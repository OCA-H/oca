import type { MembershipCard } from "../services";

// Draws the e-Membership Card onto a canvas, matching the card on screen (.mp-ecard in
// oca-v1.css), so it can be saved as an image or printed on its own. Drawn at the proportions of
// a real ID card (85.6 × 54 mm), on a 856 × 540 layout scaled up for a sharp print.

const W = 856;
const H = 540;
const SCALE = 2;
const PAD_X = 51;
const PAD_Y = 47;
const GOLD = "#F4D976";
const CREST_SRC = "/images/oca-crest.png";

export interface CardImageText {
  org: string;
  school: string;
  tag: string;
  validity: string;
  labels: { batch: string; memberId: string; valid: string };
}

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The crest image could not be loaded."));
    image.src = src;
  });

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Letter spacing where the browser supports it on canvas; plain text elsewhere. */
function setSpacing(ctx: CanvasRenderingContext2D, px: number) {
  if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`;
}

/** The largest font size up to `max` at which `text` fits in `width`. */
function fitFont(ctx: CanvasRenderingContext2D, text: string, weight: number, max: number, width: number, family: string) {
  let size = max;
  do {
    ctx.font = `${weight} ${size}px ${family}`;
    if (ctx.measureText(text).width <= width) break;
    size -= 1;
  } while (size > 20);
  return size;
}

export async function drawMembershipCard(card: MembershipCard, text: CardImageText): Promise<HTMLCanvasElement> {
  // The site's own font, once it has loaded, so the image reads like the page.
  await document.fonts.ready;
  const family = getComputedStyle(document.body).fontFamily || "Inter, Arial, sans-serif";
  const crest = await loadImage(CREST_SRC);

  const canvas = document.createElement("canvas");
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not draw the card.");
  ctx.scale(SCALE, SCALE);

  // Card face: the same radial green as on screen, clipped to rounded corners.
  roundRect(ctx, 0, 0, W, H, 38);
  ctx.save();
  ctx.clip();
  const face = ctx.createRadialGradient(W * 0.1, 0, 0, W * 0.1, 0, W * 1.25);
  face.addColorStop(0, "#1E6E38");
  face.addColorStop(0.55, "#0F5E2D");
  face.addColorStop(1, "#08381B");
  ctx.fillStyle = face;
  ctx.fillRect(0, 0, W, H);

  // Gold inner frame and the faint ring in the corner.
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(244,217,118,.34)";
  roundRect(ctx, 19, 19, W - 38, H - 38, 23);
  ctx.stroke();
  ctx.strokeStyle = "rgba(244,217,118,.16)";
  ctx.beginPath();
  ctx.arc(W - 97, H - 58, 233, 0, Math.PI * 2);
  ctx.stroke();

  // Top: crest, association, membership tag.
  const crestSize = 97;
  ctx.drawImage(crest, PAD_X, PAD_Y, crestSize, crestSize);
  const orgX = PAD_X + crestSize + 23;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 29px ${family}`;
  ctx.fillText(text.org, orgX, PAD_Y + 44);
  ctx.fillStyle = "rgba(255,255,255,.72)";
  ctx.font = `400 22px ${family}`;
  ctx.fillText(text.school, orgX, PAD_Y + 76);

  const tag = text.tag.toUpperCase();
  ctx.font = `800 21px ${family}`;
  setSpacing(ctx, 1.7);
  const tagW = ctx.measureText(tag).width + 42;
  const tagH = 42;
  const tagX = W - PAD_X - tagW;
  const tagY = PAD_Y + (crestSize - tagH) / 2;
  ctx.strokeStyle = "rgba(244,217,118,.55)";
  roundRect(ctx, tagX, tagY, tagW, tagH, tagH / 2);
  ctx.stroke();
  ctx.fillStyle = GOLD;
  ctx.textAlign = "center";
  ctx.fillText(tag, tagX + tagW / 2, tagY + 29);
  ctx.textAlign = "left";
  setSpacing(ctx, 0);

  // Bottom: details row, with the name above it.
  const meta = [
    card.batchYear ? [text.labels.batch, card.batchYear] : null,
    [text.labels.memberId, card.memberId],
    [text.labels.valid, text.validity],
  ].filter((item): item is string[] => Boolean(item));
  const valueY = H - PAD_Y - 6;
  const labelY = valueY - 36;
  let x = PAD_X;
  for (const [label, value] of meta) {
    ctx.font = `700 20px ${family}`;
    setSpacing(ctx, 1.4);
    ctx.fillStyle = "rgba(255,255,255,.62)";
    ctx.fillText(label.toUpperCase(), x, labelY);
    const labelW = ctx.measureText(label.toUpperCase()).width;
    setSpacing(ctx, 0);
    ctx.font = `700 28px ${family}`;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(value, x, valueY);
    x += Math.max(labelW, ctx.measureText(value).width) + 51;
  }

  const nameSize = fitFont(ctx, card.name, 800, 49, W - PAD_X * 2, family);
  ctx.font = `800 ${nameSize}px ${family}`;
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText(card.name, PAD_X, labelY - 40);

  ctx.restore();
  return canvas;
}

/** "OCA-e-Membership-Card-OCA-2026-0011.png". */
export const cardFileName = (memberId: string) => `OCA-e-Membership-Card-${memberId.replace(/[^A-Za-z0-9-]+/g, "-")}.png`;
