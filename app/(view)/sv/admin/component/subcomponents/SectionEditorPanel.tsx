'use client';

import React from 'react';
import { DiscardDialog } from '@/app/(view)/sv/profile/component/subcomponents/DiscardDialog';
import { adminContent, type AdminPanel } from '../../content';
import { useSectionEditor } from '../../handler';
import { adminHelper, type EditorItem } from '../../helper';
import type { ListSpec, SectionSpec, SectionSummary } from '../../services';
import { AdminIcon } from './AdminIcon';
import { AdminPanelLink } from './AdminPanelLink';
import { FieldInput } from './FieldInput';
import { FormSkeleton } from './AdminSkeleton';
import { ListEditor } from './ListEditor';
import { PhotoGridEditor } from './PhotoGridEditor';

interface SectionEditorPanelProps {
  spec: SectionSpec;
  isActive: boolean;
  onBack: (panel: AdminPanel) => void;
  onSaved: (summary: SectionSummary) => void;
}

/**
 * The editor for any section, built from its spec: its own fields in blocks, then each of its lists.
 * A list with `inBlock` is drawn at the end of the block of fields with that heading, so a long page
 * reads in the order it appears on the site; a "grid" list is a grid of photo tiles.
 */
export const SectionEditorPanel: React.FC<SectionEditorPanelProps> = ({ spec, isActive, onBack, onSaved }) => {
  const { editor: text } = adminContent;
  const editor = useSectionEditor(spec, isActive, onSaved);
  const { form, meta, fieldErrors } = editor;
  const headingId = `ad-t-${spec.key.replace(/\./g, '-')}`;
  const blocks = adminHelper.fieldBlocks(spec.fields, text.sectionText);
  const lists = form ? spec.lists.filter((list) => adminHelper.shows(list.showWhen, form)) : [];
  const inBlock = (list: ListSpec) => Boolean(list.inBlock && blocks.some((block) => block.heading === list.inBlock));
  const renderList = (list: ListSpec) => {
    const props = { list, path: list.key, items: (form?.[list.key] as EditorItem[] | undefined) ?? [], editor };
    return list.layout === 'grid' ? <PhotoGridEditor key={list.key} {...props} /> : <ListEditor key={list.key} {...props} />;
  };

  return (
    <section className="mp-panel" data-admin-panel={spec.key} aria-labelledby={headingId} hidden={!isActive}>
      <AdminPanelLink className="mp-back" panel="dashboard" onShow={onBack}>
        <AdminIcon name="back" />
        Dashboard
      </AdminPanelLink>
      <div className="mp-head ad-head">
        <div>
          <h2 id={headingId} tabIndex={-1}>
            {spec.label}
          </h2>
          <p>{spec.description}</p>
        </div>
        {spec.href && (
          <a className="mp-photo-btn ad-view" href={spec.href} target="_blank" rel="noopener noreferrer">
            {text.viewOnSite}
            <AdminIcon name="ext" />
          </a>
        )}
      </div>

      {editor.loadError && (
        <div className="mp-fade">
          <p className="ms-error" role="alert">
            {text.loadError} {editor.loadError}
          </p>
          <button className="btn btn-secondary" type="button" onClick={editor.retry} style={{ marginTop: 16 }}>
            {text.retry}
          </button>
        </div>
      )}

      {editor.isLoading && <FormSkeleton />}

      {form && meta && (
        <div className="mp-fade">
          <p className="ad-meta">
            {meta.isDefault || !meta.updatedAt ? text.defaults : `${text.lastSaved} ${adminHelper.formatSaved(meta.updatedAt)}.`}
            {editor.isDirty && <span className="ad-dirty">{text.unsaved}</span>}
          </p>

          <div className="ad-message">
            <div className="mp-ok" role="status" hidden={!editor.isSaved}>
              <AdminIcon name="check" />
              <p>
                <b>{text.saved}</b> {text.savedNote}
              </p>
            </div>
            {editor.error && (
              <p className="ms-error" role="alert">
                {editor.error}
              </p>
            )}
          </div>

          <form className="cf-form mp-form" noValidate onSubmit={editor.handleSubmit} aria-busy={editor.isSaving}>
            {blocks.map((block) => (
              <fieldset className="ad-fieldset" key={block.heading}>
                <legend className="ad-subhead">{block.heading}</legend>
                <div className="ad-grid">
                  {block.fields.filter((field) => adminHelper.shows(field.showWhen, form)).map((field) => (
                    <FieldInput
                      key={field.key}
                      field={field}
                      name={field.key}
                      value={form[field.key] as string | number | undefined}
                      onChange={(value) => editor.setField(field.key, value)}
                      onChoose={editor.chooseMedia}
                      error={fieldErrors[field.key]}
                    />
                  ))}
                </div>
                {lists.filter((list) => list.inBlock === block.heading).map(renderList)}
              </fieldset>
            ))}

            {lists.filter((list) => !inBlock(list)).map(renderList)}

            <div className="mp-actions ad-actions">
              <button className={`btn btn-primary mp-save${editor.isSaving ? ' is-saving' : ''}`} type="submit" disabled={editor.isSaving || !editor.isDirty}>
                <span className="mp-spinner" aria-hidden="true" />
                <span>{editor.isUploading ? text.uploading : editor.isSaving ? text.saving : text.save}</span>
              </button>
              <button className="cf-reset" type="button" onClick={editor.openDiscard} disabled={editor.isSaving || !editor.isDirty}>
                {text.discard}
              </button>
            </div>
          </form>
        </div>
      )}

      {editor.isDiscardOpen && <DiscardDialog onCancel={editor.closeDiscard} onConfirm={editor.confirmDiscard} />}
    </section>
  );
};

export default SectionEditorPanel;
