import { createTheme, MantineColorsTuple } from '@mantine/core';

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

export const theme = createTheme({
  primaryColor: 'brand',
  colors: {
    brand: primaryColor,
    secondary: secondaryColor,
  },
  defaultRadius: 'md',
  fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  headings: {
    fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
  },
  breakpoints: {
    xs: '36em',
    sm: '48em',
    md: '62em',
    lg: '75em',
    xl: '88em',
  },
});