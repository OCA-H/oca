import { ROUTES } from "@/app/(view)/common/helper/routes";
import { SECTION_SPECS, sectionSpec } from "@/app/api/(features)/(pview)/site/schema/sectionSpecs";
import { RECORD_PANELS, type AdminPanel, type RecordPanel } from "../content";
import type { FieldSpec, ListSpec, SectionData, SectionItem, ShowWhen } from "../services";

/** A list entry in the editor, with an id that stays with it while entries are moved around. */
export type EditorItem = { _id: string; [key: string]: string | number | EditorItem[] };
export type EditorData = Record<string, string | number | EditorItem[]>;

let nextItemId = 0;
const newItemId = () => `item-${++nextItemId}`;

/** Saved entries with ids, recursively; entries keep the id they had at the same place in `before`. */
const withIds = (items: SectionItem[], before: unknown): EditorItem[] =>
  items.map((item, i) => {
    const previous = Array.isArray(before) ? (before[i] as EditorItem | undefined) : undefined;
    const entry: EditorItem = { _id: previous?._id || newItemId() };
    for (const [key, value] of Object.entries(item)) entry[key] = Array.isArray(value) ? withIds(value, previous?.[key]) : value;
    return entry;
  });

/** Entries as the API takes them: ids dropped, recursively. */
const withoutIds = (items: EditorItem[]): SectionItem[] =>
  items.map((item) =>
    Object.fromEntries(
      Object.entries(item)
        .filter(([key]) => key !== "_id")
        .map(([key, value]) => [key, Array.isArray(value) ? withoutIds(value) : value])
    )
  );

/** "albums.0.photos" → ["albums", 0, "photos"]: list keys at even places, entry positions at odd ones. */
const pathParts = (path: string): (string | number)[] => path.split(".").map((part, i) => (i % 2 ? Number(part) : part));

export const adminHelper = {
  /** "home.events" → "/sv/admin/home/events"; the dashboard is "/sv/admin". */
  panelPath: (panel: AdminPanel): string =>
    panel === "dashboard" ? ROUTES.ADMIN : `${ROUTES.ADMIN}/${panel.replace(/\./g, "/")}`,

  /** The panel for the address segments after /sv/admin, or null when they are not one of ours. */
  panelFromSegments: (segments: string[] | undefined): AdminPanel | null => {
    if (!segments || segments.length === 0) return "dashboard";
    if (segments.length === 1 && segments[0] in RECORD_PANELS) return segments[0] as RecordPanel;
    return sectionSpec(segments.join("."))?.key ?? null;
  },

  /** Every panel's address segments, for prerendering. */
  allPanelSegments: (): string[][] => [
    [],
    ...SECTION_SPECS.map((spec) => spec.key.split(".")),
    ...Object.keys(RECORD_PANELS).map((panel) => [panel]),
  ],

  /** The panel's name, for the page title; null for the dashboard. */
  panelLabel: (panel: AdminPanel): string | null =>
    panel === "dashboard" ? null : panel in RECORD_PANELS ? RECORD_PANELS[panel as RecordPanel].label : (sectionSpec(panel)?.label ?? null),

  /**
   * The fields whose value differs between two forms, for the confirm dialog. A select shows its
   * option's label; `format` can dress a value (e.g. as rupees).
   */
  formChanges: <F extends Record<string, string>>(
    fields: FieldSpec[],
    before: F,
    after: F,
    format: Partial<Record<keyof F, (value: string) => string>> = {}
  ): { label: string; from: string; to: string }[] =>
    fields
      .filter((field) => (before[field.key] ?? "").trim() !== (after[field.key] ?? "").trim())
      .map((field) => {
        const show = (value: string) => {
          const option = field.options?.find((o) => o.value === value);
          if (option) return option.label;
          const dress = format[field.key as keyof F];
          return value.trim() && dress ? dress(value) : value.trim();
        };
        return { label: field.label, from: show(before[field.key] ?? ""), to: show(after[field.key] ?? "") };
      }),

  /** "₹1,25,000". */
  formatRupees: (amount: number): string => `₹${amount.toLocaleString("en-IN")}`,

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

  /** A section's fields split into blocks at each field with a heading; the first block takes `firstHeading`. */
  fieldBlocks: (fields: FieldSpec[], firstHeading: string): { heading: string; fields: FieldSpec[] }[] =>
    fields.reduce<{ heading: string; fields: FieldSpec[] }[]>((blocks, field) => {
      if (field.heading || blocks.length === 0) blocks.push({ heading: field.heading ?? firstHeading, fields: [] });
      blocks[blocks.length - 1].fields.push(field);
      return blocks;
    }, []),

  /** Whether a field or list with this condition shows for an entry with these values (no condition: always). */
  shows: (showWhen: ShowWhen | undefined, values: Record<string, unknown>): boolean =>
    !showWhen || values[showWhen.field] === showWhen.equals,

  /** An empty value of the field's kind: the first choice for a select, the smallest number. */
  blankValue: (field: FieldSpec): string | number =>
    field.type === "select" ? (field.options?.[0]?.value ?? "") : field.type === "number" ? (field.min ?? 0) : "",

  /** A new entry; any lists inside it start with as many blank entries as they need (photo grids start empty, ready for uploads). */
  blankItem: (list: ListSpec): EditorItem => ({
    _id: newItemId(),
    ...Object.fromEntries(list.fields.map((field) => [field.key, adminHelper.blankValue(field)])),
    ...Object.fromEntries(
      (list.lists ?? []).map((sub) => [sub.key, Array.from({ length: sub.layout === "grid" ? 0 : sub.min }, () => adminHelper.blankItem(sub))])
    ),
  }),

  /**
   * Saved content as the editor holds it: list entries get ids. Given the form it replaces, entries
   * keep the ids they had there, so the ones open in the editor stay open after a save.
   */
  toEditor: (data: SectionData, previous?: EditorData): EditorData =>
    Object.fromEntries(
      Object.entries(data).map(([key, value]) => [key, Array.isArray(value) ? withIds(value, previous?.[key]) : value])
    ),

  /** The editor's content as the API takes it: list entry ids dropped. */
  fromEditor: (form: EditorData): SectionData =>
    Object.fromEntries(Object.entries(form).map(([key, value]) => [key, Array.isArray(value) ? withoutIds(value) : value])),

  /** The entries of the list at `path` ("items", or "albums.0.photos" for one inside an entry). */
  listAt: (form: EditorData, path: string): EditorItem[] => {
    let node: unknown = form;
    for (const part of pathParts(path)) node = (node as Record<string | number, unknown> | undefined)?.[part];
    return Array.isArray(node) ? (node as EditorItem[]) : [];
  },

  /** The form with the list at `path` replaced by `items`, leaving the rest as it was. */
  withListAt: (form: EditorData, path: string, items: EditorItem[]): EditorData => {
    const [key, index, ...rest] = pathParts(path);
    if (index === undefined) return { ...form, [key]: items };
    const list = adminHelper.listAt(form, String(key));
    return {
      ...form,
      [key]: list.map((item, i) => (i === index ? (adminHelper.withListAt(item, rest.join("."), items) as EditorItem) : item)),
    };
  },

  /** The first image in an entry's lists, for the thumbnail of an entry that has none itself (an album). */
  firstImage: (item: EditorItem): string => {
    for (const value of Object.values(item)) {
      if (!Array.isArray(value)) continue;
      const found = value.find((entry) => typeof entry.image === "string" && entry.image);
      if (found) return found.image as string;
    }
    return "";
  },

  /**
   * The ids of the entries an API error is inside, outermost first: "albums.0.photos.3.image"
   * names the first album and its fourth photo; "albums.0.photos" the first album only.
   */
  entriesOf: (form: EditorData, name: string): string[] => {
    const parts = name.split(".");
    const ids: string[] = [];
    let node: EditorData = form;
    for (let i = 0; i + 2 < parts.length; i += 2) {
      const item = adminHelper.listAt(node, parts[i])[Number(parts[i + 1])];
      if (!item) break;
      ids.push(item._id);
      node = item;
    }
    return ids;
  },

  isDirty: (form: EditorData, saved: EditorData): boolean =>
    JSON.stringify(adminHelper.fromEditor(form)) !== JSON.stringify(adminHelper.fromEditor(saved)),

  /** The name an input gets, matching the keys of the API's field errors: "title", "items.2.title", "albums.0.photos.1.image". */
  fieldName: (key: string, list?: { path: string; index: number }): string => (list ? `${list.path}.${list.index}.${key}` : key),
};
