import { DefaultTheme } from 'styled-components';
import {
  darkThemeSharedColors,
  lightThemeSharedColors,
  primitives,
  sharedStyles,
} from './constants';

export const lightTheme: DefaultTheme = {
  color: {
    primary: '#00a481',
    buttonText: primitives.white,
    ...lightThemeSharedColors,
  },
  ...sharedStyles,
};

export const darkTheme: DefaultTheme = {
  color: {
    primary: '#14f195',
    background: '#1b1f25',
    buttonText: primitives.black,
    ...darkThemeSharedColors,
  },
  ...sharedStyles,
};

export const theme = {
  lightTheme,
  darkTheme,
};
