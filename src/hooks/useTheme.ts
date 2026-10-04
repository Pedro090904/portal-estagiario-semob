import { useState, useEffect } from 'react';
import { ThemeMode } from '../types';
import { storageService } from '../services/storageService';

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => storageService.getTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    storageService.setTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
}
