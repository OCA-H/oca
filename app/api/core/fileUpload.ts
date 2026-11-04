import "server-only";
import { HttpError } from "./httpError";

// Reading and checking a file sent in a multipart form, for any feature that takes uploads.
// The type is decided by the file's first bytes, not by its name or the type the browser
// claims, so a renamed file cannot pass as an image.

export interface FileKind {
  contentType: string;
  extension: string;
  /** Whether the file's first bytes are this kind. */
  matches: (head: Uint8Array) => boolean;
}

const startsWith = (head: Uint8Array, bytes: number[], offset = 0) => bytes.every((b, i) => head[offset + i] === b);
const ascii = (text: string) => [...text].map((c) => c.charCodeAt(0));

/** Kinds features can accept; add more here as uploads need them. */
export const FILE_KINDS = {
  jpeg: { contentType: "image/jpeg", extension: "jpg", matches: (h) => startsWith(h, [0xff, 0xd8, 0xff]) },
  png: { contentType: "image/png", extension: "png", matches: (h) => startsWith(h, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
  webp: { contentType: "image/webp", extension: "webp", matches: (h) => startsWith(h, ascii("RIFF")) && startsWith(h, ascii("WEBP"), 8) },
  pdf: { contentType: "application/pdf", extension: "pdf", matches: (h) => startsWith(h, ascii("%PDF-")) },
  // MP4 and QuickTime share the ISO "ftyp" box; the brand after it ("qt  ") tells them apart.
  mp4: { contentType: "video/mp4", extension: "mp4", matches: (h) => startsWith(h, ascii("ftyp"), 4) && !startsWith(h, ascii("qt  "), 8) },
  mov: { contentType: "video/quicktime", extension: "mov", matches: (h) => startsWith(h, ascii("ftyp"), 4) && startsWith(h, ascii("qt  "), 8) },
  webm: { contentType: "video/webm", extension: "webm", matches: (h) => startsWith(h, [0x1a, 0x45, 0xdf, 0xa3]) },
  // An MP3 opens with an ID3 tag, or straight away with an MPEG audio frame (11 sync bits set).
  mp3: { contentType: "audio/mpeg", extension: "mp3", matches: (h) => startsWith(h, ascii("ID3")) || (h[0] === 0xff && (h[1] & 0xe0) === 0xe0) },
} satisfies Record<string, FileKind>;

export const IMAGE_KINDS: FileKind[] = [FILE_KINDS.jpeg, FILE_KINDS.png, FILE_KINDS.webp];
export const VIDEO_KINDS: FileKind[] = [FILE_KINDS.mp4, FILE_KINDS.mov, FILE_KINDS.webm];
export const DOCUMENT_KINDS: FileKind[] = [FILE_KINDS.pdf];
export const AUDIO_KINDS: FileKind[] = [FILE_KINDS.mp3];

export interface UploadRules {
  /** Largest file accepted, in bytes. */
  maxBytes: number;
  kinds: FileKind[];
  /** How the file is named in messages, e.g. "photo". */
  label: string;
}

export interface UploadedFile {
  bytes: Uint8Array;
  size: number;
  contentType: string;
  extension: string;
  originalName: string;
}

const megabytes = (bytes: number) => `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`;

const invalidUpload = (field: string, message: string) => HttpError.badRequest(message, { [field]: message });

/** "Please choose a JPG, PNG or WEBP file.", as a 400 on `field`. */
export function wrongUploadKind(field: string, rules: UploadRules) {
  const names = rules.kinds.map((k) => k.extension.toUpperCase());
  const allowed = names.length > 1 ? `${names.slice(0, -1).join(", ")} or ${names.at(-1)}` : names[0];
  return invalidUpload(field, `Please choose a ${allowed} file.`);
}

/** Rejects an empty file, or one over `rules.maxBytes`, as a 400 on `field`. */
export function assertUploadSize(size: number, field: string, rules: UploadRules) {
  if (!(size > 0)) throw invalidUpload(field, `Please choose a ${rules.label} to upload.`);
  if (size > rules.maxBytes) {
    throw invalidUpload(field, `That ${rules.label} is ${megabytes(size)}. Please choose one under ${megabytes(rules.maxBytes)}.`);
  }
}

/** The kind of file whose first bytes are `head`, or a 400 on `field` if `rules` takes no such kind. */
export function detectUploadKind(head: Uint8Array, field: string, rules: UploadRules): FileKind {
  const kind = rules.kinds.find((k) => k.matches(head.subarray(0, 16)));
  if (!kind) throw wrongUploadKind(field, rules);
  return kind;
}

/**
 * The kind a file says it is, by the type the browser gives it or else its name's extension, for
 * naming it before its bytes can be checked (a direct upload). Its bytes must still be checked
 * with detectUploadKind once it arrives.
 */
export function claimedUploadKind(contentType: string, fileName: string, field: string, rules: UploadRules): FileKind {
  const extension = fileName.split(".").pop()?.toLowerCase();
  const kind =
    rules.kinds.find((k) => k.contentType === contentType) ??
    rules.kinds.find((k) => k.extension === extension || (k.extension === "jpg" && extension === "jpeg"));
  if (!kind) throw wrongUploadKind(field, rules);
  return kind;
}

/**
 * The file in form field `field`, checked against `rules`. Problems come back as a 400 on that
 * field, so the form can show them next to it.
 */
export async function readUploadedFile(form: FormData, field: string, rules: UploadRules): Promise<UploadedFile> {
  const file = form.get(field);
  if (!(file instanceof File)) throw invalidUpload(field, `Please choose a ${rules.label} to upload.`);
  assertUploadSize(file.size, field, rules);

  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = detectUploadKind(bytes, field, rules);
  return { bytes, size: file.size, contentType: kind.contentType, extension: kind.extension, originalName: file.name };
}
