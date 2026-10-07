import { themeColors } from './colors';
import { themeFonts } from './fonts';

export const theme = {
  colors: themeColors,
  fonts: themeFonts,
  radius: {
    s: '4px',
    m: '8px',
    l: '10px',
  },
  shadows: {
    card: '0 1px 2px rgba(11,60,30,.04), 0 2px 10px rgba(11,60,30,.05)',
    hover: '0 2px 6px rgba(11,60,30,.06), 0 8px 20px rgba(11,60,30,.09)',
    brand: '0 8px 22px rgba(27,158,75,.22)',
  },
  layout: {
    maxw: '1200px',
  }
} as const;

export * from './colors';
export * from './fonts';
export default theme;
