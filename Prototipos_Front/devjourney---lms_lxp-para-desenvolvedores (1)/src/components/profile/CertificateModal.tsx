import React, { useState } from 'react';
import { Award, CheckCircle2, Download, Share2, ShieldCheck, Check } from 'lucide-react';
import { useLMS } from '../../context/LMSContext';
import { Modal } from '../common/Modal';

export const CertificateModal: React.FC = () => {
  const { isCertificateModalOpen, setIsCertificateModalOpen, certificate } = useLMS();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `https://devjourney.app/verify/${certificate.verificationCode}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isCertificateModalOpen}
      onClose={() => setIsCertificateModalOpen(false)}
      title="Certificado de Conclusão Profissional"
      subtitle={`Código de Autenticidade: ${certificate.verificationCode}`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Certificate Printable Surface */}
        <div className="relative p-8 rounded-2xl border-4 border-double border-indigo-200 dark:border-indigo-900 bg-gradient-to-b from-white to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20 text-center space-y-6 shadow-inner print:p-0">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg">
              <Award className="w-9 h-9" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-widest font-mono text-indigo-600 dark:text-indigo-400 font-bold">
              Plataforma DevJourney · Credencial Oficial
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 dark:text-white tracking-wide">
              CERTIFICADO DE FORMAÇÃO
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
            Certificamos para os devidos fins de comprovação de proficiência técnica que
          </p>

          <div className="text-2xl sm:text-3xl font-extrabold text-indigo-900 dark:text-indigo-200 border-b-2 border-indigo-300 dark:border-indigo-700 pb-2 inline-block px-8">
            {certificate.studentName}
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            concluiu com êxito a trilha de especialização em <strong>{certificate.trackTitle}</strong> com carga horária total de <strong>{certificate.totalHours} horas</strong>, cumprindo todas as avaliações teóricas e projetos práticos com aprovação superior a 70%.
          </p>

          {/* Skills Breakdown */}
          <div className="pt-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Competências Chave Validadas:
            </div>
            <div className="flex flex-wrap justify-center gap-1.5 max-w-xl mx-auto">
              {certificate.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div className="text-left font-mono">
                <div>Hash de Verificação:</div>
                <strong className="text-slate-800 dark:text-slate-200">
                  {certificate.verificationCode}
                </strong>
              </div>
            </div>

            <div className="text-right">
              <div>Emitido em: {certificate.issueDate}</div>
              <div className="font-semibold text-slate-700 dark:text-slate-300">
                Coordenação Pedagógica DevJourney
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Link Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Copiar Link de Autenticidade</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Baixar / Imprimir Certificado</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
