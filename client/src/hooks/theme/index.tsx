import * as React from 'react';
import {
  createContext,
  useCallback,
  ReactNode,
  FC,
  useState,
  useEffect,
  useContext,
} from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { StorageKeys } from 'utils';
import { themes } from 'styles/themes';
import { useSearchParams } from 'react-router-dom';

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

type ThemeColors = 'blue' | 'green' | 'purple' | 'pink';

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [themeColor, setThemeColor] = useState<ThemeColors>('blue');
  const [theme, setTheme] = useState(
    (localStorage.getItem(StorageKeys.THEME) ?? THEME.DARK) as THEME
  );

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const previewTheme = searchParams.get('override_theme_color');
    if (previewTheme) {
      setThemeColor(previewTheme as ThemeColors);
    }
  }, [searchParams]);

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

  const currentTheme = themes[themeColor];

  return (
    <ThemeContext.Provider value={getCtx()}>
      <StyledThemeProvider
        theme={isDarkTheme ? currentTheme.darkTheme : currentTheme.lightTheme}
      >
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext.Consumer;

export const useTheme = () => {
  return useContext(ThemeContext);
};
