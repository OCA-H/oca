'use client';

import React from 'react';
import { adminContent } from '../../content';
import { adminHelper, type EditorItem } from '../../helper';
import type { SectionEditor } from '../../handler';
import type { ListSpec } from '../../services';
import { AdminIcon } from './AdminIcon';
import { FieldInput } from './FieldInput';

interface ListEditorProps {
  list: ListSpec;
  /** Where the list sits in the form: its key, or "albums.0.photos" for a list inside an entry. */
  path: string;
  items: EditorItem[];
  editor: SectionEditor;
}

/**
 * A section's repeating entries: each one folds open to edit, and can be moved or removed. An entry
 * with lists of its own (an album's photos) shows them under its fields.
 */
export const ListEditor: React.FC<ListEditorProps> = ({ list, path, items, editor }) => {
  const { editor: text } = adminContent;
  const { openItems, fieldErrors } = editor;
  const listError = fieldErrors[path];
  const isNested = path !== list.key;

  return (
    <fieldset className={`ad-fieldset ad-list${isNested ? ' ad-list--nested' : ''}`}>
      <div className="ad-list-head">
        <legend className="ad-subhead">{list.label}</legend>
        <span className="ad-tally">{text.items(items.length, list.max)}</span>
      </div>
      {list.hint && <p className="mp-hint ad-list-hint">{list.hint}</p>}
      {listError && (
        <p className="mp-hint mp-hint--bad" role="alert">
          {listError}
        </p>
      )}

      <ol className="ad-items">
        {items.map((item, index) => {
          const isOpen = openItems.has(item._id);
          const prefix = `${path}.${index}.`;
          const hasError = Object.keys(fieldErrors).some((name) => name.startsWith(prefix));
          const title = String(item[list.titleField] ?? '').trim();
          const bodyId = `ad-item-${item._id}`;
          const thumb = typeof item.image === 'string' ? item.image : adminHelper.firstImage(item);
          return (
            <li key={item._id} className={`ad-item${isOpen ? ' is-open' : ''}${hasError ? ' has-error' : ''}`}>
              <div className="ad-item-head">
                <button className="ad-item-toggle" type="button" aria-expanded={isOpen} aria-controls={bodyId} onClick={() => editor.toggleItem(item._id)}>
                  <span className="ad-item-thumb" aria-hidden="true">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {thumb ? <img src={thumb} alt="" /> : <AdminIcon name="image" />}
                  </span>
                  <span className="ad-item-t">
                    <small>
                      {list.itemLabel} {index + 1}
                    </small>
                    <b>{title || text.untitled(list.itemLabel)}</b>
                  </span>
                  <AdminIcon name="chevron" className="ad-item-chev" />
                </button>
                <div className="ad-item-tools">
                  <button type="button" className="ad-tool" onClick={() => editor.moveItem(path, index, -1)} disabled={index === 0} aria-label={`${text.moveUp}: ${list.itemLabel} ${index + 1}`} title={text.moveUp}>
                    <AdminIcon name="up" />
                  </button>
                  <button type="button" className="ad-tool" onClick={() => editor.moveItem(path, index, 1)} disabled={index === items.length - 1} aria-label={`${text.moveDown}: ${list.itemLabel} ${index + 1}`} title={text.moveDown}>
                    <AdminIcon name="down" />
                  </button>
                  <button type="button" className="ad-tool ad-tool--bad" onClick={() => editor.removeItem(path, index)} disabled={items.length <= list.min} aria-label={`${text.remove}: ${list.itemLabel} ${index + 1}`} title={text.remove}>
                    <AdminIcon name="trash" />
                  </button>
                </div>
              </div>
              {isOpen && (
                <div className="ad-item-body" id={bodyId}>
                  <div className="ad-grid">
                    {list.fields.map((field) => (
                      <FieldInput
                        key={field.key}
                        field={field}
                        name={`${prefix}${field.key}`}
                        value={item[field.key] as string | number | undefined}
                        onChange={(value) => editor.setItemField(path, index, field.key, value)}
                        onUpload={editor.uploadImage}
                        error={fieldErrors[`${prefix}${field.key}`]}
                      />
                    ))}
                  </div>
                  {list.lists?.map((sub) => (
                    <ListEditor
                      key={sub.key}
                      list={sub}
                      path={`${prefix}${sub.key}`}
                      items={(item[sub.key] as EditorItem[] | undefined) ?? []}
                      editor={editor}
                    />
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <button className="ad-add" type="button" onClick={() => editor.addItem(list, path)} disabled={items.length >= list.max}>
        <AdminIcon name="plus" />
        {text.add(list.itemLabel)}
      </button>
    </fieldset>
  );
};

export default ListEditor;
