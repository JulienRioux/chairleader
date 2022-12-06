import { DefaultTheme } from 'styled-components';
import {
  darkThemeSharedColors,
  lightThemeSharedColors,
  primitives,
  sharedStyles,
} from './constants';

export const lightTheme: DefaultTheme = {
  color: {
    primary: '#E0282E',
    buttonText: primitives.white,
    ...lightThemeSharedColors,
  },
  ...sharedStyles,
};

export const darkTheme: DefaultTheme = {
  color: {
    primary: '#E0282E',
    background: '#070708',
    buttonText: primitives.white,
    ...darkThemeSharedColors,
  },
  ...sharedStyles,
};

export const theme = {
  lightTheme,
  darkTheme,
};
