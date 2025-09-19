import { createContext, useContext, useState, useMemo } from 'react';
import { FluentProvider, webDarkTheme } from '@fluentui/react-components';
import type { Theme } from '@fluentui/react-components';
import { ekalTheme } from '../themes/ekalTheme';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const theme = useMemo(() => (isDark ? webDarkTheme : ekalTheme), [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark }}>
      <FluentProvider theme={theme}>
        {children}
      </FluentProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
