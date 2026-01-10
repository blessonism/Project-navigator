import { useState, useEffect, useCallback } from 'react';
import { verifyPassword, isAuthenticated, setAuthenticated, logout } from '@/lib/auth';

export interface UseAdminAuthReturn {
  isAdminMode: boolean;
  setIsAdminMode: (value: boolean) => void;
  isAuthDialogOpen: boolean;
  setIsAuthDialogOpen: (value: boolean) => void;
  password: string;
  setPassword: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  authError: string;
  handlePasswordSubmit: () => Promise<void>;
  handleLogout: () => void;
  resetAuthDialog: () => void;
}

export function useAdminAuth(): UseAdminAuthReturn {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('admin')) {
      if (!isAuthenticated()) {
        setIsAuthDialogOpen(true);
      } else {
        setIsAdminMode(true);
      }
      window.history.replaceState({}, '', window.location.pathname);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        if (!isAuthenticated()) {
          setIsAuthDialogOpen(true);
        } else {
          setIsAdminMode(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handlePasswordSubmit = useCallback(async () => {
    setAuthError('');

    if (!password) {
      setAuthError('请输入密码');
      return;
    }

    const isValid = await verifyPassword(password);

    if (isValid) {
      setAuthenticated(true);
      setIsAuthDialogOpen(false);
      setIsAdminMode(true);
      setPassword('');
    } else {
      setAuthError('密码错误，请重试');
      setPassword('');
    }
  }, [password]);

  const handleLogout = useCallback(() => {
    logout();
    setIsAdminMode(false);
  }, []);

  const resetAuthDialog = useCallback(() => {
    setIsAuthDialogOpen(false);
    setPassword('');
    setAuthError('');
  }, []);

  return {
    isAdminMode,
    setIsAdminMode,
    isAuthDialogOpen,
    setIsAuthDialogOpen,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    authError,
    handlePasswordSubmit,
    handleLogout,
    resetAuthDialog,
  };
}
