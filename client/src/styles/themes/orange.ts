import { DefaultTheme } from 'styled-components';
import {
  darkThemeSharedColors,
  lightThemeSharedColors,
  primitives,
  sharedStyles,
} from './constants';

export const lightTheme: DefaultTheme = {
  color: {
    primary: '#F4801A',
    buttonText: primitives.white,
    ...lightThemeSharedColors,
  },
  ...sharedStyles,
};

export const darkTheme: DefaultTheme = {
  color: {
    primary: '#F4801A',
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
