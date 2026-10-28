import "server-only";
import { HttpError } from "./httpError";

// Files in Supabase Storage, through its REST API, for any feature that stores uploads.
// Everything goes in one private bucket (STORAGE_BUCKET, "oldcolumbans" by default), organised by path,
// e.g. users/{id}/profile/profile.jpg. Nothing in it is public: files are read back through our
// own API routes, which check who is asking first. The bucket is created on first use.
//
// Each environment keeps to its own top-level folder (STORAGE_ROOT: "dev" or "production"), so a
// feature's path users/5/profile/profile.jpg is stored as dev/users/5/... or production/users/5/...
// Callers and the database only ever see the path without it; this class adds it on every call.
// Settings: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (see .env.example).

export interface StoredFile {
  body: ReadableStream<Uint8Array>;
  contentType: string;
  size: number | null;
}

export interface UploadOptions {
  contentType: string;
  /** Replace a file already at this path (default), instead of failing. */
  upsert?: boolean;
  /** Cache-Control Supabase sends when the file is fetched from it directly. */
  cacheControl?: string;
}

// `next dev` re-runs modules on every edit; remember across reloads which buckets already exist.
const cache = globalThis as typeof globalThis & { ocaStorageBuckets?: Set<string> };
const readyBuckets = (cache.ocaStorageBuckets ??= new Set<string>());

/** "users/5/profile/profile.jpg" with each segment URL-encoded, keeping the slashes. */
const encodePath = (path: string) => path.split("/").map(encodeURIComponent).join("/");

/** The environment's folder: STORAGE_ROOT if set, else "production" for a production build and "dev" otherwise. */
function storageRoot(): string {
  const root = process.env.STORAGE_ROOT || (process.env.NODE_ENV === "production" ? "production" : "dev");
  assertSafePath(root);
  return root;
}

/** Rejects paths that could step outside their folder or are not plain relative paths. */
function assertSafePath(path: string) {
  const segments = path.split("/");
  if (!path || path.startsWith("/") || segments.some((s) => !s || s === "." || s === "..")) {
    throw new Error(`Unsafe storage path: "${path}"`);
  }
}

export class FileStorage {
  constructor(
    private readonly bucket = process.env.STORAGE_BUCKET || "oldcolumbans",
    private readonly root = storageRoot()
  ) {}

  /** Where a caller's path really lives: inside this environment's folder. */
  private key(path: string): string {
    assertSafePath(path);
    return `${this.root}/${path}`;
  }

  private get config() {
    const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for file storage (see .env.example).");
      throw new HttpError(503, "File uploads are not available right now. Please try again later.");
    }
    return { url, key };
  }

  private async request(path: string, init: RequestInit = {}): Promise<Response> {
    const { url, key } = this.config;
    const headers = new Headers(init.headers);
    headers.set("apikey", key);
    // A legacy service_role key is a JWT and also goes as the bearer token. A newer secret key
    // (sb_secret_...) is not a JWT: Supabase reads it from apikey alone.
    if (key.startsWith("eyJ")) headers.set("Authorization", `Bearer ${key}`);
    return fetch(`${url}/storage/v1${path}`, { ...init, headers, cache: "no-store" });
  }

  private async fail(action: string, res: Response): Promise<never> {
    const detail = await res.text().catch(() => "");
    console.error(`Storage ${action} failed (${res.status}): ${detail}`);
    throw new HttpError(502, "We could not reach file storage. Please try again in a minute.");
  }

  /** Creates the bucket, private, the first time this server touches it. */
  async ensureBucket(): Promise<void> {
    if (readyBuckets.has(this.bucket)) return;
    const found = await this.request(`/bucket/${encodeURIComponent(this.bucket)}`);
    if (!found.ok) {
      const created = await this.request("/bucket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: this.bucket, name: this.bucket, public: false }),
      });
      // 409 / "already exists": another request created it first, which is fine.
      if (!created.ok && created.status !== 409 && !(await created.clone().text()).includes("already exists")) {
        await this.fail(`create bucket "${this.bucket}"`, created);
      }
    }
    readyBuckets.add(this.bucket);
  }

  /** Stores bytes at `path`, replacing what is there unless `upsert` is false. */
  async upload(path: string, data: Uint8Array | ArrayBuffer | Blob, options: UploadOptions): Promise<void> {
    const key = this.key(path);
    await this.ensureBucket();
    const res = await this.request(`/object/${encodeURIComponent(this.bucket)}/${encodePath(key)}`, {
      method: "POST",
      headers: {
        "Content-Type": options.contentType,
        "x-upsert": String(options.upsert ?? true),
        "cache-control": options.cacheControl ?? "no-cache",
      },
      body: data instanceof Uint8Array ? new Blob([data as Uint8Array<ArrayBuffer>]) : data,
    });
    if (!res.ok) await this.fail(`upload "${key}"`, res);
  }

  /** The file at `path`, streamed, or null if there is none. */
  async download(path: string): Promise<StoredFile | null> {
    const key = this.key(path);
    const res = await this.request(`/object/authenticated/${encodeURIComponent(this.bucket)}/${encodePath(key)}`);
    if (res.status === 400 || res.status === 404) return null;
    if (!res.ok || !res.body) return this.fail(`download "${key}"`, res);
    const length = res.headers.get("content-length");
    return {
      body: res.body,
      contentType: res.headers.get("content-type") || "application/octet-stream",
      size: length ? Number(length) : null,
    };
  }

  /** Names of the files directly inside `folder` (no trailing slash). */
  async list(folder: string): Promise<string[]> {
    const key = this.key(folder);
    await this.ensureBucket();
    const res = await this.request(`/object/list/${encodeURIComponent(this.bucket)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefix: `${key}/`, limit: 1000, offset: 0 }),
    });
    if (!res.ok) await this.fail(`list "${key}"`, res);
    const items = (await res.json()) as Array<{ name: string; id: string | null }>;
    // Sub-folders come back with a null id.
    return items.filter((item) => item.id !== null).map((item) => item.name);
  }

  /** Deletes the files at these paths; missing ones are ignored. */
  async remove(paths: string[]): Promise<void> {
    if (paths.length === 0) return;
    const keys = paths.map((path) => this.key(path));
    const res = await this.request(`/object/${encodeURIComponent(this.bucket)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prefixes: keys }),
    });
    if (!res.ok) await this.fail(`remove ${paths.length} file(s)`, res);
  }

  /**
   * Makes `folder/fileName` the only file in `folder`: uploads it (overwriting a file of the same
   * name), then deletes anything else there. For one-file slots like a profile photo, where a new
   * upload may have a different extension (profile.png replacing profile.jpg).
   * Returns the path as callers use it (without the environment folder).
   */
  async replaceIn(folder: string, fileName: string, data: Uint8Array | ArrayBuffer | Blob, options: UploadOptions): Promise<string> {
    const path = `${folder}/${fileName}`;
    await this.upload(path, data, { ...options, upsert: true });
    const others = (await this.list(folder)).filter((name) => name !== fileName);
    await this.remove(others.map((name) => `${folder}/${name}`));
    return path;
  }
}

/** The app's bucket, in this environment's folder. Features use their own folder within it, e.g. users/{id}/... */
export const storage = new FileStorage();
