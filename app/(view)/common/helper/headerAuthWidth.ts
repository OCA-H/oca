// The header's Contribute + sign-in row is as wide as whichever state the visitor last saw (their
// profile button, or Become a Member + Sign In). Its width is remembered in this browser, and set
// before the first paint, so while the sign-in check runs the placeholder already has the final
// size and nothing beside it moves when the real buttons arrive.

/** localStorage key: the row's last width in CSS pixels, on a wide (desktop) header. */
export const HEADER_AUTH_WIDTH_KEY = 'oca_hdr_auth_w';

/** Wide enough that the header shows the sign-in area (it is in the burger menu below this). */
export const HEADER_AUTH_WIDE_QUERY = '(min-width: 1081px)';

/**
 * Runs in <head> before the page paints: puts the remembered width in --hdr-auth-w and marks
 * <html data-hdr-auth-w>, which the header's CSS uses in place of its default reserved width.
 */
export const HEADER_AUTH_WIDTH_SCRIPT = `try{var w=parseFloat(localStorage.getItem(${JSON.stringify(HEADER_AUTH_WIDTH_KEY)}));if(w>0&&w<1000){var r=document.documentElement;r.style.setProperty("--hdr-auth-w",w+"px");r.setAttribute("data-hdr-auth-w","")}}catch(e){}`;

/** Remembers the row's width for the next page load; ignored on a narrow header or without storage. */
export function rememberHeaderAuthWidth(row: HTMLElement) {
  if (!window.matchMedia(HEADER_AUTH_WIDE_QUERY).matches) return;
  try {
    localStorage.setItem(HEADER_AUTH_WIDTH_KEY, String(row.getBoundingClientRect().width));
  } catch {
    // Private mode or storage blocked: the header falls back to its default reserved width.
  }
}
