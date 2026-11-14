import type { HomeNoticeDocument, HomeNoticeItem } from '@/app/api/(features)/(pview)/site/schema/sectionSpecs';

// Every notice on the home page's notice board has its own page at /news/<slug>. The slug is the
// one set in the admin panel, or one made from the title; notices saved before they had pages have
// no slug, and two notices could share one, so the slugs are always worked out for the whole list
// at once: a repeat gets "-2", "-3", in list order, the same way wherever the list is shown.

/** "OCA – AGM MOM 23rd April 2023" → "oca-agm-mom-23rd-april-2023". */
export const toSlug = (text: string): string =>
  text
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '');

/** Each notice's slug, in the order of `notices`. */
export function noticeSlugs(notices: Pick<HomeNoticeItem, 'slug' | 'title'>[]): string[] {
  const seen = new Set<string>();
  return notices.map((notice, i) => {
    const base = toSlug(notice.slug || '') || toSlug(notice.title || '') || `notice-${i + 1}`;
    let slug = base;
    for (let n = 2; seen.has(slug); n++) slug = `${base}-${n}`;
    seen.add(slug);
    return slug;
  });
}

/** The address of a notice's own page. */
export const newsHref = (slug: string) => `/news/${slug}`;

/** The notice whose page is /news/`slug`, or null. */
export function findNotice(notices: HomeNoticeItem[], slug: string): HomeNoticeItem | null {
  const index = noticeSlugs(notices).indexOf(slug);
  return index < 0 ? null : notices[index];
}

/** "MINUTES" → "Minutes": the tags read as words on the notice's page, as in the template. */
const asWord = (tag: string) => tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();

/** The tags at the top of a notice's page: its kind, then its other tags (in gold). */
export function noticeTags(notice: HomeNoticeItem, defaultTag: string): { label: string; gold: boolean }[] {
  const kind = { label: asWord((notice.tag || defaultTag).trim()), gold: false };
  const extra = (notice.extraTags || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
    .map((label) => ({ label, gold: true }));
  return [kind, ...extra.filter((tag) => tag.label.toLowerCase() !== kind.label.toLowerCase())];
}

/** The agenda's items: one per line, with any "1." the admin typed taken off (the page numbers them). */
export const agendaItems = (agenda: string | undefined): string[] =>
  (agenda || '')
    .split('\n')
    .map((line) => line.replace(/^\s*(\d+[.)]|[-•*])\s*/, '').trim())
    .filter(Boolean);

/** A notice's attached PDFs: the entries that have a file, in the order set in the admin panel. */
export const noticeDocuments = (notice: HomeNoticeItem): HomeNoticeDocument[] =>
  (notice.documents ?? []).filter((doc) => doc && typeof doc.file === 'string' && doc.file.trim() !== '');
