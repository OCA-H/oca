'use client';

import { useEffect, useRef, useState } from 'react';
import { profileContent } from '../content';
import { profileService, type MemberProfile } from '../services';

const { photo } = profileContent;

interface ShownPhoto {
  /** Object URL of the image on screen. */
  src: string | null;
  /** The profile's avatarUrl that image belongs to, so it is fetched once per version. */
  version: string | null;
}

/**
 * The member's photo in the sidebar oval. The saved photo is fetched as a Blob and shown through
 * an object URL (the photo route is private, so this keeps it behind the session). A newly chosen
 * photo shows at once from the file itself while it uploads, and the old one comes back if the
 * upload fails. A new `sessionKey` (after a sign-out) forgets the photo entirely.
 */
export function useProfilePhoto(profile: MemberProfile | null, onSaved: (profile: MemberProfile) => void, sessionKey: number) {
  const [shown, setShown] = useState<ShownPhoto>({ src: null, version: null });
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ text: string; bad: boolean } | null>(null);
  const shownVersion = useRef<string | null>(null);
  const messageTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Signed out and back in: forget the previous member's photo before showing anything.
  const [photoSession, setPhotoSession] = useState(sessionKey);
  if (photoSession !== sessionKey) {
    setPhotoSession(sessionKey);
    setShown({ src: null, version: null });
    setPreview(null);
    setMessage(null);
  }

  /** Puts an image on screen and frees the object URL it replaces. */
  const show = (src: string | null, version: string | null) => {
    shownVersion.current = version;
    setShown((prev) => {
      if (prev.src && prev.src !== src) URL.revokeObjectURL(prev.src);
      return { src, version };
    });
  };

  const avatarUrl = profile?.avatarUrl ?? null;
  const loadedSession = useRef(sessionKey);
  useEffect(() => {
    // A new session starts with nothing on screen, even if the same member signs back in.
    if (loadedSession.current !== sessionKey) {
      loadedSession.current = sessionKey;
      shownVersion.current = null;
    }
    if (!avatarUrl || shownVersion.current === avatarUrl) return;
    let isCurrent = true;
    profileService
      .getPhotoBlob(avatarUrl)
      .then((blob) => {
        if (isCurrent) show(URL.createObjectURL(blob), avatarUrl);
      })
      .catch(() => {
        // No image to show: the oval falls back to initials.
        if (isCurrent) show(null, avatarUrl);
      });
    return () => {
      isCurrent = false;
    };
  }, [avatarUrl, sessionKey]);

  useEffect(() => () => clearTimeout(messageTimer.current), []);

  const say = (text: string, bad = false) => {
    clearTimeout(messageTimer.current);
    setMessage({ text, bad });
    if (!bad) messageTimer.current = setTimeout(() => setMessage(null), 4000);
  };

  /** Checks the chosen image, previews it at once, and uploads it. */
  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    input.value = '';
    if (!file || isUploading) return;
    if (!photo.types.test(file.type)) return say(photo.badType, true);
    if (file.size > photo.maxBytes) return say(photo.tooBig, true);

    const local = URL.createObjectURL(file);
    setPreview(local);
    setIsUploading(true);
    say(photo.uploading);
    try {
      const saved = await profileService.uploadPhoto(file);
      // The local copy is the photo just saved, so keep it rather than downloading it again.
      show(local, saved.avatarUrl);
      setPreview(null);
      onSaved(saved);
      say(photo.updated);
    } catch (err: unknown) {
      URL.revokeObjectURL(local);
      setPreview(null);
      say(err instanceof Error ? err.message : photo.uploadFailed, true);
    } finally {
      setIsUploading(false);
    }
  };

  return {
    photoSrc: preview ?? shown.src,
    /** True while the saved photo is still on its way, so the oval can shimmer instead of flashing initials. */
    isPhotoLoading: Boolean(avatarUrl) && !preview && shown.version !== avatarUrl,
    isPhotoUploading: isUploading,
    photoMsg: message,
    handlePhotoChange,
  };
}

export default useProfilePhoto;
