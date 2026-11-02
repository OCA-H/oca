import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import opentype from "opentype.js";

// Writes text onto printed artwork (event passes, payment receipts) as SVG paths for sharp to
// composite. The fonts are bundled in ./assets, so the server needs no fonts installed and every
// machine renders the same image.

export interface FieldBox {
  /** Left edge of the text. */
  x: number;
  /** Where the text sits, just above the printed line. */
  baseline: number;
  maxWidth: number;
  /** Font size in px; smaller when the text would not fit maxWidth. */
  size: number;
}

const FONTS = {
  /** Event passes. */
  playfair: "PlayfairDisplay-Bold.ttf",
  /** Payment receipts. */
  poppins: "Poppins-Medium.ttf",
};
const FONT_DIR = path.join(process.cwd(), "app/api/core/assets");
const MIN_SIZE = 14;
const DIGIT = /^(zero|one|two|three|four|five|six|seven|eight|nine)$/;

export type CardFont = keyof typeof FONTS;

const fonts: Partial<Record<CardFont, Promise<opentype.Font>>> = {};
export const loadCardFont = (name: CardFont) =>
  (fonts[name] ??= readFile(path.join(FONT_DIR, FONTS[name])).then((file) =>
    opentype.parse(file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength))
  ));

/**
 * The text's glyphs, with lining figures ("zero.lf") in place of old-style ones where the font has
 * both, as Playfair does: its default figures dip below the line and read poorly in IDs and amounts.
 * opentype.js cannot apply lnum itself. (nameToGlyph gives .notdef for a missing name, so check first.)
 */
const glyphsFor = (font: opentype.Font, text: string) =>
  font.stringToGlyphs(text).map((glyph) =>
    glyph.name && DIGIT.test(glyph.name) && font.nameToGlyphIndex(`${glyph.name}.lf`) > 0 ? font.nameToGlyph(`${glyph.name}.lf`) : glyph
  );

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
export const fieldPath = (font: opentype.Font, text: string, box: FieldBox, ink: string) => {
  const glyphs = glyphsFor(font, text);
  const { width } = layout(font, glyphs, box.size);
  const size = width > box.maxWidth ? Math.max(MIN_SIZE, (box.size * box.maxWidth) / width) : box.size;
  const { offsets } = layout(font, glyphs, size);
  const d = glyphs.map((glyph, i) => glyph.getPath(box.x + offsets[i], box.baseline, size).toPathData(2)).join("");
  return `<path fill="${ink}" d="${d}"/>`;
};
