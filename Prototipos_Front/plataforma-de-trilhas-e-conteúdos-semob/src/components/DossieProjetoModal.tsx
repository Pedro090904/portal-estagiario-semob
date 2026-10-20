import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, FileText, CheckCircle2, Shield, Eye, Smartphone, Laptop, Sparkles, BookOpen } from 'lucide-react';

export const DossieProjetoModal: React.FC = () => {
  const { isDossierOpen, setIsDossierOpen } = useApp();
  const [abaAtiva, setAbaAtiva] = useState<'parte1' | 'parte2' | 'parte3' | 'parte4' | 'parte5'>('parte1');

  if (!isDossierOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossie-titulo"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-in fade-in"
      onClick={() => setIsDossierOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
                Entrega do Time Sênior de Produto, UX e Front-end
              </span>
              <h2 id="dossie-titulo" className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">
                Dossiê Completo de Estratégia, Design System e Especificação
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsDossierOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-lg"
            aria-label="Fechar dossiê de projeto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (5 Parts) */}
        <div className="flex items-center gap-1 px-6 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setAbaAtiva('parte1')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              abaAtiva === 'parte1'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Parte 1: Estratégia & Fluxos
          </button>
          <button
            onClick={() => setAbaAtiva('parte2')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              abaAtiva === 'parte2'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Parte 2: Design System & Telas
          </button>
          <button
            onClick={() => setAbaAtiva('parte3')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              abaAtiva === 'parte3'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Parte 3: Biblioteca & Wireframes FASE 2
          </button>
          <button
            onClick={() => setAbaAtiva('parte4')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              abaAtiva === 'parte4'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Parte 4: Código React & Rotas
          </button>
          <button
            onClick={() => setAbaAtiva('parte5')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              abaAtiva === 'parte5'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Parte 5: Validação WCAG & Métricas
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-6 text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
          {abaAtiva === 'parte1' && (
            <div className="space-y-5">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  1. Suposições Assumidas (Diretrizes de Execução)
                </h3>
                <ul className="list-disc list-inside space-y-1.5 pl-2 text-slate-600 dark:text-slate-300">
                  <li><strong>Público Iniciante:</strong> Estagiários sem bagagem prévia de terminal ou bancos relacionais precisam de termos explicados na primeira ocorrência com glossário interativo por toque/teclado.</li>
                  <li><strong>Contrato com Backend NestJS:</strong> O front-end consome uma camada de serviço tipada com exatamente as mesmas assinaturas que os endpoints REST/JSON definitivos terão.</li>
                  <li><strong>Processo SEI:</strong> O certificado oficial é emitido pelo supervisor técnico e subsecretário com número de processo SEI institucional para validade jurídica e consulta pública sem login por QR code.</li>
                </ul>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  2. Comparativo das Duas Direções Visuais
                </h3>
                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold">
                        <th className="p-3">Critério de Avaliação</th>
                        <th className="p-3">Direção A: Institucional e Sóbria (RECOMENDADA)</th>
                        <th className="p-3">Direção B: Produto / Gamificada Estilo Duolingo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      <tr>
                        <td className="p-3 font-semibold">Clareza Cognitiva</td>
                        <td className="p-3 text-emerald-700 dark:text-emerald-400 font-medium">Alta: Foco na próxima etapa, honestidade sem enrolação.</td>
                        <td className="p-3">Média: Distração por elementos lúdicos e badges artificiais.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Sobriedade Órgão Público</td>
                        <td className="p-3 text-emerald-700 dark:text-emerald-400 font-medium">Excelente: Alinhada a processos SEI, normas e seriedade pública.</td>
                        <td className="p-3">Baixa: Aspecto infantilizado não adequado ao ambiente de estágio.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Acessibilidade WCAG AA</td>
                        <td className="p-3 text-emerald-700 dark:text-emerald-400 font-medium">Nativa: Contraste &gt; 4.5:1, foco visível, alvos &gt; 44px.</td>
                        <td className="p-3">Complexa: Selos coloridos dificultam conformidade sem cor única.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold">Custo de Implementação</td>
                        <td className="p-3 text-emerald-700 dark:text-emerald-400 font-medium">Baixo/Médio: Tokens reutilizáveis e design white-label limpo.</td>
                        <td className="p-3">Alto: Ilustrações sob demanda e animações de mascote.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-slate-500 italic">
                  <strong>Justificativa da Recomendação:</strong> A Direção Institucional e Sóbria foi a escolhida pois garante autoridade governamental, atende perfeitamente ao estagiário sem experiência em TI e viabiliza a replicação white-label por outros órgãos públicos.
                </p>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  3. Os 10 Fluxos Principais Mapeados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">1. Primeiro acesso do estagiário com escolha de trilha</div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">2. Ciclo de leitura com marcação de leitura honesta</div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">3. Desafio SQL com execução e comparação de dados</div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">4. Entrega de código via GitLab e histórico de feedback</div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">5. Emissão institucional de certificado com validação</div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">6. Anulação com motivo sem deletar o histórico</div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">7. Publicação de conteúdo com rascunho e prévia</div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">8. Consulta pública sem login por QR code ou chave</div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">9. Busca global na biblioteca por atalho Ctrl+K</div>
                  <div className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-lg">10. Aviso de conteúdo atualizado durante a trilha</div>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'parte2' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Sistema de Design Tokens & Anti-Slop Discipline
              </h3>
              <p>
                O design system foi rigorosamente construído respeitando as regras universais de design:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Zero-Pill Discipline</span>
                  <p className="text-slate-500">Metadados são renderizados como texto limpo desencaixado com separadores sutis (·), sem cápsulas estáticas ou efeito arco-íris.</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Regra 60-30-10 de Cores</span>
                  <p className="text-slate-500">60% canvas neutro sofisticado, 30% superfícies estruturais com bordas hairline, 10% foco acentuado em botões de ação e tabs ativas.</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Tipografia 2+1</span>
                  <p className="text-slate-500">Plus Jakarta Sans (Display e Corpo) + JetBrains Mono (código SQL, terminal e números tabulares tabular-nums).</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Status Sem Dependência de Cor Única</span>
                  <p className="text-slate-500">Todos os estados de aprovação, revisão e erro incluem obrigatoriamente ícone semântico e texto explicativo claro.</p>
                </div>
              </div>
            </div>
          )}

          {abaAtiva === 'parte3' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Telas da Biblioteca, Públicas e Wireframes de Fase Futura
              </h3>
              <p>
                As telas de FASE 2 e FUTURO (como a Trilha de Secretaria com processos SEI, o Painel de Competências do Aluno e o Editor de Conteúdo por Blocos) estão modeladas em wireframe de alta fidelidade sem complicar ou poluir o núcleo operacional do MVP.
              </p>
              <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-900 space-y-2 text-xs">
                <span className="font-semibold text-blue-900 dark:text-blue-200">
                  Você pode abrir o Visualizador de Wireframes clicando no botão "Wireframes FASE 2" na barra superior da aplicação.
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  Lá estão demonstradas as telas conceituais de competências por cores, abertura de chamados técnicos de suporte e publicação administrativa por blocos.
                </p>
              </div>
            </div>
          )}

          {abaAtiva === 'parte4' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Arquitetura de Código React & Roteamento
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li><code>/src/context/AppContext.tsx</code>: Gerencia tema claro/escuro, marca white-label, controle de perfis e estado reativo.</li>
                <li><code>/src/services/api.ts</code>: Camada de serviço desacoplada simulando endpoints NestJS com tipagem estrita TypeScript.</li>
                <li><code>/src/components/*</code>: 9 componentes essenciais modulares com foco em acessibilidade e responsividade mobile-first.</li>
                <li><code>/src/pages/*</code>: Telas completas cobrindo Início do Aluno, Detalhe de Trilha, Leitor de Aula, Quiz, Desafio SQL, Entrega GitLab, Biblioteca, Certificados, Validador Público, Painel do Supervisor e Painel do Administrador.</li>
              </ul>
            </div>
          )}

          {abaAtiva === 'parte5' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Checklist de Acessibilidade WCAG 2.1 AA & Métricas de Sucesso
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Navegação por Teclado:</strong> Foco visível com anéis de alto contraste e navegação ordenada por tabs em todas as telas.</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Alvos de Toque Mobile &gt;= 44px:</strong> Todos os botões, checkboxes e seletores atendem à área de toque confortável para polegar.</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Progresso Honesto:</strong> Etapas mostradas sempre como "X de Y concluídas", sem porcentagens artificiais que enganem o aluno.</span>
                </div>
                <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Métricas de Acompanhamento:</strong> Taxa de conclusão por etapa, índice de abandono por aula técnica e tempo de revisão do orientador.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between text-xs">
          <span className="text-slate-500">Documento de conformidade com o briefing SEMOB</span>
          <button
            onClick={() => setIsDossierOpen(false)}
            className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors"
          >
            Entendido, Explorar Interface
          </button>
        </div>
      </div>
    </div>
  );
};
