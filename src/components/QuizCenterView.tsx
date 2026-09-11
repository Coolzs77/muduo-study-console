import React, { useState } from 'react';
import { CheckSquare, Eye, EyeOff, Star, HelpCircle, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { DAYS_DATASET } from '../data/muduo28Days';
import { AppState } from '../types';

interface QuizCenterViewProps {
  mastery: AppState['mastery'];
  onUpdateMastery: (day: number, level: number) => void;
  onShowToast: (msg: string) => void;
}

export const QuizCenterView: React.FC<QuizCenterViewProps> = ({
  mastery,
  onUpdateMastery,
  onShowToast,
}) => {
  const [currentDay, setCurrentDay] = useState(1);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userNote, setUserNote] = useState('');

  const currentItem = DAYS_DATASET.find(d => d.day === currentDay) || DAYS_DATASET[0];
  const currentLevel = mastery[currentDay]?.level || 0;

  const handleNextDay = () => {
    if (currentDay < 28) {
      setCurrentDay(currentDay + 1);
      setShowAnswer(false);
    }
  };

  const handlePrevDay = () => {
    if (currentDay > 1) {
      setCurrentDay(currentDay - 1);
      setShowAnswer(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 顶部控制栏与 Day 切换器 */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrevDay}
            disabled={currentDay <= 1}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-800 font-mono">
                Day {String(currentItem.day).padStart(2, '0')} 自测考场
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">
                Tier {currentItem.tier}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 font-serifHeading mt-0.5">
              {currentItem.title}
            </h3>
          </div>

          <button
            onClick={handleNextDay}
            disabled={currentDay >= 28}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 快速选择 Day 下拉框 */}
        <div className="flex items-center gap-3 text-xs font-serifMono">
          <span className="text-stone-500">跳转题库:</span>
          <select
            value={currentDay}
            onChange={(e) => {
              setCurrentDay(parseInt(e.target.value));
              setShowAnswer(false);
            }}
            className="p-2 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 cursor-pointer focus:outline-hidden"
          >
            {DAYS_DATASET.map(d => (
              <option key={d.day} value={d.day}>
                Day {String(d.day).padStart(2, '0')}: {d.tags[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 考题与自测问答核心卡片 */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
        {/* 问题 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-sky-900 font-serifHeading">
            <HelpCircle className="w-4 h-4 text-sky-700" />
            <span>今日核心深度自测题目：</span>
          </div>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/90 text-stone-900 font-serifHeading text-sm sm:text-base leading-relaxed">
            {currentItem.quizQuestion || "详细阐述本章节中的核心对象生命周期管理机制与跨线程并发保证？"}
          </div>
        </div>

        {/* 答题思考与草稿纸 */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-700 font-serifHeading flex items-center justify-between">
            <span>我的作答草稿与答题思路 (防偷看练习):</span>
            <span className="text-[11px] text-stone-400 font-serifMono">
              建议先默写出核心逻辑再看标准解析
            </span>
          </label>
          <textarea
            rows={4}
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            placeholder="在此处写下你的理解、类结构定义或核心伪代码..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-serifMono leading-relaxed focus:bg-white focus:outline-hidden focus:border-sky-500 transition"
          />
        </div>

        {/* 答案揭晓切换 */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer shadow-xs ${
              showAnswer 
                ? 'bg-stone-200 hover:bg-stone-300 text-stone-800'
                : 'bg-gradient-to-r from-sky-800 to-indigo-800 hover:from-sky-900 hover:to-indigo-900 text-white'
            }`}
          >
            {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{showAnswer ? '收起标准解析' : '揭晓大厂标准答案与原理剖析'}</span>
          </button>

          {/* 掌握度评星 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-serifHeading">自测掌握评级:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => {
                    onUpdateMastery(currentDay, star);
                    onShowToast(`已将 Day ${currentDay} 掌握度标记为 L${star} 级！`);
                  }}
                  className={`w-4 h-4 cursor-pointer transition ${
                    star <= currentLevel
                      ? 'text-amber-500 fill-amber-500'
                      : 'text-stone-300 hover:text-amber-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 标准答案展开区域 */}
        {showAnswer && (
          <div className="p-5 rounded-2xl bg-sky-50/80 border border-sky-200 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <h4 className="text-xs font-bold text-sky-900 uppercase font-serifHeading flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>标准参考答案与底层机制全景拆解：</span>
            </h4>
            <div 
              className="text-xs font-serifHeading text-stone-800 leading-relaxed space-y-2"
              dangerouslySetInnerHTML={{ __html: currentItem.quizAnswer || "暂无标准答案，请参考陈硕原书对应章节。" }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
