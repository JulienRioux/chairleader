import * as React from 'react';
import {
  createContext,
  useCallback,
  ReactNode,
  FC,
  useState,
  useContext,
} from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { DarkTheme, LightTheme } from 'styles';
import { StorageKeys } from 'utils';

enum THEME {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

interface IThemeContext {
  theme: THEME;
  toggleTheme: () => void;
  isDarkTheme: boolean;
}

export const ThemeContext = createContext<IThemeContext>({} as IThemeContext);

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(
    (localStorage.getItem(StorageKeys.THEME) ?? THEME.LIGHT) as THEME
  );

  const isDarkTheme = theme === THEME.DARK;

  const toggleTheme = useCallback(() => {
    const currentTheme = isDarkTheme ? THEME.LIGHT : THEME.DARK;
    setTheme(currentTheme);
    localStorage.setItem(StorageKeys.THEME, currentTheme);
  }, [isDarkTheme]);

  const getCtx = useCallback(() => {
    return {
      toggleTheme,
      theme,
      isDarkTheme,
    };
  }, [isDarkTheme, theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={getCtx()}>
      <StyledThemeProvider theme={isDarkTheme ? DarkTheme : LightTheme}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext.Consumer;

export const useTheme = () => {
  return useContext(ThemeContext);
};
