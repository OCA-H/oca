import type React from 'react';
import type { ConsoleSummary, StaffUser } from '../services/ocaAdmin.service';
import type { DialogSpec, ListFilters } from './OaUi';

export type MsgKind = 'success' | 'info' | 'warning' | 'danger';

/** What every console page gets from the shell. */
export interface OaContext {
  me: StaffUser;
  isSuper: boolean;
  /** The dashboard's numbers; null until loaded. */
  summary: ConsoleSummary | null;
  /** Fetches the numbers again after a change. */
  refreshSummary: () => void;
  /** The page's message line, above the title. */
  msg: (text: React.ReactNode, kind?: MsgKind) => void;
  ask: (spec: DialogSpec) => void;
  go: (route: string, id?: string | number) => void;
  /** A form with unsaved changes asks before the page is left. */
  setDirty: (dirty: boolean) => void;
  filters: (key: string) => ListFilters;
  setFilters: (key: string, next: ListFilters) => void;
  /** The id after the route, e.g. 12 in #update-account/12. */
  id: string | null;
}

