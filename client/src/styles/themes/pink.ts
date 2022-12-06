import { DefaultTheme } from 'styled-components';
import {
  darkThemeSharedColors,
  lightThemeSharedColors,
  primitives,
  sharedStyles,
} from './constants';

export const lightTheme: DefaultTheme = {
  color: {
    primary: '#ff55d3',
    buttonText: primitives.white,
    ...lightThemeSharedColors,
  },
  ...sharedStyles,
};

export const darkTheme: DefaultTheme = {
  color: {
    primary: '#ff55d3',
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
