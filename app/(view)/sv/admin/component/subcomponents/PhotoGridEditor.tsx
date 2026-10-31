'use client';

import React, { useRef, useState } from 'react';
import { adminContent } from '../../content';
import type { EditorItem } from '../../helper';
import type { SectionEditor } from '../../handler';
import type { ListSpec } from '../../services';
import { AdminIcon } from './AdminIcon';

interface PhotoGridEditorProps {
  list: ListSpec;
  /** Where the list sits in the form, e.g. "posts.0.images". */
  path: string;
  items: EditorItem[];
  editor: SectionEditor;
}

/**
 * A list of photos as a grid of tiles: add several at once (or drop them on the add tile), reorder,
 * replace or remove each, and fill in its short text fields under it. The first photo is the cover.
 * Chosen photos are only previewed here; they are uploaded when the section is saved.
 */
export const PhotoGridEditor: React.FC<PhotoGridEditorProps> = ({ list, path, items, editor }) => {
  const { image: imageText, photos: text, editor: editorText } = adminContent;
  const { fieldErrors } = editor;
  const imageKey = list.fields.find((field) => field.type === 'image')?.key ?? 'image';
  const textFields = list.fields.filter((field) => field.key !== imageKey);
  const addInput = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const replacing = useRef<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const room = list.max - items.length;
  const listError = fieldErrors[path];

  /** Splits files into ones to keep and a note about any left out (wrong type, too big). */
  const screen = (files: File[]) => {
    const wrongType = files.filter((file) => !imageText.types.test(file.type));
    const tooBig = files.filter((file) => imageText.types.test(file.type) && file.size > imageText.maxBytes);
    const notes = [
      wrongType.length > 0 && text.skipped(wrongType.length, imageText.badType),
      tooBig.length > 0 && text.skipped(tooBig.length, imageText.tooBig),
    ].filter(Boolean);
    return { ok: files.filter((file) => !wrongType.includes(file) && !tooBig.includes(file)), notes };
  };

  const addFiles = (picked: File[]) => {
    if (picked.length === 0) return;
    const { ok, notes } = screen(picked);
    if (ok.length > room) notes.push(text.tooMany(list.max));
    const files = ok.slice(0, Math.max(room, 0));
    setMessage(notes.length > 0 ? notes.join(' ') : null);
    if (files.length === 0) return;
    editor.addItems(list, path, files.map((file) => ({ [imageKey]: editor.chooseMedia(file) })));
  };

  const replaceFile = (file: File | undefined, index: number) => {
    if (!file) return;
    const { ok, notes } = screen([file]);
    if (ok.length === 0) return setMessage(notes.join(' '));
    setMessage(null);
    editor.setItemField(path, index, imageKey, editor.chooseMedia(file));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <fieldset className="ad-fieldset ad-photos">
      <div className="ad-list-head">
        <legend className="ad-label ad-photos-label">
          {list.label}
          {list.min > 0 && ' *'}
        </legend>
        <span className="ad-tally">{editorText.items(items.length, list.max)}</span>
      </div>
      {list.hint && <p className="mp-hint ad-list-hint">{list.hint}</p>}
      {(listError || message) && (
        <p className="mp-hint mp-hint--bad" role="alert">
          {[listError, message].filter(Boolean).join(' ')}
        </p>
      )}

      <ol className="ad-photo-grid">
        {items.map((item, index) => {
          const prefix = `${path}.${index}.`;
          const src = typeof item[imageKey] === 'string' ? (item[imageKey] as string) : '';
          const imageError = fieldErrors[`${prefix}${imageKey}`];
          const hasError = Object.keys(fieldErrors).some((name) => name.startsWith(prefix));
          const label = `${list.itemLabel} ${index + 1}`;
          return (
            <li key={item._id} className={`ad-photo${hasError ? ' has-error' : ''}`}>
              <div className="ad-photo-media">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {src ? <img src={src} alt="" /> : <span className="ad-image-empty"><AdminIcon name="image" />{imageText.none}</span>}
                <button
                  type="button"
                  className="ad-photo-replace"
                  aria-label={`${text.replace}: ${label}`}
                  onClick={() => {
                    replacing.current = index;
                    replaceInput.current?.click();
                  }}
                >
                  <span>{text.replace}</span>
                </button>
                <span className={`ad-photo-num${index === 0 ? ' is-cover' : ''}`}>{index === 0 ? text.cover : index + 1}</span>
                <div className="ad-photo-tools">
                  <button type="button" className="ad-photo-tool" onClick={() => editor.moveItem(path, index, -1)} disabled={index === 0} aria-label={`${text.moveEarlier}: ${label}`} title={text.moveEarlier}>
                    <AdminIcon name="back" />
                  </button>
                  <button type="button" className="ad-photo-tool" onClick={() => editor.moveItem(path, index, 1)} disabled={index === items.length - 1} aria-label={`${text.moveLater}: ${label}`} title={text.moveLater}>
                    <AdminIcon name="go" />
                  </button>
                  <button type="button" className="ad-photo-tool ad-photo-tool--bad" onClick={() => editor.removeItem(path, index)} aria-label={`${editorText.remove}: ${label}`} title={editorText.remove}>
                    <AdminIcon name="trash" />
                  </button>
                </div>
              </div>
              {imageError && <p className="mp-hint mp-hint--bad">{imageError}</p>}
              {textFields.map((field) => {
                const name = `${prefix}${field.key}`;
                const error = fieldErrors[name];
                return (
                  <div className="field ad-photo-field" key={field.key}>
                    <input
                      type="text"
                      name={name}
                      value={String(item[field.key] ?? '')}
                      maxLength={field.max}
                      onChange={(e) => editor.setItemField(path, index, field.key, e.target.value)}
                      placeholder={`${field.label}${field.required ? '' : ' (optional)'}`}
                      aria-label={`${field.label}: ${label}`}
                      aria-invalid={Boolean(error) || undefined}
                      title={field.hint}
                    />
                    {error && <p className="mp-hint mp-hint--bad">{error}</p>}
                  </div>
                );
              })}
            </li>
          );
        })}

        {room > 0 && (
          <li className="ad-photo">
            <button
              type="button"
              className={`ad-photo-add${isDragging ? ' is-dragging' : ''}`}
              onClick={() => addInput.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
            >
              <AdminIcon name="plus" />
              {text.add}
              <small>{text.addNote}</small>
            </button>
          </li>
        )}
      </ol>
      {items.length === 0 && !listError && <p className="mp-hint">{text.empty}</p>}

      <input
        ref={addInput}
        type="file"
        accept={imageText.accept}
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = '';
          addFiles(files);
        }}
      />
      <input
        ref={replaceInput}
        type="file"
        accept={imageText.accept}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = '';
          if (replacing.current !== null) replaceFile(file, replacing.current);
        }}
      />
    </fieldset>
  );
};

export default PhotoGridEditor;
