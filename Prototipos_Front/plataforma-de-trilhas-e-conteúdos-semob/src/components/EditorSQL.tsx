import React, { useState } from 'react';
import { DesafioSQLData } from '../types';
import { api } from '../services/api';
import { Play, HelpCircle, CheckCircle2, AlertTriangle, Database, Code, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

interface EditorSQLProps {
  desafio: DesafioSQLData;
  onAprovado?: () => void;
}

export const EditorSQL: React.FC<EditorSQLProps> = ({ desafio, onAprovado }) => {
  const [consulta, setConsulta] = useState(desafio.consultaInicial);
  const [executando, setExecutando] = useState(false);
  const [resultado, setResultado] = useState<{
    sucesso: boolean;
    mensagem: string;
    linhasRetornadas: Record<string, any>[];
    colunas: string[];
    tempoExecucaoMs: number;
    criteriosAtendidos: { criterio: string; atendido: boolean }[];
    aprovado: boolean;
  } | null>(null);

  const [dicaNivel, setDicaNivel] = useState(0);
  const [abaSchemaAtiva, setAbaSchemaAtiva] = useState(desafio.tabelas[0]?.nome || '');
  const [mostrarEsquema, setMostrarEsquema] = useState(true);

  const simbolosRapidos = [
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'GROUP BY', 'HAVING', 'ORDER BY DESC', 'COUNT(*)', 'MAX()', 'AND'
  ];

  const inserirTextoNoEditor = (texto: string) => {
    setConsulta(prev => prev + ' ' + texto + ' ');
  };

  const handleExecutar = async () => {
    setExecutando(true);
    try {
      const res = await api.desafioSQL.executar(desafio.id, consulta);
      setResultado(res);
      if (res.aprovado && onAprovado) {
        onAprovado();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setExecutando(false);
    }
  };

  const revelarProximaDica = () => {
    if (dicaNivel < desafio.dicas.length) {
      setDicaNivel(prev => prev + 1);
    }
  };

  const redefinirConsulta = () => {
    setConsulta(desafio.consultaInicial);
    setResultado(null);
  };

  const carregarSolucaoModelo = () => {
    setConsulta(desafio.consultaEsperada);
  };

  return (
    <div className="space-y-6">
      {/* Context and Prompt */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm md:text-base">
              {desafio.titulo}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">PostgreSQL 16 (SIT)</span>
        </div>

        <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/40 text-xs md:text-sm text-blue-950 dark:text-blue-200 space-y-1">
          <span className="font-semibold block text-blue-800 dark:text-blue-300">Contexto Operacional SEMOB:</span>
          <p>{desafio.contextoOrganizacional}</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Enunciado da Tarefa:
          </h4>
          <p className="text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
            {desafio.enunciado}
          </p>
        </div>
      </div>

      {/* Schema Viewer (Collapsible) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <button
          onClick={() => setMostrarEsquema(prev => !prev)}
          className="w-full flex items-center justify-between px-5 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 transition-colors"
          aria-expanded={mostrarEsquema}
        >
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Esquema das Tabelas de Exemplo (Clique para {mostrarEsquema ? 'ocultar' : 'expandir'})</span>
          </div>
          {mostrarEsquema ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {mostrarEsquema && (
          <div className="p-5 space-y-4 border-t border-slate-200 dark:border-slate-800">
            {/* Tabs for tables */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
              {desafio.tabelas.map(tab => (
                <button
                  key={tab.nome}
                  onClick={() => setAbaSchemaAtiva(tab.nome)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    abaSchemaAtiva === tab.nome
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.nome}
                </button>
              ))}
            </div>

            {/* Active Table Details */}
            {desafio.tabelas.filter(t => t.nome === abaSchemaAtiva).map(tab => (
              <div key={tab.nome} className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {tab.descricao}
                </p>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                        <th className="p-2.5">Coluna</th>
                        <th className="p-2.5">Tipo</th>
                        <th className="p-2.5">Chaves</th>
                        <th className="p-2.5">Descrição</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-mono text-[11px]">
                      {tab.colunas.map((col, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                          <td className="p-2 font-semibold text-blue-600 dark:text-blue-400">{col.nome}</td>
                          <td className="p-2 text-slate-500">{col.tipo}</td>
                          <td className="p-2">
                            {col.chavePrimaria && <span className="text-amber-600 font-bold">PK</span>}
                            {col.chaveEstrangeira && <span className="text-emerald-600">FK → {col.chaveEstrangeira}</span>}
                          </td>
                          <td className="p-2 font-sans text-slate-600 dark:text-slate-400">{col.descricao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SQL Editor Area */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-3 p-4 md:p-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Code className="w-4 h-4 text-blue-600" />
            <span>Editor SQL Interativo</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={redefinirConsulta}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 px-2 py-1 rounded"
              title="Voltar à consulta inicial"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="hidden sm:inline">Restaurar</span>
            </button>
            <button
              onClick={carregarSolucaoModelo}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-2 py-1"
              title="Carregar consulta modelo para demonstração rápida"
            >
              Carregar Solução Modelo
            </button>
          </div>
        </div>

        {/* Mobile quick keyword bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium mr-1">Atalhos:</span>
          {simbolosRapidos.map((sym) => (
            <button
              key={sym}
              type="button"
              onClick={() => inserirTextoNoEditor(sym)}
              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded text-[11px] font-mono text-slate-700 dark:text-slate-300 transition-colors whitespace-nowrap"
            >
              {sym}
            </button>
          ))}
        </div>

        {/* Textarea code editor with high contrast and tab stop */}
        <div className="relative">
          <textarea
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
            rows={7}
            aria-label="Editor de código SQL"
            className="w-full font-mono text-xs md:text-sm p-4 bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed resize-y selection:bg-blue-600 selection:text-white"
            placeholder="Digite sua consulta SQL aqui..."
            spellCheck={false}
          />
        </div>

        {/* Action button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={revelarProximaDica}
              disabled={dicaNivel >= desafio.dicas.length}
              className="inline-flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400 hover:underline disabled:opacity-40"
            >
              <HelpCircle className="w-4 h-4" />
              <span>
                {dicaNivel === 0
                  ? 'Pedir Dica (1 de 3)'
                  : dicaNivel < desafio.dicas.length
                  ? `Próxima Dica (${dicaNivel + 1} de ${desafio.dicas.length})`
                  : 'Todas as dicas foram reveladas'}
              </span>
            </button>
          </div>

          <button
            onClick={handleExecutar}
            disabled={executando || !consulta.trim()}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs md:text-sm shadow transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{executando ? 'Executando no banco...' : 'Executar Consulta SQL'}</span>
          </button>
        </div>

        {/* Stepwise hints display */}
        {dicaNivel > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            {desafio.dicas.slice(0, dicaNivel).map((dica, i) => (
              <div key={i} className="p-3 bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-lg text-xs text-amber-900 dark:text-amber-200">
                <span className="font-semibold block mb-0.5">Dica {i + 1}:</span>
                {dica}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Execution Results & Verification */}
      {resultado && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-6 space-y-5">
          {/* Result Banner */}
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              resultado.aprovado
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100'
                : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-100'
            }`}
          >
            {resultado.aprovado ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h4 className="font-bold text-sm">
                {resultado.aprovado ? 'Desafio Aprovado!' : 'Consulta Executada, mas incompleta'}
              </h4>
              <p className="text-xs leading-relaxed">{resultado.mensagem}</p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono pt-1">
                Tempo de execução: {resultado.tempoExecucaoMs}ms · {resultado.linhasRetornadas.length} linhas retornadas
              </div>
            </div>
          </div>

          {/* Checklist of success criteria */}
          <div className="space-y-2">
            <h5 className="text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Verificação dos Critérios do Enunciado:
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {resultado.criteriosAtendidos.map((c, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border ${
                    c.atendido
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {c.atendido ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{c.criterio}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Table of query results */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Tabela de Saída do Banco de Dados:
              </span>
              <span className="text-slate-500 font-mono text-[11px]">
                {resultado.linhasRetornadas.length} registros encontrados
              </span>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
                    {resultado.colunas.map(col => (
                      <th key={col} className="p-3 font-semibold uppercase tracking-wider">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {resultado.linhasRetornadas.map((linha, lIdx) => (
                    <tr key={lIdx} className="hover:bg-slate-50 dark:hover:bg-slate-850">
                      {resultado.colunas.map(col => (
                        <td key={col} className="p-3 whitespace-nowrap">
                          {String(linha[col] ?? '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
