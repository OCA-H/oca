import { getCountries, getCountryCallingCode, type CountryCode } from "libphonenumber-js/min";
import metadata from "libphonenumber-js/min/metadata";

/** Every phone field starts on India. */
export const DEFAULT_DIAL_CODE = "+91";
export const DEFAULT_COUNTRY: CountryCode = "IN";

export interface PhoneCountry {
  /** "IN": also the flag's name, lowercased. */
  iso2: CountryCode;
  name: string;
  /** "+91". */
  dialCode: string;
}

export interface PhoneParts {
  /** "+91". */
  code: string;
  /** The number without the country code, as typed. */
  number: string;
}

/** Calling code digits → the countries using it, the main one first ("1" → US, AG, AI, …). */
const COUNTRIES_BY_CODE = (metadata as unknown as { country_calling_codes: Record<string, CountryCode[]> }).country_calling_codes;

let countries: PhoneCountry[] | null = null;

/** Every country with its calling code: India first, then by name. Built once, on first use. */
export function phoneCountries(): PhoneCountry[] {
  if (countries) return countries;
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  const all = getCountries().map((iso2) => ({ iso2, name: names.of(iso2) ?? iso2, dialCode: `+${getCountryCallingCode(iso2)}` }));
  all.sort((a, b) => (a.iso2 === DEFAULT_COUNTRY ? -1 : b.iso2 === DEFAULT_COUNTRY ? 1 : a.name.localeCompare(b.name)));
  countries = all;
  return all;
}

/** The main country for a calling code: "+1" → US, "+44" → GB. Unknown codes give India. */
export const countryForDialCode = (code: string): CountryCode => COUNTRIES_BY_CODE[code.replace(/\D/g, "")]?.[0] ?? DEFAULT_COUNTRY;

/** The flag-icons class for a country; Ascension and Tristan da Cunha are filed under St Helena. */
export const flagClass = (iso2: CountryCode): string => `fi fi-${iso2 === "AC" || iso2 === "TA" ? `sh-${iso2.toLowerCase()}` : iso2.toLowerCase()}`;

/**
 * A saved phone number split for the picker: "+44 20 7946 0958" → +44 and the rest. A number
 * without a leading + is taken as Indian, which is how Indian numbers have always been saved.
 */
export function splitPhone(value: string): PhoneParts {
  const trimmed = value.trim();
  if (!trimmed.startsWith("+")) return { code: DEFAULT_DIAL_CODE, number: trimmed };
  const digits = trimmed.slice(1).replace(/\D/g, "");
  // Calling codes are one to three digits, and none is the start of another.
  for (let length = 1; length <= 3; length++) {
    const code = digits.slice(0, length);
    if (COUNTRIES_BY_CODE[code]) {
      return { code: `+${code}`, number: trimmed.slice(1).replace(new RegExp(`^[\\s\\-().]*${code}[\\s\\-().]*`), "") };
    }
  }
  return { code: DEFAULT_DIAL_CODE, number: trimmed };
}

/**
 * The picker's parts as one value, or "" when no number was typed. With `bareIndia`, an Indian
 * number keeps its old form, without +91: for fields matched at sign-in or sent to the payment gateway.
 */
export function joinPhone({ code, number }: PhoneParts, { bareIndia = false } = {}): string {
  const rest = number.trim();
  if (!rest) return "";
  if (bareIndia && code === DEFAULT_DIAL_CODE) return rest;
  return `${code} ${rest}`;
}
