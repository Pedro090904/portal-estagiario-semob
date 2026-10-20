import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Certificado, Trilha } from '../types';
import { CartaoCertificado } from '../components/CartaoCertificado';
import { SkeletonCard } from '../components/SkeletonLoader';
import { Award, ShieldCheck, Clock, ExternalLink, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CertificadosLista: React.FC = () => {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [trilhaDev, setTrilhaDev] = useState<Trilha | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [certificadoEmFoco, setCertificadoEmFoco] = useState<Certificado | null>(null);

  useEffect(() => {
    carregar();
  }, []);

  const carregar = async () => {
    setCarregando(true);
    try {
      const [certs, t] = await Promise.all([
        api.certificados.listar(),
        api.trilhas.obterPorId('trilha-dev-semob-2026')
      ]);
      setCertificados(certs);
      setTrilhaDev(t);
      if (certs.length > 0) {
        setCertificadoEmFoco(certs[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return (
      <div className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Registro Oficial e Rastreabilidade SEI
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Certificados Institucionais
          </h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
            O certificado é homologado pelo supervisor técnico e pelo subsecretário após cumprimento de 100% das etapas.
          </p>
        </div>

        <Link
          to="/validar"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-xs transition-colors shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Validar Autenticidade sem Login</span>
        </Link>
      </div>

      {/* Track in Progress Eligibility Banner */}
      {trilhaDev && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
              Status da Trilha Atual
            </span>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm md:text-base">
              {trilhaDev.titulo}
            </h3>
            <p className="text-xs text-slate-500">
              {trilhaDev.etapas.filter(e => e.status === 'concluida').length} de {trilhaDev.etapas.length} etapas obrigatórias concluídas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/trilhas/${trilhaDev.id}`}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              Ver Etapas Pendentes
            </Link>
          </div>
        </div>
      )}

      {/* Main Certificate Display */}
      {certificadoEmFoco ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
              Certificado Selecionado para Visualização e Impressão
            </h2>
            <span className="text-xs font-mono text-slate-500">
              Chave: {certificadoEmFoco.codigoValidacao}
            </span>
          </div>

          <CartaoCertificado certificado={certificadoEmFoco} />
        </div>
      ) : (
        <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <Award className="w-10 h-10 mx-auto text-slate-400 mb-2" />
          <p className="font-semibold text-slate-700 dark:text-slate-300">Nenhum certificado emitido até o momento.</p>
          <p className="text-xs">Complete a trilha de formação para que o orientador possa homologar seu certificado.</p>
        </div>
      )}
    </div>
  );
};
