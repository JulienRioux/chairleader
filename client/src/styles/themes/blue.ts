import { DefaultTheme } from 'styled-components';
import {
  darkThemeSharedColors,
  lightThemeSharedColors,
  primitives,
  sharedStyles,
} from './constants';

export const lightTheme: DefaultTheme = {
  color: {
    primary: '#0185fe',
    buttonText: primitives.white,
    ...lightThemeSharedColors,
  },
  ...sharedStyles,
};

export const darkTheme: DefaultTheme = {
  color: {
    primary: '#198fff',
    background: '#1a1a1a',
    buttonText: primitives.white,
    ...darkThemeSharedColors,
  },
  ...sharedStyles,
};

export const theme = {
  lightTheme,
  darkTheme,
};
