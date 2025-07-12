import { createTheme, MantineColorsTuple, rem } from '@mantine/core';

const primaryColor: MantineColorsTuple = [
  '#eef3ff',
  '#dce4f5',
  '#b9c7e2',
  '#94a8d0',
  '#748dc1',
  '#5f7cb8',
  '#5474b4',
  '#44639f',
  '#39588f',
  '#2d4b81'
];

const secondaryColor: MantineColorsTuple = [
  '#fef4e6',
  '#fce8d3',
  '#f8d0a9',
  '#f4b67c',
  '#f1a156',
  '#ef943d',
  '#ee8d30',
  '#d37a23',
  '#bc6d1b',
  '#a35d0f'
];

const darkColor: MantineColorsTuple = [
  '#C1C2C5',
  '#A6A7AB',
  '#909296',
  '#5c5f66',
  '#373A40',
  '#2C2E33',
  '#25262b',
  '#1A1B1E',
  '#141517',
  '#101113'
];

export const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand: primaryColor,
    secondary: secondaryColor,
    dark: darkColor,
  },
  defaultRadius: 'xl',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontWeight: '700',
  },
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
  },
  shadows: {
    xs: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.05), 0 20px 25px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.05), 0 25px 50px rgba(0, 0, 0, 0.15)',
  },
  other: {
    darkColors: {
      background: '#0a0a0a',
      card: '#141414',
      border: '#2a2a2a',
      text: '#f0f0f0',
      textSecondary: '#a0a0a0',
    },
    animations: {
      fadeIn: 'fadeIn 0.3s ease-in-out',
      slideUp: 'slideUp 0.3s ease-in-out',
      scaleIn: 'scaleIn 0.3s ease-in-out',
      float: 'float 3s ease-in-out infinite',
    },
  },
});