/** The id in any YouTube address: watch?v=…, youtu.be/…, /embed/…, /shorts/…; null if there is none. */
function youtubeId(url: string): string | null {
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\.|^m\./, '');
    if (host === 'youtu.be') return parsed.pathname.slice(1).split('/')[0] || null;
    if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      const v = parsed.searchParams.get('v');
      if (v) return v;
      const match = parsed.pathname.match(/^\/(?:embed|shorts|live|v)\/([\w-]{6,})/);
      return match?.[1] ?? null;
    }
  } catch {
    // Not an address: fall through.
  }
  return /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null;
}

export const schoolAnthemHelper = {
  youtubeId,

  /** The embed address the page's player drives (the YouTube IFrame API needs enablejsapi=1). */
  embedUrl: (url: string): string | null => {
    const id = youtubeId(url);
    return id ? `https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0` : null;
  },

  /** The watch page, for the "Not loading?" link. */
  watchUrl: (url: string): string => {
    const id = youtubeId(url);
    return id ? `https://www.youtube.com/watch?v=${id}` : url;
  },

  /** The lyrics as verses of lines: a blank line starts a new verse; empty lines are dropped. */
  stanzas: (lyrics: string): string[][] =>
    lyrics
      .replace(/\r/g, '')
      .trim()
      .split(/\n\s*\n/)
      .map((block) =>
        block
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
      )
      .filter((lines) => lines.length > 0),
};
