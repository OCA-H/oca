'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { signOutMember } from '@/app/(view)/common/helper/useAuth';
import { ApiError, ocaAdminService, type ConsoleSummary, type StaffUser } from '../services/ocaAdmin.service';
import { OaIcon, type OaIconName } from './OaIcon';
import { Dialog, newFilters, type DialogSpec, type ListFilters } from './OaUi';
import type { MsgKind, OaContext } from './oaContext';
import {
  CreateAccountPage,
  CreateAdminsPage,
  DeleteAccountPage,
  DuplicateAccountPage,
  MembersDetailPage,
  UpdateAccountPage,
} from './MemberPages';
import { BirthdaysPage, DashboardPage, DonorPassPage, ExportDataPage } from './OtherPages';
import { ContributionsPage, DinnerBookingsPage, GolfBookingsPage, MembershipsPage } from './OrderPages';
import '../ocaAdmin.css';

/** The menu: the old portal's items, in its order, with group captions. */
const NAV: { route: string; label: string; icon: OaIconName; group?: string }[] = [
  { route: 'dashboard', label: 'Dashboard', icon: 'home' },
  { route: 'create-account', label: 'Create Account', icon: 'plus', group: 'Members' },
  // Hidden from the sidebar for now; the page still works via #create-admins (see HIDDEN_ROUTES).
  // { route: 'create-admins', label: 'Create Admins', icon: 'shield' },
  { route: 'update-account', label: 'Update Account', icon: 'edit' },
  { route: 'members-detail', label: 'Members Detail', icon: 'idcard' },
  { route: 'donor-pass', label: 'Donor Pass', icon: 'ticket' },
  { route: 'memberships', label: 'Membership Payments', icon: 'idcard', group: 'Payments' },
  { route: 'dinner-bookings', label: 'Dinner Bookings', icon: 'ticket' },
  { route: 'golf-bookings', label: 'Golf Bookings', icon: 'ticket' },
  { route: 'contributions', label: 'Contributions', icon: 'rupee' },
  { route: 'delete-account', label: 'Delete Account', icon: 'trash', group: 'Tools' },
  { route: 'duplicate-account', label: 'Duplicate Account', icon: 'copy' },
  { route: 'export-data', label: 'Export Data', icon: 'download' },
  { route: 'birthdays', label: 'Next 7 Days Birthday/Anniversary', icon: 'cal' },
];
const TITLES: Record<string, string> = {
  dashboard: 'Admin Dashboard',
  'create-admins': 'Create Sub Admins',
};
/** Pages that still open by address but are not listed in the sidebar. */
const HIDDEN_ROUTES = ['create-admins'];
const ROUTE_SET = new Set([...NAV.map((n) => n.route), ...HIDDEN_ROUTES]);

type Route = { v: string; id: string | null };
const routeOf = (hash: string): Route => {
  const [v, id] = hash.replace(/^#\/?/, '').split('/');
  return { v: ROUTE_SET.has(v) ? v : 'dashboard', id: id || null };
};

/** The address's #hash as React state. "oa-nav" is sent when the console moves itself (pushState). */
const NAV_EVENT = 'oa-nav';
const subscribeHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  window.addEventListener(NAV_EVENT, onChange);
  return () => {
    window.removeEventListener('hashchange', onChange);
    window.removeEventListener(NAV_EVENT, onChange);
  };
};
const readHash = () => window.location.hash;
const serverHash = () => '';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter((p) => p && !p.endsWith('.'))
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'OA';

export const OcaAdminView: React.FC = () => {
  const [me, setMe] = useState<StaffUser | null>(null);
  const [summary, setSummary] = useState<ConsoleSummary | null>(null);
  const [state, setState] = useState<'loading' | 'ready' | 'denied' | 'error'>('loading');
  const [loadError, setLoadError] = useState('');
  const hash = useSyncExternalStore(subscribeHash, readHash, serverHash);
  const route = useMemo(() => routeOf(hash), [hash]);
  const [message, setMessage] = useState<{ text: React.ReactNode; kind: MsgKind } | null>(null);
  const [dialog, setDialog] = useState<DialogSpec | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterMap, setFilterMap] = useState<Record<string, ListFilters>>({});
  const [leaving, setLeaving] = useState(false);
  const dirty = useRef(false);
  const hashRef = useRef('');
  const pageRef = useRef<HTMLDivElement>(null);

  /* ------------------------------ data ------------------------------ */

  const fetchMembers = useCallback(
    () =>
      ocaAdminService.summary().then(
        (res) => {
          setMe(res.me);
          setSummary(res.data);
          setState('ready');
        },
        (error) => {
          if (error instanceof ApiError && error.status === 403) setState('denied');
          else {
            setLoadError(error instanceof Error ? error.message : 'Something went wrong.');
            setState('error');
          }
        }
      ),
    []
  );

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const retry = () => {
    setState('loading');
    fetchMembers();
  };

  /* ----------------------------- routing ----------------------------- */

  /** What moving to another page resets. Called from event handlers, never during render. */
  const arrived = useCallback(() => {
    hashRef.current = window.location.hash;
    dirty.current = false;
    setMessage(null);
    setDialog(null);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  }, []);

  const go = useCallback(
    (v: string, id?: string | number) => {
      const next = `#${v}${id !== undefined ? `/${id}` : ''}`;
      if (window.location.hash !== next) history.pushState(null, '', next);
      arrived();
      window.dispatchEvent(new Event(NAV_EVENT));
    },
    [arrived]
  );

  useEffect(() => {
    hashRef.current = window.location.hash;
    const onHash = () => {
      if (window.location.hash === hashRef.current) return;
      if (dirty.current) {
        // Put the address back and ask first.
        const target = window.location.hash;
        history.replaceState(null, '', hashRef.current || '#dashboard');
        window.dispatchEvent(new Event(NAV_EVENT));
        setDialog({
          title: 'Leave this page?',
          body: 'You have changes that are not saved yet.',
          okLabel: 'Leave without saving',
          cancelLabel: 'Stay on this page',
          danger: true,
          onOk: () => {
            dirty.current = false;
            window.location.hash = target;
          },
        });
        return;
      }
      arrived();
    };
    const onUnload = (e: BeforeUnloadEvent) => {
      if (dirty.current) e.preventDefault();
    };
    window.addEventListener('hashchange', onHash);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, [arrived]);

  // The page title, and focus to the page (or its search box) after each move.
  useEffect(() => {
    if (state !== 'ready') return;
    const nav = NAV.find((n) => n.route === route.v);
    document.title = `${TITLES[route.v] ?? nav?.label ?? 'Admin'} – OCA admin`;
    const fine = window.matchMedia?.('(pointer:fine)').matches;
    const root = pageRef.current;
    if (!root) return;
    const field = root.querySelector<HTMLElement>('form#createForm [data-oa-select], form#editForm [data-oa-select]');
    const search = root.querySelector<HTMLElement>('[data-k="q"]');
    if (fine && (field || search)) (field ?? search)!.focus({ preventScroll: true });
    else {
      const h = root.querySelector<HTMLElement>('h1');
      h?.setAttribute('tabindex', '-1');
      h?.focus({ preventScroll: true });
    }
  }, [route, state]);

  // "/" jumps to the search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) || t.isContentEditable) return;
      const q = pageRef.current?.querySelector<HTMLInputElement>('[data-k="q"]');
      if (q) {
        e.preventDefault();
        q.focus();
        q.select();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  /* ----------------------------- context ----------------------------- */

  const msg = useCallback((text: React.ReactNode, kind: MsgKind = 'success') => {
    setMessage({ text, kind });
    const box = document.getElementById('msg');
    const top = box?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight - 60) window.scrollTo(0, 0);
  }, []);
  const setDirty = useCallback((value: boolean) => {
    dirty.current = value;
  }, []);
  const refreshSummary = useCallback(() => {
    ocaAdminService.summary().then((res) => setSummary(res.data), () => undefined);
  }, []);
  const filters = useCallback((key: string) => filterMap[key] ?? newFilters(), [filterMap]);
  const setFilters = useCallback((key: string, next: ListFilters) => setFilterMap((old) => ({ ...old, [key]: next })), []);

  const signOut = async () => {
    setLeaving(true);
    await signOutMember();
    window.location.replace(ROUTES.MEMBER_SIGNIN);
  };

  /* ------------------------------ render ------------------------------ */

  const isSuper = me?.role === 'super_admin';

  const header = (
    <header className="app-header">
      <div className="hdr-l">
        {state === 'ready' && (
          <button type="button" className="menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-label="Show or hide the menu" aria-expanded={menuOpen} aria-controls="side">
            <OaIcon name="menu" />
          </button>
        )}
        <a href="#dashboard" aria-label="OCA admin, dashboard">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="logo" src="/images/oca-header-logo.jpg" alt="Old Columbans Association" />
        </a>
        {me && <span className={`badge-admin${isSuper ? ' is-super' : ''}`}>{isSuper ? 'Super admin' : 'Admin'}</span>}
      </div>
      <div className="hdr-r">
        <nav className="hdr-links" aria-label="Elsewhere">
          <a href={ROUTES.HOME}>Website</a>
          <a href={ROUTES.PROFILE}>My Profile</a>
          {isSuper && <a href={ROUTES.ADMIN}>Super Admin Profile</a>}
        </nav>
        {me && (
          <div className="who">
            <span className="avatar" aria-hidden="true">
              {initials(me.fullName)}
            </span>
            <span className="nm">{me.fullName}</span>
          </div>
        )}
        <button type="button" className="btn btn-default btn-sm" onClick={signOut} disabled={leaving}>
          {leaving ? 'Signing out…' : 'Logout'}
        </button>
      </div>
    </header>
  );

  if (state !== 'ready' || !me) {
    return (
      <div className="oa">
        {header}
        <main className="main">
          <div className="content">
            {state === 'loading' && (
              <div className="state" role="status">
                <span className="spin" aria-hidden="true" />
                <p>Loading the portal…</p>
              </div>
            )}
            {state === 'denied' && (
              <div className="state">
                <h1>This page is for OCA admins</h1>
                <p>Only super admins and admins can open the OCA admin portal. If you were made an admin recently, sign out and sign in again.</p>
                <a className="btn btn-primary" href={ROUTES.PROFILE}>
                  Go to my profile
                </a>
              </div>
            )}
            {state === 'error' && (
              <div className="state">
                <h1>We could not load the portal</h1>
                <p>{loadError}</p>
                <button type="button" className="btn btn-primary" onClick={retry}>
                  Try again
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  }

  const ctx: OaContext = {
    me,
    isSuper,
    summary,
    refreshSummary,
    msg,
    ask: setDialog,
    go,
    setDirty,
    filters,
    setFilters,
    id: route.id,
  };

  const page = (() => {
    switch (route.v) {
      case 'create-account':
        return <CreateAccountPage ctx={ctx} />;
      case 'create-admins':
        return <CreateAdminsPage ctx={ctx} />;
      case 'update-account':
        return <UpdateAccountPage ctx={ctx} />;
      case 'members-detail':
        return <MembersDetailPage ctx={ctx} />;
      case 'donor-pass':
        return <DonorPassPage ctx={ctx} />;
      case 'delete-account':
        return <DeleteAccountPage ctx={ctx} />;
      case 'duplicate-account':
        return <DuplicateAccountPage ctx={ctx} />;
      case 'memberships':
        return <MembershipsPage ctx={ctx} />;
      case 'dinner-bookings':
        return <DinnerBookingsPage ctx={ctx} />;
      case 'golf-bookings':
        return <GolfBookingsPage ctx={ctx} />;
      case 'contributions':
        return <ContributionsPage ctx={ctx} />;
      case 'export-data':
        return <ExportDataPage ctx={ctx} />;
      case 'birthdays':
        return <BirthdaysPage />;
      default:
        return <DashboardPage ctx={ctx} />;
    }
  })();

  return (
    <div className="oa">
      <a
        href="#"
        className="skip"
        onClick={(e) => {
          e.preventDefault();
          const h = pageRef.current?.querySelector<HTMLElement>('h1');
          h?.setAttribute('tabindex', '-1');
          h?.focus();
        }}
      >
        Skip to the page
      </a>
      {header}
      <div className="app">
        <nav id="side" className={`side${menuOpen ? ' open' : ''}`} aria-label="Main menu">
          <ul>
            {NAV.map((n) => (
              <React.Fragment key={n.route}>
                {n.group && <li className="mg">{n.group}</li>}
                <li>
                  <a className={`mi${route.v === n.route ? ' on' : ''}`} href={`#${n.route}`} aria-current={route.v === n.route ? 'page' : undefined}>
                    <span className="mi-ic">
                      <OaIcon name={n.icon} />
                    </span>
                    <span>{n.label}</span>
                  </a>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </nav>
        <div className={`side-scrim${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen(false)} />
        <main className="main">
          <div className="content" ref={pageRef}>
            <div id="msg">
              {message && (
                <div className={`alert alert-${message.kind}`} role={message.kind === 'danger' ? 'alert' : 'status'}>
                  {message.kind === 'success' && (
                    <span className="alert-ic">
                      <OaIcon name="check" />
                    </span>
                  )}
                  <div>{message.text}</div>
                </div>
              )}
            </div>
            {/* Keyed by the address, so each visit starts the page fresh. */}
            <React.Fragment key={`${route.v}/${route.id ?? ''}`}>{page}</React.Fragment>
          </div>
        </main>
      </div>
      {dialog && <Dialog spec={dialog} onClose={() => setDialog(null)} />}
    </div>
  );
};

export default OcaAdminView;
