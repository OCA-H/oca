'use client';

import React, { useState } from 'react';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { adminContent, type AdminPanel } from '../../content';
import { useRecordList, usePassEditor } from '../../handler';
import { adminHelper } from '../../helper';
import { adminService, type AdminEventPass, type FieldSpec } from '../../services';
import { AdminConfirmDialog } from './AdminConfirmDialog';
import { AdminIcon } from './AdminIcon';
import { FieldInput } from './FieldInput';
import { RecordPanelFrame } from './RecordPanelFrame';

const text = adminContent.passes;

// The pass form, in the editor's field style. Limits match EventPassService.updateFromAdmin.
type FormField = FieldSpec & { wide?: boolean };
const FIELD_GROUPS: { title: string; lead: string; fields: FormField[] }[] = [
  {
    ...text.groups.booking,
    fields: [
      { key: 'status', label: text.fields.status, type: 'select', options: text.statusOptions },
      { key: 'price', label: text.fields.price, type: 'number', min: 0 },
      { key: 'totalQuantity', label: text.fields.totalQuantity, type: 'number', min: 0 },
      { key: 'availableQuantity', label: text.fields.availableQuantity, type: 'number', min: 0, hint: text.hints.availableQuantity },
    ],
  },
  {
    ...text.groups.card,
    fields: [
      { key: 'label', label: text.fields.label, type: 'text', required: true, max: 200, wide: true },
      { key: 'batchEligibility', label: text.fields.batchEligibility, type: 'text', max: 100 },
      { key: 'displayOrder', label: text.fields.displayOrder, type: 'number', min: 0 },
      { key: 'statusNote', label: text.fields.statusNote, type: 'text', max: 255, hint: text.hints.statusNote, wide: true },
      { key: 'description', label: text.fields.description, type: 'textarea', max: 500 },
    ],
  },
];
const ALL_FIELDS = FIELD_GROUPS.flatMap((group) => group.fields);
const rupees = (value: string) => adminHelper.formatRupees(Number(value));

// The pass form has no images.
const noUpload = () => Promise.reject(new Error('No uploads here.'));

const PassItem: React.FC<{ pass: AdminEventPass; onSaved: (pass: AdminEventPass) => void }> = ({ pass, onSaved }) => {
  const [isOpen, setIsOpen] = useState(false);
  const editor = usePassEditor(pass, onSaved);
  const bodyId = `ad-pass-${pass.id}`;
  const hasError = Object.keys(editor.fieldErrors).length > 0;
  const isSoldOut = pass.availableQuantity === 0;
  const badge =
    pass.status === 'locked'
      ? { tone: 'warn', label: text.locked }
      : isSoldOut
        ? { tone: 'bad', label: text.soldOut }
        : { tone: 'ok', label: text.open };
  const taken =
    pass.totalQuantity && pass.availableQuantity !== null ? Math.min(100, Math.max(0, ((pass.totalQuantity - pass.availableQuantity) / pass.totalQuantity) * 100)) : 0;

  return (
    <li className={`ad-item ad-rec${isOpen ? ' is-open' : ''}${hasError ? ' has-error' : ''}`}>
      <div className="ad-item-head">
        <button className="ad-item-toggle" type="button" aria-expanded={isOpen} aria-controls={bodyId} onClick={() => setIsOpen((open) => !open)}>
          <span className="ad-item-thumb">
            <AdminIcon name="ticket" />
          </span>
          <span className="ad-item-t">
            <small>
              {pass.tierTitle} · {adminHelper.formatRupees(pass.price)}
            </small>
            <b>{pass.label}</b>
          </span>
          <span className="ad-pass-facts">
            <span className="ad-pass-seats">
              <span>{text.seats(pass.availableQuantity, pass.totalQuantity)}</span>
              <span className="ad-meter" aria-hidden="true">
                <span style={{ width: `${taken}%` }} />
              </span>
              <span className="ad-pass-paid">{text.sold(pass.paid)}</span>
            </span>
            <span className={`ad-badge ad-badge--${badge.tone}`}>{badge.label}</span>
          </span>
          <AdminIcon name="chevron" className="ad-item-chev" />
        </button>
      </div>

      {isOpen && (
        <div className="ad-item-body" id={bodyId}>
          <form className="cf-form mp-form ad-recform" noValidate onSubmit={editor.handleSubmit} aria-busy={editor.isSaving}>
            {FIELD_GROUPS.map((group) => (
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
                      wide={field.wide}
                      name={`pass-${pass.id}-${field.key}`}
                      value={editor.form[field.key as keyof typeof editor.form]}
                      onChange={(value) => editor.setField(field.key as keyof typeof editor.form, String(value))}
                      onUpload={noUpload}
                      error={editor.fieldErrors[field.key]}
                    />
                  ))}
                </div>
              </fieldset>
            ))}
            <div className="ad-message">
              <div className="mp-ok" role="status" hidden={!editor.isSaved}>
                <AdminIcon name="check" />
                <p>{text.saved}</p>
              </div>
              {editor.error && !editor.isConfirming && (
                <p className="ms-error" role="alert">
                  {editor.error}
                </p>
              )}
            </div>
            <div className="ad-form-foot">
              {editor.isDirty && <span className="ad-dirty">{adminContent.editor.unsaved}</span>}
              <button className="cf-reset" type="button" onClick={editor.reset} disabled={editor.isSaving || !editor.isDirty}>
                {text.reset}
              </button>
              <button className="btn btn-primary mp-save" type="submit" disabled={editor.isSaving || !editor.isDirty}>
                {text.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {editor.isConfirming && (
        <AdminConfirmDialog
          title={text.confirm.title(pass.label)}
          body={text.confirm.body}
          changes={adminHelper.formChanges(ALL_FIELDS, editor.saved, editor.form, { price: rupees })}
          confirmLabel={text.confirm.yes}
          busyLabel={text.confirm.busy}
          isBusy={editor.isSaving}
          error={editor.error}
          onCancel={editor.cancelConfirm}
          onConfirm={editor.confirmSave}
        />
      )}
    </li>
  );
};

interface EventPassesPanelProps {
  isActive: boolean;
  onBack: (panel: AdminPanel) => void;
}

/** Every Annual Dinner pass: open its card to change the price, seats, or whether it can be booked. */
export const EventPassesPanel: React.FC<EventPassesPanelProps> = ({ isActive, onBack }) => {
  const { items: passes, setItems, error, isLoading, reload } = useRecordList(adminService.listPasses, isActive);

  const replace = (saved: AdminEventPass) => setItems((list) => list && list.map((pass) => (pass.id === saved.id ? saved : pass)));

  const seatsLeft = passes?.reduce((total, pass) => total + (pass.availableQuantity ?? 0), 0) ?? 0;
  const paid = passes?.reduce((total, pass) => total + pass.paid, 0) ?? 0;
  const revenue = passes?.reduce((total, pass) => total + pass.revenue, 0) ?? 0;

  return (
    <RecordPanelFrame
      panel="passes"
      isActive={isActive}
      onBack={onBack}
      isLoading={isLoading}
      hasLoaded={passes !== null}
      error={error}
      onReload={reload}
      action={
        <a className="mp-photo-btn ad-view" href={ROUTES.ANNUAL_DINNER} target="_blank" rel="noopener noreferrer">
          {text.viewOnSite}
          <AdminIcon name="ext" />
        </a>
      }
    >
      {passes && (
        <div className="mp-fade">
          <dl className="ad-stats">
            <div className="ad-stat">
              <dt>{text.stats.seats}</dt>
              <dd>{seatsLeft}</dd>
            </div>
            <div className="ad-stat">
              <dt>{text.stats.sold}</dt>
              <dd>{paid}</dd>
            </div>
            <div className="ad-stat">
              <dt>{text.stats.revenue}</dt>
              <dd>{adminHelper.formatRupees(revenue)}</dd>
            </div>
          </dl>
          {passes.length === 0 ? (
            <p className="mp-hint">{adminContent.records.empty}</p>
          ) : (
            <ul className="ad-items">
              {passes.map((pass) => (
                <PassItem key={pass.id} pass={pass} onSaved={replace} />
              ))}
            </ul>
          )}
        </div>
      )}
    </RecordPanelFrame>
  );
};

export default EventPassesPanel;
