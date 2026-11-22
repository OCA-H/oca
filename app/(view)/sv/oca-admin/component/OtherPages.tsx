'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { EXPORT_KINDS, type ExportKind } from '@/app/api/(features)/sv/oca-admin/schema';
import { ocaAdminService, type DonorPassRow, type ExportCounts, type Occasion } from '../services/ocaAdmin.service';
import { OaIcon, type OaIconName } from './OaIcon';
import { DataTable, Dash, filterParams, money, PagedList, PageHead, Pager, plural, TableSkeleton } from './OaUi';
import { OaSelect } from './OaSelect';
import type { OaContext } from './oaContext';

const errorText = (error: unknown) => (error instanceof Error ? error.message : 'Something went wrong. Please try again.');

/* ------------------------------- Dashboard ------------------------------- */

export const DashboardPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => {
  const total = ctx.summary?.members;
  const tiles: [string, string, OaIconName, string][] = [
    ['create-account', 'Create Account', 'plus', ''],
    ['update-account', 'Update Account', 'edit', total === undefined ? '' : plural(total, 'member', 'members')],
    ['members-detail', 'Members Detail', 'idcard', ''],
    ['memberships', 'Membership Payments', 'idcard', ''],
    ['dinner-bookings', 'Dinner Bookings', 'ticket', ''],
    ['golf-bookings', 'Golf Bookings', 'ticket', ''],
    ['contributions', 'Contributions', 'rupee', ''],
    ['export-data', 'Export Data', 'download', plural(EXPORT_KINDS.length, 'file', 'files')],
    ['delete-account', 'Delete Account', 'trash', ''],
  ];
  return (
    <>
      <PageHead title="Admin Dashboard" />
      <div className="tiles">
        {tiles.map(([route, title, icon, sub]) => (
          <a key={route} className="tile" href={`#${route}`}>
            <span className="tile-ic">
              <OaIcon name={icon} />
            </span>
            <span className="tile-body">
              <span className="tile-t">{title}</span>
              {sub && <span className="tile-s">{sub}</span>}
            </span>
            <span className="tile-go" aria-hidden="true">
              &rarr;
            </span>
          </a>
        ))}
      </div>
    </>
  );
};

/* ------------------------------- Donor Pass ------------------------------- */

const passName = (p: DonorPassRow) => `${p.passLabel} (${p.eventName})`;

export const DonorPassPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => {
  const filters = ctx.filters('dp');
  const [busy, setBusy] = useState<'all' | 'teachers' | null>(null);

  const exportCsv = async (teachers: boolean) => {
    const params = filterParams(filters);
    params.delete('page');
    params.delete('pageSize');
    if (teachers) params.set('teachers', '1');
    setBusy(teachers ? 'teachers' : 'all');
    try {
      const { count } = await ocaAdminService.downloadPasses(params);
      const n = count ?? 0;
      ctx.msg(teachers ? `Exported ${plural(n, 'sponsor a teacher entry', 'sponsor a teacher entries')}.` : `Exported ${plural(n, 'donor pass', 'donor passes')}.`);
    } catch (error) {
      ctx.msg(errorText(error), 'danger');
    } finally {
      setBusy(null);
    }
  };

  const showPass = (r: DonorPassRow) =>
    ctx.ask({
      title: `Pass ${r.orderId}`,
      body: (
        <table className="kv">
          <tbody>
            {(
              [
                ['Event', r.eventName],
                ['Pass', r.passLabel],
                ['Name', r.name],
                ['Batch', r.batch],
                ['Spouse', r.spouseName],
                ['Teachers sponsored', String(r.teachers)],
                ...r.lineItems.map((li) => [li.label, money(li.amount)] as [string, string]),
                ['Total paid', money(r.amount)],
                ['Paid on', r.paidAt ? new Date(r.paidAt).toLocaleString('en-IN') : ''],
              ] as [string, string][]
            ).map(([k, v], i) => (
              <tr key={`${k}-${i}`}>
                <th scope="row">{k}</th>
                <td>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ),
    });

  return (
    <PagedList<DonorPassRow>
      title="Donor Pass"
      filters={filters}
      onFilters={(f) => ctx.setFilters('dp', f)}
      fetchPage={(f, signal) => ocaAdminService.passesPage(filterParams(f), signal)}
      rowKey={(r) => r.id}
      batch
      type={{
        label: 'Donor Pass',
        options: (page) =>
          Object.entries(page?.types ?? {})
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, n]) => {
              const [event, ...label] = key.split('|');
              return { value: key, label: `${label.join('|')} (${event}) · ${n}` };
            }),
      }}
      top={
        <div className="top-actions">
          <button type="button" className="btn btn-default" onClick={() => exportCsv(true)} disabled={busy !== null}>
            {busy === 'teachers' ? 'Preparing…' : 'Export Sponsor a teacher'}
          </button>
          <button type="button" className="btn btn-default" onClick={() => exportCsv(false)} disabled={busy !== null}>
            {busy === 'all' ? 'Preparing…' : 'Export Donor Pass'}
          </button>
        </div>
      }
      cols={[
        { label: 'SN', sortKey: 'id', cell: (r) => r.id },
        { label: 'Name', sortKey: 'name', primary: true, cell: (r) => r.name },
        { label: 'Batch', sortKey: 'batch', cell: (r) => r.batch },
        { label: 'Email', sortKey: 'email', cell: (r) => <Dash v={r.email} /> },
        { label: 'Mobile', sortKey: 'mobile', cell: (r) => <Dash v={r.mobile} /> },
        { label: 'Amount', sortKey: 'amount', cell: (r) => money(r.amount) },
        { label: 'Pass Name', sortKey: 'pass', cell: (r) => passName(r) },
        {
          label: 'Pass No',
          sortKey: 'orderId',
          cell: (r) => (
            <button type="button" className="linkbtn" onClick={() => showPass(r)}>
              {r.orderId}
            </button>
          ),
        },
      ]}
      one="pass"
      many="passes"
      emptyText="No passes have been paid for yet."
    />
  );
};

/* ------------------------------- Export Data ------------------------------- */

const EXPORT_INFO: Record<ExportKind, { title: string; desc: string }> = {
  members: { title: 'Member Details', desc: 'Every member’s full record: identity, home and work details, notes, role and account status.' },
  applications: { title: 'Apply Members Information', desc: 'Everyone who applied for membership through the website, with the payment details of each application.' },
  receipts: { title: 'Member Receipt Data', desc: 'The membership fee receipts: who paid, how much, the receipt number and the date.' },
  events: { title: 'Events Information', desc: 'Who booked event passes (Annual Dinner, Golf and others), and which pass each person chose.' },
  admins: { title: 'Sub-Admin Information', desc: 'The super admins and sub admins of this portal.' },
};

export const ExportDataPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => {
  const [counts, setCounts] = useState<ExportCounts | null>(null);
  const [busy, setBusy] = useState<ExportKind | null>(null);

  useEffect(() => {
    let live = true;
    ocaAdminService
      .exportCounts()
      .then((res) => live && setCounts(res.data))
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, []);

  const run = async (kind: ExportKind) => {
    if (counts && counts[kind] === 0) {
      ctx.msg(`There is nothing to export for ${EXPORT_INFO[kind].title} yet.`, 'warning');
      return;
    }
    setBusy(kind);
    try {
      const name = await ocaAdminService.downloadExport(kind);
      ctx.msg(
        <>
          Downloaded <b>{name}</b>
          {counts ? ` (${plural(counts[kind], 'record', 'records')})` : ''}. Look in your Downloads folder.
        </>
      );
    } catch (error) {
      ctx.msg(errorText(error), 'danger');
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHead title="Export Data" />
      <DataTable<ExportKind>
        rows={[...EXPORT_KINDS]}
        rowKey={(k) => k}
        cols={[
          { label: 'File', primary: true, cell: (k) => <b>{EXPORT_INFO[k].title}</b> },
          { label: 'What it has', wrap: true, cell: (k) => EXPORT_INFO[k].desc },
          { label: 'Size', cell: (k) => (counts ? plural(counts[k], 'record', 'records') : <span className="skeleton" style={{ display: 'inline-block', width: 80 }} />) },
          {
            label: '',
            cell: (k) => (
              <button type="button" className="btn btn-default btn-sm" onClick={() => run(k)} disabled={busy !== null}>
                {busy === k ? 'Preparing…' : 'Download CSV'}
              </button>
            ),
          },
        ]}
      />
      <p className="count">These files hold members’ personal details. Keep them private and delete them when you are done. Passwords are never exported.</p>
    </>
  );
};

/* ------------------------- Next 7 Days Birthday / Anniversary ------------------------- */

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const OCC_PER_PAGE = 25;

export const BirthdaysPage: React.FC = () => {
  const [result, setResult] = useState<{ list: Occasion[] | null; error: string | null } | null>(null);
  const [kind, setKind] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let live = true;
    ocaAdminService.occasions().then(
      (res) => live && setResult({ list: res.data, error: null }),
      (e) => live && setResult({ list: null, error: errorText(e) })
    );
    return () => {
      live = false;
    };
  }, []);

  const list = useMemo(() => (result?.list ?? []).filter((x) => !kind || x.kind === kind), [result, kind]);
  const pages = Math.max(1, Math.ceil(list.length / OCC_PER_PAGE));
  const shownPage = Math.min(page, pages);
  const count = (k: string) => (result?.list ?? []).filter((x) => x.kind === k).length;

  return (
    <>
      <PageHead title="Next 7 Days Birthday/Anniversary">
        <form className="filters" onSubmit={(e) => e.preventDefault()}>
          <div className="ff">
            <span>Occasion</span>
            <OaSelect
              value={kind}
              onChange={(v) => {
                setKind(v);
                setPage(1);
              }}
              placeholder="All"
              allowEmpty
              ariaLabel="Occasion"
              searchable={false}
              options={[
                { value: 'Birthday', label: `Birthdays (${count('Birthday')})` },
                { value: 'Anniversary', label: `Anniversaries (${count('Anniversary')})` },
              ]}
            />
          </div>
        </form>
      </PageHead>
      {result?.error && <div className="alert alert-danger" role="alert">{result.error}</div>}
      {!result ? (
        <TableSkeleton cols={6} />
      ) : !list.length ? (
        <p className="text-muted">There is no record.</p>
      ) : (
        <>
          <DataTable<Occasion>
            rows={list.slice((shownPage - 1) * OCC_PER_PAGE, shownPage * OCC_PER_PAGE)}
            rowKey={(x) => `${x.kind}-${x.member.id}`}
            cols={[
              {
                label: 'Date',
                cell: (x) => {
                  const d = new Date(`${x.date}T00:00:00`);
                  return (
                    <>
                      {x.inDays === 0 ? <b>Today</b> : DAY[d.getDay()]}, {d.getDate()} {MON[d.getMonth()]}
                    </>
                  );
                },
              },
              { label: 'Occasion', cell: (x) => x.kind },
              { label: 'Name', primary: true, cell: (x) => <a href={`#members-detail/${x.member.id}`}>{x.member.name}</a> },
              { label: 'Batch', cell: (x) => x.member.batch },
              { label: 'Email', cell: (x) => (x.member.email ? <a href={`mailto:${x.member.email}`}>{x.member.email}</a> : '') },
              { label: 'Mobile', cell: (x) => <Dash v={x.member.mobile} /> },
            ]}
          />
          <div className="foot">
            <span className="count" style={{ margin: 0 }}>
              {plural(list.length, 'date', 'dates')} in the next 7 days
            </span>
            <Pager page={shownPage} pages={pages} onPage={setPage} />
          </div>
        </>
      )}
    </>
  );
};
