import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Mail, ExternalLink, ShieldCheck, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PaginaAjudaSuporte: React.FC = () => {
  const { brandConfig, setIsWireframesOpen } = useApp();
  const [perguntaAberta, setPerguntaAberta] = useState<number | null>(0);

  const faqs = [
    {
      p: 'Como é calculado o progresso da minha trilha de formação?',
      r: 'O progresso é 100% honesto e reflete as etapas obrigatórias concluídas de fato (ex: 4 de 8 etapas). Para ser considerada concluída, a etapa exige marcação de leitura e aprovação no quiz (mínimo de 70%), no desafio SQL ou na entrega de código revisada pelo orientador.'
    },
    {
      p: 'O que acontece se eu errar uma pergunta no quiz?',
      r: 'Na plataforma da SEMOB, o erro é tratado como aprendizado e não como punição. Todas as alternativas oferecem explicação detalhada sobre os conceitos técnicos e você tem tentativas ilimitadas. O sistema registrará sua melhor nota alcançada.'
    },
    {
      p: 'Como funciona a emissão e validação do certificado?',
      r: 'O aluno não emite o certificado diretamente. Após o cumprimento de 100% das etapas, o orientador técnico revisa e homologa a emissão. O certificado gerado é vinculado ao número de Processo SEI oficial da SEMOB e conta com QR code e código de verificação pública sem exigência de login.'
    },
    {
      p: 'O que devo enviar na etapa de Entrega de Código?',
      r: 'Você deve submeter o link do seu Merge Request ou ramificação no GitLab institucional (ex: https://gitlab.semob.gov.br/...). O orientador avaliará os critérios de aceite descritos na etapa e registrará o parecer técnico.'
    },
    {
      p: 'Posso acessar a biblioteca sem estar matriculado na trilha?',
      r: 'Sim! A biblioteca técnica permanente (manuais de Git, convenções de código, POPs operacionais e dicionários de dados do SIT) possui leitura livre e aberta para todos os desenvolvedores e servidores.'
    }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="space-y-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Suporte e Dúvidas Frequentes
        </span>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Ajuda & Perguntas Frequentes
        </h1>
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400">
          Entenda as regras de formação, critérios de aprovação de código e certificação na {brandConfig.nomeCompleto}.
        </p>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = perguntaAberta === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-xs"
            >
              <button
                onClick={() => setPerguntaAberta(isOpen ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-xs md:text-sm font-semibold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                aria-expanded={isOpen}
              >
                <span>{faq.p}</span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-blue-600 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                  {faq.r}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact Support Box */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Ainda com dúvidas técnicas ou problemas de acesso?
          </h3>
          <p className="text-xs text-slate-500">
            Entre em contato direto com a Gerência de Tecnologia da SEMOB.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWireframesOpen(true)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Abrir Chamado [FASE 2]
          </button>
          <a
            href={`mailto:${brandConfig.suporteEmail}`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>{brandConfig.suporteEmail}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
