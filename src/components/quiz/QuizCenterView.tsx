import React, { useState, useMemo } from 'react';
import { DAYS_DATASET } from '../../data/daysDataset';
import { CodeBlock } from '../common/CodeBlock';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { showToast } from '../common/Toast';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Eye,
  FileCode,
  Flame,
  Check
} from 'lucide-react';

interface QuizCenterViewProps {
  initialDay?: number;
}

export const QuizCenterView: React.FC<QuizCenterViewProps> = ({ initialDay = 1 }) => {
  const [selectedDay, setSelectedDay] = useState<number>(initialDay);

  // Stored quiz scores: { [day]: score }
  const [quizScores, setQuizScores] = useLocalStorage<Record<number, number>>(
    'muduo_quiz_scores',
    {}
  );

  // User's selections for current quiz: { [questionKey]: selectedOptionIndex }
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  // Revealed states for open-ended questions
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  // Current day item
  const currentDayItem = useMemo(() => {
    return DAYS_DATASET.find(d => d.day === selectedDay) || DAYS_DATASET[0];
  }, [selectedDay]);

  const quiz = currentDayItem?.quiz;

  const handleSelectOption = (qKey: string, optIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qKey]: optIdx }));
  };

  const toggleReveal = (key: string) => {
    setRevealed(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Evaluate score
  const scoreResult = useMemo(() => {
    if (!quiz) return { totalQuestions: 0, correct: 0, score: 0 };

    let total = 0;
    let correct = 0;

    // 1. Multiple choice
    (quiz.questions || []).forEach((q, idx) => {
      total++;
      if (userAnswers[`mc_${idx}`] === q.answer) {
        correct++;
      }
    });

    // 2. Code question
    if (quiz.codeQuestion) {
      total++;
      if (userAnswers['code_q'] === quiz.codeQuestion.answer) {
        correct++;
      }
    }

    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { totalQuestions: total, correct, score };
  }, [quiz, userAnswers]);

  // Save score to local storage when answered
  const handleSaveScore = () => {
    setQuizScores(prev => ({ ...prev, [selectedDay]: scoreResult.score }));
    showToast(`Day ${selectedDay} 自测成绩已存档: ${scoreResult.score} 分`, 'success');
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setRevealed({});
    showToast('已重置当前测试选项', 'info');
  };

  const dayScore = quizScores[selectedDay];

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <HelpCircle size={22} />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              28 天每日深度自测中心
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            每一天均配备 5 维结构化自测（基础单选、代码辨析、原理深度、Muduo机制与编码手写），闭环检验学习成效。
          </p>
        </div>

        {/* Current Day Score Badge */}
        {dayScore !== undefined && (
          <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <div className="text-center">
              <div
                className={`text-xl font-black ${
                  dayScore >= 75
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-500'
                }`}
              >
                {dayScore} 分
              </div>
              <div className="text-[10px] text-slate-400 font-medium">历史最高成绩</div>
            </div>
          </div>
        )}
      </div>

      {/* Day Selector Pills */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-2">
        <div className="text-xs font-semibold text-slate-500">选择要测试的天数:</div>
        <div className="flex flex-wrap gap-1.5">
          {DAYS_DATASET.map(d => {
            const isSelected = d.day === selectedDay;
            const score = quizScores[d.day];
            return (
              <button
                key={d.day}
                onClick={() => {
                  setSelectedDay(d.day);
                  setUserAnswers({});
                  setRevealed({});
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <span>D{d.day}</span>
                {score !== undefined && (
                  <span
                    className={`text-[9px] px-1 rounded ${
                      score >= 75 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {score}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Quiz Area */}
      {!quiz ? (
        <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
          该天暂无自测题
        </div>
      ) : (
        <div className="space-y-6">
          {/* Day Title & Score Header */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400">
                Day {currentDayItem.day} 专项测试
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {currentDayItem.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold transition cursor-pointer"
                type="button"
              >
                <RotateCcw size={13} />
                <span>重置作答</span>
              </button>

              <button
                onClick={handleSaveScore}
                className="inline-flex items-center gap-1 px-4 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold transition cursor-pointer shadow-xs"
                type="button"
              >
                <Award size={13} />
                <span>存档成绩 ({scoreResult.score}分)</span>
              </button>
            </div>
          </div>

          {/* Part 1: Multiple Choice Questions */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-sky-600" />
              第一部分：基础概念与单选题 (共 {quiz.questions?.length || 0} 题)
            </h3>

            {(quiz.questions || []).map((q, qIdx) => {
              const qKey = `mc_${qIdx}`;
              const selectedOpt = userAnswers[qKey];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.answer;

              return (
                <div
                  key={q.id || qIdx}
                  className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                      {q.question}
                    </h4>
                  </div>

                  {/* Options */}
                  <div className="space-y-2 pl-8">
                    {q.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isOptionCorrect = optIdx === q.answer;

                      let btnStyle =
                        'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-sky-400 text-slate-800 dark:text-slate-200';

                      if (isAnswered) {
                        if (isOptionCorrect) {
                          btnStyle =
                            'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold';
                        } else if (isOptionSelected) {
                          btnStyle =
                            'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(qKey, optIdx)}
                          className={`w-full text-left p-3 rounded-xl border transition text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                          type="button"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {isAnswered && (
                            <div>
                              {isOptionCorrect && (
                                <CheckCircle2 size={16} className="text-emerald-500" />
                              )}
                              {!isOptionCorrect && isOptionSelected && (
                                <XCircle size={16} className="text-rose-500" />
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  {isAnswered && (
                    <div
                      className={`ml-8 p-3 rounded-xl text-xs leading-relaxed border ${
                        isCorrect
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-300'
                          : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-300'
                      }`}
                    >
                      <div className="font-bold mb-1">
                        {isCorrect ? '✓ 回答正确！解析：' : '✕ 回答错误。解析：'}
                      </div>
                      <div>{q.explanation}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Part 2: Code Comprehension Question */}
          {quiz.codeQuestion && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode size={15} className="text-emerald-600" />
                第二部分：C++ 代码阅读与辨析
              </h3>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                  {quiz.codeQuestion.question}
                </h4>

                <CodeBlock
                  code={quiz.codeQuestion.code}
                  language="cpp"
                  maxHeight="max-h-[300px]"
                />

                {/* Choices */}
                <div className="space-y-2">
                  {quiz.codeQuestion.options.map((opt, optIdx) => {
                    const isOptionSelected = userAnswers['code_q'] === optIdx;
                    const isOptionCorrect = optIdx === quiz.codeQuestion!.answer;
                    const isAnswered = userAnswers['code_q'] !== undefined;

                    let btnStyle =
                      'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-sky-400 text-slate-800 dark:text-slate-200';

                    if (isAnswered) {
                      if (isOptionCorrect) {
                        btnStyle =
                          'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold';
                      } else if (isOptionSelected) {
                        btnStyle =
                          'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-800 dark:text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption('code_q', optIdx)}
                        className={`w-full text-left p-3 rounded-xl border transition text-xs sm:text-sm flex items-center justify-between gap-3 cursor-pointer ${btnStyle}`}
                        type="button"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-[11px] font-mono font-bold flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isAnswered && isOptionCorrect && (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {userAnswers['code_q'] !== undefined && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <span className="font-bold">解析: </span>
                    {quiz.codeQuestion.explanation}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Part 3: Why Deep Concept */}
          {quiz.whyQuestion && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Flame size={15} className="text-amber-500" />
                第三部分：底层机制与深度“为什么”
              </h3>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                  {quiz.whyQuestion.question}
                </h4>

                {quiz.whyQuestion.keywords && (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs">
                    <span className="text-slate-400">思考提示关键词:</span>
                    {quiz.whyQuestion.keywords.map((kw, kwIdx) => (
                      <span
                        key={kwIdx}
                        className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 text-[11px] font-semibold"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => toggleReveal('why')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                    type="button"
                  >
                    <Eye size={13} />
                    <span>{revealed['why'] ? '收起参考答案' : '查看标准参考答案'}</span>
                  </button>

                  {revealed['why'] && (
                    <div className="mt-2.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {quiz.whyQuestion.referenceAnswer}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Part 4: Muduo Question */}
          {quiz.muduoQuestion && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Award size={15} className="text-sky-600" />
                第四部分：Muduo 架构设计映射
              </h3>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                  {quiz.muduoQuestion.question}
                </h4>

                {quiz.muduoQuestion.muduoMechanism && (
                  <div className="text-xs text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/40 px-3 py-1.5 rounded-lg border border-sky-100 dark:border-sky-900/40 font-mono">
                    涉及机制: {quiz.muduoQuestion.muduoMechanism}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => toggleReveal('muduo')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                    type="button"
                  >
                    <Eye size={13} />
                    <span>{revealed['muduo'] ? '收起参考答案' : '查看源码架构解答'}</span>
                  </button>

                  {revealed['muduo'] && (
                    <div className="mt-2.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {quiz.muduoQuestion.referenceAnswer}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Part 5: Implementation Coding Prompt */}
          {quiz.implQuestion && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileCode size={15} className="text-purple-600" />
                第五部分：手写编码自测题
              </h3>

              <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                  {quiz.implQuestion.prompt}
                </h4>

                {quiz.implQuestion.testCase && (
                  <div className="text-xs font-mono text-slate-500 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    验证用例: {quiz.implQuestion.testCase}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => toggleReveal('impl')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                    type="button"
                  >
                    <Eye size={13} />
                    <span>{revealed['impl'] ? '收起参考实现' : '查看参考 C++ 实现'}</span>
                  </button>

                  {revealed['impl'] && (
                    <div className="mt-2.5">
                      <CodeBlock
                        code={quiz.implQuestion.referenceSolution}
                        language="cpp"
                        title="参考实现"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
