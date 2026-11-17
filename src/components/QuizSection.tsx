import { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/sdg2Data';

export function QuizSection() {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const answeredCount = Object.keys(answers).length;
  const totalCount = QUIZ_QUESTIONS.length;
  const correctCount = QUIZ_QUESTIONS.reduce((acc, q) => {
    return acc + (answers[q.id] === q.correctIndex ? 1 : 0);
  }, 0);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (answers[questionId] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleReset = () => {
    setAnswers({});
  };

  return (
    <section id="kuis" className="py-16 lg:py-20 border-t border-slate-200 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-medium text-emerald-700 mb-2">
              04. Uji Pemahaman Kritis
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight text-balance">
              Evaluasi Konsep Ketahanan Pangan SDG 2
            </h2>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-500">Progres & Skor</div>
              <div className="font-mono-tabular text-base font-semibold text-slate-900">
                {correctCount}/{totalCount} benar · {answeredCount}/{totalCount} terjawab
              </div>
            </div>
            {answeredCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ulangi</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {QUIZ_QUESTIONS.map((q, qIdx) => {
            const selectedOption = answers[q.id];
            const isAnswered = selectedOption !== undefined;
            const isCorrect = selectedOption === q.correctIndex;

            return (
              <article
                key={q.id}
                className="rounded-xl border border-slate-200 bg-white p-6"
              >
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-mono-tabular font-semibold text-slate-700">
                    Soal {qIdx + 1} dari {totalCount}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{q.topic}</span>
                </div>

                <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-snug mb-4">
                  {q.question}
                </h3>

                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isThisSelected = selectedOption === optIdx;
                    const isThisCorrect = optIdx === q.correctIndex;

                    let optionClass =
                      'border-slate-200 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-300';
                    if (isAnswered) {
                      if (isThisCorrect) {
                        optionClass = 'border-emerald-300 bg-emerald-50 text-emerald-950 font-medium';
                      } else if (isThisSelected && !isThisCorrect) {
                        optionClass = 'border-red-300 bg-red-50 text-red-950';
                      } else {
                        optionClass = 'border-slate-200 bg-slate-50/50 text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={isAnswered}
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors flex items-start justify-between gap-3 ${optionClass} ${
                          isAnswered ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isThisCorrect && (
                          <CheckCircle2
                            className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                        )}
                        {isAnswered && isThisSelected && !isThisCorrect && (
                          <XCircle
                            className="w-4 h-4 text-red-600 shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div
                    className={`mt-4 p-4 rounded-lg border text-sm leading-relaxed ${
                      isCorrect
                        ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                        : 'bg-amber-50/70 border-amber-200 text-slate-800'
                    }`}
                  >
                    <span className="font-semibold mr-1.5">
                      {isCorrect ? 'Jawaban Tepat:' : 'Penjelasan Konsep:'}
                    </span>
                    {q.explanation}
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {answeredCount === totalCount && (
          <div className="mt-8 rounded-xl border border-emerald-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-slate-900">
                Evaluasi Selesai: {correctCount} dari {totalCount} Soal Benar
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                {correctCount >= 4
                  ? 'Pemahamanmu tentang rantai pangan, gizi mikro, dan pertanian berkelanjutan sudah sangat kuat untuk merancang inovasi SDG 2.'
                  : 'Coba ulas kembali penjelasan tiap soal atau uji ulang skenario di simulator untuk memperdalam pemahaman sistem pangan.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Kerjakan Ulang</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
