/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Users,
  Search,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { ApiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';

export const AdminUserManager: React.FC = () => {
  const { allUsers } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const { showSuccess, showError } = useNotification();

  const loadUsers = async () => {
    const list = await ApiService.getAllUsers();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await ApiService.updateUserRole(userId, newRole);
      showSuccess('Papel atualizado com sucesso!', 'As permissões foram recalculadas.');
      await loadUsers();
    } catch (e) {
      showError('Falha ao atualizar papel');
    }
  };

  const roleBadges = {
    student: <Badge variant="info">Aluno / Estagiário</Badge>,
    supervisor: <Badge variant="success">Supervisora Técnica</Badge>,
    admin: <Badge variant="neutral">Administrador</Badge>,
  };

  const filtered = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-700 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>CONTROLE DE ACESSO & GOVERNANÇA</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Gestão de Usuários e Atribuição de Papéis
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Gerencie o acesso às áreas de Aluno, Supervisão Técnica e Administração da plataforma corporativa.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <Input
          placeholder="Buscar usuário por nome, email ou cargo..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
            <tr>
              <th className="py-3 px-4">Usuário</th>
              <th className="py-3 px-4">Organização</th>
              <th className="py-3 px-4">Papel Atual</th>
              <th className="py-3 px-4">Data de Ingresso</th>
              <th className="py-3 px-4 text-right">Alterar Papel</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatarUrl}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[11px] text-slate-500 font-mono">{u.email}</span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{u.organizationName}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4">{roleBadges[u.role]}</td>
                <td className="py-3.5 px-4 text-slate-500 font-mono">{u.joinedAt}</td>
                <td className="py-3.5 px-4 text-right">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="student">Aluno / Estagiário</option>
                    <option value="supervisor">Supervisor Técnico</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
