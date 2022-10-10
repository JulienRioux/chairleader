import { DefaultTheme } from 'styled-components';

const primitives = {
  white: '#ffffff',
  black: '#0e0e0e',
};

const sharedStyles = {
  borderWidth: '1px',
  borderRadius: {
    default: '12px',
    input: '4px',
  },
  font: {
    weight: {
      normal: '300',
      bold: '600',
    },
  },
  layout: {
    maxWidth: '1200px',
    mediumWidth: '600px',
    smallWidth: '400px',
    appLayoutPadding: '20px',
  },
  components: {
    modal: { animationDuration: 300 },
  },
  zIndex: {
    max: 9999,
  },
  products: {
    image: {
      aspectRatio: 1 / 1,
    },
  },
};

export const LightTheme: DefaultTheme = {
  color: {
    primary: '#00a481',
    white: primitives.white,
    black: primitives.black,
    lightGrey: '#dddddd',
    text: primitives.black,
    background: primitives.white,
    danger: '#ff2626',
    lightText: `${primitives.black}cc`,
    backdrop: `${primitives.black}66`,
    buttonText: primitives.white,
  },
  ...sharedStyles,
};

export const DarkTheme: DefaultTheme = {
  color: {
    primary: '#14f195',
    white: primitives.white,
    black: primitives.black,
    lightGrey: '#333333',
    text: primitives.white,
    background: '#1b1f25',
    danger: '#ff2626',
    lightText: `${primitives.white}cc`,
    backdrop: `${primitives.white}22`,
    buttonText: primitives.black,
  },
  ...sharedStyles,
};

const isDarkTheme = false;

export const Styles = isDarkTheme ? DarkTheme : LightTheme;
