import type { FieldErrors } from "@/app/api/core/httpError";
import type { FieldSpec, SectionData, SectionItem, SectionSpec, SectionValue } from "../schema/sectionSpecs";

// Checks a section save against its spec, field by field. Errors are keyed the way the admin form
// names its inputs: "title" for a section field, "items.2.title" for a field of the third event.

const MAX_URL_LENGTH = 500;

/**
 * Addresses a link or image may use: a path on this site ("/sports", "#events"), or an absolute
 * http(s) address. Links may also be mailto: or tel:. Anything else, javascript: above all, is refused.
 */
function isAllowedUrl(value: string, type: "link" | "image"): boolean {
  if (/^\/(?![/\\])/.test(value)) return true;
  if (type === "link" && value.startsWith("#")) return true;
  if (type === "link" && /^(mailto|tel):[^\s]+$/i.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function checkField(spec: FieldSpec, raw: unknown, errors: FieldErrors, name: string): SectionValue {
  if (spec.type === "number") {
    const value = typeof raw === "number" ? raw : Number(typeof raw === "string" && raw.trim() !== "" ? raw : NaN);
    if (!Number.isFinite(value)) {
      if (spec.required) errors[name] = `${spec.label} is required.`;
      return spec.min ?? 0;
    }
    if (spec.min !== undefined && value < spec.min) errors[name] = `${spec.label} must be at least ${spec.min}.`;
    if (spec.max !== undefined && value > spec.max) errors[name] = `${spec.label} must be at most ${spec.max}.`;
    return value;
  }

  const value = typeof raw === "string" ? raw.trim() : "";
  if (!value) {
    if (spec.required) errors[name] = `${spec.label} is required.`;
    return "";
  }

  if (spec.type === "select") {
    if (!spec.options?.some((option) => option.value === value)) errors[name] = `Choose a ${spec.label.toLowerCase()} from the list.`;
    return value;
  }

  if (spec.type === "link" || spec.type === "image") {
    if (value.length > MAX_URL_LENGTH) errors[name] = `Please keep this address under ${MAX_URL_LENGTH} characters.`;
    else if (!isAllowedUrl(value, spec.type)) {
      errors[name] =
        spec.type === "image"
          ? "Upload an image, or use an address starting with https:// or /."
          : "Use a page on this site (starting with /) or a full address starting with https://.";
    }
    return value;
  }

  if (spec.max && value.length > spec.max) errors[name] = `Please keep this under ${spec.max} characters.`;
  return value;
}

/** The section's content with only the fields its spec knows, trimmed, plus any problems found. */
export function validateSection(spec: SectionSpec, payload: Record<string, unknown>): { data: SectionData; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const data: SectionData = {};

  for (const field of spec.fields) {
    data[field.key] = checkField(field, payload[field.key], errors, field.key);
  }

  for (const list of spec.lists) {
    const raw = Array.isArray(payload[list.key]) ? (payload[list.key] as unknown[]) : [];
    if (raw.length < list.min) {
      errors[list.key] = `Add at least ${list.min} ${list.itemLabel.toLowerCase()}${list.min === 1 ? "" : "s"}.`;
    }
    if (raw.length > list.max) {
      errors[list.key] = `There can be at most ${list.max} ${list.itemLabel.toLowerCase()}s.`;
    }

    data[list.key] = raw.slice(0, list.max).map((entry, index) => {
      const source = entry && typeof entry === "object" && !Array.isArray(entry) ? (entry as Record<string, unknown>) : {};
      const item: SectionItem = {};
      for (const field of list.fields) {
        item[field.key] = checkField(field, source[field.key], errors, `${list.key}.${index}.${field.key}`);
      }
      return item;
    });
  }

  return { data, errors };
}
