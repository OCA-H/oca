'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError, type ApiFieldErrors } from '@/app/(view)/common/services/api.service';
import { adminHelper, type EditorData, type EditorItem } from '../helper';
import { adminService, type ListSpec, type MediaKind, type SectionSpec, type SectionSummary } from '../services';

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
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<ApiFieldErrors>({});
  const [openItems, setOpenItems] = useState<Set<string>>(() => new Set());
  const [isDiscardOpen, setIsDiscardOpen] = useState(false);
  const hasRequested = useRef(false);

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

  const uploadMedia = (file: File, kind?: MediaKind) => adminService.uploadMedia(spec.key, file, kind);

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
    try {
      const section = await adminService.saveSection(spec.key, adminHelper.fromEditor(form));
      const data = adminHelper.toEditor(section.data, form);
      setSaved(data);
      setForm(data);
      setMeta({ updatedAt: section.updatedAt, isDefault: false });
      setIsSaved(true);
      onSaved({ key: section.key, updatedAt: section.updatedAt, isDefault: false });
    } catch (err) {
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
    uploadMedia,
    handleSubmit,
    isDiscardOpen,
    openDiscard: () => setIsDiscardOpen(true),
    closeDiscard: () => setIsDiscardOpen(false),
    confirmDiscard,
  };
}

export type SectionEditor = ReturnType<typeof useSectionEditor>;
export default useSectionEditor;
