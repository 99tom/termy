import { createStyled } from '@stitches/react'

/**
 * Default theme is stolen from tailwind
 * Source: https://github.com/tailwindlabs/tailwindcss/blob/v1/stubs/defaultConfig.stub.js#L5
 */

export const theme = {
  colors: {
    $textColor: '#1a202c',
    $backgroundColor: '#141418',

    $tileBackgroundColor: '#d6d8e3',
    $accentColor: '#f0773a', // orange OP-1 button
    $selectionColor: '#90cdf4',

    // Tailwind palette: https://tailwindcss.com/docs/customizing-colors#default-color-palette
    $black: '#000000',
    $white: '#ffffff',

    $gray100: '#f7fafc',
    $gray200: '#edf2f7',
    $gray300: '#e2e8f0',
    $gray400: '#cbd5e0',
    $gray500: '#a0aec0',
    $gray600: '#718096',
    $gray700: '#4a5568',
    $gray800: '#2d3748',
    $gray900: '#1a202c',

    $red100: '#fff5f5',
    $red200: '#fed7d7',
    $red300: '#feb2b2',
    $red400: '#fc8181',
    $red500: '#f56565',
    $red600: '#e53e3e',
    $red700: '#c53030',
    $red800: '#9b2c2c',
    $red900: '#742a2a',

    $orange100: '#fffaf0',
    $orange200: '#feebc8',
    $orange300: '#fbd38d',
    $orange400: '#f6ad55',
    $orange500: '#ed8936',
    $orange600: '#dd6b20',
    $orange700: '#dd6b20',
    $orange800: '#c05621',
    $orange900: '#9c4221',

    $yellow100: '#fffff0',
    $yellow200: '#fefcbf',
    $yellow300: '#faf089',
    $yellow400: '#f6e05e',
    $yellow500: '#ecc94b',
    $yellow600: '#d69e2e',
    $yellow700: '#b7791f',
    $yellow800: '#975a16',
    $yellow900: '#744210',

    $green100: '#f0fff4',
    $green200: '#c6f6d5',
    $green300: '#9ae6b4',
    $green400: '#68d391',
    $green500: '#48bb78',
    $green600: '#38a169',
    $green700: '#2f855a',
    $green800: '#276749',
    $green900: '#22543d',

    $teal100: '#e6fffa',
    $teal200: '#b2f5ea',
    $teal300: '#81e6d9',
    $teal400: '#4fd1c5',
    $teal500: '#38b2ac',
    $teal600: '#319795',
    $teal700: '#2c7a7b',
    $teal800: '#285e61',
    $teal900: '#234e52',

    $blue100: '#ebf8ff',
    $blue200: '#bee3f8',
    $blue300: '#90cdf4',
    $blue400: '#63b3ed',
    $blue500: '#4299e1',
    $blue600: '#3182ce',
    $blue700: '#2b6cb0',
    $blue800: '#2c5282',
    $blue900: '#2a4365',

    $indigo100: '#ebf4ff',
    $indigo200: '#c3dafe',
    $indigo300: '#a3bffa',
    $indigo400: '#7f9cf5',
    $indigo500: '#667eea',
    $indigo600: '#5a67d8',
    $indigo700: '#4c51bf',
    $indigo800: '#434190',
    $indigo900: '#3c366b',

    $purple100: '#faf5ff',
    $purple200: '#e9d8fd',
    $purple300: '#d6bcfa',
    $purple400: '#b794f4',
    $purple500: '#9f7aea',
    $purple600: '#805ad5',
    $purple700: '#6b46c1',
    $purple800: '#553c9a',
    $purple900: '#44337a',

    $pink100: '#fff5f7',
    $pink200: '#fed7e2',
    $pink300: '#fbb6ce',
    $pink400: '#f687b3',
    $pink500: '#ed64a6',
    $pink600: '#d53f8c',
    $pink700: '#b83280',
    $pink800: '#97266d',
    $pink900: '#702459',
  },
  fonts: {
    $sans:
      '"Helvetica Neue", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    $mono:
      '"Courier New", Courier, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    $serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  },
  space: {
    $px: '1px',
    $0: '0',
    $1: '0.25rem',
    $2: '0.5rem',
    $3: '0.75rem',
    $4: '1rem',
    $5: '1.25rem',
    $6: '1.5rem',
    $8: '2rem',
    $10: '2.5rem',
    $12: '3rem',
    $16: '4rem',
    $20: '5rem',
    $24: '6rem',
    $32: '8rem',
    $40: '10rem',
    $48: '12rem',
    $56: '14rem',
    $64: '16rem',
  },
  sizes: {},
  fontSizes: {
    $xs: '0.75rem',
    $sm: '0.875rem',
    $base: '1rem',
    $lg: '1.125rem',
    $xl: '1.25rem',
    $2xl: '1.5rem',
    $3xl: '1.875rem',
    $4xl: '2.25rem',
    $5xl: '3rem',
    $6xl: '4rem',
  },
  radii: {
    $none: '0',
    $sm: '0.125rem',
    $default: '0.25rem',
    $md: '0.375rem',
    $lg: '0.5rem',
    $xl: '0.75rem',
    $2xl: '1rem',
    $3xl: '1.5rem',
    $full: '9999px',
  },
  zIndices: {
    $auto: 'auto',
    $0: '0',
    $10: '10',
    $20: '20',
    $30: '30',
    $40: '40',
    $50: '50',
  },
}

// creating a copy so that the exported `theme` retains the raw values
const tokens = JSON.parse(JSON.stringify(theme)) as typeof theme

export const { styled, css } = createStyled({
  tokens,
  breakpoints: {
    default: rule => rule,
    bp1: rule => `@media (min-width: 520px) { ${rule} }`,
    bp2: rule => `@media (min-width: 900px) { ${rule} }`,
    bp3: rule => `@media (min-width: 1200px) { ${rule} }`,
    bp4: rule => `@media (min-width: 1800px) { ${rule} }`,
    motion: rule => `@media (prefers-reduced-motion) { ${rule} }`,
    hover: rule => `@media (hover: hover) { ${rule} }`,
    dark: rule => `@media (prefers-color-scheme: dark) { ${rule} }`,
    light: rule => `@media (prefers-color-scheme: light) { ${rule} }`,
  },
  utils: {
    p: value => ({
      paddingTop: value,
      paddingBottom: value,
      paddingLeft: value,
      paddingRight: value,
    }),
    pt: value => ({
      paddingTop: value,
    }),
    pr: value => ({
      paddingRight: value,
    }),
    pb: value => ({
      paddingBottom: value,
    }),
    pl: value => ({
      paddingLeft: value,
    }),
    px: value => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: value => ({
      paddingTop: value,
      paddingBottom: value,
    }),

    m: value => ({
      marginTop: value,
      marginBottom: value,
      marginLeft: value,
      marginRight: value,
    }),
    mt: value => ({
      marginTop: value,
    }),
    mr: value => ({
      marginRight: value,
    }),
    mb: value => ({
      marginBottom: value,
    }),
    ml: value => ({
      marginLeft: value,
    }),
    mx: value => ({
      marginLeft: value,
      marginRight: value,
    }),
    my: value => ({
      marginTop: value,
      marginBottom: value,
    }),
  },
})
