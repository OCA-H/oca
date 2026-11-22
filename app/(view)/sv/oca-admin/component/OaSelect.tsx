'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

export interface OaOption {
  value: string;
  label: string;
  /** A flag-icons class, e.g. "fi fi-in", drawn before the label. */
  flag?: string;
  /** Shorter text for the closed button (e.g. "+91"); the list shows `label`. */
  short?: string;
}

const Flag: React.FC<{ cls?: string }> = ({ cls }) => (cls ? <span className={`oa-flag ${cls}`} aria-hidden="true" /> : null);

interface OaSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: OaOption[];
  /** Shown when nothing is chosen (the value ""). */
  placeholder: string;
  /** Offer the placeholder as a choice too (e.g. "All Batches"). */
  allowEmpty?: boolean;
  ariaLabel?: string;
  invalid?: boolean;
  describedBy?: string;
  /** Long lists get a search box; on by default above 12 options. */
  searchable?: boolean;
}

/**
 * The console's dropdown, in place of the browser's <select>: a button that opens a list, with a
 * search box for long lists. Keyboard: arrows / Home / End move, Enter picks, Esc closes, typing
 * searches (or jumps, without a search box).
 */
export const OaSelect: React.FC<OaSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  allowEmpty,
  ariaLabel,
  invalid,
  describedBy,
  searchable,
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [up, setUp] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const typed = useRef({ text: '', at: 0 });

  const all = useMemo(() => (allowEmpty ? [{ value: '', label: placeholder }, ...options] : options), [allowEmpty, placeholder, options]);
  const withSearch = searchable ?? options.length > 12;
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? all.filter((o) => `${o.label} ${o.short ?? ''}`.toLowerCase().includes(q)) : all;
  }, [all, query]);
  const current = all.find((o) => o.value === value);

  const openList = () => {
    const rect = root.current?.getBoundingClientRect();
    setUp(!!rect && window.innerHeight - rect.bottom < 300 && rect.top > window.innerHeight - rect.bottom);
    setQuery('');
    setActive(Math.max(0, all.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const close = (focusButton = true) => {
    setOpen(false);
    if (focusButton) button.current?.focus();
  };
  const pick = (o: OaOption | undefined) => {
    if (!o) return;
    if (o.value !== value) onChange(o.value);
    close();
  };

  // Close on a click outside.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  // Focus the search box (or the list) on open, and keep the active option in view.
  useEffect(() => {
    if (open) (withSearch ? search.current : list.current)?.focus({ preventScroll: true });
  }, [open, withSearch]);
  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, active, shown]);

  const move = (e: React.KeyboardEvent) => {
    const last = shown.length - 1;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActive((a) => Math.min(last, a + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
        break;
      case 'Home':
        if (!withSearch) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case 'End':
        if (!withSearch) {
          e.preventDefault();
          setActive(last);
        }
        break;
      case 'PageDown':
        e.preventDefault();
        setActive((a) => Math.min(last, a + 8));
        break;
      case 'PageUp':
        e.preventDefault();
        setActive((a) => Math.max(0, a - 8));
        break;
      case 'Enter':
        e.preventDefault();
        pick(shown[active]);
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        close();
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        // Without a search box, typing jumps to the first match.
        if (!withSearch && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const now = Date.now();
          typed.current = { text: (now - typed.current.at < 700 ? typed.current.text : '') + e.key.toLowerCase(), at: now };
          const i = shown.findIndex((o) => o.label.toLowerCase().startsWith(typed.current.text));
          if (i >= 0) setActive(i);
        }
    }
  };

  const onButtonKey = (e: React.KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault();
      openList();
    }
  };

  const listId = `${id}-list`;
  const activeId = shown[active] ? `${id}-o${active}` : undefined;

  return (
    <div className={`oa-select${open ? ' is-open' : ''}${up ? ' is-up' : ''}`} ref={root}>
      <button
        type="button"
        ref={button}
        className={`form-control oa-select-btn${current && (current.value || allowEmpty) ? '' : ' is-empty'}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        data-invalid={invalid || undefined}
        aria-describedby={describedBy}
        data-oa-select=""
        onClick={() => (open ? close() : openList())}
        onKeyDown={onButtonKey}
      >
        <Flag cls={current?.flag} />
        <span className="oa-select-val">{current ? (current.short ?? current.label) : placeholder}</span>
        <svg className="oa-select-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="oa-select-pop">
          {withSearch && (
            <div className="oa-select-search">
              <input
                ref={search}
                type="text"
                className="form-control"
                placeholder="Type to search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={move}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={activeId}
                aria-autocomplete="list"
                aria-label={`Search ${ariaLabel ?? 'options'}`}
              />
            </div>
          )}
          <ul
            ref={list}
            id={listId}
            role="listbox"
            tabIndex={withSearch ? -1 : 0}
            aria-label={ariaLabel}
            aria-activedescendant={withSearch ? undefined : activeId}
            onKeyDown={withSearch ? undefined : move}
            className="oa-select-list"
          >
            {shown.length === 0 && <li className="oa-select-none">No match</li>}
            {shown.map((o, i) => (
              <li
                key={o.value || '__empty'}
                id={`${id}-o${i}`}
                data-i={i}
                role="option"
                aria-selected={o.value === value}
                className={`oa-select-opt${i === active ? ' is-active' : ''}${o.value === value ? ' is-on' : ''}`}
                onPointerMove={() => setActive(i)}
                onClick={() => pick(o)}
              >
                <Flag cls={o.flag} />
                <span className="oa-select-lbl">{o.label}</span>
                {o.value === value && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/** A single, already-chosen radio choice, drawn by the console instead of the browser. */
export const OaRadio: React.FC<{ label: string; checked: boolean; onChange?: () => void; name: string }> = ({ label, checked, onChange, name }) => (
  <label className="oa-radio">
    <input type="radio" name={name} checked={checked} onChange={() => onChange?.()} className="sr-only" />
    <span className="oa-radio-dot" aria-hidden="true" />
    {label}
  </label>
);
