'use client';

import React, { useState } from 'react';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { adminContent, type AdminPanel } from '../../content';
import { useFundEditor, useNewFund, useRecordList, type NewFundEditor } from '../../handler';
import { adminHelper } from '../../helper';
import { adminService, type AdminFund, type FieldSpec } from '../../services';
import { AdminConfirmDialog } from './AdminConfirmDialog';
import { AdminIcon } from './AdminIcon';
import { AdminSwitch } from './AdminSwitch';
import { FieldInput } from './FieldInput';
import { RecordPanelFrame } from './RecordPanelFrame';

const text = adminContent.funds;

// Limits match ContributionService.updateFundFromAdmin; the unit fields are for per-unit heads only,
// the amount fields for every other head.
type FormField = FieldSpec & { wide?: boolean };
const FORM_FIELDS: FormField[] = [
  { key: 'label', label: text.fields.label, type: 'text', required: true, max: 100 },
  { key: 'sortOrder', label: text.fields.sortOrder, type: 'number', min: 0 },
  { key: 'note', label: text.fields.note, type: 'text', max: 100, hint: text.hints.note, wide: true },
];
const UNIT_FIELDS: FormField[] = [
  { key: 'unitAmount', label: text.fields.unitAmount, type: 'number', min: 1 },
  { key: 'unitLabel', label: text.fields.unitLabel, type: 'text', required: true, max: 30, hint: text.hints.unitLabel },
  { key: 'maxUnits', label: text.fields.maxUnits, type: 'number', min: 1 },
];
const NEW_FIELDS: FormField[] = [
  { key: 'kind', label: text.fields.kind, type: 'select', required: true, options: text.kindOptions, hint: text.hints.kind },
  { key: 'status', label: text.fields.status, type: 'select', required: true, options: text.statusOptions },
];
const AMOUNT_FIELDS: FormField[] = [
  { key: 'minAmount', label: text.fields.minAmount, type: 'number', min: 1, hint: text.hints.minAmount },
  { key: 'maxAmount', label: text.fields.maxAmount, type: 'number', min: 1, hint: text.hints.maxAmount },
];
const rupees = (value: string) => adminHelper.formatRupees(Number(value));

// The form has no images.
const noUpload = () => Promise.reject(new Error('No uploads here.'));

interface FundItemProps {
  fund: AdminFund;
  onSaved: (fund: AdminFund) => void;
  onDeleted: (id: number) => void;
}

const FundItem: React.FC<FundItemProps> = ({ fund, onSaved, onDeleted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const editor = useFundEditor(fund, onSaved, onDeleted);
  const bodyId = `ad-fund-${fund.id}`;
  const isOn = fund.status === 'active';
  const hasError = Object.keys(editor.fieldErrors).length > 0;
  const groups = [
    { ...text.groups.form, fields: FORM_FIELDS },
    editor.perUnit ? { ...text.groups.unit, fields: UNIT_FIELDS } : { ...text.groups.amount, fields: AMOUNT_FIELDS },
  ];
  const canDelete = fund.contributions === 0;

  const renderField = (field: FormField) => (
    <FieldInput
      key={field.key}
      field={field}
      wide={field.wide}
      name={`fund-${fund.id}-${field.key}`}
      value={editor.form[field.key as keyof typeof editor.form]}
      onChange={(value) => editor.setField(field.key as keyof typeof editor.form, String(value))}
      onUpload={noUpload}
      error={editor.fieldErrors[field.key]}
    />
  );

  const dialog = (() => {
    const action = editor.action;
    if (!action) return null;
    if (action.kind === 'save') {
      return {
        ...text.confirmSave,
        title: text.confirmSave.title(fund.label),
        changes: adminHelper.formChanges([...FORM_FIELDS, ...UNIT_FIELDS, ...AMOUNT_FIELDS], editor.saved, editor.form, {
          unitAmount: rupees,
          minAmount: rupees,
          maxAmount: rupees,
        }),
        busy: text.busy,
      };
    }
    if (action.kind === 'status') {
      const copy = action.active ? text.confirmOn : text.confirmOff;
      return { ...copy, title: copy.title(fund.label), busy: text.busy };
    }
    return { ...text.confirmDelete, title: text.confirmDelete.title(fund.label), busy: text.deleting, danger: true };
  })();

  return (
    <li className={`ad-item ad-rec${isOn ? '' : ' is-off'}${isOpen ? ' is-open' : ''}${hasError ? ' has-error' : ''}`}>
      <div className="ad-item-head">
        <button className="ad-item-toggle" type="button" aria-expanded={isOpen} aria-controls={bodyId} onClick={() => setIsOpen((open) => !open)}>
          <span className="ad-item-thumb">
            <AdminIcon name="heart" />
          </span>
          <span className="ad-item-t">
            <small>{fund.unitAmount !== null ? text.perUnit(fund.unitAmount, fund.unitLabel) : text.anyAmount}</small>
            <b>{fund.label}</b>
          </span>
          <span className="ad-pass-facts">
            <span className="ad-pass-paid">{text.raised(fund.paid, adminHelper.formatRupees(fund.raised))}</span>
          </span>
          <AdminIcon name="chevron" className="ad-item-chev" />
        </button>
        <AdminSwitch
          checked={isOn}
          onChange={editor.askStatus}
          disabled={editor.isBusy}
          label={`${text.switchLabel}: ${fund.label}`}
          onText={text.on}
          offText={text.off}
        />
      </div>
      {!isOpen && editor.error && !editor.action && (
        <p className="ms-error ad-rec-error" role="alert">
          {editor.error}
        </p>
      )}

      {isOpen && (
        <div className="ad-item-body" id={bodyId}>
          <form className="cf-form mp-form ad-recform" noValidate onSubmit={editor.handleSubmit} aria-busy={editor.isBusy}>
            {groups.map((group) => (
              <fieldset className="ad-section" key={group.title}>
                <legend className="ad-section-head">
                  <b>{group.title}</b>
                  <span>{group.lead}</span>
                </legend>
                <div className="ad-grid">{group.fields.map(renderField)}</div>
              </fieldset>
            ))}
            <div className="ad-message">
              <div className="mp-ok" role="status" hidden={!editor.isSaved}>
                <AdminIcon name="check" />
                <p>{text.saved}</p>
              </div>
              {editor.error && !editor.action && (
                <p className="ms-error" role="alert">
                  {editor.error}
                </p>
              )}
            </div>
            <div className="ad-form-foot">
              <button className="ad-delete" type="button" onClick={editor.askDelete} disabled={editor.isBusy || !canDelete}>
                <AdminIcon name="trash" />
                {text.delete}
              </button>
              {editor.isDirty && <span className="ad-dirty">{adminContent.editor.unsaved}</span>}
              <button className="cf-reset" type="button" onClick={editor.reset} disabled={editor.isBusy || !editor.isDirty}>
                {text.reset}
              </button>
              <button className="btn btn-primary mp-save" type="submit" disabled={editor.isBusy || !editor.isDirty}>
                {text.save}
              </button>
            </div>
            {!canDelete && <p className="ad-delete-note">{text.cannotDelete(fund.contributions, fund.paid)}</p>}
          </form>
        </div>
      )}

      {dialog && (
        <AdminConfirmDialog
          title={dialog.title}
          body={dialog.body}
          changes={'changes' in dialog ? dialog.changes : undefined}
          confirmLabel={dialog.yes}
          busyLabel={dialog.busy}
          danger={'danger' in dialog}
          isBusy={editor.isBusy}
          error={editor.error}
          onCancel={editor.cancel}
          onConfirm={editor.confirm}
        />
      )}
    </li>
  );
};

/** The add form, open at the end of the list until the head is added or the admin cancels. */
const NewFundItem: React.FC<{ editor: NewFundEditor }> = ({ editor }) => {
  const { form } = editor;
  const groups = [
    { ...text.groups.kind, fields: NEW_FIELDS },
    { ...text.groups.form, fields: FORM_FIELDS },
    form.kind === 'unit' ? { ...text.groups.unit, fields: UNIT_FIELDS } : { ...text.groups.amount, fields: AMOUNT_FIELDS },
  ];
  const label = form.label.trim() || text.newTitle.toLowerCase();

  return (
    <li className="ad-item ad-rec is-open ad-newfund">
      <div className="ad-item-head">
        <span className="ad-item-toggle">
          <span className="ad-item-thumb">
            <AdminIcon name="plus" />
          </span>
          <span className="ad-item-t">
            <small>{text.newLead}</small>
            <b>{form.label.trim() || text.newTitle}</b>
          </span>
        </span>
      </div>
      <div className="ad-item-body">
        <form className="cf-form mp-form ad-recform" noValidate onSubmit={editor.handleSubmit} aria-busy={editor.isBusy}>
          {groups.map((group) => (
            <fieldset className="ad-section" key={group.title}>
              <legend className="ad-section-head">
                <b>{group.title}</b>
                <span>{group.lead}</span>
              </legend>
              <div className="ad-grid">
                {group.fields.map((field) => (
                  <FieldInput
                    key={field.key}
                    field={field}
                    wide={field.wide || field.type === 'select'}
                    name={`newfund-${field.key}`}
                    value={form[field.key as keyof typeof form]}
                    onChange={(value) => editor.setField(field.key as keyof typeof form, String(value))}
                    onUpload={noUpload}
                    error={editor.fieldErrors[field.key]}
                  />
                ))}
              </div>
            </fieldset>
          ))}
          <div className="ad-message">
            {editor.error && !editor.isConfirming && (
              <p className="ms-error" role="alert">
                {editor.error}
              </p>
            )}
          </div>
          <div className="ad-form-foot">
            <button className="cf-reset" type="button" onClick={editor.close} disabled={editor.isBusy}>
              {text.cancelAdd}
            </button>
            <button className="btn btn-primary mp-save" type="submit" disabled={editor.isBusy}>
              {text.add}
            </button>
          </div>
        </form>
      </div>

      {editor.isConfirming && (
        <AdminConfirmDialog
          title={text.confirmAdd.title(label)}
          body={form.status === 'active' ? text.confirmAdd.bodyActive : text.confirmAdd.bodyInactive}
          confirmLabel={text.confirmAdd.yes}
          busyLabel={text.adding}
          isBusy={editor.isBusy}
          error={editor.error}
          onCancel={editor.cancel}
          onConfirm={editor.confirm}
        />
      )}
    </li>
  );
};

interface ContributionHeadsPanelProps {
  isActive: boolean;
  onBack: (panel: AdminPanel) => void;
}

/** The contribution form's heads: add one, edit the wording, switch a head on or off, or delete an unused one. */
export const ContributionHeadsPanel: React.FC<ContributionHeadsPanelProps> = ({ isActive, onBack }) => {
  const { items: funds, setItems, error, isLoading, reload } = useRecordList(adminService.listFunds, isActive);

  const replace = (saved: AdminFund) => setItems((list) => list && list.map((fund) => (fund.id === saved.id ? saved : fund)));
  const remove = (id: number) => setItems((list) => list && list.filter((fund) => fund.id !== id));
  const add = (created: AdminFund) =>
    setItems((list) => list && [...list, created].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id));
  // A new head goes after the last one on the form.
  const nextSortOrder = (funds ?? []).reduce((last, fund) => Math.max(last, fund.sortOrder), 0) + 1;
  const newFund = useNewFund(nextSortOrder, add);

  return (
    <RecordPanelFrame
      panel="funds"
      isActive={isActive}
      onBack={onBack}
      isLoading={isLoading}
      hasLoaded={funds !== null}
      error={error}
      onReload={reload}
      action={
        <>
          <button className="mp-photo-btn ad-view" type="button" onClick={newFund.open} disabled={funds === null}>
            <AdminIcon name="plus" />
            {text.add}
          </button>
          <a className="mp-photo-btn ad-view" href={ROUTES.DONATION_GIVE_FORM} target="_blank" rel="noopener noreferrer">
          {adminContent.passes.viewOnSite}
          <AdminIcon name="ext" />
          </a>
        </>
      }
    >
      {funds && (
        <div className="mp-fade">
          <dl className="ad-stats">
            <div className="ad-stat">
              <dt>{text.stats.active}</dt>
              <dd>
                {funds.filter((fund) => fund.status === 'active').length} / {funds.length}
              </dd>
            </div>
            <div className="ad-stat">
              <dt>{text.stats.paid}</dt>
              <dd>{funds.reduce((total, fund) => total + fund.paid, 0)}</dd>
            </div>
            <div className="ad-stat">
              <dt>{text.stats.raised}</dt>
              <dd>{adminHelper.formatRupees(funds.reduce((total, fund) => total + fund.raised, 0))}</dd>
            </div>
          </dl>
          {funds.length === 0 && !newFund.isOpen && <p className="ad-empty">{adminContent.records.empty}</p>}
          {(funds.length > 0 || newFund.isOpen) && (
            <ul className="ad-items">
              {funds.map((fund) => (
                <FundItem key={fund.id} fund={fund} onSaved={replace} onDeleted={remove} />
              ))}
              {newFund.isOpen && <NewFundItem editor={newFund} />}
            </ul>
          )}
          {!newFund.isOpen && (
            <button className="ad-add" type="button" onClick={newFund.open}>
              <AdminIcon name="plus" />
              {text.addLong}
            </button>
          )}
        </div>
      )}
    </RecordPanelFrame>
  );
};

export default ContributionHeadsPanel;
