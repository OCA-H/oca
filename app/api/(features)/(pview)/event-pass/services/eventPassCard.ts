import "server-only";
import path from "node:path";
import sharp from "sharp";
import { type FieldBox, fieldPath, loadCardFont } from "@/app/api/core/cardText";
import { themeColors } from "@/template/theme/colors";

// Writes the member's details onto the event's pass artwork in public/images/passes, giving
// the digital pass that is emailed after payment. The artwork is 1024×1536; each field below is
// placed on the blank line printed beside or under its label, in the font and way core/cardText
// sets text. Long names are shrunk to fit their line, and a detail we do not have (no spouse name,
// no batch on record) is written as "NA". On the golf cards each label has a full-width line of
// its own under it, so the detail is written on that line, starting at the label's left edge.

export type PassCardDesign = "golden" | "donor" | "donor-couple" | "golf-single" | "golf-couple";

export interface PassCardDetails {
  memberName: string;
  spouseName?: string | null;
  memberId: string;
  batch?: string | null;
}

type PassCardField = keyof PassCardDetails;

const PASS_DIR = path.join(process.cwd(), "public/images/passes");
const INK = themeColors.brand.darkest;
/** Written on a line whose detail we do not have. */
export const PASS_CARD_MISSING = "NA";
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
  "golf-single": {
    file: "OCA_Annual_Golf_Single_Pass_2026.png",
    fields: {
      memberName: { x: 62, baseline: 695, maxWidth: 900, size: 30 },
      memberId: { x: 62, baseline: 814, maxWidth: 900, size: 30 },
      batch: { x: 62, baseline: 934, maxWidth: 900, size: 30 },
    },
  },
  "golf-couple": {
    file: "OCA_Annual_Golf_Couple_Pass_2026.png",
    fields: {
      memberName: { x: 62, baseline: 682, maxWidth: 900, size: 28 },
      spouseName: { x: 62, baseline: 783, maxWidth: 900, size: 28 },
      memberId: { x: 62, baseline: 883, maxWidth: 900, size: 28 },
      batch: { x: 62, baseline: 975, maxWidth: 900, size: 28 },
    },
  },
};

/**
 * A golf pass has the golf card, for one or for a couple. At the dinner the Golden Pass has its own
 * card, and every other pass is a Donor Pass, for one or for a couple.
 */
export const passCardDesign = (pass: { eventName: string; passId: string; includesSpouse: boolean }): PassCardDesign => {
  if (pass.eventName === "golf-tournament") return pass.includesSpouse ? "golf-couple" : "golf-single";
  if (pass.passId === "golden") return "golden";
  return pass.includesSpouse ? "donor-couple" : "donor";
};

/** The pass with the member's details written in, as a JPEG ready to attach to an email. */
export async function renderPassCard(design: PassCardDesign, details: PassCardDetails): Promise<Buffer> {
  const { file, fields } = DESIGNS[design];
  const font = await loadCardFont("playfair");
  const paths = (Object.entries(fields) as Array<[PassCardField, FieldBox]>)
    .map(([field, box]) => fieldPath(font, details[field]?.trim() || PASS_CARD_MISSING, box, INK))
    .join("");
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">${paths}</svg>`;
  return sharp(path.join(PASS_DIR, file))
    .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}
