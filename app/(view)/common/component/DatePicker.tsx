'use client';

import React, { useState, useRef, useEffect, useId, useMemo } from 'react';

/** Dates go in and out as ISO calendar dates, "1985-03-24", so there is no time zone to shift them. */
export interface DatePickerProps {
  id?: string;
  name?: string;
  /** "YYYY-MM-DD", or "" for no date. */
  value: string;
  onChange: (value: string) => void;
  /** Earliest selectable date, "YYYY-MM-DD". */
  min?: string;
  /** Latest selectable date, "YYYY-MM-DD", or "today", read when the calendar opens. */
  max?: string;
  /** With no value, the calendar opens this many years before today. Defaults to max, else today. */
  openToYearsAgo?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

type View = 'days' | 'months' | 'years';

interface Ymd {
  y: number;
  m: number; // 0–11
  d: number;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const pad = (n: number) => String(n).padStart(2, '0');
const toIso = ({ y, m, d }: Ymd) => `${y}-${pad(m + 1)}-${pad(d)}`;
const daysIn = (y: number, m: number) => new Date(y, m + 1, 0).getDate();

function parseIso(value: string | undefined): Ymd | null {
  const match = value ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(value) : null;
  if (!match) return null;
  const [y, m, d] = [Number(match[1]), Number(match[2]) - 1, Number(match[3])];
  return m >= 0 && m < 12 && d >= 1 && d <= daysIn(y, m) ? { y, m, d } : null;
}

/**
 * Today, read only from event handlers. Reading the clock while rendering would freeze it into
 * the prerendered page, so nothing that renders while closed depends on it.
 */
const todayYmd = (): Ymd => {
  const now = new Date();
  return { y: now.getFullYear(), m: now.getMonth(), d: now.getDate() };
};

/** Shown before the calendar first opens; open() always moves the cursor somewhere real. */
const PLACEHOLDER_CURSOR: Ymd = { y: 2000, m: 0, d: 1 };

/** Moves a date by days, or by months keeping the day where it can ("31 Jan" + 1 month → "28/29 Feb"). */
function shift(date: Ymd, unit: 'day' | 'month', amount: number): Ymd {
  if (unit === 'day') {
    const next = new Date(date.y, date.m, date.d + amount);
    return { y: next.getFullYear(), m: next.getMonth(), d: next.getDate() };
  }
  const months = date.y * 12 + date.m + amount;
  const y = Math.floor(months / 12);
  const m = months - y * 12;
  return { y, m, d: Math.min(date.d, daysIn(y, m)) };
}

/** "24 Mar 1985" */
const formatDisplay = ({ y, m, d }: Ymd) => `${d} ${MONTHS[m].slice(0, 3)} ${y}`;

export const DatePicker: React.FC<DatePickerProps> = ({
  id: customId,
  name,
  value,
  onChange,
  min = '1900-01-01',
  max,
  openToYearsAgo,
  placeholder = 'Select date',
  required = false,
  disabled = false,
  className = '',
  ariaLabel,
}) => {
  const generatedId = useId();
  const id = customId || generatedId;
  const gridLabelId = `${id}-label`;
  const triggerId = `${id}-trigger`;

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>('days');
  // The date keyboard focus is on; the month it falls in is the month on show.
  const [cursor, setCursor] = useState<Ymd>(() => parseIso(value) ?? PLACEHOLDER_CURSOR);
  // Read from the clock each time the calendar opens; empty until then.
  const [today, setToday] = useState('');

  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(() => parseIso(value), [value]);
  /** The latest selectable date for a given today, "" when there is no limit. */
  const maxFor = (todayIso: string) => (max === 'today' ? todayIso : (max ?? ''));
  const maxIso = maxFor(today) || '9999-12-31';
  const minYear = parseIso(min)?.y ?? 1900;
  const maxYear = parseIso(maxIso)?.y ?? (parseIso(today)?.y ?? minYear) + 10;

  const isDisabledDay = (iso: string) => iso < min || iso > maxIso;
  const isDisabledMonth = (y: number, m: number) =>
    toIso({ y, m, d: daysIn(y, m) }) < min || toIso({ y, m, d: 1 }) > maxIso;

  /** Keeps the cursor inside min and max (as of the given latest date). */
  const clamp = (date: Ymd, latest = maxIso): Ymd => {
    const iso = toIso(date);
    if (iso < min) return parseIso(min)!;
    if (iso > latest) return parseIso(latest) ?? date;
    return date;
  };

  const close = (focusTrigger = true) => {
    setIsOpen(false);
    // By id rather than a ref: this runs from handlers inside render helpers.
    if (focusTrigger) document.getElementById(triggerId)?.focus();
  };

  const open = () => {
    if (disabled) return;
    const now = todayYmd();
    const nowIso = toIso(now);
    const latest = maxFor(nowIso) || '9999-12-31';
    const openTo = openToYearsAgo !== undefined ? { y: now.y - openToYearsAgo, m: 0, d: 1 } : null;
    const start = selected ?? openTo ?? parseIso(maxFor(nowIso)) ?? now;
    setToday(nowIso);
    setCursor(clamp(start, latest));
    // With nothing chosen yet, a date of birth is quickest picked year first.
    setView(selected ? 'days' : 'years');
    setIsOpen(true);
  };

  const select = (date: Ymd) => {
    const iso = toIso(date);
    if (isDisabledDay(iso)) return;
    onChange(iso);
    close();
  };

  // Close on a click outside, as CustomDropdown does.
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keep focus on the active cell as the cursor or view changes.
  useEffect(() => {
    if (!isOpen) return;
    panelRef.current?.querySelector<HTMLButtonElement>('[data-active="true"]')?.focus();
  }, [isOpen, view, cursor]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen && (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      open();
    }
  };

  /** Arrow keys move through whichever grid is showing; Enter picks, Escape closes. */
  const handleGridKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    // The header buttons keep their own Enter and Space.
    if (!(e.target as HTMLElement).hasAttribute('data-active')) return;

    const moves: Record<View, Record<string, () => Ymd>> = {
      days: {
        ArrowLeft: () => shift(cursor, 'day', -1),
        ArrowRight: () => shift(cursor, 'day', 1),
        ArrowUp: () => shift(cursor, 'day', -7),
        ArrowDown: () => shift(cursor, 'day', 7),
        Home: () => shift(cursor, 'day', -new Date(cursor.y, cursor.m, cursor.d).getDay()),
        End: () => shift(cursor, 'day', 6 - new Date(cursor.y, cursor.m, cursor.d).getDay()),
        PageUp: () => shift(cursor, 'month', e.shiftKey ? -12 : -1),
        PageDown: () => shift(cursor, 'month', e.shiftKey ? 12 : 1),
      },
      months: {
        ArrowLeft: () => shift(cursor, 'month', -1),
        ArrowRight: () => shift(cursor, 'month', 1),
        ArrowUp: () => shift(cursor, 'month', -3),
        ArrowDown: () => shift(cursor, 'month', 3),
      },
      years: {
        ArrowLeft: () => shift(cursor, 'month', -12),
        ArrowRight: () => shift(cursor, 'month', 12),
        ArrowUp: () => shift(cursor, 'month', -48),
        ArrowDown: () => shift(cursor, 'month', 48),
      },
    };

    const move = moves[view][e.key];
    if (move) {
      e.preventDefault();
      setCursor(clamp(move()));
      return;
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (view === 'days') select(cursor);
      else setView(view === 'years' ? 'months' : 'days');
    }
  };

  /**
   * Tabbing out to another field closes it. Only when focus lands somewhere else: a cell that
   * unmounts as the view changes blurs with nowhere to go, and that must not close it.
   */
  const handleBlur = (e: React.FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (isOpen && next && !containerRef.current?.contains(next)) setIsOpen(false);
  };

  const canGoPrev = view === 'days' && toIso({ y: cursor.y, m: cursor.m, d: 1 }) > min;
  const canGoNext = view === 'days' && toIso({ y: cursor.y, m: cursor.m, d: daysIn(cursor.y, cursor.m) }) < maxIso;

  const renderDays = () => {
    const lead = new Date(cursor.y, cursor.m, 1).getDay();
    const cells: (Ymd | null)[] = [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: daysIn(cursor.y, cursor.m) }, (_, i) => ({ y: cursor.y, m: cursor.m, d: i + 1 })),
    ];
    while (cells.length % 7) cells.push(null);

    return (
      <div role="grid" aria-labelledby={gridLabelId} className="c-datepicker-days">
        <div role="row" className="c-datepicker-weekdays">
          {WEEKDAYS.map((w) => (
            <span role="columnheader" key={w} className="c-datepicker-weekday">
              {w}
            </span>
          ))}
        </div>
        {Array.from({ length: cells.length / 7 }, (_, row) => (
          <div role="row" className="c-datepicker-row" key={row}>
            {cells.slice(row * 7, row * 7 + 7).map((cell, col) => {
              if (!cell) return <span role="gridcell" key={col} className="c-datepicker-blank" />;
              const iso = toIso(cell);
              const isSelected = iso === value;
              const isActive = cell.d === cursor.d;
              const isOff = isDisabledDay(iso);
              return (
                <span role="gridcell" key={col} aria-selected={isSelected}>
                  <button
                    type="button"
                    className={`c-datepicker-cell${isSelected ? ' is-selected' : ''}${iso === today ? ' is-today' : ''}`}
                    tabIndex={isActive ? 0 : -1}
                    data-active={isActive}
                    disabled={isOff}
                    aria-label={`${cell.d} ${MONTHS[cell.m]} ${cell.y}`}
                    onClick={() => select(cell)}
                  >
                    {cell.d}
                  </button>
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderMonths = () => (
    <div className="c-datepicker-grid months" role="listbox" aria-label="Month">
      {MONTHS.map((label, m) => {
        const isActive = m === cursor.m;
        return (
          <button
            type="button"
            role="option"
            key={label}
            aria-selected={selected?.y === cursor.y && selected?.m === m}
            className={`c-datepicker-cell${selected?.y === cursor.y && selected?.m === m ? ' is-selected' : ''}`}
            tabIndex={isActive ? 0 : -1}
            data-active={isActive}
            disabled={isDisabledMonth(cursor.y, m)}
            onClick={() => {
              setCursor(clamp({ y: cursor.y, m, d: Math.min(cursor.d, daysIn(cursor.y, m)) }));
              setView('days');
            }}
          >
            {label.slice(0, 3)}
          </button>
        );
      })}
    </div>
  );

  const renderYears = () => (
    // Newest first: for a date of birth the likely years are near the top.
    <div className="c-datepicker-grid years" role="listbox" aria-label="Year">
      {Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i).map((y) => {
        const isActive = y === cursor.y;
        return (
          <button
            type="button"
            role="option"
            key={y}
            aria-selected={selected?.y === y}
            className={`c-datepicker-cell${selected?.y === y ? ' is-selected' : ''}`}
            tabIndex={isActive ? 0 : -1}
            data-active={isActive}
            onClick={() => {
              setCursor(clamp({ y, m: cursor.m, d: Math.min(cursor.d, daysIn(y, cursor.m)) }));
              setView('months');
            }}
          >
            {y}
          </button>
        );
      })}
    </div>
  );

  const heading = view === 'days' ? `${MONTHS[cursor.m]} ${cursor.y}` : view === 'months' ? String(cursor.y) : 'Select year';

  return (
    <div
      ref={containerRef}
      className={`c-dropdown c-datepicker ${isOpen ? 'is-open' : ''} ${disabled ? 'is-disabled' : ''} ${className}`}
      onBlur={handleBlur}
    >
      {/* Hidden real input, so the form's required check and submission see the date. */}
      <input
        id={id}
        name={name}
        type="text"
        value={value}
        // Not readOnly: the browser skips required on read-only inputs. Only the picker sets it.
        onChange={() => {}}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
        className="c-datepicker-native"
      />

      <button
        id={triggerId}
        type="button"
        className="c-dropdown-trigger"
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`${ariaLabel || placeholder}${selected ? `: ${formatDisplay(selected)}` : ''}`}
        disabled={disabled}
      >
        <span className={`c-dropdown-value ${!selected ? 'is-placeholder' : ''}`}>
          {selected ? formatDisplay(selected) : placeholder}
        </span>
        <svg className="c-datepicker-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="3" y="4.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 8.5h14M7 2.75v3.5M13 2.75v3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="c-dropdown-panel c-datepicker-panel"
          role="dialog"
          aria-modal="false"
          aria-label={ariaLabel || placeholder}
          onKeyDown={handleGridKeyDown}
        >
          <div className="c-datepicker-head">
            <button
              type="button"
              className="c-datepicker-nav"
              aria-label="Previous month"
              disabled={!canGoPrev}
              tabIndex={view === 'days' ? 0 : -1}
              onClick={() => setCursor(clamp(shift(cursor, 'month', -1)))}
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              id={gridLabelId}
              className="c-datepicker-title"
              aria-live="polite"
              aria-label={view === 'days' ? `${heading}, choose month and year` : view === 'months' ? `${heading}, choose year` : heading}
              onClick={() => setView(view === 'days' ? 'months' : 'years')}
              disabled={view === 'years'}
            >
              {heading}
              {view !== 'years' && (
                <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="c-datepicker-nav"
              aria-label="Next month"
              disabled={!canGoNext}
              tabIndex={view === 'days' ? 0 : -1}
              onClick={() => setCursor(clamp(shift(cursor, 'month', 1)))}
            >
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {view === 'days' && renderDays()}
          {view === 'months' && renderMonths()}
          {view === 'years' && renderYears()}

          {!required && value && (
            <div className="c-datepicker-foot">
              <button
                type="button"
                className="c-datepicker-clear"
                onClick={() => {
                  onChange('');
                  close();
                }}
              >
                Clear date
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DatePicker;
