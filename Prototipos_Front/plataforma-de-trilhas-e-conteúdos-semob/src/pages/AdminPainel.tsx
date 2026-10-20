import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { BrandConfig, BrandTheme } from '../types';
import { SkeletonTable } from '../components/SkeletonLoader';
import {
  Settings,
  FileText,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  Sliders,
  Shield,
  Search,
  Building,
  Save,
  Check
} from 'lucide-react';

export const AdminPainel: React.FC = () => {
  const { brandConfig, setBrand, activeBrand } = useApp();
  const [abaAtiva, setAbaAtiva] = useState<'conteudos' | 'usuarios' | 'instancia'>('conteudos');
  const [conteudos, setConteudos] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [previaItem, setPreviaItem] = useState<any | null>(null);

  // Form instance branding
  const [nomeInstancia, setNomeInstancia] = useState(brandConfig.nomeCompleto);
  const [siglaInstancia, setSiglaInstancia] = useState(brandConfig.sigla);
  const [emailSuporte, setEmailSuporte] = useState(brandConfig.suporteEmail);
  const [salvoFeedback, setSalvoFeedback] = useState(false);

  // Users filter
  const [buscaUsuario, setBuscaUsuario] = useState('');

  const usuariosSimulados = [
    { id: 'u1', nome: 'Lucas Mendes Ferreira', email: 'lucas.mendes@estagio.semob.gov.br', perfil: 'Aluno (Estagiário)', area: 'Engenharia SIT', status: 'Ativo' },
    { id: 'u2', nome: 'Carlos Eduardo Silveira', email: 'carlos.silveira@semob.gov.br', perfil: 'Supervisor Técnico', area: 'Gerência de Sistemas', status: 'Ativo' },
    { id: 'u3', nome: 'Beatriz Vasconcelos Lima', email: 'beatriz.lima@estagio.semob.gov.br', perfil: 'Aluno (Estagiário)', area: 'Ciência de Dados', status: 'Ativo' },
    { id: 'u4', nome: 'Mariana Costa Ribeiro', email: 'mariana.costa@semob.gov.br', perfil: 'Desenvolvedora Júnior', area: 'Engenharia SIT', status: 'Ativo' },
    { id: 'u5', nome: 'Renata Abreu Santos', email: 'renata.abreu@semob.gov.br', perfil: 'Administrador', area: 'Diretoria de TI', status: 'Ativo' }
  ];

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    setCarregando(true);
    try {
      const res = await api.admin.listarConteudos();
      setConteudos(res);
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  const handleSalvarConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSalvoFeedback(true);
    setTimeout(() => setSalvoFeedback(false), 3000);
  };

  if (carregando) {
    return <SkeletonTable />;
  }

  const usuariosFiltrados = usuariosSimulados.filter(u =>
    u.nome.toLowerCase().includes(buscaUsuario.toLowerCase()) ||
    u.email.toLowerCase().includes(buscaUsuario.toLowerCase()) ||
    u.perfil.toLowerCase().includes(buscaUsuario.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 border-b border-slate-200 dark:border-slate-800 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Governança de Conteúdo & Instância White-Label
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Painel de Administração
        </h1>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
          Gestão de status de publicação de trilhas, metadados institucionais, usuários e configuração white-label.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setAbaAtiva('conteudos')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            abaAtiva === 'conteudos' ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Trilhas & Conteúdos ({conteudos.length})
        </button>

        <button
          onClick={() => setAbaAtiva('usuarios')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            abaAtiva === 'usuarios' ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Gestão de Usuários & Perfis ({usuariosSimulados.length})
        </button>

        <button
          onClick={() => setAbaAtiva('instancia')}
          className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
            abaAtiva === 'instancia' ? 'bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          Configurações da Instância & Marca
        </button>
      </div>

      {/* TAB 1: CONTEUDOS */}
      {abaAtiva === 'conteudos' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    <th className="p-4">Título do Conteúdo</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">Versão</th>
                    <th className="p-4">Revisão</th>
                    <th className="p-4">Escopo</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {conteudos.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-4 font-semibold text-slate-900 dark:text-slate-100 max-w-xs truncate">
                        {c.titulo}
                      </td>
                      <td className="p-4 text-slate-500 font-mono">{c.tipo}</td>
                      <td className="p-4 font-mono text-slate-500">{c.versao}</td>
                      <td className="p-4 font-mono text-slate-500">{c.dataRevisao}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{c.escopo}</td>
                      <td className="p-4">
                        {c.status === 'publicado' ? (
                          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200">
                            Publicado
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200">
                            Em Revisão
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setPreviaItem(c)}
                          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium px-2 py-1 rounded"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Prévia</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USUARIOS */}
      {abaAtiva === 'usuarios' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={buscaUsuario}
                onChange={(e) => setBuscaUsuario(e.target.value)}
                placeholder="Filtrar por nome, e-mail ou perfil..."
                className="w-full pl-11 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-slate-100"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                    <th className="p-3">Nome do Usuário</th>
                    <th className="p-3">E-mail Institucional</th>
                    <th className="p-3">Perfil de Acesso</th>
                    <th className="p-3">Lotação / Área</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {usuariosFiltrados.map(u => (
                    <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">{u.nome}</td>
                      <td className="p-3 font-mono text-slate-500">{u.email}</td>
                      <td className="p-3 font-medium text-blue-700 dark:text-blue-400">{u.perfil}</td>
                      <td className="p-3 text-slate-600 dark:text-slate-400">{u.area}</td>
                      <td className="p-3">
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONFIGURACOES DA INSTANCIA (WHITE-LABEL) */}
      {abaAtiva === 'instancia' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs max-w-2xl">
          <div className="space-y-1 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              Parâmetros da Instância White-Label
            </h3>
            <p className="text-xs text-slate-500">
              Personalize o nome da organização, sigla oficial e canal de atendimento técnico.
            </p>
          </div>

          <form onSubmit={handleSalvarConfig} className="space-y-4 text-xs md:text-sm">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Nome Completo da Instituição:
              </label>
              <input
                type="text"
                value={nomeInstancia}
                onChange={(e) => setNomeInstancia(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                Sigla Institucional:
              </label>
              <input
                type="text"
                value={siglaInstancia}
                onChange={(e) => setSiglaInstancia(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 block">
                E-mail para Suporte e Chamados:
              </label>
              <input
                type="email"
                value={emailSuporte}
                onChange={(e) => setEmailSuporte(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 text-xs font-mono"
              />
            </div>

            {salvoFeedback && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Configurações da instância salvas com sucesso!</span>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content Preview Modal */}
      {previaItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-in fade-in"
          onClick={() => setPreviaItem(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="font-semibold text-xs text-slate-500 uppercase tracking-wider">
                Prévia Exata como o Aluno Visualiza
              </span>
              <button onClick={() => setPreviaItem(null)} className="text-slate-400 hover:text-slate-600">
                Fechar
              </button>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{previaItem.titulo}</h3>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p>Tipo: {previaItem.tipo} · Versão: {previaItem.versao}</p>
                <p>Escopo de Acesso: {previaItem.escopo} · Status: {previaItem.status}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setPreviaItem(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-semibold"
              >
                Concluir Prévia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
