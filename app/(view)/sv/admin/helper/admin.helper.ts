import { ROUTES } from "@/app/(view)/common/helper/routes";
import { SECTION_SPECS, sectionSpec } from "@/app/api/(features)/(pview)/site/schema/sectionSpecs";
import type { AdminPanel } from "../content";
import type { FieldSpec, ListSpec, SectionData, SectionItem } from "../services";

/** A list entry in the editor, with an id that stays with it while entries are moved around. */
export type EditorItem = SectionItem & { _id: string };
export type EditorData = Record<string, string | number | EditorItem[]>;

let nextItemId = 0;
const newItemId = () => `item-${++nextItemId}`;

export const adminHelper = {
  /** "home.events" → "/sv/admin/home/events"; the dashboard is "/sv/admin". */
  panelPath: (panel: AdminPanel): string =>
    panel === "dashboard" ? ROUTES.ADMIN : `${ROUTES.ADMIN}/${panel.replace(/\./g, "/")}`,

  /** The panel for the address segments after /sv/admin, or null when they are not one of ours. */
  panelFromSegments: (segments: string[] | undefined): AdminPanel | null => {
    if (!segments || segments.length === 0) return "dashboard";
    return sectionSpec(segments.join("."))?.key ?? null;
  },

  /** Every panel's address segments, for prerendering. */
  allPanelSegments: (): string[][] => [[], ...SECTION_SPECS.map((spec) => spec.key.split("."))],

  /** The panel for the current pathname, falling back to the dashboard. */
  panelFromPath: (pathname: string): AdminPanel => {
    const rest = pathname.replace(/\/+$/, "").slice(ROUTES.ADMIN.length).split("/").filter(Boolean);
    return adminHelper.panelFromSegments(rest) ?? "dashboard";
  },

  getInitials: (name: string): string =>
    name
      .split(" ")
      .filter((part) => part && !part.endsWith("."))
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase(),

  /** "2026-10-28T…" → "28 Oct 2026, 4:05 pm". */
  formatSaved: (iso: string): string =>
    new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }),

  /** "2026-10-28T…" → "28 Oct 2026", where there is only room for the day. */
  formatSavedDate: (iso: string): string =>
    new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),

  /** An empty value of the field's kind: the first choice for a select, the smallest number. */
  blankValue: (field: FieldSpec): string | number =>
    field.type === "select" ? (field.options?.[0]?.value ?? "") : field.type === "number" ? (field.min ?? 0) : "",

  blankItem: (list: ListSpec): EditorItem => ({
    _id: newItemId(),
    ...Object.fromEntries(list.fields.map((field) => [field.key, adminHelper.blankValue(field)])),
  }),

  /**
   * Saved content as the editor holds it: list entries get ids. Given the form it replaces, entries
   * keep the ids they had there, so the ones open in the editor stay open after a save.
   */
  toEditor: (data: SectionData, previous?: EditorData): EditorData =>
    Object.fromEntries(
      Object.entries(data).map(([key, value]) => {
        if (!Array.isArray(value)) return [key, value];
        const before = previous?.[key];
        return [key, value.map((item, i) => ({ ...item, _id: (Array.isArray(before) && before[i]?._id) || newItemId() }))];
      })
    ),

  /** The editor's content as the API takes it: list entry ids dropped. */
  fromEditor: (form: EditorData): SectionData =>
    Object.fromEntries(
      Object.entries(form).map(([key, value]) => [
        key,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Array.isArray(value) ? value.map(({ _id, ...item }) => item) : value,
      ])
    ),

  isDirty: (form: EditorData, saved: EditorData): boolean =>
    JSON.stringify(adminHelper.fromEditor(form)) !== JSON.stringify(adminHelper.fromEditor(saved)),

  /** The name an input gets, matching the keys of the API's field errors: "title", "items.2.title". */
  fieldName: (key: string, list?: { key: string; index: number }): string => (list ? `${list.key}.${list.index}.${key}` : key),
};
