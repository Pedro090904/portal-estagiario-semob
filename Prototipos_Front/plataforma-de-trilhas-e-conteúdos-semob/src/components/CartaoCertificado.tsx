import React, { useState } from 'react';
import { Certificado } from '../types';
import { useApp } from '../context/AppContext';
import { Award, QrCode, Printer, ShieldCheck, Check, AlertOctagon, RotateCw, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartaoCertificadoProps {
  certificado: Certificado;
  modoImpressao?: boolean;
}

export const CartaoCertificado: React.FC<CartaoCertificadoProps> = ({ certificado }) => {
  const { brandConfig } = useApp();
  const [lado, setLado] = useState<'frente' | 'verso'>('frente');
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = () => {
    navigator.clipboard.writeText(certificado.codigoValidacao);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleImprimir = () => {
    window.print();
  };

  const isAnulado = certificado.status === 'anulado';

  return (
    <div className="space-y-4">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl no-print text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLado('frente')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              lado === 'frente'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Frente (Certificado Oficial)
          </button>
          <button
            onClick={() => setLado('verso')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              lado === 'verso'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Verso (Ementa & Competências)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copiarCodigo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            {copiado ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            <span>{copiado ? 'Código copiado!' : 'Copiar Código'}</span>
          </button>
          <Link
            to={`/validar?codigo=${certificado.codigoValidacao}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Página Pública</span>
          </Link>
          <button
            onClick={handleImprimir}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Salvar PDF</span>
          </button>
        </div>
      </div>

      {/* Anulado warning if applicable */}
      {isAnulado && (
        <div className="p-4 rounded-xl border border-rose-300 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 flex items-start gap-3 text-xs">
          <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">CERTIFICADO OFICIALMENTE ANULADO</span>
            <p>
              Data de Anulação: {certificado.dataAnulacao} · Motivo Registrado: {certificado.motivoAnulacao || 'Revisão administrativa de conformidade.'}
            </p>
            <p className="text-[11px] text-rose-700 dark:text-rose-400">
              Conforme a regra de integridade governamental, o documento original não é deletado, permanecendo publicamente auditável com a anotação de cancelamento.
            </p>
          </div>
        </div>
      )}

      {/* Diploma Container */}
      <div className="relative bg-white dark:bg-slate-900 border-8 border-slate-200 dark:border-slate-800 rounded-3xl p-8 md:p-14 shadow-2xl overflow-hidden print:border-4 print:p-6 print:shadow-none min-h-[560px] flex flex-col justify-between">
        {/* Subtle Guilloché / Watermark effect */}
        <div className="absolute inset-0 border border-slate-300/40 dark:border-slate-700/40 m-3 rounded-2xl pointer-events-none" />

        {lado === 'frente' ? (
          <>
            {/* Top Certificate Header */}
            <div className="text-center space-y-3 relative z-10">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 mx-auto">
                <Award className="w-8 h-8 text-blue-700 dark:text-blue-400" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold block">
                  {brandConfig.nomeCompleto}
                </span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                  CERTIFICADO DE FORMAÇÃO TÉCNICA
                </h2>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-1 font-mono">
                  <span>Processo SEI: {certificado.processoSei}</span>
                  <span>·</span>
                  <span>Carga Horária: {certificado.cargaHoraria} horas</span>
                </div>
              </div>
            </div>

            {/* Certificate Body Text */}
            <div className="my-8 text-center space-y-4 max-w-2xl mx-auto relative z-10">
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-serif">
                Certificamos que o colaborador e estagiário técnico
              </p>
              <div className="border-b-2 border-slate-900/80 dark:border-slate-100/80 pb-2 inline-block px-8">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-wide font-sans">
                  {certificado.alunoNome}
                </h3>
                <span className="text-xs font-mono text-slate-500 block mt-1">
                  CPF: {certificado.alunoCpfMascarado}
                </span>
              </div>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-serif pt-2">
                concluiu com êxito todas as etapas obrigatórias da <strong className="font-semibold font-sans text-slate-900 dark:text-slate-100">{certificado.trilhaTitulo}</strong>, demonstrando competência técnica prática em desenvolvimento de software, arquitetura de sistemas de mobilidade urbana, modelagem de banco de dados e testes contínuos.
              </p>
            </div>

            {/* Bottom Signatures & QR Code */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-end relative z-10 text-xs">
              {/* Signature 1 */}
              <div className="text-center space-y-1">
                <div className="h-10 flex items-center justify-center font-serif italic text-blue-900 dark:text-blue-300 text-lg">
                  Roberto M. Vieira
                </div>
                <div className="w-48 mx-auto border-t border-slate-400 dark:border-slate-600 pt-1">
                  <span className="font-semibold block text-slate-900 dark:text-slate-100">
                    {certificado.assinaturaSubsecretario.nome}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {certificado.assinaturaSubsecretario.cargo}
                  </span>
                </div>
              </div>

              {/* QR Code and Validation Code */}
              <div className="text-center space-y-2 flex flex-col items-center">
                <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm inline-block">
                  <QrCode className="w-14 h-14 text-slate-900" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">
                    Autenticidade Verificável
                  </span>
                  <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                    {certificado.codigoValidacao}
                  </span>
                </div>
              </div>

              {/* Signature 2 */}
              <div className="text-center space-y-1">
                <div className="h-10 flex items-center justify-center font-serif italic text-blue-900 dark:text-blue-300 text-lg">
                  Carlos E. Silveira
                </div>
                <div className="w-48 mx-auto border-t border-slate-400 dark:border-slate-600 pt-1">
                  <span className="font-semibold block text-slate-900 dark:text-slate-100">
                    {certificado.assinaturaSupervisor.nome}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {certificado.assinaturaSupervisor.cargo}
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Back side (Verso) - Syllabus */
          <div className="space-y-6 relative z-10">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  Verso do Certificado Oficial
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Ementa Curricular & Competências Validadas em Produção
                </h3>
              </div>
              <span className="font-mono text-xs text-slate-500">
                Processo SEI: {certificado.processoSei}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                As etapas abaixo foram cumpridas integralmente pelo aluno com avaliação prática de código revisada por orientador técnico da SEMOB:
              </p>
              <ol className="space-y-2 text-xs md:text-sm text-slate-800 dark:text-slate-200 list-decimal list-inside leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700">
                {certificado.ementa.map((modulo, i) => (
                  <li key={i} className="pl-1">
                    {modulo}
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-semibold text-blue-900 dark:text-blue-300 block">
                Disposição Legal e Rastreabilidade Institucional:
              </span>
              <p>
                Este certificado tem validade institucional permanente e atesta a aptidão para atuação nos microsserviços do Sistema Integrado de Transporte (SIT). Sua autenticidade pode ser checada publicamente no endereço eletrônico oficial da plataforma ou pelo código de autenticação QR Code presente no anverso.
              </p>
            </div>

            <div className="flex justify-between items-center text-[11px] text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800 font-mono">
              <span>Data de Homologação: {certificado.dataEmissao}</span>
              <span>Código: {certificado.codigoValidacao}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
