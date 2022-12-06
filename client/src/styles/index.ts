import { DefaultTheme } from 'styled-components';
import { lightThemeSharedColors } from './themes/constants';

const primitives = {
  white: '#ffffff',
  black: '#0e0e0e',
};

export const LightTheme: DefaultTheme = {
  borderRadius: {
    default: '8px',
    input: '4px',
  },
  font: {
    weight: {
      normal: '300',
      bold: '600',
    },
  },
  borderWidth: '1px',
  color: {
    primary: '#6F00FF',
    buttonText: primitives.white,
    ...lightThemeSharedColors,
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
      // aspectRatio: 3 / 2,
      aspectRatio: 1 / 1,
    },
  },
};

export const DarkTheme: DefaultTheme = {
  borderRadius: {
    default: '0',
    input: '0',
  },
  font: {
    weight: {
      normal: '300',
      bold: '600',
    },
  },
  borderWidth: '1px',
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
      // aspectRatio: 3 / 2,
      aspectRatio: 1 / 1,
    },
  },
};

const isDarkTheme = false;

export const Styles = isDarkTheme ? DarkTheme : LightTheme;
