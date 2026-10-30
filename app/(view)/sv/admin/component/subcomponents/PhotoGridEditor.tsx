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
 */
export const PhotoGridEditor: React.FC<PhotoGridEditorProps> = ({ list, path, items, editor }) => {
  const { image: imageText, photos: text, editor: editorText } = adminContent;
  const { fieldErrors } = editor;
  const imageKey = list.fields.find((field) => field.type === 'image')?.key ?? 'image';
  const textFields = list.fields.filter((field) => field.key !== imageKey);
  const addInput = useRef<HTMLInputElement>(null);
  const replaceInput = useRef<HTMLInputElement>(null);
  const replacing = useRef<number | null>(null);
  const [uploading, setUploading] = useState(0);
  const [replacingIndex, setReplacingIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const room = list.max - items.length;
  const listError = fieldErrors[path];

  /** Splits files into ones to upload and a note about any left out (wrong type, too big). */
  const screen = (files: File[]) => {
    const wrongType = files.filter((file) => !imageText.types.test(file.type));
    const tooBig = files.filter((file) => imageText.types.test(file.type) && file.size > imageText.maxBytes);
    const notes = [
      wrongType.length > 0 && text.skipped(wrongType.length, imageText.badType),
      tooBig.length > 0 && text.skipped(tooBig.length, imageText.tooBig),
    ].filter(Boolean);
    return { ok: files.filter((file) => !wrongType.includes(file) && !tooBig.includes(file)), notes };
  };

  const addFiles = async (picked: File[]) => {
    if (picked.length === 0 || uploading > 0) return;
    const { ok, notes } = screen(picked);
    if (ok.length > room) notes.push(text.tooMany(list.max));
    const files = ok.slice(0, Math.max(room, 0));
    setMessage(notes.length > 0 ? notes.join(' ') : null);
    if (files.length === 0) return;

    setUploading(files.length);
    // Uploaded side by side; the photos keep the order they were chosen in.
    const results = await Promise.allSettled(files.map((file) => editor.uploadMedia(file)));
    setUploading(0);
    const urls = results.flatMap((result) => (result.status === 'fulfilled' ? [result.value] : []));
    if (urls.length > 0) editor.addItems(list, path, urls.map((url) => ({ [imageKey]: url })));
    const failed = results.find((result): result is PromiseRejectedResult => result.status === 'rejected');
    if (failed) {
      const reason = failed.reason instanceof Error ? failed.reason.message : imageText.failed;
      setMessage([...notes, text.skipped(results.length - urls.length, reason)].join(' '));
    }
  };

  const replaceFile = async (file: File | undefined, index: number) => {
    if (!file) return;
    const { ok, notes } = screen([file]);
    if (ok.length === 0) return setMessage(notes.join(' '));
    setMessage(null);
    setReplacingIndex(index);
    try {
      editor.setItemField(path, index, imageKey, await editor.uploadMedia(file));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : imageText.failed);
    } finally {
      setReplacingIndex(null);
    }
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
                  disabled={replacingIndex !== null}
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
                {replacingIndex === index && (
                  <span className="ad-image-busy" aria-hidden="true">
                    <span className="mp-photo-spin" />
                  </span>
                )}
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

        {Array.from({ length: uploading }, (_, i) => (
          <li key={`uploading-${i}`} className="ad-photo" aria-hidden="true">
            <div className="ad-photo-media">
              <span className="ad-image-busy">
                <span className="mp-photo-spin" />
              </span>
            </div>
          </li>
        ))}

        {room > uploading && (
          <li className="ad-photo">
            <button
              type="button"
              className={`ad-photo-add${isDragging ? ' is-dragging' : ''}`}
              onClick={() => addInput.current?.click()}
              disabled={uploading > 0}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
            >
              <AdminIcon name={uploading > 0 ? 'upload' : 'plus'} />
              {uploading > 0 ? text.uploading(uploading) : text.add}
              <small>{text.addNote}</small>
            </button>
          </li>
        )}
      </ol>
      {items.length === 0 && uploading === 0 && !listError && <p className="mp-hint">{text.empty}</p>}

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
