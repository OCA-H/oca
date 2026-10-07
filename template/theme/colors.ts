export const themeColors = {
  brand: {
    DEFAULT: '#1B9E4B',      // logo green — primary brand colour
    bright: '#29B85C',       // lifted green for gradients / dark-bg accents
    mid: '#14803C',          // AA-safe green for text & small UI on white
    deep: '#0F5E2D',         // deep forest — dark surfaces, headings
    darkest: '#08381B',      // deepest green — footer, hero base
  },
  gold: {
    DEFAULT: '#C9A227',      // heraldic gold — crest, honours, highlights
    dark: '#8A6B1F',
  },
  neutrals: {
    bg: '#F5F8F5',
    card: '#FFFFFF',
    border: '#D8E4DA',
    borderStrong: '#BCD2C2',
    text: '#12251A',
    textSoft: '#5A6B60',
  },
  tints: {
    teal: '#EAF5EE',
    gold: '#FBF4E3',
    navy: '#E8F1EA',
  },
  onDark: {
    DEFAULT: '#CDE0D2',
    soft: '#A8C4B1',
    faint: '#7E9A86',
  },
  legacy: {
    navy: '#0F5E2D',
    navyDark: '#08381B',
    teal: '#1B9E4B',
    tealDark: '#14803C',
    gold: '#C9A227',
    goldDark: '#8A6B1F',
  }
} as const;

export type ThemeColors = typeof themeColors;
