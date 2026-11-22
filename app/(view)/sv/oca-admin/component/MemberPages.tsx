'use client';

import React, { useEffect, useMemo, useState } from 'react';
import 'flag-icons/css/flag-icons.min.css';
import { MEMBER_TITLES, FIRST_BATCH, lastBatch } from '@/app/api/(features)/sv/oca-admin/schema';
import { ApiError, ocaAdminService, type DuplicateGroup, type MemberDetail, type MemberInput, type MemberRow } from '../services/ocaAdmin.service';
import { countryForDialCode, DEFAULT_DIAL_CODE, flagClass, phoneCountries } from '@/app/(view)/common/helper/phone';
import { OaRadio, OaSelect, type OaOption } from './OaSelect';
import { Actions, Back, DataTable, Dash, filterParams, KeyValues, PagedList, PageHead, Pager, TableSkeleton, type ListFilters, type Paged, type PagedColumn } from './OaUi';
import type { OaContext } from './oaContext';

const SUPER = 'super_admin';
const ADMIN = 'admin';
const REQ = <span className="req"> *</span>;

export const RoleBadge: React.FC<{ role: string }> = ({ role }) =>
  role === SUPER ? <span className="label-gold">Super admin</span> : role === ADMIN ? <span className="label-success">Sub admin</span> : null;

/** Admins cannot change a super admin's account; nobody deletes themselves or a super admin. */
const canEdit = (ctx: OaContext, m: MemberRow) => ctx.isSuper || m.role !== SUPER || m.id === ctx.me.id;
const canDelete = (ctx: OaContext, m: MemberRow) => m.id !== ctx.me.id && m.role !== SUPER;

const errorText = (error: unknown) => (error instanceof Error ? error.message : 'Something went wrong. Please try again.');

/* ------------------------------ the form ------------------------------- */

const emptyInput = (): MemberInput => ({
  title: '',
  batch: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  password: '',
  countryCode: '+91',
  mobile: '',
  memberId: '',
  remark: '',
});

const inputOf = (m: MemberRow): MemberInput => ({
  title: m.title,
  batch: m.batch,
  firstName: m.firstName,
  middleName: m.middleName,
  lastName: m.lastName,
  email: m.email,
  countryCode: m.countryCode,
  mobile: m.mobile,
  memberId: m.memberId,
  remark: m.remark,
});

/** Every country with its flag, India first (the contact page's list). The value is the country, as +1 and +44 are shared. */
let countryOptions: OaOption[] | null = null;
const COUNTRY_OPTIONS = (): OaOption[] =>
  (countryOptions ??= phoneCountries().map((c) => ({ value: c.iso2, label: `${c.name} (${c.dialCode})`, short: c.dialCode, flag: flagClass(c.iso2) })));

const BATCHES = (() => {
  const years: number[] = [];
  for (let y = FIRST_BATCH; y <= lastBatch(); y++) years.push(y);
  return years;
})();

/** Create Account and Update Account: the same fields, password only when creating. */
const MemberForm: React.FC<{
  ctx: OaContext;
  initial: MemberInput;
  isNew: boolean;
  onSubmit: (input: MemberInput) => Promise<void>;
  cancelHref?: string;
}> = ({ ctx, initial, isNew, onSubmit, cancelHref }) => {
  const [v, setV] = useState<MemberInput>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof MemberInput, string>>>({});
  const [busy, setBusy] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { setDirty } = ctx;

  useEffect(() => () => setDirty(false), [setDirty]);

  const set = (key: keyof MemberInput) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setV((old) => ({ ...old, [key]: e.target.value }));
    setErrors((old) => ({ ...old, [key]: undefined }));
    setDirty(true);
  };

  const setValue = (key: keyof MemberInput) => (value: string) => {
    setV((old) => ({ ...old, [key]: value }));
    setErrors((old) => ({ ...old, [key]: undefined }));
    setDirty(true);
  };

  const err = (key: keyof MemberInput) =>
    errors[key] ? (
      <p className="ferr" id={`oa-err-${key}`}>
        {errors[key]}
      </p>
    ) : null;
  const invalid = (key: keyof MemberInput) =>
    errors[key] ? { 'aria-invalid': true as const, 'aria-describedby': `oa-err-${key}` } : {};

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setBusy(true);
    try {
      await onSubmit(v);
      setErrors({});
      if (isNew) {
        setV(emptyInput());
        setShowPw(false);
      }
      setDirty(false);
    } catch (error) {
      if (error instanceof ApiError && Object.keys(error.fields).length) {
        setErrors(error.fields as typeof errors);
        ctx.msg(error.message, 'danger');
        const firstBad = form.querySelector<HTMLElement>('[aria-invalid="true"]');
        setTimeout(() => (form.querySelector<HTMLElement>('[aria-invalid="true"]') ?? firstBad)?.focus(), 0);
      } else ctx.msg(errorText(error), 'danger');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form id={isNew ? 'createForm' : 'editForm'} onSubmit={submit} noValidate>
      <div className="card fcard">
        <div className="fgrid">
          <div className="fld">
            <span className="lbl">Title{REQ}</span>
            <OaSelect
              value={v.title}
              onChange={setValue('title')}
              placeholder="Please Enter Title"
              ariaLabel="Title"
              options={[...(v.title && !(MEMBER_TITLES as readonly string[]).includes(v.title) ? [v.title] : []), ...MEMBER_TITLES].map((t) => ({ value: t, label: t }))}
              invalid={!!errors.title}
              describedBy={errors.title ? 'oa-err-title' : undefined}
            />
            {err('title')}
          </div>
          <div className="fld">
            <span className="lbl">Batch{REQ}</span>
            <OaSelect
              value={v.batch}
              onChange={setValue('batch')}
              placeholder="Please Enter Batch"
              ariaLabel="Batch"
              options={[...(v.batch && !BATCHES.includes(Number(v.batch)) ? [v.batch] : []), ...BATCHES.map(String)].map((y) => ({ value: y, label: y }))}
              invalid={!!errors.batch}
              describedBy={errors.batch ? 'oa-err-batch' : undefined}
            />
            {err('batch')}
          </div>
          <div className="fld">
            <span className="lbl">Type of Membership</span>
            <OaRadio name="mtype" label="Life Member" checked />
          </div>
          <label className="fld">
            <span>First Name{REQ}</span>
            <input className="form-control" value={v.firstName} onChange={set('firstName')} required placeholder="Please Enter First Name" maxLength={80} {...invalid('firstName')} />
            {err('firstName')}
          </label>
          <label className="fld">
            <span>Second Name</span>
            <input className="form-control" value={v.middleName} onChange={set('middleName')} placeholder="Please Enter Second Name" maxLength={80} />
          </label>
          <label className="fld">
            <span>Family Name</span>
            <input className="form-control" value={v.lastName} onChange={set('lastName')} placeholder="Please Enter Family Name" maxLength={80} />
          </label>
          <label className="fld">
            <span>Email ID{isNew && REQ}</span>
            <input className="form-control" type="email" value={v.email} onChange={set('email')} required={isNew} placeholder="Please Enter Email ID" autoComplete="off" {...invalid('email')} />
            {err('email')}
          </label>
          {isNew ? (
            <label className="fld">
              <span>Password{REQ}</span>
              <span className="pwbox">
                <input
                  className="form-control"
                  type={showPw ? 'text' : 'password'}
                  value={v.password ?? ''}
                  onChange={set('password')}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  placeholder="Please Enter Password"
                  {...invalid('password')}
                />
                <button type="button" className="pwtoggle" onClick={() => setShowPw((s) => !s)} aria-label={showPw ? 'Hide the password' : 'Show the password'}>
                  {showPw ? 'Hide' : 'Show'}
                </button>
              </span>
              {err('password') ?? <p className="hint">At least 8 characters.</p>}
            </label>
          ) : (
            <span />
          )}
          <div className="fld">
            <span className="lbl">
              Mobile <small className="text-muted">(Country code &amp; number)</small>
              {isNew && REQ}
            </span>
            <div className="phone">
              <OaSelect
                value={countryForDialCode(v.countryCode || DEFAULT_DIAL_CODE)}
                onChange={(iso) => setValue('countryCode')(COUNTRY_OPTIONS().find((o) => o.value === iso)?.short ?? DEFAULT_DIAL_CODE)}
                placeholder="Code"
                ariaLabel="Country code"
                options={COUNTRY_OPTIONS()}
                invalid={!!errors.countryCode}
                describedBy={errors.countryCode ? 'oa-err-countryCode' : undefined}
              />
              <input className="form-control" value={v.mobile} onChange={set('mobile')} required={isNew} placeholder="Please Enter Mobile" aria-label="Mobile number" inputMode="tel" {...invalid('mobile')} />
            </div>
            {err('countryCode')}
            {err('mobile')}
          </div>
          <label className="fld">
            <span>OCA Membership ID</span>
            <input className="form-control" value={v.memberId} onChange={set('memberId')} placeholder="Please Enter OCA ID" maxLength={50} {...invalid('memberId')} />
            {err('memberId') ??
              (isNew ? <p className="hint">The system generates the membership number if this is left blank.</p> : <p className="hint">Members can sign in with this ID.</p>)}
          </label>
          <label className="fld span2">
            <span>Remark</span>
            <textarea className="form-control" rows={2} value={v.remark} onChange={set('remark')} placeholder="Please Enter Remark" maxLength={1000} />
          </label>
        </div>
        <Actions>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? 'Saving…' : isNew ? 'Submit' : 'Save changes'}
          </button>
          {isNew ? (
            <button
              type="button"
              className="btn btn-default"
              disabled={busy}
              onClick={() => {
                setV(emptyInput());
                setErrors({});
                setDirty(false);
              }}
            >
              Reset
            </button>
          ) : (
            <a href={`#${cancelHref ?? 'update-account'}`} className="btn btn-default">
              Cancel
            </a>
          )}
        </Actions>
      </div>
    </form>
  );
};

/* ---------------------------- shared list bits ---------------------------- */

const fetchMembers = () => async (f: ListFilters, signal?: AbortSignal): Promise<Paged<MemberRow>> =>
  ocaAdminService.membersPage(filterParams(f, 'missing'), signal);

/** Reloads the list after a change, and the dashboard numbers with it. */
function useReload(ctx: OaContext) {
  const [reload, setReload] = useState(0);
  return {
    reload,
    bump: () => {
      setReload((n) => n + 1);
      ctx.refreshSummary();
    },
  };
}

const nameCol = (cell: (m: MemberRow) => React.ReactNode): PagedColumn<MemberRow> => ({ label: 'Name', sortKey: 'name', primary: true, cell });
const batchCol: PagedColumn<MemberRow> = { label: 'Batch', sortKey: 'batch', cell: (m) => m.batch };
const idCol: PagedColumn<MemberRow> = { label: 'OCA ID', sortKey: 'memberId', cell: (m) => <Dash v={m.memberId} /> };
const emailCol: PagedColumn<MemberRow> = { label: 'Email', sortKey: 'email', cell: (m) => <Dash v={m.email} /> };
const mobileCol: PagedColumn<MemberRow> = { label: 'Mobile', sortKey: 'mobile', cell: (m) => <Dash v={m.mobile} /> };

/** Loads one account by its id for the Update and Detail pages. */
function useMember(id: string | null) {
  const [state, setState] = useState<{ id: string; member: MemberDetail | null; error: string | null } | null>(null);
  useEffect(() => {
    if (!id) return;
    let live = true;
    ocaAdminService.getMember(Number(id)).then(
      (res) => live && setState({ id, member: res.data, error: null }),
      (e) => live && setState({ id, member: null, error: e instanceof ApiError && e.status === 404 ? null : errorText(e) })
    );
    return () => {
      live = false;
    };
  }, [id]);
  const current = state?.id === id ? state : null;
  return { loading: !!id && !current, member: current?.member ?? null, error: current?.error ?? null };
}

const Loading: React.FC<{ title: string; back: string }> = ({ title, back }) => (
  <>
    <Back to={back} label="Back to the list" />
    <PageHead title={title} />
    <div className="state" style={{ minHeight: 220 }} role="status">
      <span className="spin" aria-hidden="true" />
      <p>Loading the account…</p>
    </div>
  </>
);

/* ---------------------------- Create Account ---------------------------- */

export const CreateAccountPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => (
  <>
    <PageHead title="Create Account For New Membership" />
    <MemberForm
      ctx={ctx}
      isNew
      initial={emptyInput()}
      onSubmit={async (input) => {
        const { data } = await ocaAdminService.createMember(input);
        ctx.refreshSummary();
        ctx.msg(
          <>
            Account created for <b>{data.name}</b>. Membership ID: {data.memberId}. <a href={`#members-detail/${data.id}`}>View this member</a>
          </>
        );
      }}
    />
  </>
);

/* ---------------------------- Create Sub Admins ---------------------------- */

export const CreateAdminsPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => {
  const { reload, bump } = useReload(ctx);
  const change = (m: MemberRow, role: 'admin' | 'member') =>
    ctx.ask({
      title: role === 'admin' ? `Make ${m.name} a sub admin?` : `Remove ${m.name} as a sub admin?`,
      body:
        role === 'admin'
          ? 'They will be added as a sub admin of this portal: they can create, update and delete member accounts and download the exports. They see it after they next sign in.'
          : 'They stay a member, but lose access to this portal.',
      okLabel: role === 'admin' ? 'Make sub admin' : 'Remove sub admin',
      danger: role === 'member',
      onOk: async () => {
        try {
          const res = await ocaAdminService.setRole(m.id, role);
          bump();
          ctx.msg(res.message ?? 'Saved.');
        } catch (error) {
          ctx.msg(errorText(error), 'danger');
        }
      },
    });

  const cols: PagedColumn<MemberRow>[] = [
    nameCol((m) =>
      m.role === SUPER || m.role === ADMIN || m.status !== 'active' ? (
        <>
          {m.name}
          <RoleBadge role={m.role} />
          {m.status !== 'active' && <span className="text-muted small"> (inactive)</span>}
        </>
      ) : (
        <button type="button" className="linkbtn" onClick={() => change(m, 'admin')}>
          {m.name}
        </button>
      )
    ),
    batchCol,
    idCol,
  ];
  if (ctx.isSuper) {
    cols.push({
      label: 'Action',
      cell: (m) =>
        m.role === ADMIN ? (
          <button type="button" className="linkbtn text-danger" onClick={() => change(m, 'member')}>
            Remove sub admin
          </button>
        ) : null,
    });
  }

  return (
    <PagedList
      title="Create New Sub Admin's"
      filters={ctx.filters('adm')}
      onFilters={(f) => ctx.setFilters('adm', f)}
      fetchPage={fetchMembers()}
      reload={reload}
      rowKey={(m) => m.id}
      batch
      cols={cols}
      one="member"
      many="members"
      top={<p className="count" style={{ margin: '0 2px 14px' }}>Click a member’s name to make them a sub admin.</p>}
    />
  );
};

/* ---------------------------- Update Account ---------------------------- */

const Stat: React.FC<{ m: MemberRow }> = ({ m }) => {
  const icon = (on: boolean, cls: string, yes: string, no: string) => (
    <React.Fragment key={cls}>
      <i className={`si ${cls} ${on ? 'ok' : 'no'}`} title={on ? yes : no} />
      <span className="sr-only">{on ? yes : no}</span>
    </React.Fragment>
  );
  return (
    <span className="stat">
      {icon(!!m.memberId, 'idc', 'Has a membership ID', 'No membership ID')}
      {icon(!!m.email, 'mil', 'Has an email', 'No email')}
      {icon(!!m.mobile, 'phn', 'Has a mobile number', 'No mobile number')}
    </span>
  );
};

const NotFound: React.FC<{ back: string; error?: string | null }> = ({ back, error }) => (
  <>
    <PageHead title={error ? 'Could not load this account' : 'Member not found'} />
    <p className="text-muted">{error ?? 'This account may have been deleted.'}</p>
    <Back to={back} label="Back" />
  </>
);

const UpdateOne: React.FC<{ ctx: OaContext; id: string }> = ({ ctx, id }) => {
  const { loading, member: m, error } = useMember(id);
  if (loading) return <Loading title="Update OCA Member Info" back="update-account" />;
  if (!m) return <NotFound back="update-account" error={error} />;
  if (!canEdit(ctx, m)) {
    return (
      <>
        <Back to="update-account" label="Back to the list" />
        <PageHead title="Update OCA Member Info" />
        <div className="alert alert-warning">Only a super admin can change a super admin’s account.</div>
      </>
    );
  }
  return (
    <>
      <Back to="update-account" label="Back to the list" />
      <PageHead title="Update OCA Member Info" />
      <MemberForm
        key={m.id}
        ctx={ctx}
        isNew={false}
        initial={inputOf(m)}
        onSubmit={async (input) => {
          const res = await ocaAdminService.updateMember(m.id, input);
          ctx.setDirty(false);
          ctx.go('update-account');
          ctx.msg(res.message ?? `Saved changes for ${res.data.name}.`);
        }}
      />
    </>
  );
};

export const UpdateAccountPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => {
  if (ctx.id) return <UpdateOne ctx={ctx} id={ctx.id} />;
  return (
    <PagedList
      title="Update OCA Member Info"
      filters={ctx.filters('ua')}
      onFilters={(f) => ctx.setFilters('ua', f)}
      fetchPage={fetchMembers()}
      rowKey={(m) => m.id}
      batch
      allBatches
      type={{
        label: 'Type',
        options: () => [
          { value: 'email', label: 'Missing Email' },
          { value: 'mobile', label: 'Missing Mobile' },
          { value: 'id', label: 'Missing Membership ID' },
        ],
      }}
      cols={[
        nameCol((m) => (
          <>
            <a href={`#update-account/${m.id}`}>{m.name}</a>
            <RoleBadge role={m.role} />
            <Stat m={m} />
          </>
        )),
        batchCol,
        idCol,
      ]}
      one="member"
      many="members"
    />
  );
};

/* ---------------------------- Members Detail ---------------------------- */

const prettyDate = (iso: string | null) => {
  if (!iso) return '';
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const MemberDetailView: React.FC<{ ctx: OaContext; id: string }> = ({ ctx, id }) => {
  const { loading, member: d, error } = useMember(id);
  if (loading) return <Loading title="Members Detail" back="members-detail" />;
  if (!d) return <NotFound back="members-detail" error={error} />;
  const address = [d.address.line1, d.address.line2, d.address.line3, d.address.city, d.address.state, d.address.zip, d.address.country].filter(Boolean).join(', ');
  const work = [d.office.designation, d.office.organisation, d.office.city, d.office.country].filter(Boolean).join(', ');
  return (
    <>
      <Back to="members-detail" label="Back to the list" />
      <PageHead title="Members Detail" />
      <KeyValues
        rows={[
          ['Title', d.title],
          ['Name', d.name],
          ['Batch', d.batch],
          ['Type of Membership', d.membershipType],
          ['OCA Membership ID', d.memberId],
          ['User ID', d.username ?? ''],
          ['Email ID', d.email],
          ['Mobile', `${d.countryCode ? `${d.countryCode} ` : ''}${d.mobile}`],
          ['Date of birth', prettyDate(d.dateOfBirth)],
          ['Spouse', d.spouseName],
          ['Anniversary', prettyDate(d.anniversary)],
          ['Address', address],
          ['Work', work],
          ['Apply date', d.appliedOn],
          ['Account status', d.status === 'active' ? 'Active' : d.status],
          ['Role', d.role === SUPER ? 'Super admin' : d.role === ADMIN ? 'Sub admin' : 'Member'],
          ['Last sign-in', d.lastLoginAt ? new Date(d.lastLoginAt).toLocaleString('en-IN') : 'Never'],
          ['Remark', d.remark],
        ]}
      />
      {canEdit(ctx, d) && (
        <Actions>
          <a href={`#update-account/${d.id}`} className="btn btn-primary">
            Update this member
          </a>
        </Actions>
      )}
    </>
  );
};

export const MembersDetailPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => {
  if (ctx.id) return <MemberDetailView ctx={ctx} id={ctx.id} />;
  return (
    <PagedList
      title="Members Detail"
      filters={ctx.filters('md')}
      onFilters={(f) => ctx.setFilters('md', f)}
      fetchPage={fetchMembers()}
      rowKey={(m) => m.id}
      batch
      allBatches
      cols={[
        nameCol((m) => (
          <>
            <a href={`#members-detail/${m.id}`}>{m.name}</a>
            <RoleBadge role={m.role} />
          </>
        )),
        batchCol,
        idCol,
        emailCol,
        mobileCol,
      ]}
      one="member"
      many="members"
    />
  );
};

/* ---------------------------- Delete Account ---------------------------- */

function useDeleteMember(ctx: OaContext, onDone: () => void) {
  return (m: MemberRow) =>
    ctx.ask({
      title: `Delete ${m.name}?`,
      body: 'Their account is removed from the portal and they can no longer sign in. Their past bookings and payments stay on record. This cannot be undone.',
      okLabel: 'Delete account',
      danger: true,
      onOk: async () => {
        try {
          const res = await ocaAdminService.deleteMember(m.id);
          onDone();
          ctx.msg(res.message ?? `${m.name}’s account was deleted.`);
        } catch (error) {
          ctx.msg(errorText(error), 'danger');
        }
      },
    });
}

const DeleteLink: React.FC<{ ctx: OaContext; m: MemberRow; onDelete: (m: MemberRow) => void }> = ({ ctx, m, onDelete }) =>
  canDelete(ctx, m) ? (
    <button type="button" className="linkbtn text-danger" onClick={() => onDelete(m)}>
      Delete
    </button>
  ) : (
    <span className="text-muted small" title={m.id === ctx.me.id ? 'This is your own account.' : 'Super admin accounts cannot be deleted here.'}>
      {m.id === ctx.me.id ? 'You' : 'Protected'}
    </span>
  );

export const DeleteAccountPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => {
  const { reload, bump } = useReload(ctx);
  const onDelete = useDeleteMember(ctx, bump);
  return (
    <PagedList
      title="Delete Account"
      filters={ctx.filters('dl')}
      onFilters={(f) => ctx.setFilters('dl', f)}
      fetchPage={fetchMembers()}
      reload={reload}
      rowKey={(m) => m.id}
      batch
      allBatches
      cols={[
        nameCol((m) => (
          <>
            {m.name}
            <RoleBadge role={m.role} />
          </>
        )),
        batchCol,
        idCol,
        emailCol,
        mobileCol,
        { label: 'Action', cell: (m) => <DeleteLink ctx={ctx} m={m} onDelete={onDelete} /> },
      ]}
      one="member"
      many="members"
    />
  );
};

/* --------------------------- Duplicate Account --------------------------- */

interface DupRow {
  key: string;
  m: MemberRow;
  group: { label: string; value: string; first: boolean };
}

const DUP_GROUPS_PER_PAGE = 20;

export const DuplicateAccountPage: React.FC<{ ctx: OaContext }> = ({ ctx }) => {
  const { reload, bump } = useReload(ctx);
  const onDelete = useDeleteMember(ctx, bump);
  const [result, setResult] = useState<{ reload: number; groups: DuplicateGroup[] | null; error: string | null } | null>(null);
  const [label, setLabel] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let live = true;
    ocaAdminService.duplicates().then(
      (res) => live && setResult({ reload, groups: res.data, error: null }),
      (e) => live && setResult((old) => ({ reload, groups: old?.groups ?? null, error: errorText(e) }))
    );
    return () => {
      live = false;
    };
  }, [reload]);

  const groups = useMemo(() => (result?.groups ?? []).filter((g) => !label || g.label === label), [result, label]);
  const pages = Math.max(1, Math.ceil(groups.length / DUP_GROUPS_PER_PAGE));
  const shownPage = Math.min(page, pages);
  const rows: DupRow[] = groups
    .slice((shownPage - 1) * DUP_GROUPS_PER_PAGE, shownPage * DUP_GROUPS_PER_PAGE)
    .flatMap((g) => g.rows.map((m, i) => ({ key: `${g.label}|${g.key}|${m.id}`, m, group: { label: g.label, value: g.key, first: i === 0 } })));
  const labels = [...new Set((result?.groups ?? []).map((g) => g.label))];

  return (
    <>
      <PageHead title="Duplicate Account">
        <form className="filters" onSubmit={(e) => e.preventDefault()}>
          <div className="ff">
            <span>Match</span>
            <OaSelect
              value={label}
              onChange={(v) => {
                setLabel(v);
                setPage(1);
              }}
              placeholder="All matches"
              allowEmpty
              ariaLabel="Match"
              options={labels.map((l) => ({ value: l, label: `${l} (${(result?.groups ?? []).filter((g) => g.label === l).length})` }))}
            />
          </div>
        </form>
      </PageHead>
      {result?.error && <div className="alert alert-danger" role="alert">{result.error}</div>}
      {!result?.groups ? (
        !result?.error && <TableSkeleton cols={6} />
      ) : !rows.length ? (
        <p className="text-muted">There is no record.</p>
      ) : (
        <>
          <p className="count" style={{ margin: '0 2px 10px' }}>
            {groups.length} group{groups.length === 1 ? '' : 's'} of accounts that look like the same person.
          </p>
          <div className={result.reload !== reload ? 'is-loading' : undefined}>
            <DataTable<DupRow>
              rows={rows}
              rowKey={(r) => r.key}
              before={(r) =>
                r.group.first ? (
                  <tr className="grp">
                    <td colSpan={6} data-l="">
                      <b>{r.group.label}</b>: {r.group.value}
                    </td>
                  </tr>
                ) : null
              }
              cols={[
                { label: 'Name', primary: true, cell: (r) => <>{r.m.name}<RoleBadge role={r.m.role} /></> },
                { label: 'Batch', cell: (r) => r.m.batch },
                { label: 'OCA ID', cell: (r) => <Dash v={r.m.memberId} /> },
                { label: 'Email', cell: (r) => <Dash v={r.m.email} /> },
                { label: 'Mobile', cell: (r) => <Dash v={r.m.mobile} /> },
                {
                  label: 'Action',
                  cell: (r) => (
                    <>
                      {canEdit(ctx, r.m) && <a href={`#update-account/${r.m.id}`}>Edit</a>}
                      {canEdit(ctx, r.m) && <span className="sep">|</span>}
                      <DeleteLink ctx={ctx} m={r.m} onDelete={onDelete} />
                    </>
                  ),
                },
              ]}
            />
          </div>
          <div className="foot">
            <Pager page={shownPage} pages={pages} onPage={setPage} />
          </div>
        </>
      )}
    </>
  );
};
