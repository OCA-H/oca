'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { profileContent } from '../content';
import { cardFileName, drawMembershipCard, type CardImageText } from '../helper';
import type { MembershipCard } from '../services';

type CardAction = 'download' | 'print';

const PRINT_CLASS = 'is-printing-card';

/**
 * Swaps the page for the card image while it prints: a print-only element holding the image, a
 * class that hides everything else (see .mp-print-card in oca-v1.css), and zero page margins so
 * the browser adds no date, title or address lines. Returns the function that undoes it.
 */
function showCardForPrint(dataUrl: string, title: string): () => void {
  const holder = document.createElement('div');
  holder.className = 'mp-print-card';
  holder.setAttribute('aria-hidden', 'true');
  const image = document.createElement('img');
  image.src = dataUrl;
  image.alt = '';
  holder.appendChild(image);

  const pageStyle = document.createElement('style');
  pageStyle.textContent = '@page { size: A4; margin: 0; }';

  const previousTitle = document.title;
  document.body.appendChild(holder);
  document.head.appendChild(pageStyle);
  document.documentElement.classList.add(PRINT_CLASS);
  // Also the suggested file name when saving as PDF.
  document.title = title;

  return () => {
    holder.remove();
    pageStyle.remove();
    document.documentElement.classList.remove(PRINT_CLASS);
    document.title = previousTitle;
  };
}

/**
 * "Download card" saves the card as a PNG; "Print" prints only the card, at ID-card size. While
 * the card panel is open the image is drawn ahead, so printing from the browser (Ctrl/Cmd+P) also
 * gives just the card.
 */
export function useCardExport(card: MembershipCard | null, text: CardImageText | null, isActive: boolean) {
  const [busy, setBusy] = useState<CardAction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<{ url: string; card: MembershipCard; text: CardImageText } | null>(null);
  const undoPrint = useRef<(() => void) | null>(null);
  const copy = profileContent.card.export;
  const printTitle = card ? `${copy.printTitle} – ${card.memberId}` : copy.printTitle;
  const ready = image && image.card === card && image.text === text ? image.url : null;

  // Draw the card ahead while its panel is open, so any print can use it straight away.
  useEffect(() => {
    if (!isActive || !card || !text || ready) return;
    let current = true;
    drawMembershipCard(card, text)
      .then((canvas) => current && setImage({ url: canvas.toDataURL('image/png'), card, text }))
      .catch((err) => console.error('Membership card image failed:', err));
    return () => {
      current = false;
    };
  }, [isActive, card, text, ready]);

  // Printing from the browser itself, not the button: show the card alone for that too.
  useEffect(() => {
    if (!isActive || !ready) return;
    const before = () => {
      if (!undoPrint.current) undoPrint.current = showCardForPrint(ready, printTitle);
    };
    const after = () => {
      undoPrint.current?.();
      undoPrint.current = null;
    };
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
      after();
    };
  }, [isActive, ready, printTitle]);

  const run = useCallback(
    async (action: CardAction) => {
      if (!card || !text || busy) return;
      setBusy(action);
      setError(null);
      try {
        const canvas = ready ? null : await drawMembershipCard(card, text);
        if (action === 'print') {
          const url = ready ?? canvas!.toDataURL('image/png');
          undoPrint.current?.();
          undoPrint.current = showCardForPrint(url, printTitle);
          // Let the image settle into the page before the print dialog snapshots it.
          await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
          window.print();
          // Browsers without afterprint: window.print() blocks until the dialog closes.
          undoPrint.current?.();
          undoPrint.current = null;
          return;
        }
        const blob = canvas
          ? await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
          : await (await fetch(ready!)).blob();
        if (!blob) throw new Error(copy.failed);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = cardFileName(card.memberId);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      } catch (err) {
        console.error('Membership card export failed:', err);
        setError(copy.failed);
      } finally {
        setBusy(null);
      }
    },
    [card, text, busy, ready, printTitle, copy]
  );

  return {
    busy,
    error,
    download: useCallback(() => run('download'), [run]),
    print: useCallback(() => run('print'), [run]),
  };
}

export default useCardExport;
