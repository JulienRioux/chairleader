import { DefaultTheme } from 'styled-components';
import {
  primitives,
  lightThemeSharedColors,
  sharedStyles,
  darkThemeSharedColors,
} from './constants';

export const lightTheme: DefaultTheme = {
  color: {
    primary: '#6F00FF',
    buttonText: primitives.white,
    ...lightThemeSharedColors,
  },
  ...sharedStyles,
};

export const darkTheme: DefaultTheme = {
  color: {
    primary: '#9b51ff',
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
