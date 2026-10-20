import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Certificado } from '../types';
import { ShieldCheck, Search, CheckCircle2, AlertOctagon, ArrowLeft, QrCode, FileCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ValidacaoPublica: React.FC = () => {
  const [searchParams] = useSearchParams();
  const codigoUrl = searchParams.get('codigo') || '';
  const { brandConfig } = useApp();

  const [codigoInput, setCodigoInput] = useState(codigoUrl);
  const [certificado, setCertificado] = useState<Certificado | null>(null);
  const [buscado, setBuscado] = useState(false);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (codigoUrl) {
      setCodigoInput(codigoUrl);
      consultar(codigoUrl);
    }
  }, [codigoUrl]);

  const consultar = async (cod: string) => {
    if (!cod.trim()) return;
    setCarregando(true);
    setBuscado(true);
    try {
      const res = await api.certificados.obterPorCodigo(cod);
      setCertificado(res);
    } catch (e) {
      console.error(e);
      setCertificado(null);
    } finally {
      setCarregando(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    consultar(codigoInput);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar à plataforma</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block">
          Portal Oficial de Autenticidade
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Validação Pública de Certificados
        </h1>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
          Consulte e confirme a legitimidade de certificados institucionais emitidos pela {brandConfig.nomeCompleto} sem necessidade de autenticação.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label htmlFor="input-codigo" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Digite o Código de Autenticação do Certificado (presente no anverso ou QR code):
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative w-full">
              <input
                id="input-codigo"
                type="text"
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                placeholder="Ex: SEMOB-2026-X89J-4712"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm tracking-wider uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={carregando || !codigoInput.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs md:text-sm shadow-xs transition-colors whitespace-nowrap"
            >
              {carregando ? 'Verificando...' : 'Verificar Certificado'}
            </button>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
            <span>Dica para teste de homologação: utilize a chave de exemplo acima.</span>
            <button
              type="button"
              onClick={() => {
                setCodigoInput('SEMOB-2026-X89J-4712');
                consultar('SEMOB-2026-X89J-4712');
              }}
              className="text-blue-600 hover:underline"
            >
              Inserir chave de exemplo
            </button>
          </div>
        </form>
      </div>

      {/* Verification Result */}
      {buscado && (
        <div className="space-y-4 animate-in fade-in">
          {certificado ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                {certificado.status === 'anulado' ? (
                  <AlertOctagon className="w-8 h-8 text-rose-600 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                )}
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                    Resultado da Auditoria Governamental
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {certificado.status === 'anulado'
                      ? 'CERTIFICADO REGISTRADO, PORÉM OFICIALMENTE ANULADO'
                      : 'DOCUMENTO AUTÊNTICO E HOMOLOGADO'}
                  </h3>
                </div>
              </div>

              {/* Certificate details table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500 block">Nome do Aluno / Formando:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                    {certificado.alunoNome}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    CPF: {certificado.alunoCpfMascarado}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500 block">Número do Processo SEI:</span>
                  <span className="font-bold font-mono text-slate-900 dark:text-slate-100 text-sm">
                    {certificado.processoSei}
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Carga Horária: {certificado.cargaHoraria} horas
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500 block">Trilha de Formação Técnica:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {certificado.trilhaTitulo}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-[11px] text-slate-500 block">Data de Emissão Oficial:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
                    {certificado.dataEmissao}
                  </span>
                  <span className="text-[11px] text-slate-500 block">Validade: Permanente</span>
                </div>
              </div>

              {/* Signatures verified */}
              <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-200/60 dark:border-blue-900/40 text-xs space-y-2">
                <span className="font-semibold text-blue-900 dark:text-blue-200 block">
                  Assinaturas Digitais Institucionais Verificadas:
                </span>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  <li>· {certificado.assinaturaSubsecretario.nome} ({certificado.assinaturaSubsecretario.cargo})</li>
                  <li>· {certificado.assinaturaSupervisor.nome} ({certificado.assinaturaSupervisor.cargo})</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center space-y-3">
              <AlertOctagon className="w-10 h-10 text-rose-500 mx-auto" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Nenhum certificado encontrado com o código informado
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Verifique se o código foi digitado corretamente, respeitando hifens e letras. Se o erro persistir, solicite novo envio ao formando.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
