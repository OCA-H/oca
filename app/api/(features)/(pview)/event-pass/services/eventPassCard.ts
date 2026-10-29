import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";
import { themeColors } from "@/template/theme/colors";

// Writes the member's details onto the Annual Dinner pass artwork in public/images/passes, giving
// the digital pass that is emailed after payment. The artwork is 1024×1536; each field below is
// placed on the blank line printed beside or under its label. The text is set in Playfair Display
// Bold (bundled in ../assets) and drawn as SVG paths, so the server needs no fonts installed and
// every machine renders the same pass. Long names are shrunk to fit their line, and a detail we
// do not have (no spouse name, no batch on record) is written as "NA".

export type PassCardDesign = "golden" | "donor" | "donor-couple";

export interface PassCardDetails {
  memberName: string;
  spouseName?: string | null;
  memberId: string;
  batch?: string | null;
}

type PassCardField = keyof PassCardDetails;

interface FieldBox {
  /** Left edge of the text. */
  x: number;
  /** Where the text sits, just above the printed line. */
  baseline: number;
  maxWidth: number;
  /** Font size in px; smaller when the text would not fit maxWidth. */
  size: number;
}

const PASS_DIR = path.join(process.cwd(), "public/images/passes");
const FONT_FILE = path.join(process.cwd(), "app/api/(features)/(pview)/event-pass/assets/PlayfairDisplay-Bold.ttf");
const INK = themeColors.brand.darkest;
const MIN_SIZE = 14;
/** Written on a line whose detail we do not have. */
export const PASS_CARD_MISSING = "NA";
const DIGIT = /^(zero|one|two|three|four|five|six|seven|eight|nine)$/;
const WIDTH = 1024;
const HEIGHT = 1536;

const DESIGNS: Record<PassCardDesign, { file: string; fields: Partial<Record<PassCardField, FieldBox>> }> = {
  golden: {
    file: "oca_annual_dinner_golden_pass.png",
    fields: {
      memberName: { x: 374, baseline: 761, maxWidth: 566, size: 28 },
      spouseName: { x: 308, baseline: 810, maxWidth: 632, size: 28 },
      memberId: { x: 374, baseline: 862, maxWidth: 238, size: 26 },
      batch: { x: 764, baseline: 862, maxWidth: 176, size: 26 },
    },
  },
  donor: {
    file: "oca_annual_dinner_donor_pass.png",
    fields: {
      memberName: { x: 120, baseline: 814, maxWidth: 785, size: 30 },
      memberId: { x: 120, baseline: 896, maxWidth: 425, size: 25 },
      batch: { x: 638, baseline: 896, maxWidth: 267, size: 25 },
    },
  },
  "donor-couple": {
    file: "oca_annual_dinner_donor_couple_pass.png",
    fields: {
      memberName: { x: 400, baseline: 789, maxWidth: 500, size: 26 },
      spouseName: { x: 334, baseline: 857, maxWidth: 566, size: 26 },
      memberId: { x: 402, baseline: 924, maxWidth: 160, size: 24 },
      batch: { x: 730, baseline: 924, maxWidth: 170, size: 24 },
    },
  },
};

/** The Golden Pass has its own card; every other pass is a Donor Pass, for one or for a couple. */
export const passCardDesign = (pass: { passId: string; includesSpouse: boolean }): PassCardDesign => {
  if (pass.passId === "golden") return "golden";
  return pass.includesSpouse ? "donor-couple" : "donor";
};

let font: Promise<opentype.Font> | null = null;
const loadFont = () =>
  (font ??= readFile(FONT_FILE).then((file) =>
    opentype.parse(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength))
  ));

/**
 * The text's glyphs, with Playfair's lining figures ("zero.lf") in place of its default old-style
 * ones, which dip below the line and read poorly in member IDs. opentype.js cannot apply lnum itself.
 */
const glyphsFor = (font: opentype.Font, text: string) =>
  font.stringToGlyphs(text).map((glyph) => (glyph.name && DIGIT.test(glyph.name) && font.nameToGlyph(`${glyph.name}.lf`)) || glyph);

/** Each glyph's left edge at the given size, from x = 0, and the total width. */
const layout = (font: opentype.Font, glyphs: opentype.Glyph[], size: number) => {
  const scale = size / font.unitsPerEm;
  let x = 0;
  const offsets = glyphs.map((glyph, i) => {
    const left = x;
    x += (glyph.advanceWidth ?? 0) * scale;
    if (glyphs[i + 1]) x += font.getKerningValue(glyph, glyphs[i + 1]) * scale;
    return left;
  });
  return { offsets, width: x };
};

/** The text as an SVG path on the box's baseline, at the box's size or as much smaller as fits its width. */
const fieldPath = (font: opentype.Font, text: string, box: FieldBox) => {
  const glyphs = glyphsFor(font, text);
  const { width } = layout(font, glyphs, box.size);
  const size = width > box.maxWidth ? Math.max(MIN_SIZE, (box.size * box.maxWidth) / width) : box.size;
  const { offsets } = layout(font, glyphs, size);
  const d = glyphs.map((glyph, i) => glyph.getPath(box.x + offsets[i], box.baseline, size).toPathData(2)).join("");
  return `<path fill="${INK}" d="${d}"/>`;
};

/** The pass with the member's details written in, as a JPEG ready to attach to an email. */
export async function renderPassCard(design: PassCardDesign, details: PassCardDetails): Promise<Buffer> {
  const { file, fields } = DESIGNS[design];
  const font = await loadFont();
  const paths = (Object.entries(fields) as Array<[PassCardField, FieldBox]>)
    .map(([field, box]) => fieldPath(font, details[field]?.trim() || PASS_CARD_MISSING, box))
    .join("");
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">${paths}</svg>`;
  return sharp(path.join(PASS_DIR, file))
    .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}
