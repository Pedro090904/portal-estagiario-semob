/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { ApiService } from '../services/api';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  switchUser: (userId: string) => Promise<void>;
  updateRole: (newRole: UserRole) => Promise<void>;
  allUsers: User[];
  isStudent: boolean;
  isSupervisor: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const user = await ApiService.getCurrentUser();
        const users = await ApiService.getAllUsers();
        setCurrentUser(user);
        setAllUsers(users);
      } catch (err) {
        console.error('Failed loading auth user', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const switchUser = async (userId: string) => {
    setIsLoading(true);
    try {
      const user = await ApiService.switchUser(userId);
      setCurrentUser(user);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRole = async (newRole: UserRole) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const updated = await ApiService.updateUserRole(currentUser.id, newRole);
      setCurrentUser(updated);
      const users = await ApiService.getAllUsers();
      setAllUsers(users);
    } finally {
      setIsLoading(false);
    }
  };

  const isStudent = currentUser?.role === 'student';
  const isSupervisor = currentUser?.role === 'supervisor';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        switchUser,
        updateRole,
        allUsers,
        isStudent,
        isSupervisor,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
