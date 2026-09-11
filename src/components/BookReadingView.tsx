import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Bookmark, 
  Compass, 
  FileText,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { 
  CHEN_SHUO_BOOK, 
  PRIMER_PLUS_BOOK, 
  BookSpec, 
  ChapterCheckpoint, 
  generatePdfBrowserUrl 
} from '../data/booksMapping';

interface BookReadingViewProps {
  onJumpToDay: (day: number) => void;
  onShowToast: (msg: string, success?: boolean) => void;
  readingNotes: Record<string, string>;
  onSaveReadingNote: (chapterKey: string, note: string) => void;
}

export const BookReadingView: React.FC<BookReadingViewProps> = ({
  onJumpToDay,
  onShowToast,
  readingNotes,
  onSaveReadingNote,
}) => {
  const [activeBookId, setActiveBookId] = useState<'chenshuo' | 'primer_plus'>('chenshuo');
  const [selectedChapter, setSelectedChapter] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'list' | 'readerGuide'>('list');

  const currentBook: BookSpec = activeBookId === 'chenshuo' ? CHEN_SHUO_BOOK : PRIMER_PLUS_BOOK;
  const currentChapter = currentBook.chapters.find(c => c.chapterNum === selectedChapter) || currentBook.chapters[0];

  // 1. 浏览器原生跳页 (直跳 PDF 指定页码)
  const handleJumpToPdfPage = (book: BookSpec, bookPage: number, chapterTitle: string) => {
    const jumpUrl = generatePdfBrowserUrl(book, bookPage);
    const physicalPage = bookPage + book.pageOffset;

    // 尝试在浏览器新窗口打开
    window.open(jumpUrl, '_blank');
    onShowToast(`正在浏览器中打开 ${book.title} (直跳物理页码: 第 ${physicalPage} 页)`);
  };

  // 2. 唤醒 Readest 软件并复制精准锚点
  const handleWakeReadest = (book: BookSpec, chapter: ChapterCheckpoint) => {
    const textToCopy = `《${book.title}》第 ${chapter.chapterNum} 章 ${chapter.title} (${chapter.bookPageRange})`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      // 尝试触发 Readest 自定义协议
      try {
        window.location.href = 'readest://';
      } catch (e) {
        // ignore
      }
      onShowToast(`已复制章节信息: "${textToCopy}"，已尝试呼出 Readest 阅读器！`, true);
    }).catch(() => {
      onShowToast(`已定位章节: ${chapter.title}`, true);
    });
  };

  return (
    <div className="space-y-6">
      {/* 顶部书目选择与伴读理念 */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-amber-800 font-bold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4 text-amber-600" />
              <span>Readest 伴读知识枢纽 · 章节锚定直跳</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serifHeading">
              参考书目与深度阅读流 (Reading Companion)
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 font-serifMono">
              点击任何章节页码，即可通过 <span className="font-bold text-sky-800">#page=页码</span> 在浏览器中极速直跳对应 PDF，或一键复制并唤起 <span className="font-bold text-emerald-800">Readest</span> 沉浸阅读！
            </p>
          </div>

          {/* 书籍切换开关 */}
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-xl self-start lg:self-auto font-serifHeading text-xs sm:text-sm font-bold">
            <button
              onClick={() => { setActiveBookId('chenshuo'); setSelectedChapter(1); }}
              className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
                activeBookId === 'chenshuo'
                  ? 'bg-white text-sky-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-sky-700" />
              <span>陈硕《Linux 多线程服务端编程》</span>
            </button>
            <button
              onClick={() => { setActiveBookId('primer_plus'); setSelectedChapter(9); }}
              className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
                activeBookId === 'primer_plus'
                  ? 'bg-white text-sky-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Bookmark className="w-4 h-4 text-indigo-700" />
              <span>《C++ Primer Plus 第6版》</span>
            </button>
          </div>
        </div>
      </div>

      {/* 核心双栏：左侧章节列表与页码直跳，右侧当前章节精读指南与伴读笔记 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 左侧：章节树与页码直跳卡片 */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-stone-500 font-serifHeading">
              共 {currentBook.chapters.length} 个核心专题章节
            </span>
            <span className="text-[11px] text-amber-700 font-serifMono bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              物理偏移: +{currentBook.pageOffset} 页
            </span>
          </div>

          <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
            {currentBook.chapters.map((ch) => {
              const isSelected = ch.chapterNum === currentChapter.chapterNum;
              const noteKey = `${currentBook.id}_ch${ch.chapterNum}`;
              const hasNote = !!readingNotes[noteKey];

              return (
                <div
                  key={ch.chapterNum}
                  onClick={() => setSelectedChapter(ch.chapterNum)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-white border-sky-600 shadow-md ring-1 ring-sky-500'
                      : 'bg-white/80 border-stone-200 hover:border-stone-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                          isSelected ? 'bg-sky-900 text-white' : 'bg-stone-100 text-stone-700'
                        }`}>
                          第 {ch.chapterNum} 章
                        </span>

                        {/* 点击页码直跳按钮 (高亮核心交互) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJumpToPdfPage(currentBook, ch.startPage, ch.title);
                          }}
                          className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md transition"
                          title="点击在浏览器原生打开对应 PDF 页面"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>{ch.bookPageRange}</span>
                        </button>

                        {hasNote && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-mono">
                            有笔记
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-stone-900 text-xs sm:text-sm font-serifHeading truncate">
                        {ch.title}
                      </h3>
                    </div>

                    {/* 唤醒 Readest 快速按钮 */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWakeReadest(currentBook, ch);
                      }}
                      className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-emerald-700 transition"
                      title="复制章节信息并唤起 Readest 阅读器"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 关联攻坚 Days 标签 */}
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap text-[11px] font-serifMono">
                    <span className="text-stone-400">实战打卡:</span>
                    {ch.associatedDays.map((d) => (
                      <button
                        key={d}
                        onClick={(e) => {
                          e.stopPropagation();
                          onJumpToDay(d);
                        }}
                        className="px-1.5 py-0.2 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 font-bold transition"
                      >
                        Day {String(d).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧：当前章节深度伴读指南与学习心得 */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
            {/* 章节标题与行动条 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div>
                <span className="text-xs text-sky-800 font-bold font-mono">
                  {currentBook.title} · 第 {currentChapter.chapterNum} 章
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-stone-900 font-serifHeading mt-0.5">
                  {currentChapter.title}
                </h3>
              </div>

              {/* 核心两大跳转动作按钮 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleJumpToPdfPage(currentBook, currentChapter.startPage, currentChapter.title)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>浏览器直跳 (P.{currentChapter.startPage})</span>
                </button>
                <button
                  onClick={() => handleWakeReadest(currentBook, currentChapter)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-900 hover:bg-sky-950 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>唤醒 Readest 伴读</span>
                </button>
              </div>
            </div>

            {/* 核心考点与知识纲要 */}
            <div className="py-4 space-y-3">
              <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wider font-serifHeading flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>核心必破知识要点</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentChapter.coreTopics.map((topic, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-serifHeading text-stone-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 大厂高频拷问 */}
            <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200 text-xs font-serifHeading space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-rose-800">
                <Flame className="w-4 h-4 text-rose-600" />
                <span>大厂技术专家面试核心拷问点</span>
              </div>
              <p className="text-rose-900 font-serifMono leading-relaxed">
                {currentChapter.interviewFocus}
              </p>
            </div>

            {/* 本章专属心得与 Readest 书摘归档 */}
            <div className="pt-4 mt-4 border-t border-stone-100 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5 font-serifHeading">
                  <FileText className="w-3.5 h-3.5 text-sky-700" />
                  <span>本章伴读书摘与心得思考 (自动存盘):</span>
                </label>
                <span className="text-[11px] text-stone-400 font-mono">
                  支持随时从 Readest 复制精彩书摘粘于此处
                </span>
              </div>
              <textarea
                value={readingNotes[`${currentBook.id}_ch${currentChapter.chapterNum}`] || ''}
                onChange={(e) => onSaveReadingNote(`${currentBook.id}_ch${currentChapter.chapterNum}`, e.target.value)}
                placeholder={`记录你在精读《${currentBook.title}》第 ${currentChapter.chapterNum} 章时的领悟、疑问或代码思考...`}
                rows={5}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs font-serifMono leading-relaxed focus:outline-hidden focus:border-sky-500 focus:bg-white transition"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
