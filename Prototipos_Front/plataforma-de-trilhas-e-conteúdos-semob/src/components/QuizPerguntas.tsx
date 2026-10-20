import React, { useState } from 'react';
import { QuizData } from '../types';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, AlertCircle, HelpCircle } from 'lucide-react';

interface QuizPerguntasProps {
  quiz: QuizData;
  onConcluir: (nota: number, aprovado: boolean) => void;
}

export const QuizPerguntas: React.FC<QuizPerguntasProps> = ({ quiz, onConcluir }) => {
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [alternativaSelecionada, setAlternativaSelecionada] = useState<string | null>(null);
  const [respostaConfirmada, setRespostaConfirmada] = useState(false);
  const [finalizado, setFinalizado] = useState(false);
  const [historicoTentativas, setHistoricoTentativas] = useState<{ tentativa: number; nota: number }[]>([]);

  const perguntaAtual = quiz.perguntas[indiceAtual];
  const totalPerguntas = quiz.perguntas.length;

  const handleConfirmar = () => {
    if (!alternativaSelecionada) return;
    setRespostas(prev => ({ ...prev, [perguntaAtual.id]: alternativaSelecionada }));
    setRespostaConfirmada(true);
  };

  const handleProxima = () => {
    if (indiceAtual + 1 < totalPerguntas) {
      setIndiceAtual(prev => prev + 1);
      setAlternativaSelecionada(null);
      setRespostaConfirmada(false);
    } else {
      // Finalize quiz
      let acertos = 0;
      quiz.perguntas.forEach(p => {
        if (respostas[p.id] === p.alternativaCorretaId || (p.id === perguntaAtual.id && alternativaSelecionada === p.alternativaCorretaId)) {
          acertos++;
        }
      });
      const notaCalculada = Math.round((acertos / totalPerguntas) * 100);
      const isAprovado = notaCalculada >= quiz.notaMinima;
      setHistoricoTentativas(prev => [...prev, { tentativa: prev.length + 1, nota: notaCalculada }]);
      setFinalizado(true);
      onConcluir(notaCalculada, isAprovado);
    }
  };

  const reiniciarQuiz = () => {
    setIndiceAtual(0);
    setRespostas({});
    setAlternativaSelecionada(null);
    setRespostaConfirmada(false);
    setFinalizado(false);
  };

  if (finalizado) {
    let acertos = 0;
    quiz.perguntas.forEach(p => {
      if (respostas[p.id] === p.alternativaCorretaId) acertos++;
    });
    const notaCalculada = Math.round((acertos / totalPerguntas) * 100);
    const aprovado = notaCalculada >= quiz.notaMinima;

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto">
            {aprovado ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {aprovado ? 'Parabéns! Etapa de Quiz Aprovada' : 'Quase lá! Tente novamente sem medo'}
          </h3>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {aprovado
              ? `Você alcançou ${notaCalculada}% de aproveitamento (mínimo de ${quiz.notaMinima}% exigido pela SEMOB). Seu progresso foi atualizado!`
              : `Você alcançou ${notaCalculada}%. Na SEMOB o erro faz parte do aprendizado técnico. Você pode revisar as respostas abaixo e tentar novamente com tentativas ilimitadas.`}
          </p>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Nota Obtida</span>
            <span className="text-lg md:text-xl font-bold font-mono text-slate-900 dark:text-slate-100">{notaCalculada}%</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Acertos</span>
            <span className="text-lg md:text-xl font-bold font-mono text-slate-900 dark:text-slate-100">{acertos}/{totalPerguntas}</span>
          </div>
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider block">Nota Mínima</span>
            <span className="text-lg md:text-xl font-bold font-mono text-slate-900 dark:text-slate-100">{quiz.notaMinima}%</span>
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Revisão das Questões e Justificativas Técnicas:
          </h4>
          <div className="space-y-4">
            {quiz.perguntas.map((p, idx) => {
              const respEscolhida = respostas[p.id];
              const acertou = respEscolhida === p.alternativaCorretaId;
              const altEscolhidaObj = p.alternativas.find(a => a.id === respEscolhida);
              const altCorretaObj = p.alternativas.find(a => a.id === p.alternativaCorretaId);

              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border text-xs space-y-2 ${
                    acertou
                      ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20'
                      : 'border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {acertou ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {idx + 1}. {p.enunciado}
                      </span>
                      <div className="mt-1 text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Sua resposta:</span> {altEscolhidaObj?.texto || 'Não respondida'}
                      </div>
                      {!acertou && (
                        <div className="mt-1 text-emerald-700 dark:text-emerald-400 font-medium">
                          Resposta esperada: {altCorretaObj?.texto}
                        </div>
                      )}
                      <div className="mt-2 p-2 bg-white/80 dark:bg-slate-900/80 rounded border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">Por que: </span>
                        {altCorretaObj?.explicacao}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={reiniciarQuiz}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Tentar Novamente (Tentativa {historicoTentativas.length + 1})
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 md:p-8 space-y-6">
      {/* Header with step progress */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            Questão {indiceAtual + 1} de {totalPerguntas}
          </span>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {perguntaAtual.conceitoChave}
          </h3>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 font-mono">Nota mínima: {quiz.notaMinima}%</span>
        </div>
      </div>

      {/* Question prompt */}
      <div className="space-y-3">
        <p className="text-sm md:text-base font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
          {perguntaAtual.enunciado}
        </p>
      </div>

      {/* Alternatives */}
      <fieldset className="space-y-2.5">
        <legend className="sr-only">Selecione uma alternativa</legend>
        {perguntaAtual.alternativas.map((alt) => {
          const isSelected = alternativaSelecionada === alt.id;
          const isCorrect = alt.id === perguntaAtual.alternativaCorretaId;

          let cardStyle = 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900';
          if (isSelected && !respostaConfirmada) {
            cardStyle = 'border-blue-600 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 ring-1 ring-blue-500/20';
          } else if (respostaConfirmada) {
            if (isCorrect) {
              cardStyle = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100';
            } else if (isSelected && !isCorrect) {
              cardStyle = 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100';
            }
          }

          return (
            <div key={alt.id} className="space-y-1.5">
              <label
                className={`flex items-start gap-3 p-3.5 md:p-4 rounded-xl border text-xs md:text-sm cursor-pointer transition-colors ${cardStyle}`}
              >
                <input
                  type="radio"
                  name={`pergunta-${perguntaAtual.id}`}
                  value={alt.id}
                  checked={isSelected}
                  disabled={respostaConfirmada}
                  onChange={() => !respostaConfirmada && setAlternativaSelecionada(alt.id)}
                  className="mt-0.5 text-blue-600 focus:ring-blue-500 shrink-0"
                />
                <span className="leading-relaxed">{alt.texto}</span>
              </label>

              {/* Instant feedback explanation per alternative when confirmed */}
              {respostaConfirmada && (isSelected || isCorrect) && (
                <div
                  className={`p-3 rounded-lg text-xs leading-relaxed ${
                    isCorrect
                      ? 'bg-emerald-100/70 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200'
                      : 'bg-rose-100/70 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200'
                  }`}
                >
                  <span className="font-semibold block mb-0.5">
                    {isCorrect ? 'Explicação da alternativa correta:' : 'Por que esta opção não está adequada:'}
                  </span>
                  {alt.explicacao}
                </div>
              )}
            </div>
          );
        })}
      </fieldset>

      {/* Action controls */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" />
          Tentativas ilimitadas
        </span>

        {!respostaConfirmada ? (
          <button
            onClick={handleConfirmar}
            disabled={!alternativaSelecionada}
            className="px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            Confirmar Resposta
          </button>
        ) : (
          <button
            onClick={handleProxima}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs md:text-sm font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            <span>{indiceAtual + 1 < totalPerguntas ? 'Próxima Questão' : 'Ver Resultado Final'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
