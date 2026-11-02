import "server-only";
import path from "node:path";
import sharp from "sharp";
import { type FieldBox, fieldPath, loadCardFont } from "./cardText";

// Fills in the Association's printed receipt (public/images/receipt/receipt.jpeg, 1501×1048) for an
// online payment: the receipt emailed with every paid event pass and contribution. Each detail is
// written on the dotted line beside its label. The PAN Number line and the Authorised Signatory
// space are left blank, as the receipt is computer-generated. The details are set in black Poppins.

export interface ReceiptDetails {
  /** Our order reference for the payment. */
  receiptNo: string;
  paidAt: Date;
  receivedFrom: string;
  /** Whole rupees. */
  amount: number;
  /** "UPI", "Credit Card", ...: the gateway's payment_mode; null when not known (an admin-confirmed payment). */
  paymentMode: string | null;
  /** The CCAvenue reference of the payment, when there is one. */
  paymentReference: string | null;
  /** What the money is for: the contribution fund, or "General Donation" for a pass. */
  onAccountOf: string;
}

type ReceiptField = "receiptNo" | "date" | "receivedFrom" | "amountInWords" | "paidBy" | "onAccountOf" | "amount";

const RECEIPT_FILE = path.join(process.cwd(), "public/images/receipt/receipt.jpeg");
const INK = "#000000";
const WIDTH = 1501;
const HEIGHT = 1048;

/** What a pass payment is received on account of. */
export const PASS_RECEIPT_ACCOUNT = "General Donation";

const FIELDS: Record<ReceiptField, FieldBox> = {
  // Order references are long; they may run past the dotted line into the blank space before Date.
  receiptNo: { x: 282, baseline: 314, maxWidth: 480, size: 26 },
  date: { x: 1188, baseline: 314, maxWidth: 262, size: 28 },
  receivedFrom: { x: 510, baseline: 401, maxWidth: 928, size: 30 },
  amountInWords: { x: 362, baseline: 489, maxWidth: 1078, size: 30 },
  paidBy: { x: 494, baseline: 576, maxWidth: 948, size: 30 },
  onAccountOf: { x: 318, baseline: 663, maxWidth: 1124, size: 30 },
  amount: { x: 116, baseline: 815, maxWidth: 372, size: 32 },
};

const ONES = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve",
  "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

/** 0–999 in words: 405 → "Four Hundred Five". */
const hundreds = (n: number) => {
  const words = n >= 100 ? [`${ONES[Math.floor(n / 100)]} Hundred`] : [];
  const rest = n % 100;
  if (rest >= 20) words.push(`${TENS[Math.floor(rest / 10)]}${rest % 10 ? ` ${ONES[rest % 10]}` : ""}`);
  else if (rest > 0) words.push(ONES[rest]);
  return words.join(" ");
};

/** Whole rupees in words, counted the Indian way: 125000 → "One Lakh Twenty Five Thousand Only". */
export const rupeesInWords = (amount: number): string => {
  const crores = Math.floor(amount / 10000000);
  const parts = [
    crores > 0 && `${crores >= 1000 ? rupeesInWords(crores).replace(/ Only$/, "") : hundreds(crores)} Crore`,
    Math.floor(amount / 100000) % 100 > 0 && `${hundreds(Math.floor(amount / 100000) % 100)} Lakh`,
    Math.floor(amount / 1000) % 100 > 0 && `${hundreds(Math.floor(amount / 1000) % 100)} Thousand`,
    amount % 1000 > 0 && hundreds(amount % 1000),
  ].filter(Boolean);
  return `${parts.join(" ") || "Zero"} Only`;
};

/** "Online · UPI · Ref. 313012345678": the receipt's By Cash/Cheque/Draft No. line. */
const paidBy = ({ paymentMode, paymentReference }: ReceiptDetails) =>
  [
    "Online",
    paymentMode && (paymentMode === "Unified Payments" ? "UPI" : paymentMode),
    paymentReference && `Ref. ${paymentReference}`,
  ]
    .filter(Boolean)
    .join(" · ");

/** "2 November 2026", in Indian time. */
const receiptDate = (date: Date) =>
  date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });

/** The file name the receipt is attached under. */
export const receiptFileName = (receiptNo: string) => `OCA-Receipt-${receiptNo}.jpg`;

/** The receipt with the payment's details written in, as a JPEG ready to attach to an email. */
export async function renderReceipt(details: ReceiptDetails): Promise<Buffer> {
  const text: Record<ReceiptField, string> = {
    receiptNo: details.receiptNo,
    date: receiptDate(details.paidAt),
    receivedFrom: details.receivedFrom.trim(),
    amountInWords: rupeesInWords(details.amount),
    paidBy: paidBy(details),
    onAccountOf: details.onAccountOf,
    amount: `${details.amount.toLocaleString("en-IN")}/-`,
  };
  const font = await loadCardFont("poppins");
  const paths = (Object.entries(FIELDS) as Array<[ReceiptField, FieldBox]>)
    .map(([field, box]) => fieldPath(font, text[field], box, INK))
    .join("");
  const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">${paths}</svg>`;
  return sharp(RECEIPT_FILE)
    .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
    .jpeg({ quality: 90, mozjpeg: true })
    .toBuffer();
}
