'use client';

import React, { useState } from 'react';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { adminContent, type AdminPanel } from '../../content';
import { useFundEditor, useRecordList } from '../../handler';
import { adminHelper } from '../../helper';
import { adminService, type AdminFund, type FieldSpec } from '../../services';
import { AdminIcon } from './AdminIcon';
import { AdminSwitch } from './AdminSwitch';
import { FieldInput } from './FieldInput';
import { RecordPanelFrame } from './RecordPanelFrame';

const text = adminContent.funds;

// Limits match ContributionService.updateFundFromAdmin; the unit fields are for per-unit heads only.
const FIELDS: FieldSpec[] = [
  { key: 'label', label: text.fields.label, type: 'text', required: true, max: 100 },
  { key: 'note', label: text.fields.note, type: 'text', max: 100, hint: text.hints.note },
  { key: 'sortOrder', label: text.fields.sortOrder, type: 'number', min: 0 },
];
const UNIT_FIELDS: FieldSpec[] = [
  { key: 'unitAmount', label: text.fields.unitAmount, type: 'number', min: 1 },
  { key: 'maxUnits', label: text.fields.maxUnits, type: 'number', min: 1 },
];

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
  const fields = editor.perUnit ? [...FIELDS, ...UNIT_FIELDS] : FIELDS;

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
          onChange={editor.setActive}
          disabled={editor.busy !== null}
          label={`${text.switchLabel}: ${fund.label}`}
          onText={text.on}
          offText={text.off}
        />
      </div>
      {!isOpen && editor.error && (
        <p className="ms-error ad-rec-error" role="alert">
          {editor.error}
        </p>
      )}

      {isOpen && (
        <div className="ad-item-body" id={bodyId}>
          <form className="cf-form mp-form" noValidate onSubmit={editor.handleSubmit} aria-busy={editor.busy === 'save'}>
            <div className="ad-grid ad-pass-group">
              {fields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  name={`fund-${fund.id}-${field.key}`}
                  value={editor.form[field.key as keyof typeof editor.form]}
                  onChange={(value) => editor.setField(field.key as keyof typeof editor.form, String(value))}
                  onUpload={noUpload}
                  error={editor.fieldErrors[field.key]}
                />
              ))}
            </div>
            {!isOn && <p className="mp-hint">{text.offHint}</p>}
            <div className="ad-message">
              <div className="mp-ok" role="status" hidden={!editor.isSaved}>
                <AdminIcon name="check" />
                <p>{text.saved}</p>
              </div>
              {editor.error && (
                <p className="ms-error" role="alert">
                  {editor.error}
                </p>
              )}
            </div>
            <div className="ad-pass-actions">
              <button
                className={`btn btn-primary mp-save${editor.busy === 'save' ? ' is-saving' : ''}`}
                type="submit"
                disabled={editor.busy !== null || !editor.isDirty}
              >
                <span className="mp-spinner" aria-hidden="true" />
                <span>{editor.busy === 'save' ? text.saving : text.save}</span>
              </button>
              <button className="cf-reset" type="button" onClick={editor.reset} disabled={editor.busy !== null || !editor.isDirty}>
                {text.reset}
              </button>
              <button
                className="ad-delete"
                type="button"
                onClick={editor.askDelete}
                disabled={editor.busy !== null || fund.contributions > 0 || editor.isConfirmingDelete}
                title={fund.contributions > 0 ? text.cannotDelete(fund.contributions) : undefined}
              >
                <AdminIcon name="trash" />
                {text.delete}
              </button>
            </div>
            {fund.contributions > 0 && <p className="mp-hint ad-delete-note">{text.cannotDelete(fund.contributions)}</p>}
            {editor.isConfirmingDelete && (
              <div className="ad-confirm" role="alertdialog" aria-label={text.delete}>
                <p>{text.confirm(fund.label)}</p>
                <button className="btn btn-primary ad-danger" type="button" onClick={editor.confirmDelete} disabled={editor.busy !== null}>
                  {editor.busy === 'delete' ? text.deleting : text.confirmYes}
                </button>
                <button className="cf-reset" type="button" onClick={editor.cancelDelete} disabled={editor.busy !== null}>
                  {text.cancel}
                </button>
              </div>
            )}
          </form>
        </div>
      )}
    </li>
  );
};

interface ContributionHeadsPanelProps {
  isActive: boolean;
  onBack: (panel: AdminPanel) => void;
}

/** The contribution form's heads: edit the wording, switch a head on or off, or delete an unused one. */
export const ContributionHeadsPanel: React.FC<ContributionHeadsPanelProps> = ({ isActive, onBack }) => {
  const { items: funds, setItems, error, isLoading, reload } = useRecordList(adminService.listFunds, isActive);

  const replace = (saved: AdminFund) => setItems((list) => list && list.map((fund) => (fund.id === saved.id ? saved : fund)));
  const remove = (id: number) => setItems((list) => list && list.filter((fund) => fund.id !== id));

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
        <a className="mp-photo-btn ad-view" href={ROUTES.DONATION_GIVE_FORM} target="_blank" rel="noopener noreferrer">
          {adminContent.passes.viewOnSite}
          <AdminIcon name="ext" />
        </a>
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
          {funds.length === 0 ? (
            <p className="ad-empty">{adminContent.records.empty}</p>
          ) : (
            <ul className="ad-items">
              {funds.map((fund) => (
                <FundItem key={fund.id} fund={fund} onSaved={replace} onDeleted={remove} />
              ))}
            </ul>
          )}
        </div>
      )}
    </RecordPanelFrame>
  );
};

export default ContributionHeadsPanel;
