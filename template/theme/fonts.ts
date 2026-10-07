export const themeFonts = {
  families: {
    serif: "'Raleway', -apple-system, sans-serif",
    sans: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  sizes: {
    xs: '12px',
    sm: '13.5px',
    base: '15px',
    md: '16px',
    lg: '18px',
    xl: '21px',
    '2xl': '26px',
    '3xl': '32px',
    '4xl': '40px',
    '5xl': '48px',
  },
  lineHeights: {
    tight: '1.15',
    snug: '1.3',
    normal: '1.5',
    relaxed: '1.65',
  },
} as const;

export type ThemeFonts = typeof themeFonts;
