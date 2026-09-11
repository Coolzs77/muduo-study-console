// ==========================================================================
// muduo C++ 工业实战个人控制台 - 权威参考书目与 Readest 伴读流集成
// 深度绑定 E:\workspace\C++_learning\ 书目与 E:\soft\Readest 桌面客户端
// ==========================================================================

const BOOKS_CONFIG = {
    chenShuo: {
        id: 'chenShuo',
        title: 'Linux 多线程服务端编程：使用 muduo C++ 网络库',
        shortTitle: '陈硕《Linux多线程服务端编程》',
        author: '陈硕',
        fileName: 'Linux 多线程服务端编程 使用muduo C++网络库 (陈硕) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
        systemPath: 'E:\\workspace\\C++_learning\\Linux 多线程服务端编程 使用muduo C++网络库 (陈硕) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
        fileUri: 'file:///E:/workspace/C++_learning/' + encodeURIComponent('Linux 多线程服务端编程 使用muduo C++网络库 (陈硕) (z-library.sk, 1lib.sk, z-lib.sk).pdf'),
        totalPages: 607,
        pageOffset: 23, // 印刷 P.1 对应 PDF 物理 P.24 (23页前言与目录)
        chapters: [
            { id: 1, title: '第 1 章：线程安全的对象生命周期管理', bookRange: 'P.1 ~ 38', startPage: 1, coreTopic: 'shared_ptr / weak_ptr 解决析构竞态' },
            { id: 2, title: '第 2 章：线程同步精要：互斥器与条件变量', bookRange: 'P.39 ~ 64', startPage: 39, coreTopic: 'RAII 互斥锁、避免死锁原则' },
            { id: 3, title: '第 3 章：多线程服务端的进程与线程模型', bookRange: 'P.65 ~ 92', startPage: 65, coreTopic: 'One Loop Per Thread + 线程池' },
            { id: 4, title: '第 4 章：C++ 多线程系统编程实践与避坑', bookRange: 'P.93 ~ 138', startPage: 93, coreTopic: '编译警告、线程私有数据与安全日志' },
            { id: 6, title: '第 6 章：muduo 网络库设计动机与总体架构', bookRange: 'P.161 ~ 220', startPage: 161, coreTopic: 'Reactor 反应堆核心演进与事件驱动' },
            { id: 7, title: '第 7 章：muduo 编程实战与示例剖析', bookRange: 'P.221 ~ 254', startPage: 221, coreTopic: 'Echo, Chargen, Time 等网络协议实战' },
            { id: 8, title: '第 8 章：muduo 网络库核心源码深度剖析', bookRange: 'P.255 ~ 336', startPage: 255, coreTopic: 'Channel, EventLoop, Poller, TcpServer 全源码' },
            { id: 9, title: '第 9 章：muduo 核心网络组件与设计细节', bookRange: 'P.337 ~ 398', startPage: 337, coreTopic: 'Buffer 环形缓冲、定时器队列、Connector' }
        ]
    },
    primerPlus: {
        id: 'primerPlus',
        title: 'C++ Primer Plus (第6版) 中文版',
        shortTitle: '《C++ Primer Plus (第6版)》',
        author: 'Stephen Prata',
        fileName: 'C++ Primer Plus：中文版（第六版） (Stephen Prata) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
        systemPath: 'E:\\workspace\\C++_learning\\C++ Primer Plus：中文版（第六版） (Stephen Prata) (z-library.sk, 1lib.sk, z-lib.sk).pdf',
        fileUri: 'file:///E:/workspace/C++_learning/' + encodeURIComponent('C++ Primer Plus：中文版（第六版） (Stephen Prata) (z-library.sk, 1lib.sk, z-lib.sk).pdf'),
        totalPages: 1400,
        pageOffset: 30, // 印刷 P.1 对应 PDF 物理 P.31 (30页前言与目录)
        chapters: [
            { id: 7, title: '第 7 章：函数 —— C++ 的编程模块', bookRange: 'P.200 ~ 254', startPage: 200, coreTopic: '函数指针、引用传参' },
            { id: 8, title: '第 8 章：函数探幽', bookRange: 'P.255 ~ 308', startPage: 255, coreTopic: '内联函数、引用变量与默认参数' },
            { id: 9, title: '第 9 章：内存模型和名称空间', bookRange: 'P.309 ~ 348', startPage: 309, coreTopic: '静态存储持续性、生存期、namespace' },
            { id: 10, title: '第 10 章：对象和类', bookRange: 'P.349 ~ 392', startPage: 349, coreTopic: '过程抽象、封装与构造析构' },
            { id: 12, title: '第 12 章：类和动态内存分配', bookRange: 'P.433 ~ 488', startPage: 433, coreTopic: '深浅拷贝、移动构造与赋值运算符' },
            { id: 13, title: '第 13 章：类继承', bookRange: 'P.489 ~ 550', startPage: 489, coreTopic: '虚函数、虚析构与动态多态' },
            { id: 16, title: '第 16 章：string 类和标准模板库 (STL)', bookRange: 'P.671 ~ 794', startPage: 671, coreTopic: 'vector, map, 迭代器与智能指针' },
            { id: 18, title: '第 18 章：探讨 C++ 新标准 (C++11)', bookRange: 'P.829 ~ 878', startPage: 829, coreTopic: '右值引用、std::move、Lambda 表达式' }
        ]
    }
};

function getBookPhysicalPage(bookKey, bookPage) {
    const cfg = BOOKS_CONFIG[bookKey] || BOOKS_CONFIG.chenShuo;
    const pageNum = parseInt(bookPage) || 1;
    return pageNum + cfg.pageOffset;
}

// 核心 PDF 直跳：智能区分本地协议与公网 HTTPS 安全沙箱
function openPdfAtPage(bookKey, bookPage) {
    const cfg = BOOKS_CONFIG[bookKey] || BOOKS_CONFIG.chenShuo;
    const pPage = getBookPhysicalPage(bookKey, bookPage);
    const targetUrl = `${cfg.fileUri}#page=${pPage}`;
    const isLocal = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (isLocal) {
        // 1. 本地环境下：动态创建真实 <a> 标签模拟点击，唤起 Edge 内置 PDF 阅读器并直达指定页码
        try {
            const a = document.createElement('a');
            a.href = targetUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            if (typeof showToast === 'function') {
                showToast(`已在 Edge 新标签页翻开《${cfg.shortTitle}》第 ${pPage} 页 (正文 P.${bookPage})`);
            }
        } catch(e) {
            window.open(targetUrl, '_blank');
        }
    } else {
        // 2. 公网 HTTPS 环境下：由于浏览器安全沙箱限制，打开本地阅读助手弹窗
        openLocalReaderModal(bookKey, bookPage, pPage);
    }
}

// 核心 Readest 桌面应用唤起：同步触发 readest:// 协议与剪贴板注入
function openInReadest(bookKey, bookPage, chapterTitle = '') {
    const cfg = BOOKS_CONFIG[bookKey] || BOOKS_CONFIG.chenShuo;
    const pPage = getBookPhysicalPage(bookKey, bookPage);
    const clipText = `【Readest 研读定位】\n书目：${cfg.title}\n章节：${chapterTitle || '核心章节'}\n正文印刷页：P.${bookPage}\nPDF 物理页：第 ${pPage} 页\n本地路径：${cfg.systemPath}`;

    // 1. 核心关键：必须在用户点击事件的同步主调用栈中执行唤起，保持浏览器用户激活态 (User Activation)
    try {
        const a = document.createElement('a');
        a.href = 'readest://';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch(e) {
        try {
            window.location.href = 'readest://';
        } catch(err) {}
    }

    // 2. 并行将研读信息写入剪贴板 (异步，不阻碍协议呼起)
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(clipText).catch(() => {});
    }

    // 3. 弹出 Toast 提示
    if (typeof showToast === 'function') {
        showToast(`已唤起 Readest！已复制《${cfg.shortTitle}》P.${bookPage} (物理第 ${pPage} 页) 到剪贴板，按 Ctrl+G 即可秒达`);
    }
}

// 打开公网 HTTPS 下的「本地阅读助手」模态框
function openLocalReaderModal(bookKey, bookPage, pPage) {
    const cfg = BOOKS_CONFIG[bookKey] || BOOKS_CONFIG.chenShuo;
    const modal = document.getElementById('local-reader-modal');
    if (!modal) {
        // 兜底降级处理
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(cfg.systemPath);
        }
        alert(`【浏览器安全拦截提示】\n出于隐私安全，现代浏览器严禁公网 HTTPS 网页直接读取本地磁盘文件 (file:///)。\n\n已将本地路径复制到您的剪贴板：\n${cfg.systemPath}\n\n推荐解决方案：\n1. 点击【呼起 Readest】使用桌面客户端阅读\n2. 在本地双击运行 index.html 享受无限制极速直跳！`);
        return;
    }

    document.getElementById('lrm-book-title').innerText = cfg.title;
    document.getElementById('lrm-page-info').innerText = `正文印刷页 P.${bookPage} ➔ 绝对物理第 ${pPage} 页 (加权偏移 +${cfg.pageOffset})`;
    document.getElementById('lrm-path-input').value = cfg.systemPath;
    document.getElementById('lrm-cmd-input').value = `start msedge "${cfg.systemPath}#page=${pPage}"`;

    // 自动复制打开命令
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(`start msedge "${cfg.systemPath}#page=${pPage}"`).catch(() => {});
    }

    // 绑定唤起 Readest 按钮
    const btnReadest = document.getElementById('lrm-btn-readest');
    if (btnReadest) {
        btnReadest.onclick = () => {
            openInReadest(bookKey, bookPage, `正文 P.${bookPage}`);
            closeLocalReaderModal();
        };
    }

    modal.classList.remove('hidden');
}

function closeLocalReaderModal() {
    document.getElementById('local-reader-modal')?.classList.add('hidden');
}

function copyLocalReaderCmd() {
    const cmd = document.getElementById('lrm-cmd-input')?.value;
    if (cmd && navigator.clipboard) {
        navigator.clipboard.writeText(cmd).then(() => {
            if (typeof showToast === 'function') showToast('已复制 Edge 打开命令！在 Win+R 运行窗口粘贴回车即可秒开！');
        });
    }
}

function copyLocalReaderPath() {
    const p = document.getElementById('lrm-path-input')?.value;
    if (p && navigator.clipboard) {
        navigator.clipboard.writeText(p).then(() => {
            if (typeof showToast === 'function') showToast('已复制本地文件完整路径！');
        });
    }
}

function extractBookPageFromDay(dayItem) {
    if (!dayItem || !dayItem.bookRange) return 255;
    const m = dayItem.bookRange.match(/P\.([0-9]+)/i);
    return m ? parseInt(m[1]) : 255;
}

function quickJumpByDay(dayNum) {
    const days = (typeof getDaysDataset === 'function' ? getDaysDataset() : (window.DAYS_DATASET || []));
    const dayItem = days.find(d => d.day === dayNum);
    const page = extractBookPageFromDay(dayItem);
    openPdfAtPage('chenShuo', page);
}

function quickReadestByDay(dayNum) {
    const days = (typeof getDaysDataset === 'function' ? getDaysDataset() : (window.DAYS_DATASET || []));
    const dayItem = days.find(d => d.day === dayNum);
    const page = extractBookPageFromDay(dayItem);
    const title = dayItem ? dayItem.title : `Day ${dayNum}`;
    openInReadest('chenShuo', page, title);
}

function renderBookReadingView() {
    const container = document.getElementById('view-reading-container');
    if (!container) return;

    container.innerHTML = `
    <div class="space-y-6">
        <!-- 头部卡片 -->
        <div class="bg-gradient-to-r from-stone-900 via-sky-950 to-stone-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-stone-800">
            <div class="relative z-10 max-w-3xl">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-mono font-bold mb-3 border border-sky-400/30">
                    <i class="fa-solid fa-book-open"></i> 双权威书目深度伴读系统
                </div>
                <h2 class="text-2xl sm:text-3xl font-bold font-serifHeading mb-3 tracking-tight">
                    陈硕《Linux 多线程服务端编程》 + 《C++ Primer Plus》伴读引擎
                </h2>
                <p class="text-xs sm:text-sm text-stone-300 font-serifMono leading-relaxed mb-6">
                    面向 muduo 核心源码攻坚，无缝衔接本地 <span class="text-sky-300 font-bold">Readest</span> 桌面阅读器与浏览器内置 PDF 阅读引擎。内置物理印刷页码偏移补正算法（陈硕 +23 页，Primer Plus +30 页），点击即可直接定位到指定页码！
                </p>

                <!-- 自定义页码极速直跳栏 -->
                <div class="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-stone-300 whitespace-nowrap">书目选择：</span>
                        <select id="jump-book-select" class="bg-stone-800 border border-stone-700 text-white rounded-xl px-3 py-2 text-xs font-serifMono focus:outline-none focus:border-sky-400">
                            <option value="chenShuo">陈硕《Linux 多线程服务端编程》(P.1~607)</option>
                            <option value="primerPlus">《C++ Primer Plus (第6版)》(P.1~1400)</option>
                        </select>
                    </div>
                    <div class="flex items-center gap-2 flex-1">
                        <input id="jump-page-input" type="number" min="1" max="1400" placeholder="输入印刷正文页码 (如 255)" class="bg-stone-800 border border-stone-700 text-white rounded-xl px-3 py-2 text-xs font-serifMono w-full focus:outline-none focus:border-sky-400">
                        <button onclick="handleCustomPageJump()" class="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-stone-950 font-bold text-xs transition shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                            <span>浏览器直跳</span>
                        </button>
                        <button onclick="handleCustomReadestJump()" class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md">
                            <i class="fa-solid fa-book-bookmark"></i>
                            <span>呼起 Readest</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 双书目大纲对照 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 陈硕 -->
            <div class="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-xl bg-sky-100 text-sky-900 flex items-center justify-center font-bold text-sm font-serifHeading">硕</span>
                        <div>
                            <h3 class="text-base font-bold text-stone-900 font-serifHeading">《Linux 多线程服务端编程》</h3>
                            <p class="text-xs text-stone-500 font-serifMono">陈硕 著 · 607 页 · 工业 Reactor 圣经</p>
                        </div>
                    </div>
                    <span class="text-xs font-mono px-2 py-1 rounded bg-sky-50 text-sky-800 border border-sky-200">偏移 +23 页</span>
                </div>

                <div class="space-y-2.5">
                    ${BOOKS_CONFIG.chenShuo.chapters.map(c => `
                        <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 hover:border-sky-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div class="space-y-0.5">
                                <div class="text-xs font-bold text-stone-800 font-serifHeading">
                                    ${c.title}
                                </div>
                                <div class="text-[11px] text-stone-500 font-serifMono">
                                    核心：${c.coreTopic}
                                </div>
                            </div>
                            <div class="flex items-center gap-2 shrink-0">
                                <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-200">${c.bookRange}</span>
                                <button onclick="openPdfAtPage('chenShuo', ${c.startPage})" class="px-2.5 py-1 rounded-lg bg-sky-900 hover:bg-sky-950 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1">
                                    <i class="fa-solid fa-up-right-from-square text-[10px]"></i> 直跳
                                </button>
                                <button onclick="openInReadest('chenShuo', ${c.startPage}, '${c.title}')" class="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition cursor-pointer flex items-center gap-1">
                                    Readest
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- C++ Primer Plus -->
            <div class="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div class="flex items-center gap-2">
                        <span class="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-sm font-serifHeading">普</span>
                        <div>
                            <h3 class="text-base font-bold text-stone-900 font-serifHeading">《C++ Primer Plus (第6版)》</h3>
                            <p class="text-xs text-stone-500 font-serifMono">Stephen Prata 著 · 现代 C++ 底座根基</p>
                        </div>
                    </div>
                    <span class="text-xs font-mono px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">偏移 +30 页</span>
                </div>

                <div class="space-y-2.5">
                    ${BOOKS_CONFIG.primerPlus.chapters.map(c => `
                        <div class="p-3 bg-stone-50 rounded-xl border border-stone-200 hover:border-amber-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div class="space-y-0.5">
                                <div class="text-xs font-bold text-stone-800 font-serifHeading">
                                    ${c.title}
                                </div>
                                <div class="text-[11px] text-stone-500 font-serifMono">
                                    核心：${c.coreTopic}
                                </div>
                            </div>
                            <div class="flex items-center gap-2 shrink-0">
                                <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-white text-stone-700 border border-stone-200">${c.bookRange}</span>
                                <button onclick="openPdfAtPage('primerPlus', ${c.startPage})" class="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1">
                                    <i class="fa-solid fa-up-right-from-square text-[10px]"></i> 直跳
                                </button>
                                <button onclick="openInReadest('primerPlus', ${c.startPage}, '${c.title}')" class="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold transition cursor-pointer flex items-center gap-1">
                                    Readest
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>
    `;
}

function handleCustomPageJump() {
    const bookKey = document.getElementById('jump-book-select')?.value || 'chenShuo';
    const pageVal = document.getElementById('jump-page-input')?.value;
    if (!pageVal) {
        if (typeof showToast === 'function') showToast('请输入有效的印刷正文页码', false);
        return;
    }
    openPdfAtPage(bookKey, parseInt(pageVal));
}

function handleCustomReadestJump() {
    const bookKey = document.getElementById('jump-book-select')?.value || 'chenShuo';
    const pageVal = document.getElementById('jump-page-input')?.value;
    if (!pageVal) {
        if (typeof showToast === 'function') showToast('请输入有效的印刷正文页码', false);
        return;
    }
    openInReadest(bookKey, parseInt(pageVal), `自定义精读 P.${pageVal}`);
}

window.BOOKS_CONFIG = BOOKS_CONFIG;
window.openPdfAtPage = openPdfAtPage;
window.openInReadest = openInReadest;
window.openLocalReaderModal = openLocalReaderModal;
window.closeLocalReaderModal = closeLocalReaderModal;
window.copyLocalReaderCmd = copyLocalReaderCmd;
window.copyLocalReaderPath = copyLocalReaderPath;
window.quickJumpByDay = quickJumpByDay;
window.quickReadestByDay = quickReadestByDay;
window.renderBookReadingView = renderBookReadingView;
window.handleCustomPageJump = handleCustomPageJump;
window.handleCustomReadestJump = handleCustomReadestJump;
