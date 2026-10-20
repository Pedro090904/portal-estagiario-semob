/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  Printer,
  Download,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Certificate } from '../../types';
import { ApiService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

export const CertificateView: React.FC = () => {
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const { showSuccess } = useNotification();

  useEffect(() => {
    async function load() {
      const data = await ApiService.getCertificateForStudent('user-pedro', 'track-interns-dev');
      if (data) setCertificate(data);
    }
    load();
  }, []);

  const handlePrint = () => {
    window.print();
    showSuccess('Janela de impressão gerada');
  };

  if (!certificate) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Certificado Ainda Não Disponível</h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
          Para emitir o certificado oficial de conclusão da trilha, você precisa concluir os 3 laboratórios práticos e ter o projeto integrador aprovado pela sua supervisora técnica.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header and Print Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 mb-1">
            <Award className="w-4 h-4" />
            <span>CREDENCIAL PROFISSIONAL VERIFICADA</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Certificado de Conclusão</h1>
          <p className="text-xs text-slate-500 mt-1">
            Emitido pela Nexora Tech Academy com verificação criptográfica de autenticidade
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handlePrint}
            variant="outline"
            size="md"
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Imprimir / Salvar PDF
          </Button>
        </div>
      </div>

      {/* Official Certificate Card (Styled to print gracefully) */}
      <div className="relative bg-white border-2 border-slate-300 rounded-3xl p-8 sm:p-14 shadow-lg text-slate-900 overflow-hidden print:border-none print:shadow-none print:p-0">
        {/* Subtle decorative security border pattern */}
        <div className="absolute inset-2 border border-slate-200 rounded-2xl pointer-events-none" />
        <div className="absolute inset-3 border border-dashed border-slate-200 rounded-xl pointer-events-none" />

        <div className="relative z-10 text-center space-y-6">
          {/* Institution Header */}
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg">
              <span className="font-mono text-indigo-400">N</span>
            </div>
            <div className="text-left">
              <span className="font-bold text-slate-900 tracking-tight text-lg block leading-none">
                NEXORA
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-500">
                Academy & Tech Lab
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
              Certificado Oficial de Capacitação Técnica
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Certificamos que
            </h2>
          </div>

          <div className="py-2 border-b-2 border-slate-900 max-w-lg mx-auto">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight">
              {certificate.studentName}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 max-w-2xl mx-auto leading-relaxed">
            concluiu com êxito todos os módulos teóricos, avaliações práticas, laboratórios técnicos de banco de dados SQL, APIs REST e interfaces acessíveis, além do projeto integrador final na
          </p>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 max-w-xl mx-auto">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              {certificate.trackTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Carga horária total comprovada: <span className="font-bold text-slate-800">{certificate.workloadHours} horas</span>
            </p>
          </div>

          {/* Competencies Validated */}
          <div className="max-w-2xl mx-auto text-left pt-2">
            <p className="text-xs font-bold text-slate-700 mb-2 text-center uppercase tracking-wider text-[11px]">
              Competências Técnicas Homologadas:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
              {certificate.competenciesSummary.map((comp, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{comp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Signatures & Authenticity hash */}
          <div className="pt-8 mt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end text-left">
            <div>
              <p className="text-[11px] text-slate-400 font-mono">CÓDIGO DE AUTENTICIDADE</p>
              <p className="font-mono font-bold text-xs text-slate-900 tracking-wider">
                {certificate.credentialCode}
              </p>
              <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                Emitido em {certificate.issuedAt}
              </p>
            </div>

            <div className="sm:text-right">
              <div className="font-serif italic text-base text-slate-800 pb-1">
                {certificate.supervisorSignature}
              </div>
              <div className="h-0.5 bg-slate-400 w-48 sm:ml-auto mb-1" />
              <p className="text-xs font-semibold text-slate-700">Homologação Técnica da Mentora</p>
              <p className="text-[10px] text-slate-500">{certificate.issuedByOrganization}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
