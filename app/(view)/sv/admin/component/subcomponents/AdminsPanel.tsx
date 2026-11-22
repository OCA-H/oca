'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { adminContent, type AdminPanel } from '../../content';
import { adminService, type MemberRow } from '../../services';
import { AdminConfirmDialog } from './AdminConfirmDialog';
import { AdminIcon } from './AdminIcon';
import { AdminPager } from './AdminPager';
import { PaymentNotice } from './ConfirmPaymentDialog';
import { RecordPanelFrame } from './RecordPanelFrame';

const text = adminContent.admins;

/** Typing pauses this long before the search goes to the server. */
const SEARCH_DELAY_MS = 350;

type Page = Awaited<ReturnType<typeof adminService.listMembers>>;
type Change = { member: MemberRow; role: 'admin' | 'member' };

interface AdminsPanelProps {
  /** The signed-in super admin, who cannot change their own role. */
  selfId: number;
  isActive: boolean;
  onBack: (panel: AdminPanel) => void;
}

/**
 * Every member account, a page at a time, with a button to make one a sub admin (role "admin") or
 * take it away. The role API refuses changes to a super admin and to your own account; the buttons
 * are only offered where it would allow them.
 */
export const AdminsPanel: React.FC<AdminsPanelProps> = ({ selfId, isActive, onBack }) => {
  const [hasOpened, setHasOpened] = useState(false);
  if (isActive && !hasOpened) setHasOpened(true);

  const [page, setPage] = useState(1);
  const [staffOnly, setStaffOnlyState] = useState(false);
  const [search, setSearch] = useState('');
  const [q, setQ] = useState('');
  const [nonce, setNonce] = useState(0);
  const [list, setList] = useState<Page | null>(null);
  const [settled, setSettled] = useState<{ key: string; error: string | null } | null>(null);

  const [change, setChange] = useState<Change | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [changeError, setChangeError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const key = `${page}|${staffOnly}|${q}|${nonce}`;

  useEffect(() => {
    if (!hasOpened) return;
    let isCurrent = true;
    adminService
      .listMembers({ page, q, staffOnly })
      .then((result) => {
        if (!isCurrent) return;
        const lastPage = Math.max(1, Math.ceil(result.total / result.pageSize));
        if (result.data.length === 0 && page > lastPage) {
          setPage(lastPage);
          return;
        }
        setList(result);
        setSettled({ key, error: null });
      })
      .catch((err: unknown) => {
        if (isCurrent) setSettled({ key, error: err instanceof Error ? err.message : 'Could not load this list.' });
      });
    return () => {
      isCurrent = false;
    };
  }, [hasOpened, page, q, staffOnly, key]);

  useEffect(() => {
    const next = search.trim();
    if (next === q) return;
    const timer = setTimeout(() => {
      setQ(next);
      setPage(1);
    }, SEARCH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [search, q]);

  const isLoading = hasOpened && settled?.key !== key;
  const error = settled?.key === key ? settled.error : null;
  const reload = useCallback(() => setNonce((n) => n + 1), []);

  const setStaffOnly = (value: boolean) => {
    setStaffOnlyState(value);
    setPage(1);
  };

  const open = (member: MemberRow, role: Change['role']) => {
    setChange({ member, role });
    setChangeError(null);
    setNotice(null);
  };

  const submit = async () => {
    if (!change) return;
    setIsBusy(true);
    setChangeError(null);
    try {
      const result = await adminService.setRole(change.member.id, change.role);
      setNotice(result.message);
      setChange(null);
      reload();
    } catch (err: unknown) {
      setChangeError(err instanceof Error ? err.message : 'That did not work. Please try again.');
    } finally {
      setIsBusy(false);
    }
  };

  const shown = list?.data ?? [];
  const from = list ? (list.page - 1) * list.pageSize + 1 : 0;

  return (
    <RecordPanelFrame panel="admins" isActive={isActive} onBack={onBack} isLoading={isLoading} hasLoaded={list !== null} error={error} onReload={reload}>
      <div className="mp-fade">
        <PaymentNotice notice={notice} />
        <input className="ad-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={text.search} aria-label={text.search} />
        <div className="ad-toolbar">
          <div className="ad-pills" role="group" aria-label="Which accounts">
            {text.filters.map((filter) => {
              const on = staffOnly === (filter.value === 'staff');
              return (
                <button key={filter.value} type="button" className={`ad-pill${on ? ' is-active' : ''}`} aria-pressed={on} onClick={() => setStaffOnly(filter.value === 'staff')}>
                  {filter.label}
                </button>
              );
            })}
          </div>
          <p className="ad-tally" aria-live="polite">
            {list && list.total > 0 && text.shown(from, from + shown.length - 1, list.total)}
          </p>
        </div>

        {shown.length === 0 ? (
          <p className="ad-empty">{text.none}</p>
        ) : (
          <ul className={`ad-bookings${isLoading ? ' is-loading' : ''}`} aria-busy={isLoading}>
            {shown.map((m) => {
              const roleLabel = text.roles[m.role];
              const isSelf = m.id === selfId;
              const isSuper = m.role === 'super_admin';
              return (
                <li key={m.id} className="ad-booking">
                  <div className="ad-booking-who">
                    <b>{m.name || m.email || m.memberId}</b>
                    {(m.memberId || m.batch) && <span>{[m.memberId, m.batch && `Batch ${m.batch}`].filter(Boolean).join(' · ')}</span>}
                    {m.email && <a href={`mailto:${m.email}`}>{m.email}</a>}
                    {m.mobile && <a href={`tel:${`${m.countryCode}${m.mobile}`.replace(/\s+/g, '')}`}>{[m.countryCode, m.mobile].filter(Boolean).join(' ')}</a>}
                  </div>
                  <div className="ad-booking-pass">
                    <b>{m.membershipType || '—'}</b>
                    {m.status !== 'active' && <span className="ad-cell-bad">{text.inactive}</span>}
                  </div>
                  <div className="ad-booking-pay">
                    {roleLabel ? <span className={`ad-badge ad-badge--${isSuper ? 'ok' : 'warn'}`}>{roleLabel}</span> : <span className="ad-badge ad-badge--muted">Member</span>}
                    {isSelf && <span>{text.you}</span>}
                    {!isSelf && !isSuper && (
                      <div className="ad-order-acts">
                        {m.role === 'admin' ? (
                          <button className="mp-photo-btn ad-pay-btn ad-pay-btn--danger" type="button" onClick={() => open(m, 'member')}>
                            <AdminIcon name="ban" />
                            {text.removeAdmin}
                          </button>
                        ) : (
                          m.status === 'active' && (
                            <button className="mp-photo-btn ad-pay-btn" type="button" onClick={() => open(m, 'admin')}>
                              <AdminIcon name="shield" />
                              {text.makeAdmin}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {list && <AdminPager page={list.page} pageSize={list.pageSize} total={list.total} isLoading={isLoading} onPage={setPage} />}
      </div>

      {change && (
        <AdminConfirmDialog
          title={(change.role === 'admin' ? text.makeDialog : text.removeDialog).title(change.member.name)}
          body={(change.role === 'admin' ? text.makeDialog : text.removeDialog).body}
          confirmLabel={(change.role === 'admin' ? text.makeDialog : text.removeDialog).confirm}
          busyLabel={(change.role === 'admin' ? text.makeDialog : text.removeDialog).busy}
          isBusy={isBusy}
          danger={change.role === 'member'}
          error={changeError}
          onCancel={() => setChange(null)}
          onConfirm={submit}
        />
      )}
    </RecordPanelFrame>
  );
};

export default AdminsPanel;
