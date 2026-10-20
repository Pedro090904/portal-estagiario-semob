import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, BrandTheme, BrandConfig } from '../types';
import { BRANDS } from '../services/mockData';

interface AppContextType {
  currentUser: User;
  setRole: (role: UserRole) => void;
  activeBrand: BrandTheme;
  brandConfig: BrandConfig;
  setBrand: (brand: BrandTheme) => void;
  themeMode: 'light' | 'dark';
  toggleThemeMode: () => void;
  fontSizeAdjustment: 'normal' | 'large' | 'larger';
  setFontSizeAdjustment: (size: 'normal' | 'large' | 'larger') => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isDossierOpen: boolean;
  setIsDossierOpen: (open: boolean) => void;
  isWireframesOpen: boolean;
  setIsWireframesOpen: (open: boolean) => void;
  networkError: boolean;
  setNetworkError: (err: boolean) => void;
  isOffline: boolean;
  setIsOffline: (off: boolean) => void;
}

const DEFAULT_USER: User = {
  id: 'usr-lucas',
  nome: 'Lucas Mendes Ferreira',
  email: 'lucas.mendes@estagio.semob.gov.br',
  cargo: 'Estagiário de Desenvolvimento',
  area: 'Gerência de Sistemas do SIT',
  role: 'aluno',
  rolesDisponiveis: ['aluno', 'dev', 'supervisor', 'admin'],
  diasSeguidos: 6,
  pontos: 340,
  dataIngresso: '01/10/2026'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('semob_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });

  const [activeBrand, setActiveBrand] = useState<BrandTheme>(() => {
    const saved = localStorage.getItem('semob_brand');
    return (saved as BrandTheme) || 'semob';
  });

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [fontSizeAdjustment, setFontSizeAdjustment] = useState<'normal' | 'large' | 'larger'>('normal');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isWireframesOpen, setIsWireframesOpen] = useState(false);
  const [networkError, setNetworkError] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Sync theme with html class
  useEffect(() => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  // Sync brand class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-azimute', 'theme-novagov');
    if (activeBrand === 'azimute') {
      root.classList.add('theme-azimute');
    } else if (activeBrand === 'novagov') {
      root.classList.add('theme-novagov');
    }
    localStorage.setItem('semob_brand', activeBrand);
  }, [activeBrand]);

  const setRole = (role: UserRole) => {
    let updatedUser: User = { ...currentUser, role };
    if (role === 'supervisor') {
      updatedUser = {
        ...updatedUser,
        nome: 'Carlos Eduardo Silveira',
        cargo: 'Orientador de Estágio Técnico',
        email: 'carlos.silveira@semob.gov.br'
      };
    } else if (role === 'admin') {
      updatedUser = {
        ...updatedUser,
        nome: 'Renata Abreu Santos',
        cargo: 'Gestora de Conteúdo e Trilhas',
        email: 'renata.abreu@semob.gov.br'
      };
    } else if (role === 'dev') {
      updatedUser = {
        ...updatedUser,
        nome: 'Mariana Costa Ribeiro',
        cargo: 'Desenvolvedora Júnior Plena',
        email: 'mariana.costa@semob.gov.br'
      };
    } else {
      updatedUser = {
        ...updatedUser,
        nome: 'Lucas Mendes Ferreira',
        cargo: 'Estagiário de Desenvolvimento',
        email: 'lucas.mendes@estagio.semob.gov.br'
      };
    }
    setCurrentUser(updatedUser);
    localStorage.setItem('semob_user', JSON.stringify(updatedUser));
  };

  const setBrand = (brand: BrandTheme) => {
    setActiveBrand(brand);
  };

  const toggleThemeMode = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Keyboard shortcut Ctrl+K / Cmd+K for global search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const brandConfig = BRANDS[activeBrand] || BRANDS.semob;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setRole,
        activeBrand,
        brandConfig,
        setBrand,
        themeMode,
        toggleThemeMode,
        fontSizeAdjustment,
        setFontSizeAdjustment,
        isSearchOpen,
        setIsSearchOpen,
        isDossierOpen,
        setIsDossierOpen,
        isWireframesOpen,
        setIsWireframesOpen,
        networkError,
        setNetworkError,
        isOffline,
        setIsOffline
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
