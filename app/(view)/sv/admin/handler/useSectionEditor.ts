'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { adminHelper, type EditorData, type EditorItem } from '../helper';
import { adminService, type ListSpec, type MediaKind, type SectionData, type SectionSpec, type SectionSummary } from '../services';

/** `data` with every string passed through `change`, at any depth. */
const mapStrings = (data: unknown, change: (value: string) => string): unknown => {
  if (typeof data === 'string') return change(data);
  if (Array.isArray(data)) return data.map((value) => mapStrings(value, change));
  if (data && typeof data === 'object') return Object.fromEntries(Object.entries(data).map(([key, value]) => [key, mapStrings(value, change)]));
  return data;
};

/**
 * The editor for one section: loads it the first time its panel opens, then holds the form,
 * so edits survive switching to another panel and back.
 */
export function useSectionEditor(spec: SectionSpec, isActive: boolean, onSaved: (summary: SectionSummary) => void) {
  const [saved, setSaved] = useState<EditorData | null>(null);
  const [form, setForm] = useState<EditorData | null>(null);
  const [meta, setMeta] = useState<Omit<SectionSummary, 'key'> | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [openItems, setOpenItems] = useState<Set<string>>(() => new Set());
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const hasRequested = useRef(false);
  /**
   * Images and videos chosen but not uploaded yet, by the object URL that stands in for each in the
   * form (and previews it) until a save uploads it. Nothing is stored until Save, so a file that is
   * replaced, removed or discarded first never reaches storage.
   */
  const pendingMedia = useRef(new Map<string, { file: File; kind: MediaKind }>());

  const forgetPendingMedia = () => {
    for (const url of pendingMedia.current.keys()) URL.revokeObjectURL(url);
    pendingMedia.current.clear();
  };

  useEffect(() => {
    const pending = pendingMedia.current;
    return () => {
      for (const url of pending.keys()) URL.revokeObjectURL(url);
      pending.clear();
    };
  }, []);

  const fetchSection = useCallback(() => {
    adminService
      .getSection(spec.key)
      .then((section) => {
        const data = adminHelper.toEditor(section.data);
        setSaved(data);
        setForm(data);
        setMeta({ updatedAt: section.updatedAt, isDefault: section.isDefault });
      })
      .catch((err: unknown) => setLoadError(err instanceof Error ? err.message : 'Could not load this section.'));
  }, [spec.key]);

  useEffect(() => {
    if (!isActive || hasRequested.current) return;
    hasRequested.current = true;
    fetchSection();
  }, [isActive, fetchSection]);

  const retry = () => {
    setLoadError(null);
    fetchSection();
  };

  const isDirty = Boolean(form && saved && adminHelper.isDirty(form, saved));

  // Leaving the site (closing the tab, typing another address) with unsaved edits asks first.
  useEffect(() => {
    if (!isDirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  /** Applies an edit, and drops the errors it may have fixed. */
  const edit = (change: (current: EditorData) => EditorData, clears: (name: string) => boolean) => {
    setForm((current) => current && change(current));
    setIsSaved(false);
    setFieldErrors((errors) => Object.fromEntries(Object.entries(errors).filter(([name]) => !clears(name))));
  };

  // Lists are named by their path in the form: "items", or "albums.0.photos" for one inside an entry.
  /** Changes the entries of the list at `path`. */
  const editList = (path: string, change: (items: EditorItem[]) => EditorItem[]) => (current: EditorData) =>
    adminHelper.withListAt(current, path, change(adminHelper.listAt(current, path)));
  /** Moving or removing entries shifts their positions, so every error inside the list goes. */
  const inList = (path: string) => (name: string) => name === path || name.startsWith(`${path}.`);

  const setField = (key: string, value: string | number) =>
    edit((current) => ({ ...current, [key]: value }), (name) => name === key);

  const setItemField = (path: string, index: number, key: string, value: string | number) =>
    edit(
      editList(path, (items) => items.map((item, i) => (i === index ? { ...item, [key]: value } : item))),
      (name) => name === adminHelper.fieldName(key, { path, index })
    );

  const addItem = (list: ListSpec, path: string) => {
    const item = adminHelper.blankItem(list);
    edit(editList(path, (items) => [...items, item]), (name) => name === path);
    setOpenItems((open) => new Set(open).add(item._id));
  };

  /** Adds entries already holding some values (photos just uploaded), without opening them. */
  const addItems = (list: ListSpec, path: string, values: Record<string, string | number>[]) =>
    edit(editList(path, (items) => [...items, ...values.map((value) => ({ ...adminHelper.blankItem(list), ...value }))]), (name) => name === path);

  const removeItem = (path: string, index: number) =>
    edit(editList(path, (items) => items.filter((_, i) => i !== index)), inList(path));

  const moveItem = (path: string, index: number, by: -1 | 1) =>
    edit(
      editList(path, (current) => {
        const items = [...current];
        const target = index + by;
        if (target < 0 || target >= items.length) return current;
        [items[index], items[target]] = [items[target], items[index]];
        return items;
      }),
      inList(path)
    );

  const toggleItem = (id: string) =>
    setOpenItems((open) => {
      const next = new Set(open);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  /** Holds a chosen file until the next save; the address to put in the form for now comes back. */
  const chooseMedia = (file: File, kind: MediaKind = 'image') => {
    const url = URL.createObjectURL(file);
    pendingMedia.current.set(url, { file, kind });
    return url;
  };

  /**
   * Uploads the chosen files `payload` still uses, and returns it with their real addresses in
   * place, plus those addresses (to delete again if the save fails). One failed upload fails all.
   */
  const uploadPendingMedia = async (payload: SectionData) => {
    const chosen = new Set<string>();
    mapStrings(payload, (value) => (pendingMedia.current.has(value) && chosen.add(value), value));
    if (chosen.size === 0) return { payload, uploaded: [] };

    setIsUploading(true);
    try {
      const results = await Promise.allSettled(
        [...chosen].map(async (local) => {
          const { file, kind } = pendingMedia.current.get(local)!;
          return [local, await adminService.uploadMedia(spec.key, file, kind)] as const;
        })
      );
      const done = results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
      const uploaded = done.map(([, url]) => url);
      const failed = results.find((result): result is PromiseRejectedResult => result.status === 'rejected');
      if (failed) {
        if (uploaded.length > 0) adminService.discardMedia(spec.key, uploaded).catch(() => {});
        throw failed.reason;
      }
      const addresses = new Map(done);
      return { payload: mapStrings(payload, (value) => addresses.get(value) ?? value) as SectionData, uploaded };
    } finally {
      setIsUploading(false);
    }
  };

  /** Scrolls the panel's message (success or error) into view. */
  const revealMessage = () =>
    requestAnimationFrame(() =>
      document.querySelector(`[data-admin-panel="${spec.key}"] .ad-message`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || isSaving) return;
    setIsSaving(true);
    setError(null);
    setFieldErrors({});
    let uploaded: string[] = [];
    try {
      const upload = await uploadPendingMedia(adminHelper.fromEditor(form));
      uploaded = upload.uploaded;
      const section = await adminService.saveSection(spec.key, upload.payload);
      uploaded = [];
      // Saved: the server has deleted any file this save replaced or removed.
      forgetPendingMedia();
      const data = adminHelper.toEditor(section.data, form);
      setSaved(data);
      setForm(data);
      setMeta({ updatedAt: section.updatedAt, isDefault: false });
      setIsSaved(true);
      onSaved({ key: section.key, updatedAt: section.updatedAt, isDefault: false });
    } catch (err) {
      // Not saved: the files just uploaded go again (the form keeps the chosen files for a retry).
      if (uploaded.length > 0) adminService.discardMedia(spec.key, uploaded).catch(() => {});
      setError(err instanceof Error ? err.message : 'We could not save your changes.');
      if (err instanceof ApiError) {
        setFieldErrors(err.fields);
        // Opens every entry with a problem, and the entries around it, so each message is in sight.
        const withErrors = Object.keys(err.fields).flatMap((name) => adminHelper.entriesOf(form, name));
        if (withErrors.length > 0) setOpenItems((open) => new Set([...open, ...withErrors]));
      }
    } finally {
      setIsSaving(false);
      revealMessage();
    }
  };

  const confirmDiscard = () => {
    forgetPendingMedia();
    setForm(saved);
    setFieldErrors({});
    setError(null);
    setIsDiscardOpen(false);
  };

  return {
    form,
    meta,
    isLoading: !form && !loadError,
    loadError,
    retry,
    isDirty,
    isSaving,
    isUploading,
    isSaved,
    error,
    fieldErrors,
    openItems,
    setField,
    setItemField,
    addItem,
    addItems,
    removeItem,
    moveItem,
    toggleItem,
    chooseMedia,
    handleSubmit,
    isDiscardOpen,
    openDiscard: () => setIsDiscardOpen(true),
    closeDiscard: () => setIsDiscardOpen(false),
    confirmDiscard,
  };
}

export type SectionEditor = ReturnType<typeof useSectionEditor>;
export default useSectionEditor;
