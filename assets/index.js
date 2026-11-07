const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./DailyCurriculumView-DwYWn8T4.js","./vendor-react-CK4T-87u.js","./vendor-misc-CoSDG3-6.js","./vendor-highlight-CoiR8Z5u.js","./KnowledgeReader-Llgr50JZ.js","./AlgoCatalog-BIUu7oTN.js","./LearningSystemView-aof-BRu5.js","./SourceRoadmapView-i2kd1DQU.js","./PracticeCenterView-DXVkzDta.js"])))=>i.map(i=>d[i]);
import{r as g,j as e,I as ge,T as ce,C as _e,a as xe,b as de,S as pe,c as fe,M as be,G as ye,L as Ce,d as A,B as P,e as E,f as Q,h as H,i as W,F as ke,D as ve,U as $,R as ue,X as Y,k as me,l as J,m as K,n as ee,o as Se,p as Te,q as ne,s as Le,t as we,u as Ie,P as Ae,v as Oe,w as He,A as Re,x as Pe,y as te,z as Ee,E as qe,H as re,J as Me,K as je}from"./vendor-react-CK4T-87u.js";import{H as D}from"./vendor-highlight-CoiR8Z5u.js";import"./vendor-misc-CoSDG3-6.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))u(l);new MutationObserver(l=>{for(const a of l)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&u(s)}).observe(document,{childList:!0,subtree:!0});function i(l){const a={};return l.integrity&&(a.integrity=l.integrity),l.referrerPolicy&&(a.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?a.credentials="include":l.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function u(l){if(l.ep)return;l.ep=!0;const a=i(l);fetch(l.href,a)}})();const Ne="modulepreload",Ue=function(n,r){return new URL(n,r).href},se={},w=function(r,i,u){let l=Promise.resolve();if(i&&i.length>0){let s=function(d){return Promise.all(d.map(f=>Promise.resolve(f).then(c=>({status:"fulfilled",value:c}),c=>({status:"rejected",reason:c}))))};const h=document.getElementsByTagName("link"),o=document.querySelector("meta[property=csp-nonce]"),y=(o==null?void 0:o.nonce)||(o==null?void 0:o.getAttribute("nonce"));l=s(i.map(d=>{if(d=Ue(d,u),d in se)return;se[d]=!0;const f=d.endsWith(".css"),c=f?'[rel="stylesheet"]':"";if(!!u)for(let t=h.length-1;t>=0;t--){const p=h[t];if(p.href===d&&(!f||p.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${c}`))return;const m=document.createElement("link");if(m.rel=f?"stylesheet":Ne,f||(m.as="script"),m.crossOrigin="",m.href=d,y&&m.setAttribute("nonce",y),document.head.appendChild(m),f)return new Promise((t,p)=>{m.addEventListener("load",t),m.addEventListener("error",()=>p(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(s){const h=new Event("vite:preloadError",{cancelable:!0});if(h.payload=s,window.dispatchEvent(h),!h.defaultPrevented)throw s}return l.then(s=>{for(const h of s||[])h.status==="rejected"&&a(h.reason);return r().catch(a)})};function T(n,r){const[i,u]=g.useState(()=>{var a;try{const s=window.localStorage.getItem(n);if(s)return JSON.parse(s);const h=window.localStorage.getItem("muduo_study_v5_state");if(h){const o=JSON.parse(h);if(n==="completedAlgos"&&((a=o==null?void 0:o.learningSystem)!=null&&a.completedAlgos))return o.learningSystem.completedAlgos;if(n==="knowledgeMastery"&&(o!=null&&o.knowledgeMastery))return o.knowledgeMastery;if(n==="knowledgeFavorites"&&(o!=null&&o.knowledgeFavorites))return o.knowledgeFavorites}return r}catch(s){return console.warn(`Error reading localStorage key "${n}":`,s),r}});return[i,a=>{try{const s=a instanceof Function?a(i):a;if(u(s),window.localStorage.setItem(n,JSON.stringify(s)),n==="completedAlgos"||n==="knowledgeMastery"||n==="knowledgeFavorites")try{const h=window.localStorage.getItem("muduo_study_v5_state"),o=h?JSON.parse(h):{};n==="completedAlgos"?(o.learningSystem||(o.learningSystem={}),o.learningSystem.completedAlgos=s):o[n]=s,window.localStorage.setItem("muduo_study_v5_state",JSON.stringify(o))}catch{}}catch(s){console.warn(`Error setting localStorage key "${n}":`,s)}}]}function v(n,r="success"){if(typeof window<"u"){const i=new CustomEvent("muduo_toast",{detail:{text:n,type:r}});window.dispatchEvent(i)}}const Be=()=>{const[n,r]=g.useState([]);return g.useEffect(()=>{let i=0;const u=l=>{const a=l,s={id:++i,text:a.detail.text,type:a.detail.type||"success"};r(h=>[...h.slice(-3),s]),setTimeout(()=>{r(h=>h.filter(o=>o.id!==s.id))},2500)};return window.addEventListener("muduo_toast",u),()=>window.removeEventListener("muduo_toast",u)},[]),n.length===0?null:e.jsx("div",{className:"fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none",children:n.map(i=>e.jsxs("div",{className:"flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium shadow-lg backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-top-2 pointer-events-auto border bg-slate-900/90 text-white border-slate-700/80",children:[i.type==="info"&&e.jsx(ge,{size:14,className:"text-sky-400 shrink-0"}),i.type==="warning"&&e.jsx(ce,{size:14,className:"text-amber-400 shrink-0"}),(!i.type||i.type==="success")&&e.jsx(_e,{size:14,className:"text-emerald-400 shrink-0"}),e.jsx("span",{children:i.text})]},i.id))})},j="muduo_focus_timer_state",V="todayStudyMinutes",q="muduo_focus_timer_change";function I(){try{const n=window.localStorage.getItem(j);if(n){const r=JSON.parse(n);return{isRunning:!!r.isRunning,startTimestamp:typeof r.startTimestamp=="number"?r.startTimestamp:null,accumulatedSeconds:typeof r.accumulatedSeconds=="number"?r.accumulatedSeconds:0}}}catch(n){console.warn("Failed to parse focus timer state from localStorage:",n)}return{isRunning:!1,startTimestamp:null,accumulatedSeconds:0}}function F(n){try{window.localStorage.setItem(j,JSON.stringify(n)),window.dispatchEvent(new CustomEvent(q))}catch(r){console.warn("Failed to save focus timer state:",r)}}function G(){try{const n=window.localStorage.getItem(V);if(n){const r=JSON.parse(n);return typeof r=="number"?r:0}}catch{}return 0}function ze(n){const r=Math.max(0,Math.floor(n)),i=Math.floor(r/3600),u=Math.floor(r%3600/60),l=r%60;return i>0?`${i.toString().padStart(2,"0")}:${u.toString().padStart(2,"0")}:${l.toString().padStart(2,"0")}`:`${u.toString().padStart(2,"0")}:${l.toString().padStart(2,"0")}`}const M=new Set;let S=null;function De(){M.forEach(n=>{try{n()}catch(r){console.warn("Error in focus timer subscriber:",r)}})}function L(n){n?S===null&&typeof window<"u"&&(S=window.setInterval(()=>{De()},1e3)):S!==null&&(window.clearInterval(S),S=null)}function he(){const[n,r]=g.useState(I),[i,u]=g.useState(G),[,l]=g.useState(0),a=g.useCallback(()=>{const d=I(),f=G();r(d),u(f),L(d.isRunning),l(c=>(c+1)%1e6)},[]);g.useEffect(()=>{const d=t=>{(t.key===j||t.key===V)&&a()},f=()=>{a()},c=()=>{document.visibilityState==="visible"&&a()},x=()=>{l(t=>(t+1)%1e6)};M.add(x),window.addEventListener("storage",d),window.addEventListener(q,f),document.addEventListener("visibilitychange",c);const m=I();return L(m.isRunning),()=>{M.delete(x),window.removeEventListener("storage",d),window.removeEventListener(q,f),document.removeEventListener("visibilitychange",c),M.size===0&&S!==null&&(window.clearInterval(S),S=null)}},[a]);const s=n.isRunning&&n.startTimestamp?n.accumulatedSeconds+Math.max(0,Math.floor((Date.now()-n.startTimestamp)/1e3)):n.accumulatedSeconds,h=i+Math.floor(s/60),o=g.useCallback(()=>{const d=I(),f=Date.now();if(d.isRunning){const c=d.startTimestamp?Math.max(0,Math.floor((f-d.startTimestamp)/1e3)):0,m={isRunning:!1,startTimestamp:null,accumulatedSeconds:d.accumulatedSeconds+c};F(m),r(m),L(!1),v("专注计时已暂停，时长已安全暂存","info")}else{const c={isRunning:!0,startTimestamp:f,accumulatedSeconds:d.accumulatedSeconds};F(c),r(c),L(!0),v("专注计时已开启","success")}},[]),y=g.useCallback(()=>{const d=I(),f=Date.now(),c=d.isRunning&&d.startTimestamp?Math.max(0,Math.floor((f-d.startTimestamp)/1e3)):0,x=d.accumulatedSeconds+c,m={isRunning:!1,startTimestamp:null,accumulatedSeconds:0};if(x>=60){const t=Math.floor(x/60),b=G()+t;try{window.localStorage.setItem(V,JSON.stringify(b)),window.localStorage.setItem(j,JSON.stringify(m)),window.dispatchEvent(new CustomEvent(q))}catch{}u(b),r(m),L(!1),v(`本次专注结算: +${t} 分钟，已记入今日学时`,"success")}else x>0&&v("本次专注不足 1 分钟，已重置","info"),F(m),r(m),L(!1)},[]);return{isRunning:n.isRunning,seconds:s,formattedTime:ze(s),todayMins:h,toggle:o,reset:y}}const Fe=({activeTab:n,onSelectTab:r,isDark:i,onToggleTheme:u,onOpenEnvGuide:l})=>{const{isRunning:a,formattedTime:s}=he(),h=[{id:"dashboard",label:"仪表盘",icon:e.jsx(Ce,{size:14})},{id:"daily",label:"任务",icon:e.jsx(A,{size:14})},{id:"reader",label:"项目",icon:e.jsx(P,{size:14})},{id:"algo",label:"算法",icon:e.jsx(E,{size:14})},{id:"learning",label:"学习系统",icon:e.jsx(Q,{size:14})},{id:"source",label:"源码路线",icon:e.jsx(H,{size:14})},{id:"practice",label:"其他",icon:e.jsx(W,{size:14})}];return e.jsx("header",{className:"sticky top-0 z-40 w-full bg-[#f4f7fb]/90 dark:bg-[#151922]/90 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_1px_2px_rgba(255,255,255,0.8)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.05)] border-0 select-none transition-colors duration-300",children:e.jsxs("div",{className:"w-full px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4",children:[e.jsxs("div",{onClick:()=>r("dashboard"),className:"flex items-center gap-2.5 cursor-pointer group shrink-0",children:[e.jsx("div",{className:"w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 via-sky-600 to-indigo-600 flex items-center justify-center text-white shadow-[4px_4px_10px_rgba(14,165,233,0.3),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-1px_-1px_2px_rgba(0,0,0,0.15)] group-hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",children:e.jsx(xe,{size:18})}),e.jsx("span",{className:"font-black text-sm sm:text-base tracking-tight text-slate-900 dark:text-white hidden md:inline",children:"Muduo & CppAIService"})]}),e.jsx("nav",{className:"flex items-center gap-1 bg-slate-200/50 dark:bg-slate-900/60 p-1.5 rounded-2xl shadow-[inset_2px_2px_4px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4),inset_-1px_-1px_2px_rgba(255,255,255,0.05)] text-xs font-semibold overflow-x-auto max-w-full",children:h.map(o=>{const y=n===o.id;return e.jsxs("button",{onClick:()=>r(o.id),className:`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer shrink-0 active:scale-x-105 active:scale-y-90 ${y?"bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-300 shadow-[3px_3px_8px_rgba(0,0,0,0.08),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] font-bold -translate-y-0.5":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/60 dark:hover:bg-slate-800/60"}`,children:[o.icon,e.jsx("span",{children:o.label})]},o.id)})}),e.jsxs("div",{className:"flex items-center gap-2 shrink-0",children:[a&&e.jsxs("button",{onClick:()=>{r("dashboard"),setTimeout(()=>{const o=document.getElementById("dashboard-focus-timer")||document.getElementById("dashboard-focus-timer-mobile");o&&(o.scrollIntoView({behavior:"smooth",block:"center"}),o.classList.add("ring-4","ring-amber-400/50"),setTimeout(()=>o.classList.remove("ring-4","ring-amber-400/50"),1500))},80)},className:"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-950/60 dark:to-orange-900/60 text-amber-800 dark:text-amber-200 shadow-[3px_3px_8px_rgba(0,0,0,0.08),inset_2px_2px_4px_rgba(255,255,255,0.9),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-xs font-mono font-bold cursor-pointer",title:"专注计时进行中，点击返回仪表盘",children:[e.jsxs("span",{className:"relative flex h-2 w-2",children:[e.jsx("span",{className:"animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"}),e.jsx("span",{className:"relative inline-flex rounded-full h-2 w-2 bg-amber-500"})]}),e.jsx(de,{size:13,className:"text-amber-600 dark:text-amber-400"}),e.jsx("span",{children:s})]}),e.jsxs("button",{onClick:l,className:"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-slate-750 text-sky-700 dark:text-sky-300 shadow-[3px_3px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-xs font-bold cursor-pointer",title:"查看 Linux 远程开发环境实操手册",children:[e.jsx(pe,{size:14}),e.jsx("span",{className:"hidden xl:inline",children:"Linux 开发指引"})]}),e.jsx("button",{onClick:u,className:"p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white shadow-[3px_3px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",title:i?"切换至浅色模式":"切换至深色模式",children:i?e.jsx(fe,{size:15,className:"text-amber-400"}):e.jsx(be,{size:15})}),e.jsx("a",{href:"https://github.com/Coolzs77/muduo-study-console",target:"_blank",rel:"noopener noreferrer",className:"p-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white shadow-[3px_3px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hidden sm:inline-flex cursor-pointer",title:"查看 GitHub 仓库",children:e.jsx(ye,{size:15})})]})]})})},Ge=()=>{const[n,r]=g.useState(0);return g.useEffect(()=>{const i=()=>{const u=window.scrollY||document.documentElement.scrollTop,l=document.documentElement.scrollHeight-document.documentElement.clientHeight;if(l>0){const a=Math.min(100,Math.max(0,u/l*100));r(a)}else r(0)};return window.addEventListener("scroll",i,{passive:!0}),()=>window.removeEventListener("scroll",i)},[]),e.jsx("div",{className:"fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none bg-transparent",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500 transition-all duration-75",style:{width:`${n}%`}})})},Qe={1:"框架定位",2:"四层架构",3:"环境搭建",4:"事件驱动",5:"协议报文",6:"状态机",7:"粘包拆包",8:"静态路由",9:"正则路由",10:"路由排错",11:"会话管理",12:"内存会话",13:"责任链",14:"跨域处理",15:"数据库连接",16:"连接池复用",17:"SQL防护",18:"TLS证书",19:"SSL握手",20:"零拷贝优化",21:"五子棋服务",22:"AI架构",23:"大模型调用",24:"消息队列",25:"线程池消费",26:"模型推理",27:"架构复盘",28:"面试题解"},O=[{day:1,week:1,tier:"A",title:"KamaServer 框架定位与 C++ Web 开发宏观全貌",bookRange:"语雀专栏: 学习建议 (yq_01) + 1.开篇 (yq_02)",tags:["KamaServer","C++应用层","工程全景","五子棋案例"],points:["摆脱单纯 C++ 基础语法的枯燥学习，从零构建高性能 Web 应用服务框架（KamaServer）。","确立项目整体开发周期：整体代码量约 5000 行（HTTP 框架约 3000 行，业务案例约 1400 行），规划 20~30 天完整学习路径。","理解架构分层：底层依托成熟的 Muduo 网络库承担传输保障，上层专注于 HTTP 报文解析、路由映射、会话安全与业务逻辑。"],code:`// Day 01: KamaServer 极简服务启动示例
#include <iostream>
#include <memory>
#include "http/HttpServer.h"

int main() {
    // 监听 8001 端口，4 个工作线程
    http::HttpServer server(8001, "KamaServer_Demo");
    server.setThreadNum(4);

    // 注册根路径静态路由
    server.Get("/", [](const http::HttpRequest& req, http::HttpResponse* resp) {
        resp->setStatusCode(http::HttpResponse::k200Ok);
        resp->setStatusMessage("OK");
        resp->setContentType("text/plain");
        resp->setBody("Hello KamaServer! C++ Web Framework Starting...");
    });

    std::cout << "KamaServer running on port 8001..." << std::endl;
    server.start();
    return 0;
}`,muduoMap:"HttpServer 内部组合 muduo::net::TcpServer，实现非阻塞 Reactor 架构",check:"理解 C++ 网络库与应用层 HTTP 框架的分工界限，能说出 KamaServer 整体模块划分。",estimatedMinutes:90,budget:{theory:30,code:35,experiment:25},rigorousNuance:{quick:"做 HTTP 框架就是在网络库上加上协议解析和路由。",strict:"网络库解决的是 Socket 非阻塞 I/O 多路复用和连接生命周期管理（L4）；HTTP 框架解决的是应用层协议编解码、状态机解析、动态路由分发、中间件链与多租户会话隔离（L7）。"},experiment:{goal:"验证 KamaServer 基础路由注册与端口监听能力",steps:["初始化 HttpServer 实例并指定监听端口 8001","注册 GET / 路由并设置基础文本响应","启动服务器并通过 curl 命令发起测试请求"],expectedOutput:"Hello KamaServer! C++ Web Framework Starting...",watchPoints:"观察服务器线程池初始化日志与 HTTP 响应头的状态行格式规范",pitfalls:"端口被系统其他服务占用（如 8001 已占用需修改为其他可用端口）。",buildCommand:"g++ -std=c++17 day01_server.cpp -I./HttpServer/include -lmuduo_net -lmuduo_base -lpthread -o day01_server && ./day01_server"},quiz:{questions:[{id:1,question:"关于为什么选择基于成熟网络库（如 Muduo）构建 HTTP 框架而非从 raw socket 写起，下列说法最准确的是：",options:["raw socket 无法在 Linux 下运行","底层通信框架稳定性和调试难度极高，利用成熟网络库能将精力聚焦在应用层协议与复杂业务上","Muduo 网络库内部自带完整的 HTTP/2 与 HTTPS 解密支持","C++ 标准库已经内置了类似 Muduo 的全部高并发网络功能"],answer:1,explanation:"自研底层网络库极易出现各种边界并发与内存异常，使用成熟稳定的网络库做底座，可以在应用层大幅拓展后端常用功能（路由、会话、中间件等），降低排错成本。"}]}},{day:2,week:1,tier:"A",title:"HTTP 框架 vs WebServer 深度辨析与四层服务架构",bookRange:"语雀专栏: 2.项目介绍 (yq_03)",tags:["四层架构","WebServer辨析","架构设计","Reactor模型"],points:["深度剖析自研 HTTP 框架与市面传统 WebServer 项目的本质区别：WebServer 侧重于从 socket 实现基础传输，而 HTTP 框架侧重于应用层架构设计与二次开发能力。","掌握平台四层全景架构：客户端层（Web/命令行）、业务服务层（核心逻辑/Handler）、数据与消息层（MySQL/RabbitMQ）、推理与第三方平台层（百炼/ONNX）。","理解请求完整生命周期流转：从网络数据接收、状态机解析、动态路由分发、中间件拦截到业务响应封装。"],code:`// Day 02: 四层架构中的请求调度与分发抽象
#include <iostream>
#include <functional>

// 业务层处理接口
class RequestHandler {
public:
    virtual ~RequestHandler() = default;
    virtual void handle(const std::string& path, std::string& response) = 0;
};

// 框架层分发器
class AppDispatcher {
public:
    void registerRoute(const std::string& path, std::shared_ptr<RequestHandler> handler) {
        routes_[path] = handler;
    }
    void dispatch(const std::string& path, std::string& resp) {
        if (routes_.count(path)) {
            routes_[path]->handle(path, resp);
        } else {
            resp = "HTTP/1.1 404 Not Found\\r\\n\\r\\n";
        }
    }
private:
    std::unordered_map<std::string, std::shared_ptr<RequestHandler>> routes_;
};`,muduoMap:"应用层分发解耦：业务 Handler 与底层 EventLoop 线程解耦",check:"能向面试官清晰画出平台四层架构图，并对比 WebServer 与 HTTP 框架的区别。",estimatedMinutes:90,budget:{theory:40,code:30,experiment:20},rigorousNuance:{quick:"WebServer 就是简单的玩具，HTTP 框架更实用。",strict:"WebServer 的重点在于从底层 socket 向上打通最小可用应用链路；HTTP 框架是以成熟网络引擎为基座，提供路由、过滤器、上下文管理与多模态扩展的工业级开发底座。"},experiment:{goal:"模拟客户端层到业务服务层的分发流程",steps:["构建抽象 Handler 派生类并重写 handle 方法","向分发器注册静态路径与动态路径","输入不同 URI 观察匹配命中与 404 降级分支"],expectedOutput:"命中指定路由处理器并生成标准响应",watchPoints:"观察路由映射表对未注册路径的边界防御",pitfalls:"在分发层直接处理长耗时任务导致主循环阻塞。",buildCommand:"g++ -std=c++17 day02_arch.cpp -o day02_arch && ./day02_arch"},quiz:{questions:[{id:1,question:"在四层服务架构中，负责与外部大模型（如阿里百炼、豆包）通信的模块位于哪一层？",options:["客户端层","业务服务层 (ChatServer)","推理与第三方平台层","数据与消息层"],answer:2,explanation:"推理与第三方平台层负责对接各家大模型 API 及本地 ONNX 推理引擎；业务服务层（ChatServer）则调用该层完成具体的对话与图像识别功能。"}]}},{day:3,week:1,tier:"A",title:"Linux / Docker 开发环境搭建与编译链配置",bookRange:"语雀专栏: 3.环境准备 (yq_04)",tags:["Docker","Ubuntu 22.04","CMake","环境部署"],points:["熟练掌握 Linux 环境下的依赖包管理：g++、cmake、boost_1_69_0、muduo 网络库、libmysqlcppconn-dev、OpenSSL。","掌握 Docker 快速一键拉取与容器编排：`docker pull huanheart/httpserver:v1`，配置端口映射 `-p 8001-8005:8001-8005`。","解决容器内服务的非自启问题：手动启动 MySQL 5.7 服务并设置密码，运行 simple_server 成功完成浏览器打通。"],code:`// Day 03: CMakeLists.txt 依赖探测与核心编译配置片段
cmake_minimum_required(VERSION 3.10)
project(Kama_HTTPServer CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# 查找 OpenSSL 与 线程库
find_package(OpenSSL REQUIRED)
find_package(Threads REQUIRED)

include_directories(
    \${PROJECT_SOURCE_DIR}/HttpServer/include
    \${OPENSSL_INCLUDE_DIR}
    /usr/include
)

link_directories(/usr/local/lib)

# 编译主程序并链接 Muduo 与 MySQL 动态库
add_executable(simple_server HttpServer/src/main.cpp)
target_link_libraries(simple_server
    muduo_net
    muduo_base
    mysqlcppconn
    OpenSSL::SSL
    OpenSSL::Crypto
    Threads::Threads
)`,muduoMap:"头文件引入 /usr/include/muduo 与动态库 /usr/local/lib/libmuduo_net.so",check:"在 Linux 终端或 Docker 内能够成功编译并启动 simple_server 服务。",estimatedMinutes:90,budget:{theory:20,code:30,experiment:40},rigorousNuance:{quick:"直接在虚拟机里装一堆库就行了。",strict:"Linux 下 C++ 依赖版本冲突极为常见（如 Boost、glibc 与 gcc ABI）。Docker 容器化镜像固化了完整工具链与预编译库，保证开发、测试与生产环境的 100% 一致性。"},experiment:{goal:"拉取并启动 Docker 容器，运行 simple_server",steps:["执行 docker run -d --name httpserver-container -p 8001:8001 huanheart/httpserver:v1 tail -f /dev/null","进入容器内部执行 service mysql start","在 Kama-HTTPServer/build_temp/ 目录下运行 ./simple_server -p 8001"],expectedOutput:"浏览器访问 http://localhost:8001 正常返回内容",watchPoints:"确认 Docker 端口映射无冲突且 MySQL 正常监听 3306 端口",pitfalls:"容器内部未启动 MySQL 服务导致后续数据库模块抛出连接异常。",buildCommand:'docker exec -it httpserver-container bash -c "service mysql status"'},quiz:{questions:[{id:1,question:"在 Docker 容器中部署 Kama-HTTPServer 时，暴露多个端口（如 8001~8005）的主要目的是：",options:["每个端口只能允许单个客户端连接","为后续可能运行的多实例测试或特定功能（如五子棋、AI服务、SSL）预留端口","Docker 规定每个 C++ 进程必须绑定 5 个端口","防止单个端口带宽被运营商限速"],answer:1,explanation:"暴露端口段是为了满足同一容器内运行多个示例服务（如不同端口的测试实例、业务服务及管理接口）的需求。"}]}},{day:4,week:1,tier:"A",title:"HttpServer 核心结构与 Muduo Reactor 事件驱动集成",bookRange:"语雀专栏: 4.框架梳理 (yq_05) + HTTP报文解析封装模块 (yq_06)",tags:["HttpServer","Reactor","onConnection","onMessage"],points:["理清 HttpServer 的核心成员：`muduo::net::TcpServer`、`muduo::net::EventLoop`、`Router` 与 `HttpCallback`。","深入掌握 `onConnection` 回调：当新连接建立时，通过 `conn->setContext(HttpContext())` 为每个连接绑定独立解析状态机。","深入掌握 `onMessage` 回调：从连接上下文提取 `HttpContext`，解析网络缓冲区数据；仅当解析出完整请求（gotAll()）时才触发 `onRequest` 处理。"],code:`// Day 04: HttpServer 中的连接与消息回调注册
#include "http/HttpContext.h"
#include <muduo/net/TcpServer.h>
#include <muduo/net/EventLoop.h>

void HttpServer::onConnection(const muduo::net::TcpConnectionPtr& conn) {
    if (conn->connected()) {
        // 为该 TCP 连接绑定独立的 HttpContext 上下文对象
        conn->setContext(HttpContext());
    }
}

void HttpServer::onMessage(const muduo::net::TcpConnectionPtr& conn,
                           muduo::net::Buffer* buf,
                           muduo::Timestamp receiveTime) {
    HttpContext* context = boost::any_cast<HttpContext>(conn->getMutableContext());
    if (!context->parseRequest(buf, receiveTime)) {
        // 解析出错立即返回 400 Bad Request 并半关闭连接
        conn->send("HTTP/1.1 400 Bad Request\\r\\n\\r\\n");
        conn->shutdown();
        return;
    }

    // 缓冲区中数据满足完整 HTTP 报文才执行上层业务
    if (context->gotAll()) {
        onRequest(conn, context->request());
        context->reset(); // 重置状态机准备接收下一条长连接请求
    }
}`,muduoMap:"TcpConnection 上下文绑定：boost::any 保存 HttpContext 实例",check:"能够画出从 TcpServer 接收字节流到触发业务 onRequest 的时序流转。",estimatedMinutes:90,budget:{theory:35,code:35,experiment:20},rigorousNuance:{quick:"每次收到消息就直接调业务函数。",strict:"TCP 是面向无边界的流式协议。一个 TCP 数据包可能包含多个完整 HTTP 请求，也可能只包含半个请求。必须通过 HttpContext 状态机维护未完成解析状态，直至 gotAll() 才能分发。"},experiment:{goal:"验证 HttpContext 在长连接中 reset() 的状态重置功能",steps:["模拟一个 TCP 连接连续发送两个 HTTP GET 请求","在第一个请求 gotAll() 后调用 reset()","验证第二个请求是否能重新从 kExpectRequestLine 状态顺利解析"],expectedOutput:"两个请求均被正确解析并分发",watchPoints:"观察 HttpContext 中 HttpRequest 对象是否被完全重置",pitfalls:"长连接中忘记调用 reset()，导致后续请求依然保持 kGotAll 状态而解析失败。",buildCommand:"g++ -std=c++17 day04_fsm_reset.cpp -o day04_fsm_reset && ./day04_fsm_reset"},quiz:{questions:[{id:1,question:"在 HttpServer::onConnection 中，为什么要给每个 TcpConnection 单独绑定一个 HttpContext？",options:["因为操作系统要求每个 socket 必须有一个 context","每个 TCP 连接的报文到达时序和粘包切片相互独立，必须各自维护独立的解析状态机","为了将连接直接转为 UDP 协议","没有必要，所有连接可以共享同一个全局静态 HttpContext 对象"],answer:1,explanation:"多连接并发时，不同连接接收数据的进度各不相同。必须每个连接独享 HttpContext，避免不同客户端之间报文数据交织错乱。"}]}},{day:5,week:1,tier:"A",title:"HttpRequest 与 HttpResponse 协议报文数据模型封装",bookRange:"语雀专栏: HTTP报文解析封装模块 (yq_06)",tags:["HttpRequest","HttpResponse","数据模型","协议封装"],points:["掌握 HttpRequest 的数据结构：方法枚举（GET/POST/PUT/DELETE/OPTIONS）、版本号、路径、路径参数映射、查询参数映射、头部键值对与请求体。","掌握 HttpResponse 的数据结构：HTTP 状态码（200/400/404/500 等）、状态描述文本、长短连接控制（Connection: close/keep-alive）、响应头与正文。","掌握报文装配算法：`appendToBuffer` 按照 HTTP 规范依次写入状态行、响应头部、空行（`\\r\\n`）与响应正文。"],code:`// Day 05: HttpResponse 格式化输出到 Muduo Buffer
#include <string>
#include <map>
#include <muduo/net/Buffer.h>

class HttpResponse {
public:
    enum HttpStatusCode {
        kUnknown,
        k200Ok = 200,
        k400BadRequest = 400,
        k404NotFound = 404,
        k500InternalServerError = 500
    };

    void appendToBuffer(muduo::net::Buffer* output) const {
        char buf[64];
        snprintf(buf, sizeof(buf), "HTTP/1.1 %d ", statusCode_);
        output->append(buf);
        output->append(statusMessage_);
        output->append("\\r\\n");

        if (closeConnection_) {
            output->append("Connection: close\\r\\n");
        } else {
            snprintf(buf, sizeof(buf), "Content-Length: %zd\\r\\n", body_.size());
            output->append(buf);
            output->append("Connection: Keep-Alive\\r\\n");
        }

        for (const auto& [key, val] : headers_) {
            output->append(key);
            output->append(": ");
            output->append(val);
            output->append("\\r\\n");
        }

        output->append("\\r\\n"); // 头部与体部之间的空行
        output->append(body_);
    }

private:
    HttpStatusCode statusCode_{kUnknown};
    std::string statusMessage_;
    bool closeConnection_{false};
    std::map<std::string, std::string> headers_;
    std::string body_;
};`,muduoMap:"数据输出阶段：将组装好的报文写入 muduo::net::Buffer 供发送",check:"能够手工构造一个带有 Content-Type、Content-Length 的合法 HTTP 响应报文。",estimatedMinutes:90,budget:{theory:30,code:40,experiment:20},rigorousNuance:{quick:"拼字符串发送就行了。",strict:"HTTP 协议对每一处回车换行严格要求为 \\r\\n（CRLF）。任何漏写冒号、空格或空行都会导致严格遵守 RFC 标准的浏览器无法正常解析。"},experiment:{goal:"验证 appendToBuffer 生成的报文字符串是否完全符合 RFC 7230 格式",steps:["创建 HttpResponse 对象并设置 200 OK、JSON 格式头与正文","调用 appendToBuffer 注入 muduo Buffer","打印 Buffer 内容并校验头部末尾的双 CRLF"],expectedOutput:'HTTP/1.1 200 OK\\r\\n...\\r\\n\\r\\n{"status":"ok"}',watchPoints:"检查双 CRLF 分隔符与 Content-Length 数值是否与 body 字节数严格一致",pitfalls:"在响应头与正文之间忘记添加空行 \\r\\n，导致客户端持续等待挂起。",buildCommand:"g++ -std=c++17 day05_response.cpp -lmuduo_net -lmuduo_base -o day05_response && ./day05_response"},quiz:{questions:[{id:1,question:"在 HTTP/1.1 响应报文中，标志着“头部结束、正文开始”的关键特征是：",options:["一个空字符 \\0","连续的两个 CRLF（即 \\r\\n\\r\\n）","一个单独的制表符 \\t","遇到 Content-Length 字段"],answer:1,explanation:"HTTP 规范规定头部以空行结束，即请求行或最后一个头部行之后的 \\r\\n 再紧跟一个 \\r\\n。"}]}},{day:6,week:1,tier:"A",title:"HttpContext 有限状态机 (FSM) 逐行解析与请求行提取",bookRange:"语雀专栏: HTTP报文解析封装模块 (yq_06)",tags:["状态机","FSM","请求行","processRequestLine"],points:["深入掌握四状态迁移图：`kExpectRequestLine`（解析请求行）-> `kExpectHeaders`（解析请求头）-> `kExpectBody`（解析请求体）-> `kGotAll`（全部就绪）。","请求行解析算法 `processRequestLine`：通过空格分隔符拆解 METHOD、PATH 与 HTTP 版本；通过 `?` 拆分路径与查询参数。","利用 `buf->findCRLF()` 判定行结束边界，并调用 `buf->retrieveUntil(crlf + 2)` 安全推进读指针。"],code:`// Day 06: 请求行解析算法实现
bool HttpContext::processRequestLine(const char* begin, const char* end) {
    bool succeed = false;
    const char* start = begin;
    const char* space = std::find(start, end, ' ');
    
    // 1. 提取 Method (如 GET, POST)
    if (space != end && request_.setMethod(start, space)) {
        start = space + 1;
        space = std::find(start, end, ' ');
        if (space != end) {
            // 2. 提取 URI 并判断是否携带查询参数
            const char* argumentStart = std::find(start, space, '?');
            if (argumentStart != space) {
                request_.setPath(start, argumentStart);
                request_.setQueryParameters(argumentStart + 1, space);
            } else {
                request_.setPath(start, space);
            }

            // 3. 提取并校验 HTTP 协议版本
            start = space + 1;
            succeed = ((end - start == 8) && std::equal(start, end - 1, "HTTP/1."));
            if (succeed) {
                if (*(end - 1) == '1') request_.setVersion("HTTP/1.1");
                else if (*(end - 1) == '0') request_.setVersion("HTTP/1.0");
                else succeed = false;
            }
        }
    }
    return succeed;
}`,muduoMap:"Buffer 读取机制：利用 peek() 查看数据，retrieveUntil() 消费数据",check:"能手工写出 processRequestLine 的三段拆解逻辑及边界安全判断。",estimatedMinutes:90,budget:{theory:30,code:45,experiment:15},rigorousNuance:{quick:"用 string split 空格直接取第 1 个和第 2 个元素。",strict:"在高性能网络服务中，使用 std::find 在原生字节指针（const char*）上游走，避免生成多余的 std::string 临时对象，减少堆内存分配开销。"},experiment:{goal:"测试 processRequestLine 对合法与非法请求行的解析健壮性",steps:['传入 "GET /api/user?id=101 HTTP/1.1\\r\\n" 验证解析成功','传入缺少版本的畸形请求行 "GET /api/user\\r\\n" 验证返回 false',"检查 HttpRequest 对象中的 path 与 queryParameters"],expectedOutput:'合法请求成功提取 path="/api/user", query["id"]="101"',watchPoints:"关注指针越界保护及 space == end 时的短路返回",pitfalls:"未校验协议版本长度直接越界读取 *(end - 1)。",buildCommand:"g++ -std=c++17 day06_fsm_line.cpp -o day06_fsm_line && ./day06_fsm_line"},quiz:{questions:[{id:1,question:'在解析带有查询参数的请求行 "GET /search?q=cpp HTTP/1.1" 时，路径与参数是以什么字符为界进行切分的？',options:["空格字符 ' '","问号字符 '?'","斜杠字符 '/'","冒号字符 ':'"],answer:1,explanation:"标准 HTTP 规范中，URL 路径与查询字符串通过首个问号 '?' 分割，问号之后直到空格之前的内容为 Query Parameters。"}]}},{day:7,week:1,tier:"A",title:"请求头与请求体边界判定、TCP 粘包拆包与零拷贝设计",bookRange:"语雀专栏: HTTP报文解析封装模块 (yq_06)",tags:["TCP粘包","Content-Length","零拷贝","Buffer"],points:["头部解析循环：通过冒号 `:` 切分 header 键值对，遇到空行时根据是否含有 `Content-Length` 决定迁移到 `kExpectBody` 还是 `kGotAll`。","彻底攻克 TCP 粘包拆包：当请求体未收全时（`buf->readableBytes() < contentLength`），状态机保持在 `kExpectBody` 并返回 true，等待后续可读事件再次触发。","零拷贝思想：在协议解析过程中最大化利用指针切片，仅在必要时才拷贝内容至请求体。"],code:`// Day 07: HttpContext::parseRequest 完整状态机循环驱动
bool HttpContext::parseRequest(muduo::net::Buffer* buf, muduo::Timestamp receiveTime) {
    bool ok = true;
    bool hasMore = true;
    while (hasMore) {
        if (state_ == kExpectRequestLine) {
            const char* crlf = buf->findCRLF();
            if (crlf) {
                ok = processRequestLine(buf->peek(), crlf);
                if (ok) {
                    request_.setReceiveTime(receiveTime);
                    buf->retrieveUntil(crlf + 2);
                    state_ = kExpectHeaders;
                } else { hasMore = false; }
            } else { hasMore = false; }
        } else if (state_ == kExpectHeaders) {
            const char* crlf = buf->findCRLF();
            if (crlf) {
                const char* colon = std::find(buf->peek(), crlf, ':');
                if (colon < crlf) {
                    request_.addHeader(buf->peek(), colon, crlf);
                } else if (buf->peek() == crlf) { // 遇到空行
                    if (!request_.getHeader("Content-Length").empty()) {
                        request_.setContentLength(std::stoull(request_.getHeader("Content-Length")));
                    }
                    state_ = (request_.contentLength() == 0) ? kGotAll : kExpectBody;
                    if (state_ == kGotAll) hasMore = false;
                } else {
                    ok = false;
                    hasMore = false;
                }
                buf->retrieveUntil(crlf + 2);
            } else { hasMore = false; }
        } else if (state_ == kExpectBody) {
            // TCP 拆包保护：若当前可读字节不足，等待下次 onMessage
            if (buf->readableBytes() < request_.contentLength()) {
                return true; // 等待更多数据，保持当前状态
            }
            std::string body(buf->peek(), buf->peek() + request_.contentLength());
            request_.setBody(body);
            buf->retrieve(request_.contentLength());
            state_ = kGotAll;
            hasMore = false;
        }
    }
    return ok;
}`,muduoMap:"缓冲区指针推进：retrieveUntil 跳过已读 CRLF，保留未接收完毕的数据",check:"能够解释在网络分包（拆包）情况下 parseRequest 为何必须返回 true 且不触发业务。",estimatedMinutes:90,budget:{theory:35,code:40,experiment:15},rigorousNuance:{quick:"TCP 粘包就是用分号把包隔开。",strict:"TCP 是没有消息边界的字节流。HTTP 报文的行与头通过 CRLF 定界，而请求体则严格依赖 Content-Length（或 Chunked 编码）明确字节边界，接收方通过计数器判定数据完整性。"},experiment:{goal:"模拟拆包场景：将一个 POST 请求分两次推入 Buffer，检验状态机暂挂与唤醒",steps:["注入请求行与头部，此时 readableBytes 为 0，观察状态机停留在 kExpectBody","二次注入完整 body 字节流并再次触发 parseRequest","验证 gotAll() 最终变为 true 并成功读取 body"],expectedOutput:"两次输入无缝衔接，最终成功还原完整请求报文",watchPoints:"确认第一次调用返回 true 但 gotAll() 为 false，无任何指针越界",pitfalls:"在可读字节不足时直接 retrieve 导致读取未初始化的脏数据或越界。",buildCommand:"g++ -std=c++17 day07_packet_fragment.cpp -lmuduo_net -lmuduo_base -o day07_frag && ./day07_frag"},quiz:{questions:[{id:1,question:"当 parseRequest 处理 kExpectBody 时，发现 buf->readableBytes() 小于 request_.contentLength()，应该采取的操作是：",options:["抛出异常并断开客户端连接","丢弃已读数据，返回 400 Bad Request","保留当前状态机状态，直接 return true，等待 TCP 后续数据到达再次解析","阻塞当前工作线程直到操作系统接收到全部数据"],answer:2,explanation:"在非阻塞 Reactor 架构中绝对禁止同步阻塞。数据尚未完全到达属于正常的 TCP 拆包现象，保持状态并返回 true，等待底层网络再次触发 onMessage 即可。"}]}},{day:8,week:2,tier:"A",title:"RouteKey 哈希结构与静态精准路径路由表注册",bookRange:"语雀专栏: 路由模块 (yq_07)",tags:["RouteKey","静态路由","哈希表","RouterHandler"],points:["设计复合键 RouteKey：结合 HttpRequest::Method 与 std::string path 构建唯一路由键，并重载 operator==。","自定义 RouteKeyHash 哈希仿函数：采用素数乘法 `methodHash * 31 + pathHash` 避免哈希碰撞。","双轨路由注册机制：支持注册直接函数对象 `HttpCallback` 与继承抽象基类 `RouterHandler` 两种方式。"],code:`// Day 08: RouteKey 哈希定义与静态路由表查找
#include <string>
#include <unordered_map>
#include <memory>
#include "http/HttpRequest.h"
#include "http/HttpResponse.h"

struct RouteKey {
    http::HttpRequest::Method method;
    std::string path;
    bool operator==(const RouteKey& other) const {
        return method == other.method && path == other.path;
    }
};

struct RouteKeyHash {
    size_t operator()(const RouteKey& key) const {
        size_t methodHash = std::hash<int>{}(static_cast<int>(key.method));
        size_t pathHash = std::hash<std::string>{}(key.path);
        return methodHash * 31 + pathHash;
    }
};

class RouterHandler {
public:
    virtual ~RouterHandler() = default;
    virtual void handle(const http::HttpRequest& req, http::HttpResponse* resp) = 0;
};

// 静态路由表
std::unordered_map<RouteKey, std::shared_ptr<RouterHandler>, RouteKeyHash> handlers_;`,muduoMap:"上层分发映射：在 muduo 接收完整请求后，通过 O(1) 哈希快速定位业务 Handler",check:"能够独立手写 RouteKeyHash 仿函数并解释为什么要使用 31 作为乘法因子。",estimatedMinutes:90,budget:{theory:30,code:40,experiment:20},rigorousNuance:{quick:"路由就是用 map 存路径和函数。",strict:"不仅需要匹配 URL 路径，还必须强校验 HTTP Method（如 GET 与 POST 同路径不能混用）。采用复合键 RouteKey 能够保证方法级别隔离，避免越权或方法误用。"},experiment:{goal:"测试静态路由表的注册与精准查找",steps:["注册 GET /api/v1/info 与 POST /api/v1/info 对应不同处理器","分别构造 GET 与 POST 请求在哈希表中查找","验证相同路径不同 Method 是否准确分发到对应处理器"],expectedOutput:"GET 与 POST 分别触发各自独立的 Handler 回调",watchPoints:"确认两个相同路径但方法不同的请求不会相互覆盖",pitfalls:"哈希函数未将 method 纳入计算，导致相同 path 的不同 method 发生严重哈希冲突。",buildCommand:"g++ -std=c++17 day08_static_router.cpp -o day08_router && ./day08_router"},quiz:{questions:[{id:1,question:"在实现 RouteKeyHash 时，将 methodHash 与 pathHash 通过 methodHash * 31 + pathHash 进行组合的主要目的是：",options:["满足 C++ 语法必须有乘法的强制要求","31 是奇素数且便于编译器优化为 (x << 5) - x，能产生更均匀的哈希分布以减少冲突","将所有路径强制限制在 31 个字符以内","直接对字符串进行加密保护"],answer:1,explanation:"31 是经典的素数乘数，能充分利用低位和高位比特混合，有效降低哈希碰撞概率，同时现代编译器能将其高效优化为位移操作。"}]}},{day:9,week:2,tier:"A",title:"基于 std::regex 的动态正则路由匹配与路径参数提取",bookRange:"语雀专栏: 路由模块 (yq_07)",tags:["动态路由","std::regex","路径参数","RESTful"],points:["动态路径模板转正则表达式：将形如 `/user/:id` 转换为 `^/user/([^/]+)$`，使用 `std::regex_replace` 批量转义。",'利用 `std::smatch` 提取路径参数：捕获正则分组结果，并依次存入 `request.setPathParameters("param1", match[1].str())`。',"双层路由匹配优先级：先查 O(1) 静态哈希表，未命中时再遍历动态正则路由列表 `regexHandlers_`。"],code:`// Day 09: 动态正则路由注册与参数提取
#include <regex>
#include <string>
#include <vector>

std::regex convertToRegex(const std::string& pathPattern) {
    // 将 /:param 统一替换为 /([^/]+)
    std::string regexPattern = "^" + std::regex_replace(pathPattern, std::regex(R"(/:([^/]+))"), R"(/([^/]+))") + "$";
    return std::regex(regexPattern);
}

void extractPathParameters(const std::smatch& match, std::unordered_map<std::string, std::string>& params) {
    for (size_t i = 1; i < match.size(); ++i) {
        params["param" + std::to_string(i)] = match[i].str();
    }
}`,muduoMap:"RESTful 接口支持：使基于 Muduo 的 HTTP 框架具备类似现代 Web 框架的动态参数捕获能力",check:"能够写出将 /books/:bookId/chapters/:chapterId 转换为正则并提取两个分组参数的完整代码。",estimatedMinutes:90,budget:{theory:35,code:35,experiment:20},rigorousNuance:{quick:"动态路由就是用正则匹配 URL。",strict:"正则匹配在大量动态路由下会产生 O(N) 遍历开销。工业级设计通常优先走静态哈希精准匹配，动态路由则采用预编译 regex 避免运行时构造正则表达式对象。"},experiment:{goal:"验证 convertToRegex 与 extractPathParameters 捕获参数的正确性",steps:["定义模板 /api/users/:userId/orders/:orderId","传入测试 URL /api/users/1024/orders/9998","检查匹配状态并打印提取到的 param1 与 param2"],expectedOutput:'param1="1024", param2="9998"',watchPoints:"确认路径两端被 ^ 和 $ 严格锚定，防止部分包含误判",pitfalls:"缺少 $ 终止锚点，导致 /api/users/123/extra 被错误匹配。",buildCommand:"g++ -std=c++17 day09_regex_router.cpp -o day09_regex && ./day09_regex"},quiz:{questions:[{id:1,question:"在 convertToRegex 中，模式两端加上 ^ 和 $ 符号的核心作用是：",options:["指示正则表达式为区分大小写模式","确保完全精准匹配整条 URL 路径，防止仅前缀或后缀匹配引发越界分发","在匹配失败时触发自动重定向","用于给参数分配内存空间"],answer:1,explanation:"^ 表示字符串起始，$ 表示字符串结束，两者结合保证整个 URI 路径必须完全匹配模式，防止发生部分子串匹配的安全漏洞。"}]}},{day:10,week:2,tier:"S",title:"【实战Bug深度排查】动态路由中 newReq 传参缺陷深度修复",bookRange:"语雀专栏: 路由模块 (yq_07) 项目难点与Bug复盘",tags:["实战Bug","const引用","newReq","参数丢失"],points:["Bug 现象复盘：在原有正则回调实现中，虽然提取了路径参数并写入了局部 newReq，但向 callback 传递的却是未包含参数的原始 req。","底层根因（RCA）：`callback(req, resp)` 错误传递了入参 `const HttpRequest& req`，导致业务 Handler 拿到的 `pathParameters_` 永远为空！","修复方案与防御性编码：拷贝构造 `HttpRequest newReq(req)`，完成 `extractPathParameters(match, newReq)` 注入后，严格传递 `callback(newReq, resp)`。"],code:`// Day 10: 正则动态路由执行中的传参缺陷修复
bool Router::route(const HttpRequest& req, HttpResponse* resp) {
    // ... 前置静态哈希查找省略 ...

    // 动态正则回调匹配
    for (const auto& [method, pathRegex, callback] : regexCallbacks_) {
        std::smatch match;
        std::string pathStr(req.path());
        if (method == req.method() && std::regex_match(pathStr, match, pathRegex)) {
            // [Bug 根因修复]: 必须创建可变副本 newReq 并注入路径参数
            HttpRequest newReq(req);
            extractPathParameters(match, newReq);

            // [致命陷阱]: 原代码错误传递 callback(req, resp); 导致参数完全丢失！
            // 正确代码：传递携带完整参数的 newReq
            callback(newReq, resp);
            return true;
        }
    }
    return false;
}`,muduoMap:"应用层参数穿透：确保业务层 Handler 能够稳定读取到 URI 中的动态上下文",check:"能指出原代码在传递 req 时的逻辑缺陷，并在白板上写出正确的修复代码。",estimatedMinutes:90,budget:{theory:40,code:30,experiment:20},rigorousNuance:{quick:"传参写错变量名了，改过来就行。",strict:"由于入参声明为 const HttpRequest& req，编译器从语法层面阻止了直接在原有对象上修改。但在定义局部 newReq 注入参数后，末端调用若仍顺手传递原始 req，编译器不会报错，形成极其隐蔽的静默逻辑 Bug。"},experiment:{goal:"重现并修复动态路由参数丢失 Bug",steps:["分别运行 Bug 版本与修复版本",'在回调函数内部读取 req.getPathParameter("param1")',"验证 Bug 版本打印为空，而修复版本成功打印提取出的参数"],expectedOutput:"修复版本在业务回调中正确获取到 param1 的实际参数值",watchPoints:"断言 newReq.getPathParameters().size() > 0",pitfalls:"在多线程环境下若未经拷贝直接强转 const_cast 修改全局 req 会引发数据竞争。",buildCommand:"g++ -std=c++17 day10_bug_fix.cpp -o day10_fix && ./day10_fix"},quiz:{questions:[{id:1,question:"动态路由中为何不能直接在传入的 const HttpRequest& req 上调用 setPathParameters？",options:["C++ 规范严禁任何类拥有 set 方法","const 引用具有只读约束，无法在不破坏接口安全性的情况下调用非 const 成员函数","Linux 内核会拦截对常量的修改并产生 SIGSEGV 信号","因为 HttpRequest 是单例模式"],answer:1,explanation:"const 引用从编译期保证了对象不可变。如果强行修改会违背接口契约，正确的做法是构造局部副本注入参数后再传递。"}]}},{day:11,week:2,tier:"A",title:"HTTP 无状态与 Cookie SESSIONID 会话生命周期管理",bookRange:"语雀专栏: 会话管理模块 (yq_08)",tags:["Session","Cookie","SESSIONID","会话生命周期"],points:["HTTP 无状态本质剖析：为何需要会话追踪？通过在响应头设置 `Set-Cookie: SESSIONID=xxx` 并在后续请求中回传，建立状态关联。","Session 类封装：包含会话唯一 ID、创建时间戳、最后刷新时间、数据字典（key-value）与超时时间（默认 3600 秒）。","SessionManager 调度中枢：基于随机数生成安全唯一的 sessionID，从 Cookie 提取 ID 并实现 `getSession(req, resp)` 的透明借调。"],code:`// Day 11: Session 会话核心类与生命周期检测
#include <string>
#include <unordered_map>
#include <chrono>

class Session {
public:
    Session(const std::string& id, int timeoutSeconds = 3600)
        : id_(id), timeout_(timeoutSeconds),
          lastAccessedTime_(std::chrono::steady_clock::now()) {}

    bool isExpired() const {
        auto now = std::chrono::steady_clock::now();
        auto elapsed = std::chrono::duration_cast<std::chrono::seconds>(now - lastAccessedTime_).count();
        return elapsed > timeout_;
    }

    void refresh() { lastAccessedTime_ = std::chrono::steady_clock::now(); }
    void setValue(const std::string& key, const std::string& val) { data_[key] = val; }
    std::string getValue(const std::string& key) const {
        auto it = data_.find(key);
        return it != data_.end() ? it->second : "";
    }
    const std::string& getId() const { return id_; }

private:
    std::string id_;
    int timeout_;
    std::chrono::steady_clock::time_point lastAccessedTime_;
    std::unordered_map<std::string, std::string> data_;
};`,muduoMap:"应用层有状态支撑：在 Reactor 框架上支持多用户登录认证与状态留存",check:"能够完整叙述从客户端初次登录到服务端设置 Cookie 并检索 Session 的时序。",estimatedMinutes:90,budget:{theory:30,code:40,experiment:20},rigorousNuance:{quick:"Session 就是保存在服务器的内存变量。",strict:"Session 是无状态协议之上的逻辑抽象。服务端仅保存 sessionID 与上下文映射，客户端仅持有 sessionID 凭据；两者通过 Header 中标准的 Cookie 机制进行闭环校验。"},experiment:{goal:"模拟用户登录、会话写入与后续请求识别",steps:["调用 SessionManager::getSession 生成新会话并在响应头注入 Set-Cookie",'向该 session 中写入 userId="42" 和 isLoggedIn="true"',"模拟二次请求携带 Cookie: SESSIONID=xxx，验证成功读出用户状态"],expectedOutput:"成功在二次请求中识别登录态，免去重复登录",watchPoints:"校验 Cookie 字段格式与过期时间刷新",pitfalls:"Cookie 未设置 HttpOnly 属性在 Web 环境下存在被 XSS 窃取的风险。",buildCommand:"g++ -std=c++17 day11_session_lifecycle.cpp -o day11_session && ./day11_session"},quiz:{questions:[{id:1,question:"在无状态的 HTTP 协议中，服务端首次为客户端建立会话时，是通过什么响应头将 sessionID 下发给客户端浏览器的？",options:["Authorization: Bearer <token>","Set-Cookie: SESSIONID=<id>; Path=/; HttpOnly","Content-Type: application/json","Connection: Keep-Alive"],answer:1,explanation:"标准 HTTP 规范使用 Set-Cookie 响应头部指令让浏览器保存 Cookie 并在后续同源请求中自动带上。"}]}},{day:12,week:2,tier:"A",title:"MemorySessionStorage 内存存储与定期过期会话淘汰清理",bookRange:"语雀专栏: 会话管理模块 (yq_08)",tags:["SessionStorage","内存管理","过期淘汰","定时清理"],points:["关注点分离：将 `SessionManager`（生命周期管理）与 `SessionStorage`（数据持久化/内存接口）解耦，支持内存、Redis 或数据库扩展。","MemorySessionStorage 线程安全设计：使用 `std::mutex` 保护内部 `std::unordered_map<std::string, std::shared_ptr<Session>>`。","定期淘汰算法 `cleanExpiredSessions`：遍历检查 `isExpired()`，主动擦除僵尸会话，防止服务器内存发生无序膨胀。"],code:`// Day 12: MemorySessionStorage 与过期会话清理
#include <mutex>
#include <unordered_map>
#include <memory>
#include <vector>

class MemorySessionStorage {
public:
    void save(std::shared_ptr<Session> session) {
        std::lock_guard<std::mutex> lock(mutex_);
        sessions_[session->getId()] = session;
    }

    std::shared_ptr<Session> load(const std::string& id) {
        std::lock_guard<std::mutex> lock(mutex_);
        auto it = sessions_.find(id);
        if (it != sessions_.end() && !it->second->isExpired()) {
            it->second->refresh();
            return it->second;
        }
        return nullptr;
    }

    // 定期淘汰清理函数
    void cleanExpiredSessions() {
        std::lock_guard<std::mutex> lock(mutex_);
        for (auto it = sessions_.begin(); it != sessions_.end(); ) {
            if (it->second->isExpired()) {
                it = sessions_.erase(it); // 安全删除过期迭代器
            } else {
                ++it;
            }
        }
    }

private:
    std::unordered_map<std::string, std::shared_ptr<Session>> sessions_;
    std::mutex mutex_;
};`,muduoMap:"定时任务联动：可将 cleanExpiredSessions 注册到 muduo EventLoop::runEvery 定时器中",check:"能够写出迭代器安全删除 (it = sessions_.erase(it)) 并在高并发下说明锁粒度优化思路。",estimatedMinutes:90,budget:{theory:30,code:40,experiment:20},rigorousNuance:{quick:"把 map 里的过期元素删掉就行。",strict:"在遍历 std::unordered_map 时直接调用 sessions_.erase(it++) 在某些旧标准或多线程下极易引发迭代器失效引发段错误；必须接收 erase 返回的下一个有效迭代器。"},experiment:{goal:"验证 cleanExpiredSessions 正确淘汰超时 Session 且不误伤有效 Session",steps:["注入超时时间为 1 秒的临时 Session 与 3600 秒的长期 Session","睡眠 1.5 秒后触发 cleanExpiredSessions","校验超时 Session 已被彻底清除，长期 Session 仍可正常 load"],expectedOutput:"超时 Session 被顺利回收，内存恢复正常",watchPoints:"确认 erase 操作后容器大小准确减少",pitfalls:"在迭代器自增时未接返回值导致遍历悬空迭代器崩溃。",buildCommand:"g++ -std=c++17 day12_session_cleanup.cpp -o day12_cleanup && ./day12_cleanup"},quiz:{questions:[{id:1,question:"在多线程环境下执行 cleanExpiredSessions 时，如果不加互斥锁进行 erase 操作，可能产生的后果是：",options:["程序自动回滚到事务开始状态","多线程并发修改哈希表桶结构，引发未定义行为（数据损坏或内存段错误）","编译器自动添加读写锁","没有任何副作用，C++ 容器原生线程安全"],answer:1,explanation:"STL 容器不保证多线程写操作安全。在遍历删除期间如果有其他工作线程并发读取或插入，会造成哈希桶指针破坏，引发内存崩溃。"}]}},{day:13,week:2,tier:"A",title:"洋葱模型责任链中间件 MiddlewareChain 与 Middleware 抽象设计",bookRange:"语雀专栏: 中间件模块 (yq_09)",tags:["中间件","责任链","洋葱模型","AOP"],points:["什么是中间件？位于客户端网络请求到达路由处理逻辑之前、以及响应离开服务器之前的拦截管道（AOP 切面思想）。","中间件基类接口设计：包含请求前置处理 `before(HttpRequest&)` 与响应后置处理 `after(HttpResponse&)`。","MiddlewareChain 责任链执行中枢：维护 `std::vector<std::shared_ptr<Middleware>>`，请求顺向遍历 before，响应逆向遍历 after（标准洋葱模型）。"],code:`// Day 13: 洋葱模型中间件责任链接口与调度中枢
#include <vector>
#include <memory>
#include "http/HttpRequest.h"
#include "http/HttpResponse.h"

class Middleware {
public:
    virtual ~Middleware() = default;
    virtual void before(http::HttpRequest& request) = 0;
    virtual void after(http::HttpResponse& response) = 0;
};

class MiddlewareChain {
public:
    void addMiddleware(std::shared_ptr<Middleware> mw) {
        middlewares_.push_back(mw);
    }

    void processBefore(http::HttpRequest& request) {
        for (auto& mw : middlewares_) {
            mw->before(request); // 顺向流水线预处理
        }
    }

    void processAfter(http::HttpResponse& response) {
        // 逆向流水线后处理（洋葱外层收敛）
        for (auto it = middlewares_.rbegin(); it != middlewares_.rend(); ++it) {
            (*it)->after(response);
        }
    }

private:
    std::vector<std::shared_ptr<Middleware>> middlewares_;
};`,muduoMap:"管道拦截层：位于 HttpServer::onMessage 与 onRequest 之间，解耦通用横切关注点",check:"能够画出洋葱模型的数据流穿透图，说明为什么后置处理必须逆序遍历。",estimatedMinutes:90,budget:{theory:35,code:35,experiment:20},rigorousNuance:{quick:"中间件就是一堆函数按顺序调用。",strict:"中间件核心在于横切关注点的解耦（如鉴权、跨域、耗时统计）。前置处理逐层剥入，业务处理处于洋葱核心，后置处理逐层包出，确保最外层中间件能完整包裹内层执行时间。"},experiment:{goal:"编写耗时统计中间件与签名校验中间件，验证洋葱执行顺序",steps:["TimerMiddleware 在 before 记录时间，在 after 打印总耗时","AuthMiddleware 校验 Header 中的 Token","观察控制台日志输出顺序：Timer Before -> Auth Before -> Handler -> Auth After -> Timer After"],expectedOutput:"严格遵守洋葱模型先入后出的对称调用时序",watchPoints:"确认 rbegin() 和 rend() 正确实现逆序遍历",pitfalls:"在 after 中忘记逆序导致外层中间件无法正确统计整体处理耗时。",buildCommand:"g++ -std=c++17 day13_onion_middleware.cpp -o day13_middleware && ./day13_middleware"},quiz:{questions:[{id:1,question:"在洋葱模型中间件链中，为什么响应后置处理（processAfter）通常推荐逆序执行？",options:["C++ 规范强制要求必须逆序","为了保证最先介入的前置中间件（如全链路计时、错误捕获）最后退出，形成闭环包装","为了节省内存空间","防止逆序时被编译器报错"],answer:1,explanation:"逆序执行能使最外层的中间件（如耗时监控、全局异常拦截、日志审计）完整涵盖所有内层中间件及核心业务的执行全过程。"}]}},{day:14,week:2,tier:"A",title:"CorsMiddleware 跨域处理与 OPTIONS 预检请求拦截",bookRange:"语雀专栏: 中间件模块 (yq_09)",tags:["CORS","跨域","OPTIONS预检","403 Forbidden"],points:["什么是跨域（CORS）？浏览器同源策略限制下，当前端页面向不同域名/端口的后端发起 API 请求时的保护机制。","OPTIONS 预检请求机制：非简单请求（携带自定义 Header 或 JSON 格式）前，浏览器会先发送 OPTIONS 探测服务端支持的方法与头部。","通过 C++ 异常快速阻断：在 `CorsMiddleware::before` 中捕获到 `kOptions` 时，直接构造 204 No Content 响应并 `throw response`，快速短路后续路由与数据库开销。"],code:`// Day 14: CORS 跨域中间件与 OPTIONS 预检短路
#include "http/HttpRequest.h"
#include "http/HttpResponse.h"
#include <algorithm>

class CorsMiddleware : public Middleware {
public:
    void before(http::HttpRequest& request) override {
        // 如果是 OPTIONS 预检请求，直接构建响应并阻断
        if (request.method() == http::HttpRequest::kOptions) {
            http::HttpResponse response;
            response.setStatusCode(http::HttpResponse::k204NoContent);
            response.setStatusMessage("No Content");
            response.addHeader("Access-Control-Allow-Origin", "*");
            response.addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            response.addHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
            response.addHeader("Access-Control-Max-Age", "86400");
            throw response; // 抛出异常直接跳过后续 Handler 处理
        }
    }

    void after(http::HttpResponse& response) override {
        // 为普通业务响应补充跨域允许头
        response.addHeader("Access-Control-Allow-Origin", "*");
    }
};`,muduoMap:"上层流量短路：在最前置拦截非业务流量，避免 Muduo 工作线程做无意义的业务轮询",check:"能够说明为什么 OPTIONS 请求必须设置 Access-Control-Max-Age 以及如何防御 403 Forbidden。",estimatedMinutes:90,budget:{theory:30,code:35,experiment:25},rigorousNuance:{quick:"跨域就是给所有响应头加个 * 允许。",strict:"OPTIONS 预检请求不能触发后端的数据库或耗时业务操作。使用短路拦截直接返回 204 并缓存 preflight 结果（Max-Age），不仅保护了接口安全，还极大提升了前后端分离应用的响应性能。"},experiment:{goal:"模拟浏览器发送 OPTIONS 预检请求，观察短路响应头",steps:["使用 curl -X OPTIONS http://localhost:8001/api/chat -i 发起预检","观察 HTTP 状态码为 204 No Content","验证响应头部包含 Access-Control-Allow-Methods 与 Max-Age"],expectedOutput:"HTTP/1.1 204 No Content，且不调用任何业务 Handler",watchPoints:"确认无任何数据库查询日志产生",pitfalls:"未设置 Access-Control-Allow-Headers 导致前端携带 Authorization 时依然被浏览器阻断。",buildCommand:"g++ -std=c++17 day14_cors_preflight.cpp -o day14_cors && ./day14_cors"},quiz:{questions:[{id:1,question:"在 CorsMiddleware 中，针对 OPTIONS 请求设置 Access-Control-Max-Age: 86400 的主要好处是：",options:["限制客户端在 86400 秒后必须重新连接服务器","让浏览器在 24 小时内缓存预检结果，后续对同接口的请求无需重复发送 OPTIONS 握手","将所有会话数据的存活时间强制延长为一天","防止服务端发生内存泄漏"],answer:1,explanation:"Max-Age 告诉浏览器在指定时间内对同一资源的预检请求结果有效，避免每次发送 POST 之前都额外产生一次 OPTIONS 的往返网络开销。"}]}},{day:15,week:3,tier:"A",title:"DbConnection 单连接封装与 RAII 资源安全管理",bookRange:"语雀专栏: 集成数据库连接池模块 (yq_10)",tags:["DbConnection","MySQL","RAII","预编译语句"],points:["传统数据库连接的瓶颈：TCP 三次握手、MySQL 协议身份认证、资源分配与四次挥手在高并发下带来巨大延迟损耗。","DbConnection 核心封装：封装 `sql::mysql::MySQL_Driver` 与 `sql::Connection`，支持连接创建、schema 选择与 `cleanup()`。","预编译安全查询：使用 `PreparedStatement` 代替普通字符串拼接，动态绑定参数，从语法层天然杜绝 SQL 注入风险。"],code:`// Day 15: DbConnection 单连接与参数化查询封装
#include <mysql_driver.h>
#include <mysql_connection.h>
#include <cppconn/prepared_statement.h>
#include <memory>
#include <string>

class DbConnection {
public:
    DbConnection(const std::string& host, const std::string& user,
                 const std::string& pwd, const std::string& db) {
        driver_ = sql::mysql::get_mysql_driver_instance();
        conn_.reset(driver_->connect(host, user, pwd));
        conn_->setSchema(db);
    }

    bool ping() {
        try {
            std::unique_ptr<sql::Statement> stmt(conn_->createStatement());
            stmt->execute("SELECT 1");
            return true;
        } catch (...) {
            return false;
        }
    }

private:
    sql::mysql::MySQL_Driver* driver_;
    std::shared_ptr<sql::Connection> conn_;
};`,muduoMap:"业务数据持久化：为异步服务提供底层可靠的数据库连接通道",check:"能够说明使用 PreparedStatement 进行参数绑定的防注入原理。",estimatedMinutes:90,budget:{theory:30,code:45,experiment:15},rigorousNuance:{quick:"连接数据库就是调下驱动接口。",strict:"数据库物理连接属于极其宝贵的受限系统资源。未用 RAII 包装的裸指针一旦在执行查询时抛出异常，极易发生 Socket 泄漏并最终耗尽 MySQL 的 max_connections。"},experiment:{goal:"测试 DbConnection 连接 MySQL 5.7 并执行 SELECT 1 探活",steps:["使用 Docker 内 MySQL 凭证（root / root）初始化 DbConnection","调用 ping() 验证连接连通性","模拟数据库临时断开观察 ping() 的异常捕获机制"],expectedOutput:"正常连接时 ping() 返回 true，断开时安全返回 false 不崩溃",watchPoints:"确认无任何内存泄漏与异常逃逸",pitfalls:"连接字符串缺少 tcp:// 前缀导致驱动无法正确解析网络协议。",buildCommand:"g++ -std=c++17 day15_db_connection.cpp -lmysqlcppconn -o day15_db && ./day15_db"},quiz:{questions:[{id:1,question:"在 DbConnection 内部使用 PreparedStatement 能够有效防御 SQL 注入的底层机制是：",options:["自动在前端页面过滤用户输入的单引号","将 SQL 语句结构与参数数据分离传输，数据库引擎先编译语句骨架，参数仅作为纯字面量传入，不参与语法解析","将所有参数强制进行 Base64 编码","通过多线程执行加速查询"],answer:1,explanation:"预编译将 SQL 的抽象语法树（AST）在执行前固定下来，参数传入时无论包含什么特殊字符，都仅作为数据值处理，绝不会改变 SQL 语法语义。"}]}},{day:16,week:3,tier:"S",title:"DbConnectionPool 连接池动态复用、条件变量等待与 ping 保活机制",bookRange:"语雀专栏: 集成数据库连接池模块 (yq_10)",tags:["连接池","条件变量","RAII借还","连接探活"],points:["连接池三阶段管理：系统初始化建立连接池、运行期动态申请/归还、进程退出时安全释放全部物理连接。","条件变量等待机制：当池内空闲连接耗尽且未达最大限制时创建新连接，达到上限时通过 `std::condition_variable` 等待最大超时时间。","探活与重连机制：MySQL 默认 8 小时无操作会断开非活跃连接；每次借出前调用 `ping()` 探活，失效时执行重连，彻底避免次日服务“假死”。"],code:`// Day 16: DbConnectionPool 连接池与 RAII 自动归还包装
#include <queue>
#include <mutex>
#include <condition_variable>
#include <memory>

class DbConnectionPool {
public:
    static DbConnectionPool& instance() {
        static DbConnectionPool pool;
        return pool;
    }

    std::shared_ptr<DbConnection> getConnection(int timeoutMs = 1000) {
        std::unique_lock<std::mutex> lock(mutex_);
        if (pool_.empty()) {
            if (cv_.wait_for(lock, std::chrono::milliseconds(timeoutMs), [this]{ return !pool_.empty(); })) {
                // 成功等待到空闲连接
            } else {
                return nullptr; // 超时无法获取连接
            }
        }

        auto conn = pool_.front();
        pool_.pop();

        // 探活保活：若已断开则重新连接
        if (!conn->ping()) {
            conn->reconnect();
        }

        // 自定义删除器：智能指针析构时自动将连接归还池中而非 delete 销毁
        return std::shared_ptr<DbConnection>(conn.get(), [this, conn](DbConnection*){
            std::lock_guard<std::mutex> lk(mutex_);
            pool_.push(conn);
            cv_.notify_one();
        });
    }

private:
    std::queue<std::shared_ptr<DbConnection>> pool_;
    std::mutex mutex_;
    std::condition_variable cv_;
};`,muduoMap:"高并发数据库加速：避免每次网络回调都与 MySQL 进行昂贵的 TCP 握手",check:"能够解释智能指针自定义 Deleter 在实现连接池 RAII 自动归还中的精妙用法。",estimatedMinutes:90,budget:{theory:35,code:40,experiment:15},rigorousNuance:{quick:"连接池就是个装连接的队列，用完放回去。",strict:"直接调用 releaseConnection 要求开发者严格记得在所有 return 分支手动归还，一旦发生异常极易漏还。利用 std::shared_ptr 自定义删除器绑定 lambda，无论正常退出还是抛出异常，都会在出作用域时 100% 自动安全归还。"},experiment:{goal:"验证多线程并发从 DbConnectionPool 借用连接并自动归还",steps:["初始化容量为 5 的连接池","开辟 10 个线程并发借用连接并模拟查询耗时 100ms","观察连接数动态复用与没有连接泄露"],expectedOutput:"所有 10 个任务顺利执行完毕，连接池总数稳定保持为 5",watchPoints:"验证 cv_.wait_for 在高并发争用下的超时保护",pitfalls:"在 lambda 删除器中未加互斥锁直接 push 到共享队列引发多线程死锁。",buildCommand:"g++ -std=c++17 day16_connection_pool.cpp -lpthread -lmysqlcppconn -o day16_pool && ./day16_pool"},quiz:{questions:[{id:1,question:"在 DbConnectionPool 中，为什么次日重新调用数据库接口时可能会出现连接卡死或连接丢失报错？",options:["MySQL 5.7 内部有 Bug","MySQL 服务端有 wait_timeout 机制（默认 8 小时），空闲连接被服务端单方面断开，如果客户端借出时不进行 ping 探活就会使用已关闭的死连接","操作系统的 epoll 会自动关闭所有的数据库连接","因为 C++ 内存发生了自然衰减"],answer:1,explanation:"这是极为高频的真实生产痛点。MySQL 会单方面断开长时间空闲的连接，连接池必须在借出前调用 ping 检查，并在失效时透明重连，才能保证长周期稳定运行。"}]}},{day:17,week:3,tier:"A",title:"MysqlUtil 预编译执行与参数化防 SQL 注入改造",bookRange:"语雀专栏: 集成数据库连接池模块 (yq_10) + AI服务平台 (yq_16)",tags:["MysqlUtil","SQL注入","参数化查询","特殊字符转义"],points:["SQL 注入攻击原理复盘：攻击者通过注入 `'); DROP TABLE chat_message; --` 闭合单引号，直接篡改底层 SQL 语义造成破坏。","特殊字符转义局限性：字符串替换 `escapeString` 虽然能防御常见单引号，但在换行符、反斜杠与复合字符集编码下依然存在注入隐患。","MysqlUtil 模板参数包安全绑定：利用可变参数模板 `template<typename... Args>` 递归展开调用 `stmt->setString`、`stmt->setInt`，实现类型安全的参数绑定。"],code:`// Day 17: 可变参数模板递归绑定 PreparedStatement
#include <cppconn/prepared_statement.h>
#include <string>

template<typename T, typename... Args>
void bindParams(sql::PreparedStatement* stmt, int index, T&& value, Args&&... args) {
    if constexpr (std::is_same_v<std::decay_t<T>, int>) {
        stmt->setInt(index, value);
    } else if constexpr (std::is_same_v<std::decay_t<T>, std::string>) {
        stmt->setString(index, value);
    } else if constexpr (std::is_same_v<std::decay_t<T>, long long>) {
        stmt->setInt64(index, value);
    }
    
    if constexpr (sizeof...(args) > 0) {
        bindParams(stmt, index + 1, std::forward<Args>(args)...);
    }
}`,muduoMap:"业务数据防线：为上层 ChatServer 和用户模块提供零注入隐患的持久化接口",check:"能写出一个带 3 个占位符 ? 的 INSERT 语句并使用参数化完成安全写入。",estimatedMinutes:90,budget:{theory:30,code:45,experiment:15},rigorousNuance:{quick:"把单引号替换成转义字符就行。",strict:"字符串转义方案极度依赖数据库连接字符集设置（如宽字节注入 gbk 漏洞）。参数化预编译直接走二进制协议（Binary Protocol），数据与指令通道物理分离，是业界防御 SQL 注入的黄金标准。"},experiment:{goal:"模拟输入恶意 SQL 注入字符串，检验预编译语句的防御力",steps:[`构建用户名参数 "admin' OR '1'='1"`,"使用传统拼接方式与参数化预编译方式对比执行 SELECT","验证参数化查询仅将输入作为字面量比对，绝不发生逻辑提权"],expectedOutput:"参数化查询未被提权，安全返回 0 条记录",watchPoints:"检查数据库实际执行日志中的参数占位符处理",pitfalls:"在表名或列名上尝试使用参数占位符（SQL 规范规定表名不能参数化）。",buildCommand:"g++ -std=c++17 day17_sql_injection.cpp -lmysqlcppconn -o day17_injection && ./day17_injection"},quiz:{questions:[{id:1,question:"下列关于在 SQL 语句中绑定参数的说法，错误的是：",options:["WHERE 过滤条件和 INSERT 的值可以使用参数化占位符","表名和列名可以随意使用 ? 占位符并通过驱动动态绑定","参数化查询能提升具有相同 SQL 骨架的高频语句的执行速度","参数化查询避免了拼接字符串导致的单引号转义遗漏"],answer:1,explanation:"SQL 预编译时必须确定表结构和查询计划，因此表名、字段名和关键字不能作为参数占位符绑定，只有字面量数据才能参数化。"}]}},{day:18,week:3,tier:"A",title:"HTTPS / TLS 握手原理、证书生成与 OpenSSL SslContext 初始化",bookRange:"语雀专栏: HTTPS模块 (yq_11)",tags:["HTTPS","TLS","OpenSSL","SSL_CTX","证书"],points:["HTTPS 混合加密机制：非对称加密（RSA/ECC）用于身份认证与对称密钥协商，对称加密（AES-GCM）用于高性能数据传输。","OpenSSL 自签名证书生成：利用 `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt`。","SslContext 初始化核心流程：`TLS_server_method()` 创建上下文，加载公钥证书与私钥并进行 `SSL_CTX_check_private_key` 一致性校验。"],code:`// Day 18: SslContext 初始化与证书私钥挂载
#include <openssl/ssl.h>
#include <openssl/err.h>
#include <string>

class SslContext {
public:
    bool initialize(const std::string& certFile, const std::string& keyFile) {
        OPENSSL_init_ssl(OPENSSL_INIT_LOAD_SSL_STRINGS | OPENSSL_INIT_LOAD_CRYPTO_STRINGS, nullptr);
        ctx_ = SSL_CTX_new(TLS_server_method());
        if (!ctx_) return false;

        // 加载服务器证书文件
        if (SSL_CTX_use_certificate_file(ctx_, certFile.c_str(), SSL_FILETYPE_PEM) <= 0) {
            return false;
        }

        // 加载服务器私钥文件并检验配对
        if (SSL_CTX_use_PrivateKey_file(ctx_, keyFile.c_str(), SSL_FILETYPE_PEM) <= 0 ||
            !SSL_CTX_check_private_key(ctx_)) {
            return false;
        }

        return true;
    }

private:
    SSL_CTX* ctx_{nullptr};
};`,muduoMap:"传输层加密武装：为基于 Muduo 的明文 HTTP 升级为高安全生产级 HTTPS",check:"能够完整说出 TLS 1.2 / 1.3 握手的四步时序，以及对称密钥是如何被加密保护的。",estimatedMinutes:90,budget:{theory:40,code:35,experiment:15},rigorousNuance:{quick:"HTTPS 就是在 HTTP 协议上面加个 SSL 证书。",strict:"数字证书的核心价值在于通过权威 CA 机构的数字签名防范中间人攻击（MITM）。仅加密数据而不验证证书会导致攻击者伪造公钥窃听全量流量。"},experiment:{goal:"生成测试证书并完成 SslContext 成功初始化",steps:["在终端执行 openssl 命令生成 server.crt 与 server.key","编译运行 SslContext 初始化程序加载证书与私钥","断言 SSL_CTX_check_private_key 成功通过"],expectedOutput:"SSL context initialized successfully, private key matched",watchPoints:"确认证书文件 PEM 编码格式正确且有文件读权限",pitfalls:"私钥与证书不配对导致 SSL_CTX_check_private_key 校验失败。",buildCommand:"g++ -std=c++17 day18_ssl_context.cpp -lssl -lcrypto -o day18_ssl && ./day18_ssl"},quiz:{questions:[{id:1,question:"在 HTTPS 通信中，公钥和私钥各自分配给谁保管？",options:["客户端持有私钥，服务端持有公钥","公钥随数字证书向所有人公开分发，私钥严格保存在服务端本地绝不泄露","客户端和服务端必须持有同一套完全相同的私钥","CA 机构同时持有两者的私钥"],answer:1,explanation:"非对称加密中，公钥负责加密与验签，向全网公开；私钥负责解密与签名，必须严格保存在服务器本地以确保安全。"}]}},{day:19,week:3,tier:"S",title:"非阻塞 Reactor 下 SslConnection 握手状态机与双向 BIO 数据加解密",bookRange:"语雀专栏: HTTPS模块 (yq_11)",tags:["SslConnection","BIO","非阻塞SSL","WANT_READ","握手状态机"],points:["非阻塞网络下 SSL 的挑战：传统 OpenSSL API 假设同步阻塞读写，在基于 Muduo 的非阻塞 epoll 下会频繁产生 `SSL_ERROR_WANT_READ / WANT_WRITE`。","内存管道 BIO（`BIO_s_mem`）架构：网络未加密字节流写入 `readBio_`，再通过 `SSL_read` 解密为明文；明文通过 `SSL_write` 加密写入 `writeBio_`，再经由 TCP 发送。","握手状态迁移：`SSL_do_handshake` 返回 1 表示握手成功（迁移到 `ESTABLISHED`），触发上层数据收发回调。"],code:`// Day 19: 内存 BIO 与 SSL 握手循环驱动
#include <openssl/ssl.h>
#include <muduo/net/TcpConnection.h>

void SslConnection::handleHandshake() {
    int ret = SSL_do_handshake(ssl_);
    if (ret == 1) {
        state_ = SSLState::ESTABLISHED;
        return;
    }

    int err = SSL_get_error(ssl_, ret);
    if (err == SSL_ERROR_WANT_READ || err == SSL_ERROR_WANT_WRITE) {
        // 握手需继续交互：从 writeBio 提取数据并发送给客户端
        char buf[4096];
        int bytes = BIO_read(writeBio_, buf, sizeof(buf));
        if (bytes > 0) {
            conn_->send(buf, bytes);
        }
    } else {
        conn_->shutdown(); // 握手失败关闭连接
    }
}`,muduoMap:"深度协议适配：将 OpenSSL 内存 BIO 架构嵌入 muduo::net::Buffer 的读写链条中",check:"能够清晰阐述在非阻塞 EventLoop 下遇到 SSL_ERROR_WANT_READ 时系统的应对策略。",estimatedMinutes:90,budget:{theory:40,code:35,experiment:15},rigorousNuance:{quick:"调用 SSL_read 读出来就是解密数据。",strict:"在异步事件循环中，SSL 握手自身也是通过多次网络报文往返完成的。必须通过 BIO 内存缓存中间报文，并在遇到 WANT_READ 时主动让出 CPU 等待底层 socket 可读。"},experiment:{goal:"模拟客户端发起 HTTPS TLS 握手并在控制台打印协商套件",steps:["启动集成 SslConnection 的 HTTPS 服务器监听 8443","在终端执行 curl -k https://127.0.0.1:8443/ 发起安全连接","检查控制台输出：Using cipher: ... Protocol: TLSv1.3"],expectedOutput:"TLS 握手成功并输出加密套件与握手完成日志",watchPoints:"关注 SSL_do_handshake 状态返回及 BIO 刷新",pitfalls:"在握手未完成前直接调用 SSL_write 发送业务数据导致协议断裂。",buildCommand:"g++ -std=c++17 day19_ssl_handshake.cpp -lssl -lcrypto -lmuduo_net -lmuduo_base -o day19_handshake && ./day19_handshake"},quiz:{questions:[{id:1,question:"在非阻塞 Reactor 架构中，当 SSL_do_handshake 返回错误码 SSL_ERROR_WANT_READ 时，意味着：",options:["客户端密码错误","当前握手需要更多对端数据到达，应将已生成的响应数据发出并等待 socket 下次可读事件","系统内存严重不足，应立即终止进程","证书已经过期"],answer:1,explanation:"WANT_READ 是非阻塞 SSL 的正常状态迁移指示，代表当前状态机在等待网络对端的后续握手数据包，不应作为致命错误直接关闭连接。"}]}},{day:20,week:3,tier:"A",title:"C++ 框架性能调优思路：零拷贝、Buffer 内存池与减少系统调用",bookRange:"语雀专栏: 5. 框架优化思路 (yq_12)",tags:["性能调优","零拷贝","内存池","系统调用优化"],points:["框架吞吐量与 QPS 提升核心路径：减少无意义的内存拷贝、减少用户态与内核态频繁切换。","零拷贝思想在 HTTP 框架中的应用：使用 `string_view` 指针切片解析协议头；针对大文件使用 `sendfile(2)` 系统调用直接通过内核发送。","预分配与对象池化：高频分配的 `HttpRequest`、`HttpContext` 采用内存池机制减少频繁 malloc/free 引发的内存碎片。"],code:`// Day 20: 利用 std::string_view 零拷贝解析 Header
#include <string_view>
#include <iostream>

void parseHeaderZeroCopy(std::string_view line, std::string_view& key, std::string_view& val) {
    auto colon = line.find(':');
    if (colon != std::string_view::npos) {
        key = line.substr(0, colon);
        auto valStart = line.find_first_not_of(' ', colon + 1);
        val = (valStart != std::string_view::npos) ? line.substr(valStart) : "";
    }
}`,muduoMap:"高性能基准：Muduo 设计精髓在于极简内存拷贝与无锁高效数据缓冲区",check:"能够列出至少 3 项在自研 HTTP 框架中切实提升 QPS 的底层调优技术手段。",estimatedMinutes:90,budget:{theory:40,code:30,experiment:20},rigorousNuance:{quick:"优化就是多开几个线程。",strict:"线程数超过 CPU 核心数后，大量的 CPU 时间会被线程上下文切换（Context Switch）和缓存失效（Cache Miss）消耗。性能优化的根本在于单线程效率的最大化和临界区无锁化。"},experiment:{goal:"对比 std::string 与 std::string_view 在解析 100 万次 Header 时的耗时",steps:["循环 1000000 次执行普通 string 分割","循环 1000000 次执行 string_view 零拷贝分割","打印两者在微秒维度的性能提升对比"],expectedOutput:"string_view 耗时较普通 string 降低 60% 以上",watchPoints:"关注 string_view 生命周期必须严格从属于底层 Buffer",pitfalls:"持有生命周期已结束的原 Buffer 的 string_view 导致悬垂引用。",buildCommand:"g++ -std=c++17 day20_benchmark_zerocopy.cpp -O2 -o day20_opt && ./day20_opt"},quiz:{questions:[{id:1,question:"在 C++17 中，使用 std::string_view 代替 std::string 解析高并发请求报文能够显著提升性能的核心原因是：",options:["string_view 内部有硬件加速指令","string_view 仅包含指针和长度（无堆内存拷贝与分配），极大减少了堆碎片和内存分配开销","string_view 会自动将字符转为大写加速比对","string_view 会自动开启 GPU 推理"],answer:1,explanation:"string_view 是一种非拥有的轻量级只读切片，无需在堆上分配新的字符数组，消除了大并发下的堆分配锁争用。"}]}},{day:21,week:3,tier:"A",title:"第一代示范应用卡码五子棋 (GomokuServer) 业务流程与架构瓶颈剖析",bookRange:"语雀专栏: 6. 框架应用之卡码五子棋 (yq_13)",tags:["卡码五子棋","业务实战","组合架构","架构演进"],points:["HttpServer 的组合应用：`GomokuServer` 内部组合 `HttpServer httpServer_`，在构造函数中通过 `initialize()` 统一挂载连接池、会话与路由。","典型业务路由实现：静态资源分发（`EntryHandler` 结合 `FileUtil`）、AI 对战落子（`AiGameMoveHandler`）与后台实时在线人数统计（`getBackendData`）。","第一代架构痛点与瓶颈：业务代码与 HTTP 框架耦合度高；单机内存会话不易横向扩展；落子 AI 纯依靠本地极大极小搜索，缺乏现代大模型推理支撑。"],code:`// Day 21: GomokuServer 路由绑定与后台状态响应
#include "http/HttpServer.h"
#include <nlohmann/json.hpp>

void GomokuServer::getBackendData(const http::HttpRequest& req, http::HttpResponse* resp) {
    nlohmann::json respBody = {
        {"curOnline", getCurOnline()},
        {"maxOnline", getMaxOnline()},
        {"totalUser", getUserCount()}
    };
    std::string body = respBody.dump(4);
    resp->setStatusLine(req.getVersion(), http::HttpResponse::k200Ok, "OK");
    resp->setContentType("application/json");
    resp->setContentLength(body.size());
    resp->setBody(body);
}`,muduoMap:"业务与框架解耦：展示通用 HTTP 框架如何承载实际网络游戏与管理后台业务",check:"能够清晰说明从 GomokuServer 五子棋示范应用走向 CppAIService 的技术演进驱动力。",estimatedMinutes:90,budget:{theory:35,code:35,experiment:20},rigorousNuance:{quick:"五子棋写完了就代表网络框架做完了。",strict:"卡码五子棋是检验 HTTP 框架完整功能的最小可用原型（MVP）。在此基础上剥离具体业务，拓展模型推理与异步消息队列，是迈向工业级 AI 服务平台的关键跨越。"},experiment:{goal:"编译并运行 GomokuServer，验证 / 静态路由与后台数据接口返回",steps:["启动 GomokuServer 并监听 8001 端口","浏览器访问 http://localhost:8001/ 查看登录前端","curl 访问 /backend 接口验证返回当前在线人数的 JSON"],expectedOutput:"成功返回 JSON 格式的在线人数与历史最高在线",watchPoints:"确认静态文件读取使用了 Buffer 缓存而非重复多次 I/O",pitfalls:"前端静态 HTML 资源相对路径配置错误导致 404 Not Found。",buildCommand:"g++ -std=c++17 day21_gomoku_demo.cpp -I./HttpServer/include -lmuduo_net -lmuduo_base -o day21_gomoku && ./day21_gomoku"},quiz:{questions:[{id:1,question:"在五子棋等在线游戏中，若需要高频实时同步玩家落子状态，除了轮询 HTTP，更推荐进一步升级的技术是：",options:["发送电子邮件通知","基于 TCP 升级 WebSocket 长连接实现双向实时推流","将所有落子动作存入磁盘文件","每次落子都断开重新建立 HTTP 连接"],answer:1,explanation:"WebSocket 协议能够在单条 TCP 长连接上实现服务端主动推送与低延迟全双工通信，显著优于传统 HTTP 轮询的头部冗余与时延。"}]}},{day:22,week:4,tier:"S",title:"CppAIService 三层架构演进与 ChatServer 业务调度中枢",bookRange:"语雀专栏: 9. AI应用服务平台第一版 (yq_16)",tags:["CppAIService","ChatServer","AI架构","微服务分层"],points:["CppAIService 系统架构总览：客户端层（Web/对话 UI）-> 应用服务层（自研 HTTP 框架 + ChatServer 调度器）-> 基础支撑层（MySQL + RabbitMQ + ONNX Runtime + 阿里百炼）。","ChatServer 核心职责划分：集中管理 `chatInformation` 内存会话映射、调度 `ChatSendHandler`（对话）、`AIUploadSendHandler`（图像识别）与认证 Handler。","多线程安全映射：`chatInformation` 中以 `std::shared_ptr<AIHelper>` 形式存储指针，读写指针所指内容无需频繁锁住全表，显著提升高并发下的检索效率。"],code:`// Day 22: ChatServer 调度中枢与多用户 AIHelper 映射
#include "http/HttpServer.h"
#include <unordered_map>
#include <mutex>
#include <memory>

class AIHelper;

class ChatServer {
public:
    ChatServer(int port, const std::string& name) : server_(port, name) {
        initializeRoutes();
    }

    std::shared_ptr<AIHelper> getOrCreateHelper(int userId, const std::string& apiKey) {
        std::lock_guard<std::mutex> lock(mutexForChatInformation_);
        auto it = chatInformation_.find(userId);
        if (it == chatInformation_.end()) {
            it = chatInformation_.emplace(userId, std::make_shared<AIHelper>(apiKey)).first;
        }
        return it->second;
    }

private:
    void initializeRoutes();

    http::HttpServer server_;
    std::unordered_map<int, std::shared_ptr<AIHelper>> chatInformation_;
    std::mutex mutexForChatInformation_;
};`,muduoMap:"业务层架构跃迁：将通用网络库提升为智能 AI 对话与图像推理的高性能服务端中枢",check:"能够完整画出 CppAIService 的三层架构图并指出请求从进站到模型调用的全流程。",estimatedMinutes:90,budget:{theory:35,code:40,experiment:15},rigorousNuance:{quick:"ChatServer 就是调用大模型 API 的一个类。",strict:"ChatServer 是集路由分发、认证鉴权、内存上下文缓存、异步消息削峰与本地轻量推理于一体的服务网关。它把耗时的模型调用与数据库 I/O 彻底异步化，确保 HTTP 服务主循环始终处于非阻塞高响应状态。"},experiment:{goal:"验证多用户并发访问 getOrCreateHelper 时的线程安全性与单例复用",steps:["创建 20 个并发线程同时调用 getOrCreateHelper 获取同一 userId 的 helper","打印所有线程获得的指针地址","断言所有指针地址完全相同，且无重复创建"],expectedOutput:"所有并发线程均获得同一个已初始化的 AIHelper 共享实例",watchPoints:"确认互斥锁精确保护 emplace 插入临界区",pitfalls:"在获取到智能指针后依然长时间持有全局大锁，导致多用户完全串行化。",buildCommand:"g++ -std=c++17 day22_chat_server.cpp -lpthread -o day22_chat && ./day22_chat"},quiz:{questions:[{id:1,question:"在 ChatServer 的 chatInformation_ 映射表中，存储 std::shared_ptr<AIHelper> 指针而非直接存储 AIHelper 对象的最大好处是：",options:["节省 8 个字节的内存","多线程在获取到指针后，操作指针指向的对象时无需继续锁定全局映射表，大幅缩短临界区耗时","指针可以自动上传到云端备份","C++ 规范严禁容器存储普通对象"],answer:1,explanation:"短临界区（Short Critical Section）原则：加锁仅用于快速查找或插入共享指针，后续多线程同时操作各自的 AIHelper 内容时无需持有全局大锁，并发性能极大提升。"}]}},{day:23,week:4,tier:"A",title:"AIHelper 封装 cURL 调用阿里云百炼大模型与多轮会话记忆管理",bookRange:"语雀专栏: 9. AI应用服务平台第一版 (yq_16)",tags:["cURL","DashScope","阿里云百炼","上下文记忆","AIHelper"],points:["为什么在 C++ 中使用 libcurl？Muduo 是 L4 传输层网络库，调用外部商业 LLM 服务需要发起标准 HTTPS 客户端请求，libcurl 是工业级事实标准。","AIHelper 结构设计：封装 `DASHSCOPE_API_KEY`、`messages_` 内存历史会话数组、`addMessage` 与 `chat()` 调用链。","会话记忆保证机制：从 MySQL 加载历史按时间戳排序，严格维持 `user -> assistant -> user -> assistant` 的有序交替，防止多轮提示词上下文错位。"],code:`// Day 23: libcurl 封装发起大模型 API 请求并接收响应
#include <curl/curl.h>
#include <string>
#include <nlohmann/json.hpp>

static size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}

std::string requestDashScopeLLM(const std::string& apiKey, const nlohmann::json& payload) {
    CURL* curl = curl_easy_init();
    std::string readBuffer;
    if (curl) {
        struct curl_sstatic struct curl_slist* headers = nullptr;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        std::string authHeader = "Authorization: Bearer " + apiKey;
        headers = curl_slist_append(headers, authHeader.c_str());

        std::string jsonStr = payload.dump();
        curl_easy_setopt(curl, CURLOPT_URL, "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, jsonStr.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
        curl_easy_setopt(curl, CURLOPT_TIMEOUT, 10L); // 10秒超时熔断

        CURLcode res = curl_easy_perform(curl);
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
    }
    return readBuffer;
}`,muduoMap:"出站客户端集成：使基于 Muduo 的服务端具备作为客户端向外部大模型集群发起请求的能力",check:"能够说出 WriteCallback 回调的作用，并说明为什么必须设置 CURLOPT_TIMEOUT。",estimatedMinutes:90,budget:{theory:30,code:45,experiment:15},rigorousNuance:{quick:"调用外部 API 就是发个 HTTP 请求拿 JSON。",strict:"大模型推理延迟极高且存在不可用风险。未设超时限制的同步 cURL 会导致服务线程永久挂起，最终迅速耗尽线程池引起雪崩。必须配置合理的超时熔断与兜底策略。"},experiment:{goal:"使用 libcurl 发起模拟对话请求并解析返回结果",steps:["构建符合 OpenAI 规范的 chat/completions JSON 入参","注入有效 API-Key 并触发 requestDashScopeLLM","校验返回数据中 choices[0].message.content 字段成功提取"],expectedOutput:"成功获得大模型的文本响应",watchPoints:"关注 HTTP 状态码是否为 200，并检查超时降级逻辑",pitfalls:"在多线程环境下未调用 curl_global_init 引发线程安全隐患。",buildCommand:"g++ -std=c++17 day23_curl_llm.cpp -lcurl -o day23_curl && ./day23_curl"},quiz:{questions:[{id:1,question:"在服务高并发场景下调用外部云厂商的大模型接口时，下列哪项设计是最关键的可用性保障？",options:["无限次重试直到大模型返回成功","严格设置 HTTP 请求超时（如 3~5 秒）并在超时发生时执行缓存兜底或快速降级","将所有工作线程的线程优先级调整为最高","在前端直接把 API-Key 暴露给用户"],answer:1,explanation:"大模型云服务在高峰期可能发生延迟激增，若无超时熔断与快速失败机制，积压的请求会瞬间拖垮整台服务器的所有工作线程。"}]}},{day:24,week:4,tier:"S",title:"RabbitMQ 消息队列引入、MQManager 生产者发布与异步削峰解耦",bookRange:"语雀专栏: 9. AI应用服务平台第一版 (yq_16)",tags:["RabbitMQ","MQManager","生产者","异步削峰","消息解耦"],points:["为什么引入 RabbitMQ？多用户聊天场景下，如果每次对话都同步执行磁盘 SQL 插入，I/O 阻塞会直接击垮服务端吞吐量。","生产者发布架构：`pushMessageToMysql` 将拼装好的 SQL 或结构化数据推入 RabbitMQ 的 `sql_queue`，毫秒级返回前端。","单例 MQManager 设计：基于 SimpleAmqpClient 封装 RabbitMQ Channel 创建、信道复用与异常重连机制。"],code:`// Day 24: MQManager 生产者异步消息发布
#include <SimpleAmqpClient/SimpleAmqpClient.h>
#include <string>
#include <memory>
#include <mutex>

class MQManager {
public:
    static MQManager& instance() {
        static MQManager mgr;
        return mgr;
    }

    void init(const std::string& host, const std::string& queueName) {
        queueName_ = queueName;
        channel_ = AmqpClient::Channel::Create(host);
        channel_->DeclareQueue(queueName_, false, true, false, false);
    }

    void publish(const std::string& message) {
        std::lock_guard<std::mutex> lock(mutex_);
        channel_->BasicPublish("", queueName_, AmqpClient::BasicMessage::Create(message));
    }

private:
    std::string queueName_;
    AmqpClient::Channel::ptr_t channel_;
    std::mutex mutex_;
};`,muduoMap:"主从解耦架构：主网络线程只负责快速生产消息，磁盘持久化下沉到消息中间件",check:"能够完整陈述引入 RabbitMQ 后的两大核心收益（异步解耦与削峰填谷）。",estimatedMinutes:90,budget:{theory:35,code:35,experiment:20},rigorousNuance:{quick:"把数据扔到队列里，后台慢慢写。",strict:"消息队列在网络分区或服务崩溃时承担可靠性缓冲。开启消息持久化（Durable）和 ACK 应答机制，可以保证即使 MySQL 临时宕机，对话数据也不会丢失，待数据库恢复后继续消费入库。"},experiment:{goal:"向 RabbitMQ 队列并发推送 1000 条消息并验证发布性能",steps:["启动 Docker 中的 rabbitmq-server","多线程循环调用 MQManager::publish 推入模拟 SQL","通过 rabbitmqctl list_queues 验证队列消息数量达到 1000"],expectedOutput:"消息以微秒级耗时被迅速投递至队列，主线程无任何阻塞",watchPoints:"观察消息队列内存占用与 RabbitMQ 状态",pitfalls:"队列未声明为持久化，导致 RabbitMQ 服务重启后堆积数据丢失。",buildCommand:"g++ -std=c++17 day24_mq_producer.cpp -lSimpleAmqpClient -o day24_producer && ./day24_producer"},quiz:{questions:[{id:1,question:"在 AI 对话服务中，将聊天记录写入 MySQL 改为先发送至 RabbitMQ 的核心工程目的是：",options:["让数据库能够执行大模型推理","异步解耦与削峰填谷，避免高并发下磁盘 I/O 阻塞主服务线程，提升接口响应速度","将数据强制转换为加密格式","替代前端页面的渲染工作"],answer:1,explanation:"消息队列将耗时的磁盘持久化从前台核心请求链路中剥离出来，服务端完成对话后可立即响应前端，大幅提升吞吐量。"}]}},{day:25,week:4,tier:"S",title:"RabbitMQThreadPool 消费者线程池设计与 MySQL 异步写入实测",bookRange:"语雀专栏: 9. AI应用服务平台第一版 (yq_16)",tags:["消费者","线程池","异步入库","消息确认","并发压测"],points:["多消费者线程池设计：既然 Muduo 处理层有多个工作线程在生产消息，若只有单线程消费则无法跟上产生速度，必须配备多线程消费者池。","消费者工作循环：每个 worker 线程独立持有 `AmqpClient::Channel`，持续从 `sql_queue` 取出消息并执行 `executeMysql` 回调。","系统整体闭环：前端请求 -> ChatServer 调度 -> cURL 调用大模型 -> 内存更新 -> MQ 生产发布 -> 消费者多线程批量写库 -> 前端返回，构建完整高并发业务闭环。"],code:`// Day 25: RabbitMQThreadPool 消费者多线程异步入库
#include <SimpleAmqpClient/SimpleAmqpClient.h>
#include <vector>
#include <thread>
#include <functional>

class RabbitMQThreadPool {
public:
    using HandlerFunc = std::function<void(const std::string&)>;

    RabbitMQThreadPool(const std::string& host, const std::string& queue, int threadNum, HandlerFunc handler)
        : host_(host), queue_(queue), threadNum_(threadNum), handler_(handler), running_(false) {}

    void start() {
        running_ = true;
        for (int i = 0; i < threadNum_; ++i) {
            threads_.emplace_back(&RabbitMQThreadPool::workerLoop, this);
        }
    }

private:
    void workerLoop() {
        auto channel = AmqpClient::Channel::Create(host_);
        std::string consumerTag = channel->BasicConsume(queue_, "");
        while (running_) {
            AmqpClient::Envelope::ptr_t envelope;
            if (channel->BasicConsumeMessage(consumerTag, envelope, 1000)) {
                std::string msg = envelope->Message()->Body();
                handler_(msg); // 执行 SQL 入库操作
                channel->BasicAck(envelope); // 消息处理成功确认
            }
        }
    }

    std::string host_, queue_;
    int threadNum_;
    HandlerFunc handler_;
    bool running_;
    std::vector<std::thread> threads_;
};`,muduoMap:"端到端闭环协同：形成“L4传输 -> L7状态机 -> AI大模型 -> 消息队列 -> 数据库”工业级架构闭环",check:"能够说出消费端 BasicAck 的确认机制如何防止消息在服务端崩溃时丢失。",estimatedMinutes:90,budget:{theory:35,code:40,experiment:15},rigorousNuance:{quick:"每个线程从队列拿一条消息执行就行。",strict:"SimpleAmqpClient 的 Channel 并非线程安全对象。不能让多个工作线程并发共享同一个 Channel，必须每个工作线程独立创建独立的 Channel 实例进行独立消费。"},experiment:{goal:"启动消费者线程池消费前一天堆积的 1000 条消息并写入 MySQL",steps:["启动 RabbitMQThreadPool（4 个线程）绑定 executeMysql 回调","观察控制台快速消费日志与队列深度迅速降为 0","进入 MySQL 查询 chat_message 表验证 1000 条记录全部完整持久化"],expectedOutput:"1000 条数据准确无误全部入库，数据无一丢失",watchPoints:"关注 BasicAck 确认与多线程写库无死锁",pitfalls:"在线程间共享同一个 Channel 导致底层 socket 读写竞争断开连接。",buildCommand:"g++ -std=c++17 day25_mq_consumer.cpp -lSimpleAmqpClient -lmysqlcppconn -lpthread -o day25_consumer && ./day25_consumer"},quiz:{questions:[{id:1,question:"在多线程消费 RabbitMQ 队列时，每个消费者线程为什么必须创建自己专属的 Channel 实例？",options:["RabbitMQ 规定每个系统只能有一个 Channel","AMQP Channel 协议对象并非线程安全，跨线程并发读写同一 Channel 会引发帧序列错乱与连接强制中断","为了将不同线程绑定到不同的物理网卡","如果不这样做编译器会报语法错误"],answer:1,explanation:"AMQP 规范规定同一个 Connection 内的 Channel 仅支持单线程串行操作。多线程下必须每个线程分配独立 Channel。"}]}},{day:26,week:4,tier:"A",title:"OpenCV 图像预处理 (像素转张量) + ONNX Runtime (MobileNetV2) 本地推理部署",bookRange:"语雀专栏: 9. AI应用服务平台第一版 (yq_16)",tags:["ONNX Runtime","OpenCV","MobileNetV2","图像识别","张量预处理"],points:["为什么在容器内集成轻量推理模型：避免外部 API 的网络往返与云端计费，在服务器本地快速完成基础计算机视觉（CV）任务。","OpenCV 图像预处理流水线：前端传来的 Base64 图片经解码后，通过 `cv::imdecode` 还原为 BGR 像素，依次执行 Resize (224x224)、RGB 转换、归一化（mean/std）并转换为 Float32 连续张量。","ONNX Runtime 原生 C++ API 封装：`Ort::Env`、`Ort::Session` 加载 `mobilenetv2-7.onnx`，执行 `session->Run` 前向传播，输出 1000 维分类概率并完成 Softmax 映射。"],code:`// Day 26: OpenCV 像素转张量与 ONNX Runtime 模型推理
#include <opencv2/opencv.hpp>
#include <onnxruntime_cxx_api.h>
#include <vector>
#include <string>

class ImageRecognizer {
public:
    ImageRecognizer(const std::string& modelPath) {
        env_ = std::make_unique<Ort::Env>(ORT_LOGGING_LEVEL_WARNING, "ImageRecognizer");
        Ort::SessionOptions sessionOptions;
        sessionOptions.SetIntraOpNumThreads(2);
        session_ = std::make_unique<Ort::Session>(*env_, modelPath.c_str(), sessionOptions);
    }

    std::string predict(const std::vector<uchar>& imgData) {
        cv::Mat img = cv::imdecode(imgData, cv::IMREAD_COLOR);
        if (img.empty()) return "Decode Failed";

        // 预处理：Resize 为 224x224 并转为 RGB 归一化浮点张量
        cv::Mat resized, floatImg;
        cv::resize(img, resized, cv::Size(224, 224));
        resized.convertTo(floatImg, CV_32FC3, 1.0 / 255.0);

        // ... 转换为 NCHW 张量并执行 session_->Run ...
        return "golden_retriever (置信度: 0.95)";
    }

private:
    std::unique_ptr<Ort::Env> env_;
    std::unique_ptr<Ort::Session> session_;
};`,muduoMap:"多模态推理能力：使服务端在纯文本 HTTP 处理之外，具备本地端到端深度学习推理服务能力",check:"能够完整叙述将一张 JPG 图片转换为 ONNX 输入 NCHW 张量的具体变换步骤。",estimatedMinutes:90,budget:{theory:35,code:40,experiment:15},rigorousNuance:{quick:"调下模型就有结果了。",strict:"视觉模型推理的大部分耗时往往集中在预处理阶段（OpenCV 像素格式转换与归一化）。必须保证张量内存布局（HWC 转 CHW）完全符合训练期的要求，否则推理结果分类会发生彻底偏离。"},experiment:{goal:"加载 MobileNetV2 模型完成一张小狗图片的本地推理分类",steps:["读取测试图片 dog.jpg 并转为二进制字节流","调用 ImageRecognizer::predict 执行模型前向传播","校验输出最高概率类别索引与对应名称标签"],expectedOutput:"成功输出分类标签且耗时在 20ms 以内",watchPoints:"关注 OpenCV 的 BGR 到 RGB 转换与归一化参数",pitfalls:"通道顺序未从 BGR 转 RGB，导致模型输入特征错乱，识别准确率严重下降。",buildCommand:"g++ -std=c++17 day26_onnx_infer.cpp -lopencv_core -lopencv_imgproc -lopencv_imgcodecs -lonnxruntime -o day26_onnx && ./day26_onnx"},quiz:{questions:[{id:1,question:"在很多深度学习模型（如 MobileNetV2）的输入张量规范中，NCHW 代表的四个维度分别是：",options:["网络、通道、高、宽 (Network, Channel, Height, Width)","批次大小、通道数、图像高度、图像宽度 (Batch Size, Channels, Height, Width)","节点、核心、硬件、字长 (Node, Core, Hardware, Word)","法向量、坐标、色相、权重 (Normal, Coordinate, Hue, Weight)"],answer:1,explanation:"NCHW 是计算机视觉张量格式的经典缩写，N 是 Batch 批量大小，C 是颜色通道数（如 RGB 为 3），H 为图像高度（像素行数），W 为图像宽度（像素列数）。"}]}},{day:27,week:4,tier:"A",title:"第二版架构演进：(userId, sessionId) 复合键多会话管理与系统容错强化",bookRange:"语雀专栏: 9. AI应用服务平台第一版 (yq_16) 架构升级思考",tags:["第二版架构","多会话管理","复合键","高容错","原子操作"],points:["第一版架构的局限性：单用户只能持有一个单一的 AIHelper 对话列表，无法像 ChatGPT 一样创建“新的对话”并自由切换历史话题。","多会话复合键设计：将一维映射 `userId -> AIHelper` 重构成二维复合键 `(userId, sessionId) -> AIHelper`，支持无限平滑扩展多会话。","服务异常崩溃后的恢复容错：引入数据序列校验机制，防范一问一答因为进程被杀导致的数据两两错位问题。"],code:`// Day 27: 二维复合键多会话管理模型
#include <string>
#include <unordered_map>
#include <memory>

struct SessionKey {
    int userId;
    std::string sessionId;
    bool operator==(const SessionKey& o) const {
        return userId == o.userId && sessionId == o.sessionId;
    }
};

struct SessionKeyHash {
    size_t operator()(const SessionKey& k) const {
        return std::hash<int>{}(k.userId) ^ (std::hash<std::string>{}(k.sessionId) << 1);
    }
};

// 升级版多会话管理字典
std::unordered_map<SessionKey, std::shared_ptr<AIHelper>, SessionKeyHash> multiSessionMap_;`,muduoMap:"企业级状态模型：使平台完全对齐现代商业 AI 产品（如 ChatGPT / Claude）的多会话能力",check:"能够说出从单会话扩展为多会话需要对数据库表和内存字典做出哪些结构体变动。",estimatedMinutes:90,budget:{theory:35,code:35,experiment:20},rigorousNuance:{quick:"再加个字段存个 sessionId 就行了。",strict:"不仅是内存加复合键。数据库 chat_message 表必须新增 session_id 字段并建立复合联合索引 (user_id, session_id, ts)，在服务启动加载历史时按 session_id 进行分组拉取，才能保证快速精确恢复。"},experiment:{goal:"模拟同一用户创建两个独立主题会话（如 C++ 学习、五子棋算法），验证会话互不干扰",steps:['为 userId=101 分别创建 sessionId="math_01" 和 sessionId="cpp_02"',"分别向两个会话提交独立提问","校验两个会话的历史消息数组完全隔离"],expectedOutput:"两个会话的上下文记忆完全独立，互不污染",watchPoints:"确认 SessionKeyHash 的正确性",pitfalls:"在复合键设计中未重载 operator== 导致 std::unordered_map 编译报错。",buildCommand:"g++ -std=c++17 day27_multi_session.cpp -o day27_multisession && ./day27_multisession"},quiz:{questions:[{id:1,question:"在将系统从单会话扩展为多会话管理时，MySQL 的 chat_message 表应该推荐建立哪种索引以支撑极速历史回显？",options:["仅在 content 上建立全文索引","在 (user_id, session_id, ts) 三个字段上建立联合复合索引","不建立任何索引","仅在 is_user 字段上建立唯一索引"],answer:1,explanation:"复合索引能够以最左匹配原则，一次性快速覆盖针对指定用户、指定会话ID并按时间戳升序排序的检索查询，避免产生全表扫描和文件排序（filesort）。"}]}},{day:28,week:4,tier:"S",title:"STAR 法则项目简历包装与 15 道大厂高频面试题连环追问全真演练",bookRange:"语雀专栏: 7.简历写法 (yq_14) + 8.相关面试题 (yq_15)",tags:["STAR法则","大厂八股","简历亮点","面试演练","技术护城河"],points:["用 STAR 法则精准提炼项目经历：Situation（传统 WebServer 业务扩展能力差）、Task（搭建支持动态路由与中间件的高性能 HTTP 框架并落地 AI 推理平台）、Action（自研 FSM 状态机、集成 RabbitMQ 削峰、ONNX 本地推理）、Result（支撑高并发、QPS 提升、低延迟交付）。","高频连环追问全真攻坚：涵盖 epoll ET/LT、TCP 粘包拆包、RAII 异常安全、洋葱模型 C++ 实现、SSL 握手非阻塞处理、数据库连接池超时保活等。","构建项目核心护城河：清晰表达从网络底层、应用协议、分布式消息削峰到本地模型推理的全链路工程洞察力。"],code:`// Day 28: 面试核心架构与调用链口述提纲
/*
【向面试官介绍项目核心骨架】
1. 底座：基于 One Loop Per Thread Reactor 模型，用 Muduo 网络库处理非阻塞 L4 传输；
2. 应用层：自研 HttpContext 有限状态机，高效解析 HTTP 报文并解决 TCP 粘包拆包；
3. 路由与扩展：双层路由（静态哈希 O(1) + 动态正则），洋葱模型责任链解耦 CORS 跨域；
4. 数据与性能：RAII 自动化 MySQL 连接池，心跳探活避免 8 小时断开；
5. AI赋能与解耦：集成 RabbitMQ 消息队列将聊天写入异步化，大幅削峰填谷，结合 OpenCV + ONNX Runtime 实现毫秒级端侧视觉推理。
*/
#include <iostream>

int main() {
    std::cout << "=== Muduo & CppAIService 28天实战攻坚体系全部圆满达成! ===" << std::endl;
    return 0;
}`,muduoMap:"全景融合与求职跃迁：将 28 天所学知识沉淀为具备高辨识度的求职工程实力",check:"能够脱稿、流利地向面试官用 3 分钟介绍本项目的技术架构、痛点突破与量化指标。",estimatedMinutes:90,budget:{theory:50,code:20,experiment:20},rigorousNuance:{quick:"背一下八股文应付面试就行。",strict:"大厂面试官极看重真实踩坑经历（如动态路由 newReq 传参缺陷、连接池次日超时卡死、异步消息丢失）。能说出具体的 RCA 根因与修复过程，才是区别于普通背诵者的核心竞争力。"},experiment:{goal:"对照 15 道大厂高频面试题清单进行全真口述演练并自查答题完整性",steps:["脱稿回答“epoll 边缘触发与水平触发的区别及在 muduo 中的应用”","脱稿回答“在非阻塞 Reactor 架构中如何处理 SSL_ERROR_WANT_READ”","脱稿回答“引入 RabbitMQ 异步写库如何进行削峰填谷与可靠性保障”"],expectedOutput:"逻辑条理清晰，技术术语精确，直击底层原理",watchPoints:"避免泛泛而谈，结合具体源码类名（如 HttpContext, AIHelper, MQManager）陈述事实",pitfalls:"夸大其词使用浮夸词汇被面试官追问底层汇编或内核机制时露怯。",buildCommand:"g++ -std=c++17 day28_interview_ready.cpp -o day28_interview && ./day28_interview"},quiz:{questions:[{id:1,question:"在向大厂技术专家介绍 CppAIService 项目经历时，最能体现工程深度与严谨素养的表述策略是：",options:["大量使用“神级”、“降维打击”、“顶尖突破”等词汇提升气势","以真实业务场景为牵引，准确陈述客观技术原理（如 FSM 状态转移、BIO 加解密、Channel 线程隔离），并详述实际遇到的 Bug 根因与解决解法","告诉面试官所有代码都是自己独立从汇编写起的","只讲概念，拒绝讨论任何具体代码实现细节"],answer:1,explanation:"高级工程素养的核心是求真务实。清晰交代系统边界、底层机制与真实的排障过程，最能展现扎实的工程功底。"}]}}],We=()=>{const[n,r]=g.useState(!1),[i,u]=g.useState(""),[l,a]=g.useState(!1),s=g.useRef(null),h=()=>{try{const c=JSON.parse(localStorage.getItem("muduo_day_mastery")||"{}"),x=JSON.parse(localStorage.getItem("muduo_day_notes")||"{}"),m=JSON.parse(localStorage.getItem("muduo_quiz_scores")||"{}"),t=JSON.parse(localStorage.getItem("completedAlgos")||"[]"),p=JSON.parse(localStorage.getItem("muduo_custom_pitfalls")||"[]"),b=new Date().toISOString().split("T")[0];let _=`# C++ 与 Muduo 后端工程全量学习与演进档案

`;_+=`> 归档导出时间：${b} | Muduo & CppAIService

`,_+=`## 1. 学习指标与总体概况

`,_+=`- 算法题库完成数：${t.length} 道
`,_+=`- 28天任务已标注天数：${Object.keys(c).length} / 28 天
`,_+=`- 自测通过天数：${Object.values(m).filter(k=>k>=75).length} 天

`,_+=`## 2. 28 天每日任务与学习手记

`,O.forEach(k=>{const B=c[k.day]||0,Z=m[k.day],z=x[k.day];_+=`### Day ${k.day}: ${k.title} (掌握度: ${B}/5 阶)

`,_+=`- **专著范围**：${k.bookRange}
`,_+=`- **Muduo 落地**：${k.muduoMap}
`,Z!==void 0&&(_+=`- **自测得分**：${Z} 分
`),z&&z.trim()&&(_+=`
**学习笔记与排障记录**：

\`\`\`
${z.trim()}
\`\`\`
`),_+=`
---

`}),p.length>0&&(_+=`## 3. 问题记录

`,p.forEach((k,B)=>{_+=`### 问题 #${B+1}: ${k.title}

`,_+=`- **现象**: ${k.errorSymptom}
`,_+=`- **原因**: ${k.errorCause}
`,_+=`- **总结**: ${k.conclusion}

`}));const C=new Blob([_],{type:"text/markdown;charset=utf-8;"}),R=URL.createObjectURL(C),U=document.createElement("a");U.href=R,U.download=`muduo_study_archive_${b.replace(/-/g,"")}.md`,U.click(),URL.revokeObjectURL(R),v("学习档案 Markdown 已导出并下载","success")}catch(c){v(`导出失败: ${c.message}`,"warning")}},o=()=>{try{const c={};for(let _=0;_<localStorage.length;_++){const C=localStorage.key(_);if(C&&(C.startsWith("muduo_")||C.startsWith("completed")||C.startsWith("knowledge")))try{c[C]=JSON.parse(localStorage.getItem(C)||"null")}catch{c[C]=localStorage.getItem(C)}}const x=JSON.stringify(c,null,2),m=new Date().toISOString().split("T")[0],t=new Blob([x],{type:"application/json;charset=utf-8;"}),p=URL.createObjectURL(t),b=document.createElement("a");b.href=p,b.download=`muduo_study_backup_${m.replace(/-/g,"")}.json`,b.click(),URL.revokeObjectURL(p),v("全量 JSON 备份已下载","success")}catch(c){v(`导出失败: ${c.message}`,"warning")}},y=c=>{var t;const x=(t=c.target.files)==null?void 0:t[0];if(!x)return;const m=new FileReader;m.onload=p=>{var _;const b=(_=p.target)==null?void 0:_.result;u(b),r(!0)},m.readAsText(x),c.target.value=""},d=c=>{try{const x=JSON.parse(i);if(typeof x!="object"||!x)throw new Error("无效的 JSON 格式");if(c==="overwrite"){const m=[];for(let t=0;t<localStorage.length;t++){const p=localStorage.key(t);p&&(p.startsWith("muduo_")||p.startsWith("completed")||p.startsWith("knowledge"))&&m.push(p)}m.forEach(t=>localStorage.removeItem(t))}Object.entries(x).forEach(([m,t])=>{if(c==="merge"&&typeof t=="object"&&t!==null&&!Array.isArray(t)){const p=JSON.parse(localStorage.getItem(m)||"{}");localStorage.setItem(m,JSON.stringify({...p,...t}))}else if(c==="merge"&&Array.isArray(t)){const p=JSON.parse(localStorage.getItem(m)||"[]"),b=Array.from(new Set([...p,...t]));localStorage.setItem(m,JSON.stringify(b))}else localStorage.setItem(m,JSON.stringify(t))}),r(!1),v(c==="overwrite"?"已完全覆盖导入备份数据":"已成功合并导入备份数据","success"),setTimeout(()=>{window.location.reload()},600)}catch(x){v(`导入失败: ${x.message}`,"warning")}},f=()=>{const c=[];for(let x=0;x<localStorage.length;x++){const m=localStorage.key(x);m&&(m.startsWith("muduo_")||m.startsWith("completed")||m.startsWith("knowledge"))&&c.push(m)}c.forEach(x=>localStorage.removeItem(x)),a(!1),v("学习系统已重置为初始状态","info"),setTimeout(()=>{window.location.reload()},600)};return e.jsxs("footer",{className:"mt-16 border-t border-white/60 dark:border-white/10 bg-white/80 dark:bg-[#1a1f2c]/80 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.03)]",children:[e.jsxs("div",{className:"max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row items-center gap-2 sm:gap-4",children:[e.jsx("span",{className:"font-bold text-slate-700 dark:text-slate-300",children:"Muduo & CppAIService"}),e.jsx("span",{className:"hidden sm:inline text-slate-300 dark:text-slate-700",children:"|"}),e.jsx("span",{children:"数据仅保存在当前浏览器本地，无隐私泄漏风险"})]}),e.jsxs("div",{className:"flex flex-wrap items-center gap-2.5",children:[e.jsx("input",{type:"file",ref:s,onChange:y,accept:".json",className:"hidden"}),e.jsxs("button",{onClick:h,className:"inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-white/80 dark:border-white/10 shadow-[2px_2px_6px_rgba(0,0,0,0.06),inset_1px_1px_2px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] font-bold cursor-pointer",title:"导出结构化 Markdown 归档复盘文档",children:[e.jsx(ke,{size:14,className:"text-sky-600"}),e.jsx("span",{children:"导出学习档案.md"})]}),e.jsxs("button",{onClick:o,className:"inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-white/80 dark:border-white/10 shadow-[2px_2px_6px_rgba(0,0,0,0.06),inset_1px_1px_2px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] font-bold cursor-pointer",title:"全量导出 JSON 备份",children:[e.jsx(ve,{size:14,className:"text-emerald-600"}),e.jsx("span",{children:"导出 JSON 备份"})]}),e.jsxs("button",{onClick:()=>{var c;return(c=s.current)==null?void 0:c.click()},className:"inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border border-white/80 dark:border-white/10 shadow-[2px_2px_6px_rgba(0,0,0,0.06),inset_1px_1px_2px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] font-bold cursor-pointer",title:"读取并恢复 JSON 备份",children:[e.jsx($,{size:14,className:"text-amber-600"}),e.jsx("span",{children:"导入备份"})]}),e.jsxs("button",{onClick:()=>a(!0),className:"inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] font-bold cursor-pointer",title:"重置系统",children:[e.jsx(ue,{size:14}),e.jsx("span",{children:"重置"})]})]})]}),n&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs",children:e.jsxs("div",{className:"bg-white dark:bg-[#1a1f2c] rounded-3xl max-w-md w-full p-6 sm:p-7 border border-white/80 dark:border-white/10 shadow-[12px_12px_32px_rgba(0,0,0,0.2),inset_2px_2px_4px_rgba(255,255,255,0.7)] space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3",children:[e.jsxs("h3",{className:"font-bold text-base text-slate-900 dark:text-white flex items-center gap-2",children:[e.jsx($,{size:16,className:"text-sky-600"}),"选择数据恢复模式"]}),e.jsx("button",{onClick:()=>r(!1),className:"p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",children:e.jsx(Y,{size:16})})]}),e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-400 leading-relaxed",children:"检测到已读取的备份文件。你可以选择与当前已有的学习记录合并，或者完全覆盖现有进度："}),e.jsxs("div",{className:"grid grid-cols-2 gap-3 pt-2",children:[e.jsx("button",{onClick:()=>d("merge"),className:"p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800 text-sky-800 dark:text-sky-200 font-bold text-xs hover:bg-sky-100 shadow-[2px_2px_6px_rgba(14,165,233,0.15),inset_1px_1px_2px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",children:"合并数据 (保留本地)"}),e.jsx("button",{onClick:()=>d("overwrite"),className:"p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800 text-rose-800 dark:text-rose-200 font-bold text-xs hover:bg-rose-100 shadow-[2px_2px_6px_rgba(244,63,94,0.15),inset_1px_1px_2px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",children:"完全覆盖 (以文件为准)"})]})]})}),l&&e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs",children:e.jsxs("div",{className:"bg-white dark:bg-[#1a1f2c] rounded-3xl max-w-sm w-full p-6 sm:p-7 border border-white/80 dark:border-white/10 shadow-[12px_12px_32px_rgba(0,0,0,0.2),inset_2px_2px_4px_rgba(255,255,255,0.7)] space-y-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"p-3 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]",children:e.jsx(ce,{size:22})}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-bold text-base text-slate-900 dark:text-white",children:"确定重置系统吗？"}),e.jsx("p",{className:"text-xs text-slate-500 mt-0.5",children:"这将清空所有打卡记录、掌握星级与手记，此操作不可逆！"})]})]}),e.jsxs("div",{className:"flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800/80",children:[e.jsx("button",{onClick:()=>a(!1),className:"px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold active:scale-x-105 active:scale-y-90 transition-all duration-300 cursor-pointer",children:"取消"}),e.jsx("button",{onClick:f,className:"px-5 py-2 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-600 text-white text-xs font-bold shadow-[2px_2px_8px_rgba(244,63,94,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",children:"确认重置"})]})]})})]})},oe=({code:n,language:r="cpp",title:i,className:u="",maxHeight:l="max-h-[600px]"})=>{const[a,s]=g.useState(!1),h=g.useMemo(()=>{const d=(r||"").toLowerCase().trim();return d==="c++"?"cpp":d==="sh"||d==="shell"?"bash":d==="js"?"javascript":d==="ts"?"typescript":d==="py"?"python":d||"cpp"},[r]),o=g.useMemo(()=>{if(!n)return"";try{return D.getLanguage(h)?D.highlight(n,{language:h,ignoreIllegals:!0}).value:D.highlightAuto(n).value}catch{return n.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}},[n,h]),y=d=>{d.stopPropagation(),navigator.clipboard.writeText(n).then(()=>{s(!0),setTimeout(()=>s(!1),2e3)})};return e.jsxs("div",{className:`my-3 rounded-2xl overflow-hidden border border-white/70 dark:border-white/10 bg-white/90 dark:bg-[#1a1f2c]/90 text-slate-800 dark:text-[#cccccc] shadow-[6px_6px_16px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] text-[13px] font-mono ${u}`,children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-2.5 bg-slate-100/70 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 select-none shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8)]",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx(me,{size:14,className:"text-sky-600 dark:text-sky-400"}),e.jsx("span",{className:"font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 font-mono text-[11px]",children:i||h}),e.jsxs("span",{className:"text-[10px] text-slate-400 font-medium",children:["(",n.split(`
`).length," 行)"]})]}),e.jsx("button",{onClick:y,className:"flex items-center gap-1.5 px-3 py-1 rounded-2xl bg-white/90 dark:bg-slate-800/90 hover:bg-white text-slate-700 dark:text-slate-200 border border-white/80 dark:border-white/10 shadow-[2px_2px_5px_rgba(0,0,0,0.06),inset_1px_1px_2px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-xs font-bold cursor-pointer",title:"复制代码",type:"button",children:a?e.jsxs(e.Fragment,{children:[e.jsx(J,{size:13,className:"text-emerald-500 dark:text-emerald-400 transition-transform scale-110"}),e.jsx("span",{className:"text-emerald-600 dark:text-emerald-400 font-bold",children:"已复制"})]}):e.jsxs(e.Fragment,{children:[e.jsx(K,{size:13}),e.jsx("span",{children:"复制代码"})]})})]}),e.jsx("div",{className:`p-4 overflow-x-auto leading-relaxed bg-slate-50/50 dark:bg-[#151922]/50 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.04)] ${l}`,children:e.jsx("pre",{className:"m-0 bg-transparent p-0 font-mono text-[13px] leading-relaxed whitespace-pre hljs",children:e.jsx("code",{dangerouslySetInnerHTML:{__html:o}})})})]})},Ke=({isOpen:n,onClose:r})=>{const[i,u]=g.useState("concept");if(!n)return null;const l=a=>{navigator.clipboard.writeText(a).then(()=>{v("指令已复制到剪贴板","success")})};return e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-in fade-in",children:e.jsxs("div",{className:"bg-white dark:bg-[#1a1f2c] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-white/80 dark:border-white/10 shadow-[12px_12px_32px_rgba(0,0,0,0.2),inset_2px_2px_4px_rgba(255,255,255,0.7)] flex flex-col justify-between space-y-5",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4 shrink-0",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"p-2.5 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900/60 dark:to-sky-800/40 text-sky-700 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.06)]",children:e.jsx(pe,{size:22})}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("h3",{className:"text-base sm:text-lg font-black text-slate-900 dark:text-white",children:"Linux 开发环境实操手册：基于 VS Code Remote-SSH 与云服务器"}),e.jsx("span",{className:"px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-bold shadow-[inset_1px_1px_2px_rgba(245,158,11,0.15)]",children:"环境指南"})]}),e.jsx("p",{className:"text-xs text-slate-500 dark:text-slate-400 mt-0.5",children:"说明在 Windows 编写代码并在云端 Linux 环境下编译、调试与内存检测的操作方法"})]})]}),e.jsx("button",{onClick:r,className:"w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center shadow-[2px_2px_6px_rgba(0,0,0,0.05),inset_1px_1px_2px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer","aria-label":"关闭指引",children:e.jsx(Y,{size:18})})]}),e.jsxs("div",{className:"flex items-center gap-1.5 overflow-x-auto p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-xs font-bold shrink-0",children:[e.jsxs("button",{onClick:()=>u("concept"),className:`px-3.5 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-1.5 shrink-0 ${i==="concept"?"bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_6px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5"}`,children:[e.jsx(ee,{size:14}),e.jsx("span",{children:"1. 核心认知破局"})]}),e.jsxs("button",{onClick:()=>u("steps"),className:`px-3.5 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-1.5 shrink-0 ${i==="steps"?"bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_6px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5"}`,children:[e.jsx(Se,{size:14}),e.jsx("span",{children:"2. 云服务器实战 8 步"})]}),e.jsxs("button",{onClick:()=>u("matrix"),className:`px-3.5 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-1.5 shrink-0 ${i==="matrix"?"bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_6px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5"}`,children:[e.jsx(Te,{size:14}),e.jsx("span",{children:"3. 运作对照矩阵"})]}),e.jsxs("button",{onClick:()=>u("debug"),className:`px-3.5 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-1.5 shrink-0 ${i==="debug"?"bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_6px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5"}`,children:[e.jsx(ne,{size:14}),e.jsx("span",{children:"4. 调试与 ASan 内存检测"})]}),e.jsxs("button",{onClick:()=>u("cmake"),className:`px-3.5 py-2 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-105 active:scale-y-90 cursor-pointer flex items-center gap-1.5 shrink-0 ${i==="cmake"?"bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[2px_2px_6px_rgba(14,165,233,0.35),inset_1px_1px_2px_rgba(255,255,255,0.5)]":"text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:-translate-y-0.5"}`,children:[e.jsx(Le,{size:14}),e.jsx("span",{children:"5. 工程构建 CMake 与 WSL2"})]})]}),e.jsxs("div",{className:"space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed",children:[i==="concept"&&e.jsx("div",{className:"space-y-4",children:e.jsxs("div",{className:"bg-gradient-to-br from-amber-100/70 via-orange-50/70 to-yellow-100/70 dark:from-amber-950/40 dark:via-orange-900/30 dark:to-yellow-900/40 border border-white/70 dark:border-white/10 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.8)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08)] rounded-3xl p-5 sm:p-6 space-y-3",children:[e.jsxs("div",{className:"font-bold text-amber-900 dark:text-amber-200 text-sm mb-1.5 flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 rounded-xl flex items-center justify-center bg-amber-200/80 dark:bg-amber-900/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-700 dark:text-amber-300",children:e.jsx(ee,{size:14})}),e.jsx("span",{children:"开发模式说明：“Windows 编辑与远程 Linux 执行”"})]}),e.jsxs("p",{className:"text-xs text-amber-950/80 dark:text-amber-300/80 leading-relaxed font-medium",children:["初学远程开发容易产生误区：以为要在本地保存 ",e.jsx("code",{children:"main.cpp"}),"，再通过文件传输复制到远程机器编译。",e.jsx("strong",{children:"实际开发中通常采用基于 SSH 协议的远程编辑工作流。"})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3 text-xs",children:[e.jsxs("div",{className:"p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] space-y-1.5",children:[e.jsx("div",{className:"font-bold text-rose-800 dark:text-rose-300 mb-1 flex items-center gap-1.5",children:e.jsx("span",{children:"✕ 繁琐低效做法"})}),e.jsx("p",{className:"text-rose-700 dark:text-rose-400 leading-relaxed",children:"在 Windows 写好代码 ➔ 用 Xftp 传到服务器 ➔ Xshell 敲命令编译 ➔ 报错再回 Windows 改。链路割裂，无法使用断点调试。"})]}),e.jsxs("div",{className:"p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] space-y-1.5",children:[e.jsx("div",{className:"font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5",children:e.jsx("span",{children:"✓ 工业标准做法"})}),e.jsxs("p",{className:"text-emerald-700 dark:text-emerald-400 leading-relaxed",children:["代码物理存放在云服务器 ",e.jsx("code",{children:"~/projects"})," 目录下。Windows VS Code 通过 Remote-SSH 打开该目录，按 ",e.jsx("code",{children:"Ctrl+S"})," 直接保存至云端，并在集成终端即时编译运行。"]})]})]})]})}),i==="steps"&&e.jsx("div",{className:"space-y-3",children:[{step:1,title:"在 Windows VS Code 安装 Remote - SSH 插件",desc:"打开扩展市场（Ctrl+Shift+X），搜索并安装微软官方的 Remote - SSH 插件。"},{step:2,title:"云服务器控制台配置安全组放行 22 端口",desc:"在阿里云控制台 -> 实例安全组中，确保入方向放行 TCP 22 端口 (SSH 服务)。若测试 Web 服务，同时放行 8080 或 8000 端口。"},{step:3,title:"Windows PowerShell 生成 SSH 密钥对实现一键免密",desc:"在本地运行 ssh-keygen -t rsa -b 4096，随后使用 ssh-copy-id -i ~/.ssh/id_rsa.pub root@<服务器公网IP> 将公钥写入云服务器。",cmd:"ssh-keygen -t rsa -b 4096"},{step:4,title:"配置 VS Code ~/.ssh/config 快速直连",desc:"编辑配置文件添加别名配置：",code:`Host aliyun-muduo
    HostName 你的公网IP
    User root
    IdentityFile ~/.ssh/id_rsa`},{step:5,title:"连接云端并打开项目工作区",desc:"点击左下角绿色双向箭头图标 -> Connect to Host -> 选择 aliyun-muduo。新建终端运行 mkdir -p ~/projects/muduo_study && cd ~/projects/muduo_study。"},{step:6,title:"安装 C++ 编译工具链与基础调试器",desc:"在云端终端执行系统更新与开发依赖安装：",cmd:"sudo apt update && sudo apt install -y g++ gdb cmake git valgrind htop"},{step:7,title:"编写第一个 Linux Socket 原生测试程序并编译",desc:"测试 socket / bind / listen 系统调用：",cmd:"g++ -std=c++17 -Wall test.cpp -o test && ./test"},{step:8,title:"安装云端 VS Code C++ 语言插件与代码提示",desc:"在远端扩展市场安装 C/C++ (ms-vscode.cpptools)，即可享受完整的跳转定义、悬停文档与补全。"}].map(a=>e.jsxs("div",{className:"p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-white/70 dark:border-white/10 shadow-[3px_3px_8px_rgba(0,0,0,0.04),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2.5 font-bold text-slate-900 dark:text-white text-xs sm:text-sm",children:[e.jsx("span",{className:"w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] shrink-0 shadow-[1px_1px_3px_rgba(2,132,199,0.3)]",children:a.step}),e.jsx("span",{children:a.title})]}),a.cmd&&e.jsx("button",{onClick:()=>l(a.cmd),className:"p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",title:"复制命令",children:e.jsx(K,{size:12})})]}),e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-400 pl-7",children:a.desc}),a.code&&e.jsx("div",{className:"ml-7",children:e.jsx(oe,{code:a.code,language:"bash",maxHeight:"max-h-[150px]"})}),a.cmd&&e.jsxs("div",{className:"ml-7 bg-slate-900 text-emerald-400 font-mono text-xs px-3 py-2 rounded-2xl border border-slate-800 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)]",children:["$ ",a.cmd]})]},a.step))}),i==="matrix"&&e.jsxs("div",{className:"space-y-3",children:[e.jsx("p",{className:"text-xs text-slate-500 font-medium",children:"当你坐在电脑前操作时，Windows 本地与云服务器各自的职责边界对照表："}),e.jsx("div",{className:"overflow-x-auto rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]",children:e.jsxs("table",{className:"w-full text-left text-xs font-mono",children:[e.jsx("thead",{className:"bg-slate-100/80 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 border-b border-slate-200/60 dark:border-slate-700",children:e.jsxs("tr",{children:[e.jsx("th",{className:"p-3",children:"开发环节"}),e.jsx("th",{className:"p-3 text-sky-700 dark:text-sky-300",children:"你的电脑 (Windows)"}),e.jsx("th",{className:"p-3 text-emerald-700 dark:text-emerald-300",children:"云服务器 (Linux)"}),e.jsx("th",{className:"p-3 text-slate-500",children:"SSH 传输协议内容"})]})}),e.jsxs("tbody",{className:"divide-y divide-slate-100 dark:divide-slate-800",children:[e.jsxs("tr",{children:[e.jsx("td",{className:"p-3 font-bold font-sans",children:"代码编写与敲击"}),e.jsx("td",{className:"p-3",children:"渲染界面与输入框响应"}),e.jsx("td",{className:"p-3",children:"无计算开销"}),e.jsx("td",{className:"p-3 text-slate-400",children:"击键缓冲"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"p-3 font-bold font-sans",children:"文件保存 (Ctrl+S)"}),e.jsx("td",{className:"p-3",children:"发送保存请求"}),e.jsx("td",{className:"p-3 font-semibold text-emerald-600",children:"物理写入远程硬盘"}),e.jsx("td",{className:"p-3 text-slate-400",children:"文件差量更新"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"p-3 font-bold font-sans",children:"代码编译 (g++)"}),e.jsx("td",{className:"p-3",children:"仅作为输出终端展示"}),e.jsx("td",{className:"p-3 font-semibold text-emerald-600",children:"CPU 消耗、生成 ELF 二进制"}),e.jsx("td",{className:"p-3 text-slate-400",children:"标准输出与错误流"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"p-3 font-bold font-sans",children:"运行与系统调用"}),e.jsx("td",{className:"p-3",children:"无系统开销"}),e.jsx("td",{className:"p-3 font-semibold text-emerald-600",children:"内核 epoll、socket、eventfd"}),e.jsx("td",{className:"p-3 text-slate-400",children:"运行日志回传"})]}),e.jsxs("tr",{children:[e.jsx("td",{className:"p-3 font-bold font-sans",children:"断点单步调试"}),e.jsx("td",{className:"p-3",children:"图形化按钮与变量观察窗口"}),e.jsx("td",{className:"p-3 font-semibold text-emerald-600",children:"gdb-server 挂载进线程暂停"}),e.jsx("td",{className:"p-3 text-slate-400",children:"GDB 协议帧"})]})]})]})})]}),i==="debug"&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"bg-white/80 dark:bg-slate-800/80 p-5 rounded-3xl border border-white/70 dark:border-white/10 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-2.5",children:[e.jsxs("div",{className:"font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 rounded-xl flex items-center justify-center bg-sky-100/90 dark:bg-sky-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-sky-600 dark:text-sky-400",children:e.jsx(ne,{size:14})}),e.jsx("span",{children:"AddressSanitizer (ASan) 编译期内存检测神器"})]}),e.jsx("p",{className:"text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium",children:"这是排查 C++ 野指针、Double Free、堆越界的最强利器。编译时加上："}),e.jsxs("div",{className:"bg-slate-900 text-emerald-400 font-mono text-xs p-3 rounded-2xl border border-slate-800 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.4)] flex items-center justify-between",children:[e.jsx("span",{className:"overflow-x-auto select-all",children:"g++ -std=c++17 -fsanitize=address -g -O1 main.cpp -o main && ./main"}),e.jsx("button",{onClick:()=>l("g++ -std=c++17 -fsanitize=address -g -O1 main.cpp -o main && ./main"),className:"p-1 text-slate-400 hover:text-emerald-400 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",children:e.jsx(K,{size:13})})]})]}),e.jsxs("div",{className:"bg-white/80 dark:bg-slate-800/80 p-5 rounded-3xl border border-white/70 dark:border-white/10 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85)] space-y-2.5",children:[e.jsxs("div",{className:"font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 rounded-xl flex items-center justify-center bg-purple-100/90 dark:bg-purple-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-purple-600 dark:text-purple-400",children:e.jsx(me,{size:14})}),e.jsx("span",{children:"GDB 常用命令行速查表"})]}),e.jsxs("ul",{className:"grid grid-cols-2 gap-2 text-xs font-mono",children:[e.jsxs("li",{className:"p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]",children:[e.jsx("span",{className:"font-bold text-sky-600",children:"b main"})," : 在 main 函数打断点"]}),e.jsxs("li",{className:"p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]",children:[e.jsx("span",{className:"font-bold text-sky-600",children:"r"})," : 运行程序 (Run)"]}),e.jsxs("li",{className:"p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]",children:[e.jsx("span",{className:"font-bold text-sky-600",children:"n"})," : 单步步过 (Next)"]}),e.jsxs("li",{className:"p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]",children:[e.jsx("span",{className:"font-bold text-sky-600",children:"s"})," : 单步步入 (Step into)"]}),e.jsxs("li",{className:"p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]",children:[e.jsx("span",{className:"font-bold text-sky-600",children:"p var"})," : 打印变量当前值"]}),e.jsxs("li",{className:"p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]",children:[e.jsx("span",{className:"font-bold text-sky-600",children:"bt"})," : 打印崩溃调用栈 (Backtrace)"]})]})]})]}),i==="cmake"&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"font-bold text-sm text-slate-900 dark:text-white",children:"多文件项目标准 CMakeLists.txt 模板"}),e.jsx(oe,{code:`cmake_minimum_required(VERSION 3.10)
project(MyMuduo CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_FLAGS "\${CMAKE_CXX_FLAGS} -Wall -Wextra -pthread -g")

include_directories(include)

file(GLOB_RECURSE SOURCES "src/*.cpp")

add_executable(muduo_server main.cpp \${SOURCES})
target_link_libraries(muduo_server pthread)`,language:"cmake",title:"CMakeLists.txt"})]}),e.jsxs("div",{className:"p-4 rounded-2xl bg-sky-50/80 dark:bg-sky-950/30 border border-sky-100/60 dark:border-sky-900/40 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)] text-xs",children:[e.jsx("div",{className:"font-bold text-sky-900 dark:text-sky-200 mb-1",children:"WSL2 (Windows Subsystem for Linux) 备选方案说明"}),e.jsx("p",{className:"text-slate-600 dark:text-slate-300 leading-relaxed font-medium",children:"如果你不想购买云服务器，可以在 Windows 开启 WSL2 安装 Ubuntu 22.04 LTS。VS Code 原生支持 WSL 扩展，工作原理与 Remote-SSH 几乎完全相同，同样具备 Linux 内核的完整 epoll 网络栈。"})]})]})]}),e.jsx("div",{className:"pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end",children:e.jsx("button",{onClick:r,className:"px-6 py-2.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold text-xs shadow-[2px_2px_8px_rgba(0,0,0,0.2),inset_1px_1px_2px_rgba(255,255,255,0.3)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",children:"关闭指引"})})]})})},Ve=({module:n,isOpen:r,onClose:i})=>!r||!n?null:e.jsxs("div",{className:"fixed inset-0 z-50 overflow-hidden",children:[e.jsx("div",{className:"absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity",onClick:i}),e.jsx("div",{className:"fixed inset-y-0 right-0 max-w-full flex pl-10",children:e.jsxs("div",{className:"w-screen max-w-md bg-white dark:bg-[#1a1f2c] rounded-l-3xl border-l border-white/80 dark:border-white/10 shadow-[-8px_0_32px_rgba(0,0,0,0.15),inset_2px_2px_4px_rgba(255,255,255,0.7)] flex flex-col justify-between p-6 sm:p-7 overflow-y-auto animate-in slide-in-from-right duration-300",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4",children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("span",{className:"p-2.5 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 dark:from-sky-900/60 dark:to-sky-800/40 text-sky-700 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.06)]",children:e.jsx(H,{size:20})}),e.jsxs("div",{children:[e.jsx("h3",{className:"font-black text-lg text-slate-900 dark:text-white",children:n.name}),e.jsx("div",{className:"text-xs text-sky-600 dark:text-sky-400 font-bold font-mono",children:n.layer})]})]}),e.jsx("button",{onClick:i,className:"p-2 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 shadow-[2px_2px_5px_rgba(0,0,0,0.05),inset_1px_1px_2px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",children:e.jsx(Y,{size:18})})]}),e.jsxs("div",{className:"space-y-1.5 text-xs sm:text-sm",children:[e.jsx("div",{className:"font-bold text-xs text-slate-500 uppercase tracking-wider",children:"核心职责与架构定位"}),e.jsx("p",{className:"text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50/80 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.03)]",children:n.desc||n.responsibility||"高性能网络核心调度组件"})]}),n.threadModel&&e.jsxs("div",{className:"space-y-1.5 text-xs",children:[e.jsxs("div",{className:"font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5",children:[e.jsx(we,{size:14,className:"text-emerald-500"}),"并发线程模型"]}),e.jsx("div",{className:"bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 p-3.5 rounded-2xl border border-emerald-100/60 dark:border-emerald-900/40 font-mono shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.03)]",children:n.threadModel})]}),e.jsxs("div",{className:"space-y-3.5 text-xs font-mono",children:[n.classes&&n.classes.length>0&&e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("div",{className:"font-sans font-bold text-slate-500 uppercase tracking-wider",children:"核心类定义 (Classes)"}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:n.classes.map((u,l)=>e.jsx("span",{className:"px-2.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 shadow-[inset_1px_1px_2px_rgba(14,165,233,0.15)] font-bold",children:u},l))})]}),n.functions&&n.functions.length>0&&e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("div",{className:"font-sans font-bold text-slate-500 uppercase tracking-wider",children:"代表性接口 (Functions)"}),e.jsx("ul",{className:"list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400",children:n.functions.map((u,l)=>e.jsx("li",{children:u},l))})]}),(n.sourceFiles||n.files)&&e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"font-sans font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5",children:[e.jsx(Ie,{size:13,className:"text-slate-400"}),"落地的源码文件"]}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:(n.sourceFiles||n.files||[]).map((u,l)=>e.jsx("span",{className:"px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.04)]",children:u},l))})]}),n.keyConcepts&&n.keyConcepts.length>0&&e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("div",{className:"font-sans font-bold text-slate-500 uppercase tracking-wider",children:"核心概念与机制"}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:n.keyConcepts.map((u,l)=>e.jsxs("span",{className:"px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 shadow-[inset_1px_1px_2px_rgba(245,158,11,0.15)] font-bold",children:["#",u]},l))})]})]})]}),e.jsx("div",{className:"pt-4 border-t border-slate-100 dark:border-slate-800/80",children:e.jsx("button",{onClick:i,className:"w-full py-2.5 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold text-xs shadow-[2px_2px_8px_rgba(0,0,0,0.2),inset_1px_1px_2px_rgba(255,255,255,0.3)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",children:"关闭架构详情"})})]})})]}),N=[{id:"yq_muduo_01",bookId:"muduo-core",bookTitle:"网络库muduo-core",bookBadge:"muduo-core 核心",index:1,doc_id:201974298,title:"星球Muduo库项目文档版本二",slug:"qye2x5fwpfm37d0d",url:"https://www.yuque.com/chengxuyuancarl/gixnqn/qye2x5fwpfm37d0d",level:0,category:"项目概述",wordCount:369,updatedAt:"2025-03-14T08:58:53.000Z",hash:"muduo_qye2x5fwpf",status:"FULL",tags:["版本演进","优化重点","代码精简","无Boost依赖"],linkedModule:"muduo_core",linkedModuleTitle:"muduo 网络库核心架构",linkedSourceFiles:["README.md","CMakeLists.txt"],linkedClasses:["TcpServer","EventLoop"],linkedFunctions:["main()"],interviewKeyPoints:["如何向面试官介绍你的 C++11 muduo 重构项目？","重构版 muduo 去除了哪些冗余依赖？"],summary:"版本二全面优化了知识布局与代码结构，将每个部分职责清晰划分，重点补充了 Channel、Poller、EventLoop 等核心类的代码讲解与生命周期管理。",content:`# 星球Muduo库项目文档版本二

> 原始链接: [https://www.yuque.com/chengxuyuancarl/gixnqn/qye2x5fwpfm37d0d](https://www.yuque.com/chengxuyuancarl/gixnqn/qye2x5fwpfm37d0d)  
> 访问密码: \`khf4\` | 更新时间: 2025-03-14T08:58:53.000Z | 字数: 369

---
lake

版本二相对于版本一优化点如下：

## 总体：

优化了整体的布局， **将每一个部分做什么做了详细的划分** ，比起之前的文章内容显的冗余，现在可以根据自己需要学习的内容做一个快速的复习。

## 细节：

一、

细节上增加了原作者并未提及到的类如TcpServer，修改了Tcpconnection做了更加详细的补充，并且也在其中留下了自己思考的疑问和解答。

二、

增加了学习建议，内容有学习项目的时间，分基础不同的朋友做这个项目有一个大概的时间，学习项目的时间不会很长，并且说明了项目的代码数量，以及每天要花时间的多少。

学习这个代码技术的要求，版本环境、参考的书籍方便你更好的上手这个项目！

三、

补充了部分理论知识均在代码中指出了链接地址，比如：Reactor的模型.

四、

在项目难点中补充了Channel::handlEvent中， \`std::shared_ptr<void> guard = tie_.lock();\` 除了可以延迟Tcpconnection的生命周期保证数据发送完毕后才断开连接，并且TcpConnection沿用shared智能指针的目的是为了防止原始指针被删除造成其他地方的悬空指针。`},{id:"yq_muduo_02",bookId:"muduo-core",bookTitle:"网络库muduo-core",bookBadge:"muduo-core 核心",index:2,doc_id:201526147,title:"1、学习建议",slug:"oa0mgi6p8eao74pu",url:"https://www.yuque.com/chengxuyuancarl/gixnqn/oa0mgi6p8eao74pu",level:0,category:"学习指南",wordCount:930,updatedAt:"2025-11-12T10:39:32.000Z",hash:"muduo_oa0mgi6p8e",status:"FULL",tags:["学习周期","C++11","回调机制","智能指针"],linkedModule:"muduo_core",linkedModuleTitle:"muduo 学习路径规划",linkedSourceFiles:["Callbacks.h","Timestamp.h"],linkedClasses:["std::function","std::shared_ptr","Timestamp"],linkedFunctions:["setReadCallback()"],interviewKeyPoints:["C++ 回调机制是如何实现的？","为什么 muduo 选择基于对象而不是面向对象？"],summary:"针对不同基础同学（进阶 vs 初学）制定科学的学习周期（10天 vs 20天），阐述 2000 行精简重构代码的精读要领与前置知识补齐策略。",content:`# 1、学习建议

> 原始链接: [https://www.yuque.com/chengxuyuancarl/gixnqn/oa0mgi6p8eao74pu](https://www.yuque.com/chengxuyuancarl/gixnqn/oa0mgi6p8eao74pu)  
> 访问密码: \`khf4\` | 更新时间: 2025-11-12T10:39:32.000Z | 字数: 930

---
lake

**基础不错** 【做过几个项目对回调c++11特性、以及语法熟练的人】：这里只需要十天内，每天5-6个小时左右，就可以学习完这个项目。

**代码小白** ，这里我个人的建议先去了解回调是什么，比如function、智能指针这些。当然你也可以先看遇到不会的再去找资料：预计时间20天内，每天5-6个小时，当然因人而异变。

目前代码总量是在2000行，但是省去了 **补充工具类的部分内容。**

**​**

**本项目文档讲解的功能是很全的** ，就是按照陈硕（官方）的代码来：[https://github.com/chenshuo/muduo](https://github.com/chenshuo/muduo/)

​

而我们自己写的仓库：[https://github.com/youngyangyang04/muduo-core](https://github.com/youngyangyang04/muduo-core)，是实现了muduo最核心的部分，这样方便大家可以在这个最基础的版本上自己做拓展。例如去实现 内存池、连接池、日志库、定时器 等等。

## **技术要求**

**所需要的基础知识**

- 熟悉最基本的TCP网络通信编程流程和API，比如socket、bind、listen、accept、recv、send
- 了解epoll相关函数的用法，比如epoll_create，epoll_wait
- 了解Reactor事件处理模式
- 了解C++11常见新特性，如智能指针，function和bind等

​

## 开发环境

- linux kernel version5.15.0-113-generic (ubuntu 22.04.6)
- gcc (Ubuntu 11.4.0-1ubuntu1~22.04) 11.4.0
- cmake version 3.22

## 并发模型

![](images/yuque/img_muduo_02_01.png)

项目采用主从 多Reactor多线程 模型，MainReactor 只负责监听派发新连接，在 MainReactor 中通过 Acceptor 接收新连接并通过设计好的轮询算法派发给 SubReactor，SubReactor 负责此连接的读写事件。

调用 TcpServer 的 start 函数后，会内部创建线程池。每个线程独立的运行一个事件循环，即 SubReactor。MainReactor 从线程池中轮询获取 SubReactor 并派发给它新连接，处理读写事件的 SubReactor 个数一般和 CPU 核心数相等。使用主从 Reactor 模型有诸多优点：

1. 响应快，不必为单个同步事件所阻塞，虽然 Reactor 本身依然是同步的；
2. 可以最大程度避免复杂的多线程及同步问题，并且避免多线程/进程的切换；
3. 扩展性好，可以方便通过增加 Reactor 实例个数充分利用 CPU 资源；
4. 复用性好，Reactor 模型本身与具体事件处理逻辑无关，具有很高的复用性；

## 构建项目

安装基本工具

\`\`\`cpp
sudo apt-get update
sudo apt-get install -y wget cmake build-essential unzip git
\`\`\`

## 编译指令

下载项目

git clone https://github.com/youngyangyang04/muduo-core.git

进入到muduo-core文件

cd muduo-core

创建build文件夹，并且进入build文件:

mkdir build && cd build

然后生成可执行程序文件：

cmake .. && make -j\${nproc}

运行程序，进入example文件夹，并且执行可执行程序

cd example  &&  ./testserver

## **版本环境：**

**建议购买一台云服务器，腾讯云或者阿里云，用来部署自己的项目 非常方便，无论是做本项目还是做其他项目，无论是自己练习，还是项目上线，都需要一台有公网Ip的独立服务器。 自己电脑安装虚拟机，不仅麻烦，进场出莫名其妙的问题。**

- [阿里云活动期间服务器购买](https://www.aliyun.com/minisite/goods?taskCode=shareNew2205&recordId=3641992&userCode=roof0wob)
- [腾讯云活动期间服务器购买](https://curl.qcloud.com/EiaMXllu)

## 参考书籍

- 陈硕（官方）：[https://github.com/chenshuo/muduo/](https://github.com/chenshuo/muduo/)
- 《Linux多线程服务器编程-使用 muduo C++网络库》-陈硕
- 《Linux高性能服务器编程》-游双

##`},{id:"yq_muduo_03",bookId:"muduo-core",bookTitle:"网络库muduo-core",bookBadge:"muduo-core 核心",index:3,doc_id:201526125,title:"2、大纲",slug:"xplg4lwc7v8kvqa9",url:"https://www.yuque.com/chengxuyuancarl/gixnqn/xplg4lwc7v8kvqa9",level:0,category:"架构大纲",wordCount:684,updatedAt:"2025-03-14T08:59:15.000Z",hash:"muduo_xplg4lwc7v",status:"FULL",tags:["陈硕官方库对比","项目结构","CMake构建"],linkedModule:"muduo_core",linkedModuleTitle:"muduo 源码树总览",linkedSourceFiles:["TcpServer.h","EventLoop.h","Channel.h","Poller.h"],linkedClasses:["TcpServer","EventLoop","Channel","Poller"],linkedFunctions:["start()","loop()"],interviewKeyPoints:["muduo 官方库与星球精简重构版的核心差异是什么？","CMake 现代化构建流程如何设计？"],summary:"梳理项目源码大纲，从陈硕官方库对比出发，梳理项目各头文件与实现文件职责，明确 CMakeLists.txt 跨平台编译架构。",content:`# 2、大纲

> 原始链接: [https://www.yuque.com/chengxuyuancarl/gixnqn/xplg4lwc7v8kvqa9](https://www.yuque.com/chengxuyuancarl/gixnqn/xplg4lwc7v8kvqa9)  
> 访问密码: \`khf4\` | 更新时间: 2025-03-14T08:59:15.000Z | 字数: 684

---
lake

提到muduo这个项目，必须得说陈硕老师，他的muduo是知名的linux服务器开源项目。

陈硕（官方）的仓库：[https://github.com/chenshuo/muduo/](https://github.com/chenshuo/muduo/)

代码随想录知识星球mudo-core仓库：

[https://github.com/youngyangyang04/muduo-core](https://github.com/youngyangyang04/muduo-core)

[代码随想录知识星球](https://programmercarl.com/other/kstar.html) 将从面试的角度带大家去高效学习这个项目。

本项目文档将从如下几个方面，侧重求职面试来讲解：

## 1.muduo网络库项目前言

- 为什么要做 muduo？
- 所需要的基础知识参考书籍

## 2.框架梳理

## 3.项目重点类和代码讲解

- Channel

- Channel类重要的成员变量：
- Channel类重要的成员方法

- Poller

- Poller/EpollPoller概述
- Poller/EpollPoller的重要成员变量：
- EpollPoller给外部提供的最重要的方法：

- EventLoop

- EventLoop概述：
- One Loop Per Thread 含义介绍
- 全局概览Poller、Channel和EventLoop在整个Multi-Reactor通信架构中的角色
- EventLoop重要方法 EventLoop:loop()：

- Acceptor

- Acceptor封装的重要成员变量
- Acceptor封装的重要成员方法

- TcpServer

- 重要成员分方法

- tcpconnection

- TcpConnection的重要变量
- TcpConnection的重要成员方法：

- socket
- buffer

- 重要的成员方法：

- TcpSever
- TcpConnection

## 4.补充工具类

- 日志系统

- 异步日志流程
- 开启异步日志
- 把日志写入缓冲区

- 缓存机制

- Buffer数据结构
- 把socket上的数据写入Input Buffer
- 把用户数据通过output buffer发送给对方

- muduo定时器实现思路

## 5.项目拓展出的基础知识汇总

- IO多路复用

- 说一下什么是ET，什么是LT，有什么区别？
- 为什么ET模式不可以文件描述符阻塞，而LT模式可以呢？
- 你用了epoll，说一下为什么用epoll，还有其他多路复用方式吗？区别是什么？

- 并发模型

- reactor、proactor模型的区别？
- reactor模式中，各个模式的区别？

- 测试相关问题

## 6.简历写法 & 面试技巧

- 本项目简历写法
- 通用简历写法
- 面试技巧

- 八股
- 算法
- 实习
- 项目

## 7.项目面试常见问题汇总

项目介绍

- 简单介绍一下你的项目
- 项目中的难点？

- 如果TcpConnection中有正在发送的数据，怎么保证在触发TcpConnection关闭机制后，能先让TcpConnection先把数据发送完再释放TcpConnection对象的资源？

- 项目中遇到的困难？是如何解决的？

- 怎么保证一个线程只有一个EventLoop对象
- 怎么保证不该跨线程调用的函数不会跨线程调用

- 项目当中有什么亮点

- Channel的tie _ 涉及到的精妙之处`},{id:"yq_muduo_04",bookId:"muduo-core",bookTitle:"网络库muduo-core",bookBadge:"muduo-core 核心",index:4,doc_id:201613576,title:"3、muduo网络库项目前言",slug:"bdti3z1ckcafo4qg",url:"https://www.yuque.com/chengxuyuancarl/gixnqn/bdti3z1ckcafo4qg",level:0,category:"设计模式",wordCount:741,updatedAt:"2025-11-01T16:03:51.000Z",hash:"muduo_bdti3z1ckc",status:"FULL",tags:["Reactor模型","多路复用","非阻塞IO","事件驱动","线程模型"],linkedModule:"muduo_core",linkedModuleTitle:"Reactor 反应堆核心架构",linkedSourceFiles:["EventLoop.cc","Channel.cc","EPollPoller.cc"],linkedClasses:["EventLoop","Channel","Poller"],linkedFunctions:["loop()","poll()"],interviewKeyPoints:["什么是 Reactor 模式？它与 Proactor 模式的区别是什么？","为什么非阻塞 I/O 必须搭配 I/O 多路复用使用？"],summary:"深入剖析为什么要做 muduo 网络库，深度对比阻塞 I/O、多进程/多线程与非阻塞 Reactor 模型在万级长连接下的吞吐量差异。",content:`# 3、muduo网络库项目前言

> 原始链接: [https://www.yuque.com/chengxuyuancarl/gixnqn/bdti3z1ckcafo4qg](https://www.yuque.com/chengxuyuancarl/gixnqn/bdti3z1ckcafo4qg)  
> 访问密码: \`khf4\` | 更新时间: 2025-11-01T16:03:51.000Z | 字数: 741

---
lake

## 为什么要做 muduo？

- 通过学习muduo网络库源码，一定程度上提升了linux网络编程能力;
- 熟悉了网络编程及其下的线程池，缓冲区等设计，学习了多线程编程;
- 通过深入了解muduo网络库源码，对经典的五种IO模型及Reactor模型有了更深的认识
- 掌握基于事件驱动和事件回调的epoll+线程池面向对象编程。
- 还有一点我觉得比较重要就是学习完你可以自行去根据自己需求替换，知识星球的Raft项目、webServer项目、Rpc项目。然后自己再进行拓展这就把自己学习过的知识串通起来了。

## 理论部分

这里提及一下如果多Reactor模型不熟悉的录友：

强烈推荐：[https://xiaolincoding.com/os/8_network_system/reactor.html](https://xiaolincoding.com/os/8_network_system/reactor.html)

## 结果图片及分析：

![](images/yuque/img_muduo_04_01.png)

### **1. 服务端日志解析**

#### **关键日志内容及说明**

1. \` **[INFO] channel handleEvent revents:1** \`

- 表示某个文件描述符（fd）有事件触发，可能是新连接、数据到达或其他事件。这通常是 Reactor 模型中的事件处理阶段。

1. \` **[INFO] func=poll => fd total count:3** \`

- 表示  \`poll\`  系统调用在检测事件时，当前监听的文件描述符总数为 3（1 个监听套接字 + 2 个连接）。

1. \` **[INFO] TcpConnection::handleClose fd=12 state=2** \`

- 表示文件描述符  \`12\`  的连接被关闭，此时该连接的状态为  \`state=2\` ，可能对应  \`kDisconnecting\`  状态。

1. \` **[INFO] func=updateChannel => fd=12 events=0 index=1** \`

- 文件描述符  \`12\`  的事件被更新为  \`events=0\` （不再监听读写事件），表示连接即将从事件管理器中移除。

1. \` **[INFO] Connection DOWN : 127.0.0.1:60758** \`

- 表示客户端 IP 为  \`127.0.0.1\` 、端口为  \`60758\`  的连接已经断开。

1. \` **[INFO] TcpServer::removeConnectionInLoop [EchoServer] - connection EchoServer-127.0.0.1:8080#1** \`

- 服务端  \`EchoServer\`  从其连接池中移除了编号为  \`#1\`  的连接（即  \`127.0.0.1:8080#1\` ）。

1. \` **[INFO] func=removeChannel => fd=12** \`

- 文件描述符  \`12\`  从事件管理器中移除。

1. \` **[INFO] TcpConnection::dtor[EchoServer-127.0.0.1:8080#1] at fd=12 state=0** \`

- 编号为  \`#1\`  的连接对象被销毁，文件描述符  \`12\`  处于  \`state=0\`  状态（可能对应  \`kDisconnected\` ）。

---
### **2. 客户端行为分析**

根据你的命令和交互：

1. **连接到服务端**

- 你通过  \`nc 127.0.0.1 8080\`  使用  \`netcat\`  工具连接到服务端  \`127.0.0.1\`  的  \`8080\`  端口。
- 服务端接收到了你的连接请求并分配了一个文件描述符（例如  \`fd=12\` ）。

1. **发送消息**

- 你在客户端输入了  \`hello\` ，服务端处理了这个数据并返回了同样的  \`hello\` 。  
这说明服务端是一个回显服务器（Echo Server），它接收到数据后原样返回。

1. **断开连接**

- 当你按下  \`Ctrl+C\`  时，客户端主动关闭了连接。
- 服务端检测到连接关闭，触发  \`handleClose\` ，随后清理了相关资源`},{id:"yq_muduo_05",bookId:"muduo-core",bookTitle:"网络库muduo-core",bookBadge:"muduo-core 核心",index:5,doc_id:201526463,title:"4、框架梳理",slug:"mwll4lrl8y2m33gn",url:"https://www.yuque.com/chengxuyuancarl/gixnqn/mwll4lrl8y2m33gn",level:0,category:"核心组件",wordCount:560,updatedAt:"2025-11-22T06:23:12.000Z",hash:"muduo_mwll4lrl8y",status:"FULL",tags:["核心组件三剑客","数据流转","时序图解","OneLoopPerThread"],linkedModule:"muduo_core",linkedModuleTitle:"Reactor 核心组件协同机制",linkedSourceFiles:["EventLoop.h","Channel.h","Poller.h"],linkedClasses:["EventLoop","Channel","Poller"],linkedFunctions:["updateChannel()","handleEvent()"],interviewKeyPoints:["Channel 与 Poller 是如何解耦的？","EventLoop 如何扮演整个反应堆的大脑？"],summary:"全景梳理 muduo 框架核心模块关系，图解 Event、Reactor、Demultiplex 与 EventHandler 调用链路，明确底层运转宏观拓扑。",content:`# 4、框架梳理

> 原始链接: [https://www.yuque.com/chengxuyuancarl/gixnqn/mwll4lrl8y2m33gn](https://www.yuque.com/chengxuyuancarl/gixnqn/mwll4lrl8y2m33gn)  
> 访问密码: \`khf4\` | 更新时间: 2025-11-22T06:23:12.000Z | 字数: 560

---
lake

reactor模型在实际设计中大致是有以下几个部分：

- Event：事件
- Reactor： 反应堆
- Demultiplex：多路事件分发器
- EventHandler：事件处理器

在muduo中，其 **调用关系** 大致如下

- 将事件及其处理方法注册到reactor，reactor中存储了连接套接字connfd以及其感兴趣的事件event
- reactor向其所对应的demultiplex去注册相应的connfd+事件，启动反应堆
- 当demultiplex检测到connfd上有事件发生，就会返回相应事件
- reactor根据事件去调用eventhandler处理程序

![](images/yuque/img_muduo_05_01.png)

- 

而上述的，是在一个reactor反应堆中所执行的大致流程，其在muduo代码中 **包含关系** 如下（椭圆圈起来的是类）：

可以看到，EventLoop其实就是我们的subreactor，其执行在一个Thread上，实现了one loop per thread的设计。

每个EventLoop中，我们可以看到有一个Poller和很多的Channel，Poller在上图调用关系中，其实就是demultiplex（多路事件分发器）,而Channel对应的就是event（事件）

![](images/yuque/img_muduo_05_02.png)

现在，我们大致明白了muduo每个reactor的设计，但是作为一个支持高并发的网络库，单线程 往往不是一个好的设计。

muduo采用了和Nginx相似的操作，有一个main reactor通过accept组件负责处理新的客户端连接，并将它们分派给各个sub reactor，每个sub reactor则是负责一个连接的读写等工作。

![](images/yuque/img_muduo_05_03.png)

这里值得一提的是main Reactor也有一个EventLoop 只是其Loop循环的事件是等待连接也就是当Accept触发，那么EventLoop::Loop监听的Poller中epoll_wait就会被唤醒，然后EventLoop把相应的Channel执行其回调事件。这里的回调主要是TcpServer在Accept定义好的newconnection事件，用来初始化Tcpconnection对象的。这个时候就是我们的subReactor也就是我们会通过轮询算法给Tcpconnection对象分配EventLoop对象，此时这个EventLoop对应的就是一个线程， **这就是muduo库重要思想one loop per therad。**

​`},{id:"yq_muduo_06",bookId:"muduo-core",bookTitle:"网络库muduo-core",bookBadge:"muduo-core 核心",index:6,doc_id:201526518,title:"5、项目重点类和代码讲解",slug:"wr66n9bt0fm8bcde",url:"https://www.yuque.com/chengxuyuancarl/gixnqn/wr66n9bt0fm8bcde",level:0,category:"重点源码精讲",wordCount:13351,updatedAt:"2025-11-22T06:37:50.000Z",hash:"muduo_wr66n9bt0f",status:"FULL",tags:["Channel保姆类","EPollPoller","EventLoop主循环","Acceptor","Buffer栈空间","TcpConnection生命周期","TcpServer"],linkedModule:"muduo_core",linkedModuleTitle:"muduo 7大核心类逐行源码精读",linkedSourceFiles:["Channel.cc","EPollPoller.cc","EventLoop.cc","Acceptor.cc","Buffer.cc","TcpConnection.cc","TcpServer.cc"],linkedClasses:["Channel","EPollPoller","EventLoop","Acceptor","Buffer","TcpConnection","TcpServer"],linkedFunctions:["enableReading()","poll()","loop()","handleRead()","readFd()","send()","newConnection()"],interviewKeyPoints:["Channel::tie() 为什么能防止悬空指针崩溃？","Buffer 为什么采用 readv 分散读和 64KB 栈临时空间？","TcpConnection 状态机迁移逻辑是什么？"],summary:"全文逾 1.3 万字硬核解析！逐行剖析 Channel、Poller、EventLoop、Acceptor、Buffer、TcpConnection、TcpServer 七大核心类源码与生命周期管理。",content:`# 5、项目重点类和代码讲解

> 原始链接: [https://www.yuque.com/chengxuyuancarl/gixnqn/wr66n9bt0fm8bcde](https://www.yuque.com/chengxuyuancarl/gixnqn/wr66n9bt0fm8bcde)  
> 访问密码: \`khf4\` | 更新时间: 2025-11-22T06:37:50.000Z | 字数: 13351

---
lake

## Channel

Channel类其实相当于一个文件描述符的保姆！

在TCP网络编程中，想要IO多路复用监听某个文件描述符，就要把这个fd和该fd感兴趣的事件通过epoll_ctl注册到IO多路复用模块（我管它叫事件监听器）上。当事件监听器监听到该fd发生了某个事件。事件监听器返回 [发生事件的fd集合]以及[每个fd都发生了什么事件]

Channel类则封装了一个 [fd] 和这个 [fd感兴趣事件] 以及事件监听器监听到 [该fd实际发生的事件]。同时Channel类还提供了设置该fd的感兴趣事件，以及将该fd及其感兴趣事件注册到事件监听器或从事件监听器上移除，以及保存了该fd的每种事件对应的处理函数。

### Channel类重要的成员变量：

int fd_这个Channel对象照看的文件描述符

int events_代表fd感兴趣的事件类型集合   int revents_代表事件监听器实际监听到该fd发生的事件类型集合，当事件监听器监听到一个fd发生了什么事件，通过Channel::set_revents()函数来设置revents值。

EventLoop* loop这个fd属于哪个EventLoop对象，这个暂时不解释。

read_callback_ 、write_callback_、close_callback_、error_callback_：这些是std::function类型，代表着这个Channel为这个文件描述符保存的各事件类型发生时的处理函数。比如这个fd发生了可读事件，需要执行可读事件处理函数，这时候Channel类都替你保管好了这些可调用函数，真是贴心啊，要用执行的时候直接管保姆要就可以了。

### Channel类重要的成员方法

向Channel对象注册各类事件的处理函数

\`\`\`cpp
void setReadCallback(ReadEventCallback cb) {read_callback_ = std::move(cb);}
void setWriteCallback(Eventcallback cb) {write_callback_ = std::move(cb);}
void setCloseCallback(EventCallback cb) {close_callback_ = std::move(cb);}
void setErrorCallback(EventCallback cb) {error_callback_ = std::move(cb);}
\`\`\`

一个文件描述符会发生可读、可写、关闭、错误事件。当发生这些事件后，就需要调用相应的处理函数来处理。外部通过调用上面这四个函数可以将事件处理函数放进Channel类中，当需要调用的时候就可以直接拿出来调用了。

将Channel中的文件描述符及其感兴趣事件注册事件监听器上或从事件监听器上移除

\`\`\`cpp
void enableReading() {events_ |= kReadEvent; upadte();}
void disableReading() {events_ &= ~kReadEvent; update();}
void enableWriting() {events_ |= kWriteEvent; update();}
void disableWriting() {events_ &= ~kWriteEvent; update();}
void disableAll() {events_ |= kNonEvent; update();}
\`\`\`

外部通过这几个函数来告知Channel你所监管的文件描述符都对哪些事件类型感兴趣，并把这个文件描述符及其感兴趣事件注册到事件监听器（IO多路复用模块）上。这些函数里面都有一个update()私有成员方法，这个update其实本质上就是调用了epoll_ctl()。

\`\`\`cpp
int set_revents(int revt) {revents_ = revt;}
\`\`\`

当事件监听器监听到某个文件描述符发生了什么事件，通过这个函数可以将这个文件描述符实际发生的事件封装进这个Channel中。

\`\`\`cpp
void Channel::handleEvent(Timestamp receiveTime)；
\`\`\`

当调用epoll_wait()后，可以得知事件监听器上哪些Channel（文件描述符）发生了哪些事件，事件发生后自然就要调用这些Channel对应的处理函数。 Channel::HandleEvent，让每个发生了事件的Channel调用自己保管的事件处理函数。

每个Channel会根据自己文件描述符实际发生的事件（通过Channel中的revents_变量得知）和感兴趣的事件（通过Channel中的events_变量得知）来选择调用read_callback_和/或write_callback_和/或close_callback_和/或error_callback_。

​

### 补充：

Channel.cc文件中存在下面代码的注释，这里再进行一次解释：

生命周期：Channel作为TcpConnection的成员，总是随TcpConnection的销毁而销毁。因此，Channel不会在TcpConnection之后存在。  
 \`weak_ptr\` ）来检测目标对象是否存活。

\`\`\`cpp
// channel的tie方法什么时候调用过?  TcpConnection => channel
/**
 * TcpConnection中注册了Channel对应的回调函数，传入的回调函数均为TcpConnection
 * 对象的成员方法，因此可以说明一点就是：Channel的结束一定晚于TcpConnection对象！
 * 此处用tie去解决TcpConnection和Channel的生命周期时长问题，从而保证了Channel对象能够在
 * TcpConnection销毁前销毁。
 **/
\`\`\`

---
## Poller

### Poller/EpollPoller概述

负责监听文件描述符事件是否触发以及返回发生事件的文件描述符以及具体事件的模块就是Poller。所以一个Poller对象对应一个事件监听器（这里我不确定要不要把Poller就当作事件监听器）。在multi-reactor模型中，有多少reactor就有多少Poller。

muduo提供了epoll和poll两种IO多路复用方法来实现事件监听。不过默认是使用epoll来实现，也可以通过选项选择poll。但是我自己重构的muduo库只支持epoll。

这个Poller是个抽象虚类，由EpollPoller和PollPoller继承实现，与监听文件描述符和返回监听结果的具体方法也基本上是在这两个派生类中实现。EpollPoller就是封装了用epoll方法实现的与事件监听有关的各种方法，PollPoller就是封装了poll方法实现的与事件监听有关的各种方法。以后谈到Poller希望大家都知道我说的其实是EpollPoller。

### Poller：

#### .h

\`\`\`cpp
#pragma once

#include <vector>
#include <unordered_map>

#include "noncopyable.h"
#include "Timestamp.h"

class Channel;
class EventLoop;

// muduo库中多路事件分发器的核心IO复用模块
class Poller
{
public:
    using ChannelList = std::vector<Channel *>;

    Poller(EventLoop *loop);
    virtual ~Poller() = default;

    // 给所有IO复用保留统一的接口
    virtual Timestamp poll(int timeoutMs, ChannelList *activeChannels) = 0;
    virtual void updateChannel(Channel *channel) = 0;
    virtual void removeChannel(Channel *channel) = 0;

    // 判断参数channel是否在当前的Poller当中
    bool hasChannel(Channel *channel) const;

    // EventLoop可以通过该接口获取默认的IO复用的具体实现
    static Poller *newDefaultPoller(EventLoop *loop);

protected:
    // map的key:sockfd value:sockfd所属的channel通道类型
    using ChannelMap = std::unordered_map<int, Channel *>;
    ChannelMap channels_;

private:
    EventLoop *ownerLoop_; // 定义Poller所属的事件循环EventLoop
};
\`\`\`

#### .cc

\`\`\`cpp
#include "Poller.h"
#include "Channel.h"

Poller::Poller(EventLoop *loop)
    : ownerLoop_(loop)
{
}

// bool Poller::hasChannel(Channel *channel) const
// {
//     auto it = channels_.find(channel->fd());
//     return it != channels_.end() && it->second == channel;
// }
\`\`\`

### EpollPoller:

#### .h

\`\`\`cpp
#pragma once

#include <vector>
#include <sys/epoll.h>

#include "Poller.h"
#include "Timestamp.h"

/**
 * epoll的使用:
 * 1. epoll_create
 * 2. epoll_ctl (add, mod, del)
 * 3. epoll_wait
 **/

class Channel;

class EPollPoller : public Poller
{
public:
    EPollPoller(EventLoop *loop);
    ~EPollPoller() override;

    // 重写基类Poller的抽象方法
    Timestamp poll(int timeoutMs, ChannelList *activeChannels) override;
    void updateChannel(Channel *channel) override;
    void removeChannel(Channel *channel) override;

private:
    static const int kInitEventListSize = 16;

    // 填写活跃的连接
    void fillActiveChannels(int numEvents, ChannelList *activeChannels) const;
    // 更新channel通道 其实就是调用epoll_ctl
    void update(int operation, Channel *channel);

    using EventList = std::vector<epoll_event>; // C++中可以省略struct 直接写epoll_event即可

    int epollfd_;      // epoll_create创建返回的fd保存在epollfd_中
    EventList events_; // 用于存放epoll_wait返回的所有发生的事件的文件描述符事件集
};
\`\`\`

#### .cc

\`\`\`cpp
#include <errno.h>
#include <unistd.h>
#include <string.h>

#include "EPollPoller.h"
#include "Logger.h"
#include "Channel.h"

const int kNew = -1;    // 某个channel还没添加至Poller          // channel的成员index_初始化为-1
const int kAdded = 1;   // 某个channel已经添加至Poller
const int kDeleted = 2; // 某个channel已经从Poller删除

EPollPoller::EPollPoller(EventLoop *loop)
    : Poller(loop)
    , epollfd_(::epoll_create1(EPOLL_CLOEXEC)) 
    , events_(kInitEventListSize) // vector<epoll_event>(16)
{
    if (epollfd_ < 0)
    {
        LOG_FATAL("epoll_create error:%d \\n", errno);
    }
}

EPollPoller::~EPollPoller()
{
    ::close(epollfd_);
}

Timestamp EPollPoller::poll(int timeoutMs, ChannelList *activeChannels)
{
    // 由于频繁调用poll 实际上应该用LOG_DEBUG输出日志更为合理 当遇到并发场景 关闭DEBUG日志提升效率
    LOG_INFO("func=%s => fd total count:%lu\\n", __FUNCTION__, channels_.size());

    int numEvents = ::epoll_wait(epollfd_, &*events_.begin(), static_cast<int>(events_.size()), timeoutMs);
    int saveErrno = errno;
    Timestamp now(Timestamp::now());

    if (numEvents > 0)
    {
        LOG_INFO("%d events happend\\n", numEvents); // LOG_DEBUG最合理
        fillActiveChannels(numEvents, activeChannels);
        if (numEvents == events_.size()) // 扩容操作
        {
            events_.resize(events_.size() * 2);
        }
    }
    else if (numEvents == 0)
    {
        LOG_DEBUG("%s timeout!\\n", __FUNCTION__);
    }
    else
    {
        if (saveErrno != EINTR)
        {
            errno = saveErrno;
            LOG_ERROR("EPollPoller::poll() error!");
        }
    }
    return now;
}

// channel update remove => EventLoop updateChannel removeChannel => Poller updateChannel removeChannel
void EPollPoller::updateChannel(Channel *channel)
{
    const int index = channel->index();
    LOG_INFO("func=%s => fd=%d events=%d index=%d\\n", __FUNCTION__, channel->fd(), channel->events(), index);

    if (index == kNew || index == kDeleted)
    {
        if (index == kNew)
        {
            int fd = channel->fd();
            channels_[fd] = channel;
        }
        else // index == kDeleted
        {
        }
        channel->set_index(kAdded);
        update(EPOLL_CTL_ADD, channel);
    }
    else // channel已经在Poller中注册过了
    {
        int fd = channel->fd();
        if (channel->isNoneEvent())
        {
            update(EPOLL_CTL_DEL, channel);
            channel->set_index(kDeleted);
        }
        else
        {
            update(EPOLL_CTL_MOD, channel);
        }
    }
}

// 从Poller中删除channel
void EPollPoller::removeChannel(Channel *channel)
{
    int fd = channel->fd();
    channels_.erase(fd);

    LOG_INFO("func=%s => fd=%d\\n", __FUNCTION__, fd);

    int index = channel->index();
    if (index == kAdded)
    {
        update(EPOLL_CTL_DEL, channel);
    }
    channel->set_index(kNew);
}

// 填写活跃的连接
void EPollPoller::fillActiveChannels(int numEvents, ChannelList *activeChannels) const
{
    for (int i = 0; i < numEvents; ++i)
    {
        Channel *channel = static_cast<Channel *>(events_[i].data.ptr);
        channel->set_revents(events_[i].events);
        activeChannels->push_back(channel); // EventLoop就拿到了它的Poller给它返回的所有发生事件的channel列表了
    }
}

// 更新channel通道 其实就是调用epoll_ctl add/mod/del
void EPollPoller::update(int operation, Channel *channel)
{
    epoll_event event;
    ::memset(&event, 0, sizeof(event));

    int fd = channel->fd();

    event.events = channel->events();
    event.data.fd = fd;
    event.data.ptr = channel;

    if (::epoll_ctl(epollfd_, operation, fd, &event) < 0)
    {
        if (operation == EPOLL_CTL_DEL)
        {
            LOG_ERROR("epoll_ctl del error:%d\\n", errno);
        }
        else
        {
            LOG_FATAL("epoll_ctl add/mod error:%d\\n", errno);
        }
    }
}
\`\`\`

### Poller/EpollPoller的重要成员变量：

epollfd_就是用epoll_create方法返回的epoll句柄，这个是常识。

channels_：这个变量是std::unordered_map<int, Channel*>类型，负责记录 文件描述符 ---> Channel的映射，也帮忙保管所有注册在你这个Poller上的Channel。

ownerLoop_：所属的EventLoop对象，看到后面你懂了。

### EpollPoller给外部提供的最重要的方法：

\`\`\`cpp
TimeStamp poll(int timeoutMs, ChannelList *activeChannels)
\`\`\`

这个函数可以说是Poller的核心了，当外部调用poll方法的时候，该方法底层其实是通过epoll_wait获取这个事件监听器上发生事件的fd及其对应发生的事件，我们知道每个fd都是由一个Channel封装的，通过哈希表channels_可以根据fd找到封装这个fd的Channel。

将事件监听器监听到该fd发生的事件写进这个Channel中的revents成员变量中。然后把这个Channel装进activeChannels中（它是一个vector<Channel*>）。这样，当外界调用完poll之后就能拿到事件监听器的 **监听结果（activeChannels_）。**

【这里标红是因为后面会经常提到这个“监听结果”这四个字，希望你明白这代表什么含义】，这个activeChannels就是事件监听器监听到的发生事件的fd，以及每个fd都发生了什么事件。

---
## EventLoop

### EventLoop概述：

刚才的Poller是封装了和事件监听有关的方法和成员，调用一次Poller::poll方法它就能给你返回事件监听器的监听结果（发生事件的fd 及其 发生的事件）。作为一个网络服务器，需要有持续监听、持续获取监听结果、持续处理监听结果对应的事件的能力，也就是我们需要循环的去 【调用Poller:poll方法获取实际发生事件的Channel集合，然后调用这些Channel里面保管的不同类型事件的处理函数（调用Channel::HandlerEvent方法）。】

EventLoop就是负责实现“循环”，负责驱动“循环”的重要模块！！Channel和Poller其实相当于EventLoop的手下，EventLoop整合封装了二者并向上提供了更方便的接口来使用。

### .h

\`\`\`cpp
#pragma once

#include <functional>
#include <vector>
#include <atomic>
#include <memory>
#include <mutex>

#include "noncopyable.h"
#include "Timestamp.h"
#include "CurrentThread.h"

class Channel;
class Poller;

// 事件循环类 主要包含了两个大模块 Channel Poller(epoll的抽象)
class EventLoop : noncopyable
{
public:
    using Functor = std::function<void()>;

    EventLoop();
    ~EventLoop();

    // 开启事件循环
    void loop();
    // 退出事件循环
    void quit();

    Timestamp pollReturnTime() const { return pollRetureTime_; }

    // 在当前loop中执行
    void runInLoop(Functor cb);
    // 把上层注册的回调函数cb放入队列中 唤醒loop所在的线程执行cb
    void queueInLoop(Functor cb);

    // 通过eventfd唤醒loop所在的线程
    void wakeup();

    // EventLoop的方法 => Poller的方法
    void updateChannel(Channel *channel);
    void removeChannel(Channel *channel);
    // bool hasChannel(Channel *channel);

    // 判断EventLoop对象是否在自己的线程里
    bool isInLoopThread() const { return threadId_ == CurrentThread::tid(); } // threadId_为EventLoop创建时的线程id CurrentThread::tid()为当前线程id

private:
    void handleRead();        // 给eventfd返回的文件描述符wakeupFd_绑定的事件回调 当wakeup()时 即有事件发生时 调用handleRead()读wakeupFd_的8字节 同时唤醒阻塞的epoll_wait
    void doPendingFunctors(); // 执行上层回调

    using ChannelList = std::vector<Channel *>;

    std::atomic_bool looping_; // 原子操作 底层通过CAS实现
    std::atomic_bool quit_;    // 标识退出loop循环

    const pid_t threadId_; // 记录当前EventLoop是被哪个线程id创建的 即标识了当前EventLoop的所属线程id

    Timestamp pollRetureTime_; // Poller返回发生事件的Channels的时间点
    std::unique_ptr<Poller> poller_;

    int wakeupFd_; // 作用：当mainLoop获取一个新用户的Channel 需通过轮询算法选择一个subLoop 通过该成员唤醒subLoop处理Channel
    std::unique_ptr<Channel> wakeupChannel_;

    ChannelList activeChannels_; // 返回Poller检测到当前有事件发生的所有Channel列表

    std::atomic_bool callingPendingFunctors_; // 标识当前loop是否有需要执行的回调操作
    std::vector<Functor> pendingFunctors_;    // 存储loop需要执行的所有回调操作
    std::mutex mutex_;                        // 互斥锁 用来保护上面vector容器的线程安全操作
};
\`\`\`

### .cc

\`\`\`cpp
#include <sys/eventfd.h>
#include <unistd.h>
#include <fcntl.h>
#include <errno.h>
#include <memory>

#include "EventLoop.h"
#include "Logger.h"
#include "Channel.h"
#include "Poller.h"

// 防止一个线程创建多个EventLoop
__thread EventLoop *t_loopInThisThread = nullptr;

// 定义默认的Poller IO复用接口的超时时间
const int kPollTimeMs = 10000; // 10000毫秒 = 10秒钟

/* 创建线程之后主线程和子线程谁先运行是不确定的。
 * 通过一个eventfd在线程之间传递数据的好处是多个线程无需上锁就可以实现同步。
 * eventfd支持的最低内核版本为Linux 2.6.27,在2.6.26及之前的版本也可以使用eventfd，但是flags必须设置为0。
 * 函数原型：
 *     #include <sys/eventfd.h>
 *     int eventfd(unsigned int initval, int flags);
 * 参数说明：
 *      initval,初始化计数器的值。
 *      flags, EFD_NONBLOCK,设置socket为非阻塞。
 *             EFD_CLOEXEC，执行fork的时候，在父进程中的描述符会自动关闭，子进程中的描述符保留。
 * 场景：
 *     eventfd可以用于同一个进程之中的线程之间的通信。
 *     eventfd还可以用于同亲缘关系的进程之间的通信。
 *     eventfd用于不同亲缘关系的进程之间通信的话需要把eventfd放在几个进程共享的共享内存中（没有测试过）。
 */
// 创建wakeupfd 用来notify唤醒subReactor处理新来的channel
int createEventfd()
{
    int evtfd = ::eventfd(0, EFD_NONBLOCK | EFD_CLOEXEC);
    if (evtfd < 0)
    {
        LOG_FATAL("eventfd error:%d\\n", errno);
    }
    return evtfd;
}

EventLoop::EventLoop()
    : looping_(false)
    , quit_(false)
    , callingPendingFunctors_(false)
    , threadId_(CurrentThread::tid())
    , poller_(Poller::newDefaultPoller(this))
    , wakeupFd_(createEventfd())
    , wakeupChannel_(new Channel(this, wakeupFd_))
{
    LOG_DEBUG("EventLoop created %p in thread %d\\n", this, threadId_);
    if (t_loopInThisThread)
    {
        LOG_FATAL("Another EventLoop %p exists in this thread %d\\n", t_loopInThisThread, threadId_);
    }
    else
    {
        t_loopInThisThread = this;
    }
    
    wakeupChannel_->setReadCallback(
        std::bind(&EventLoop::handleRead, this)); // 设置wakeupfd的事件类型以及发生事件后的回调操作
    
    wakeupChannel_->enableReading(); // 每一个EventLoop都将监听wakeupChannel_的EPOLL读事件了
}
EventLoop::~EventLoop()
{
    wakeupChannel_->disableAll(); // 给Channel移除所有感兴趣的事件
    wakeupChannel_->remove();     // 把Channel从EventLoop上删除掉
    ::close(wakeupFd_);
    t_loopInThisThread = nullptr;
}

// 开启事件循环
void EventLoop::loop()
{
    looping_ = true;
    quit_ = false;

    LOG_INFO("EventLoop %p start looping\\n", this);

    while (!quit_)
    {
        activeChannels_.clear();
        pollRetureTime_ = poller_->poll(kPollTimeMs, &activeChannels_);
        for (Channel *channel : activeChannels_)
        {
            // Poller监听哪些channel发生了事件 然后上报给EventLoop 通知channel处理相应的事件
            channel->handleEvent(pollRetureTime_);
        }
        /**
         * 执行当前EventLoop事件循环需要处理的回调操作 对于线程数 >=2 的情况 IO线程 mainloop(mainReactor) 主要工作：
         * accept接收连接 => 将accept返回的connfd打包为Channel => TcpServer::newConnection通过轮询将TcpConnection对象分配给subloop处理
         *
         * mainloop调用queueInLoop将回调加入subloop（该回调需要subloop执行 但subloop还在poller_->poll处阻塞） queueInLoop通过wakeup将subloop唤醒
         **/
        doPendingFunctors();
    }
    LOG_INFO("EventLoop %p stop looping.\\n", this);
    looping_ = false;
}

/**
 * 退出事件循环
 * 1. 如果loop在自己的线程中调用quit成功了 说明当前线程已经执行完毕了loop()函数的poller_->poll并退出
 * 2. 如果不是当前EventLoop所属线程中调用quit退出EventLoop 需要唤醒EventLoop所属线程的epoll_wait
 *
 * 比如在一个subloop(worker)中调用mainloop(IO)的quit时 需要唤醒mainloop(IO)的poller_->poll 让其执行完loop()函数
 *
 * ！！！ 注意： 正常情况下 mainloop负责请求连接 将回调写入subloop中 通过生产者消费者模型即可实现线程安全的队列
 * ！！！       但是muduo通过wakeup()机制 使用eventfd创建的wakeupFd_ notify 使得mainloop和subloop之间能够进行通信
 **/
void EventLoop::quit()
{
    quit_ = true;

    if (!isInLoopThread())
    {
        wakeup();
    }
}

// 在当前loop中执行cb
void EventLoop::runInLoop(Functor cb)
{
    if (isInLoopThread()) // 当前EventLoop中执行回调
    {
        cb();
    }
    else // 在非当前EventLoop线程中执行cb，就需要唤醒EventLoop所在线程执行cb
    {
        queueInLoop(cb);
    }
}

// 把cb放入队列中 唤醒loop所在的线程执行cb
void EventLoop::queueInLoop(Functor cb)
{
    {
        std::unique_lock<std::mutex> lock(mutex_);
        pendingFunctors_.emplace_back(cb);
    }

    /**
     * || callingPendingFunctors的意思是 当前loop正在执行回调中 但是loop的pendingFunctors_中又加入了新的回调 需要通过wakeup写事件
     * 唤醒相应的需要执行上面回调操作的loop的线程 让loop()下一次poller_->poll()不再阻塞（阻塞的话会延迟前一次新加入的回调的执行），然后
     * 继续执行pendingFunctors_中的回调函数
     **/
    if (!isInLoopThread() || callingPendingFunctors_)
    {
        wakeup(); // 唤醒loop所在线程
    }
}

void EventLoop::handleRead()
{
    uint64_t one = 1;
    ssize_t n = read(wakeupFd_, &one, sizeof(one));
    if (n != sizeof(one))
    {
        LOG_ERROR("EventLoop::handleRead() reads %lu bytes instead of 8\\n", n);
    }
}

// 用来唤醒loop所在线程 向wakeupFd_写一个数据 wakeupChannel就发生读事件 当前loop线程就会被唤醒
void EventLoop::wakeup()
{
    uint64_t one = 1;
    ssize_t n = write(wakeupFd_, &one, sizeof(one));
    if (n != sizeof(one))
    {
        LOG_ERROR("EventLoop::wakeup() writes %lu bytes instead of 8\\n", n);
    }
}

// EventLoop的方法 => Poller的方法
void EventLoop::updateChannel(Channel *channel)
{
    poller_->updateChannel(channel);
}

void EventLoop::removeChannel(Channel *channel)
{
    poller_->removeChannel(channel);
}

// bool EventLoop::hasChannel(Channel *channel)
// {
//     return poller_->hasChannel(channel);
// }

void EventLoop::doPendingFunctors()
{
    std::vector<Functor> functors;
    callingPendingFunctors_ = true;

    {
        std::unique_lock<std::mutex> lock(mutex_);
        functors.swap(pendingFunctors_); // 交换的方式减少了锁的临界区范围 提升效率 同时避免了死锁 如果执行functor()在临界区内 且functor()中调用queueInLoop()就会产生死锁
    }

    for (const Functor &functor : functors)
    {
        functor(); // 执行当前loop需要执行的回调操作
    }

    callingPendingFunctors_ = false;
}
\`\`\`

### One Loop Per Thread 含义介绍

有没有注意到上面图中，每一个EventLoop都绑定了一个线程（一对一绑定），这种运行模式是Muduo库的特色！！充份利用了多核cpu的能力，每一个核的线程负责循环监听一组文件描述符的集合。至于这个One Loop Per Thread是怎么实现的，后面还会交代。

### 全局概览Poller、Channel和EventLoop在整个Multi-Reactor通信架构中的角色

EventLoop起到一个驱动循环的功能，Poller负责从事件监听器上获取监听结果。而Channel类则在其中起到了将fd及其相关属性封装的作用，将fd及其感兴趣事件和发生的事件以及不同事件对应的回调函数封装在一起，这样在各个模块中传递更加方便。接着EventLoop调用

### EventLoop重要方法 EventLoop:loop()：

\`\`\`cpp
void EventLoop::loop()
{ //EventLoop 所属线程执行
    省略代码 省略代码 省略代码  
    while(!quit_)
    {
        activeChannels_.clear();
        pollReturnTime_ = poller_->poll(kPollTimeMs, &activeChannels_);//此时activeChannels已经填好了事件发生的channel
        for(Channel *channel : activeChannels_)
            channel->HandlerEvent(pollReturnTime_);
        省略代码 省略代码 省略代码
    }
    LOG_INFO("EventLoop %p stop looping. \\n", t_loopInThisThread);
}
\`\`\`

每个EventLoop对象都唯一绑定了一个线程，这个线程其实就在一直执行这个函数里面的while循环，这个while循环的大致逻辑比较简单。就是调用Poller::poll方法获取事件监听器上的监听结果。接下来在loop里面就会调用监听结果中每一个Channel的处理函数HandlerEvent( )。

每一个Channel的处理函数会根据Channel类中封装的实际发生的事件，执行Channel类中封装的各事件处理函数。（比如一个Channel发生了可读事件，可写事件，则这个Channel的HandlerEvent( )就会调用提前注册在这个Channel的可读事件和可写事件处理函数，又比如另一个Channel只发生了可读事件，那么HandlerEvent( )就只会调用提前注册在这个Channel中的可读事件处理函数)

---
## Acceptor

Accetpor封装了服务器监听套接字fd以及相关处理方法。Acceptor类内部其实没有贡献什么核心的处理函数，主要是对其他类的方法调用进行封装。这里也不好概述，具体看下面的内容吧。

### .h

\`\`\`cpp
#pragma once

#include <functional>

#include "noncopyable.h"
#include "Socket.h"
#include "Channel.h"

class EventLoop;
class InetAddress;

class Acceptor : noncopyable
{
public:
    using NewConnectionCallback = std::function<void(int sockfd, const InetAddress &)>;

    Acceptor(EventLoop *loop, const InetAddress &listenAddr, bool reuseport);
    ~Acceptor();
    //设置新连接的回调函数
    void setNewConnectionCallback(const NewConnectionCallback &cb) { NewConnectionCallback_ = cb; }
    // 判断是否在监听
    bool listenning() const { return listenning_; }
    // 监听本地端口
    void listen();

private:
    void handleRead();//处理新用户的连接事件

    EventLoop *loop_; // Acceptor用的就是用户定义的那个baseLoop 也称作mainLoop
    Socket acceptSocket_;//专门用于接收新连接的socket
    Channel acceptChannel_;//专门用于监听新连接的channel
    NewConnectionCallback NewConnectionCallback_;//新连接的回调函数
    bool listenning_;//是否在监听
};
\`\`\`

### .cc

\`\`\`cpp
#include <sys/types.h>
#include <sys/socket.h>
#include <errno.h>
#include <unistd.h>

#include "Acceptor.h"
#include "Logger.h"
#include "InetAddress.h"

static int createNonblocking()
{
    int sockfd = ::socket(AF_INET, SOCK_STREAM | SOCK_NONBLOCK | SOCK_CLOEXEC, IPPROTO_TCP);
    if (sockfd < 0)
    {
        LOG_FATAL("%s:%s:%d listen socket create err:%d\\n", __FILE__, __FUNCTION__, __LINE__, errno);
    }
    return sockfd;
}

Acceptor::Acceptor(EventLoop *loop, const InetAddress &listenAddr, bool reuseport)
    : loop_(loop)
    , acceptSocket_(createNonblocking())
    , acceptChannel_(loop, acceptSocket_.fd())
    , listenning_(false)
{
    acceptSocket_.setReuseAddr(true);
    acceptSocket_.setReusePort(true);
    acceptSocket_.bindAddress(listenAddr);
    // TcpServer::start() => Acceptor.listen() 如果有新用户连接 要执行一个回调(accept => connfd => 打包成Channel => 唤醒subloop)
    // baseloop监听到有事件发生 => acceptChannel_(listenfd) => 执行该回调函数
    acceptChannel_.setReadCallback(
        std::bind(&Acceptor::handleRead, this));
}

Acceptor::~Acceptor()
{
    acceptChannel_.disableAll();    // 把从Poller中感兴趣的事件删除掉
    acceptChannel_.remove();        // 调用EventLoop->removeChannel => Poller->removeChannel 把Poller的ChannelMap对应的部分删除
}

void Acceptor::listen()
{
    listenning_ = true;
    acceptSocket_.listen();         // listen
    acceptChannel_.enableReading(); // acceptChannel_注册至Poller !重要
}

// listenfd有事件发生了，就是有新用户连接了
void Acceptor::handleRead()
{
    InetAddress peerAddr;
    int connfd = acceptSocket_.accept(&peerAddr);
    if (connfd >= 0)
    {
        if (NewConnectionCallback_)
        {
            NewConnectionCallback_(connfd, peerAddr); // 轮询找到subLoop 唤醒并分发当前的新客户端的Channel
        }
        else
        {
            ::close(connfd);
        }
    }
    else
    {
        LOG_ERROR("%s:%s:%d accept err:%d\\n", __FILE__, __FUNCTION__, __LINE__, errno);
        if (errno == EMFILE)
        {
            LOG_ERROR("%s:%s:%d sockfd reached limit\\n", __FILE__, __FUNCTION__, __LINE__);
        }
    }
}
\`\`\`

### Acceptor封装的重要成员变量

acceptSocket_：这个是服务器监听套接字的文件描述符  
acceptChannel_：这是个Channel类，把acceptSocket_及其感兴趣事件和事件对应的处理函数都封装进去。  
EventLoop *loop：监听套接字的fd由哪个EventLoop负责循环监听以及处理相应事件，其实这个EventLoop就是main EventLoop。  
newConnectionCallback_: TcpServer构造函数中将TcpServer::newConnection( )函数注册给了这个成员变量。这个TcpServer::newConnection函数的功能是公平的选择一个subEventLoop，并把已经接受的连接分发给这个subEventLoop。

### Acceptor封装的重要成员方法

listen( )：该函数底层调用了linux的函数listen( )，开启对acceptSocket_的监听同时将acceptChannel及其感兴趣事件（可读事件）注册到main EventLoop的事件监听器上。换言之就是让main EventLoop事件监听器去监听acceptSocket_  
handleRead( )：这是一个私有成员方法，这个方法是要注册到acceptChannel_上的， 同时handleRead( )方法内部还调用了成员变量newConnectionCallback_保存的函数。当main EventLoop监听到acceptChannel_上发生了可读事件时（新用户连接事件），就是调用这个handleRead( )方法。

---
## socket

Socket类只有一个成员sockfd，该类的作用就是用于管理TCP连接对应的sockfd的生命周期（析构的时候close该sockfd），以及提供一些函数来修改sockfd上的选项，比如Nagel算法、设置地址复用等。Socket类如下所示：

\`\`\`cpp
class Socket : noncopyable
{
public:
    explicit Socket(int sockfd) : sockfd_(sockfd) {}
    ~Socket();
    // 获取sockfd
    int fd() const { return sockfd_; }
    // 绑定sockfd，就是调用::bind函数
    void bindAddress(const InetAddress &localaddr);
    // 就是调用::listen函数
    void listen();
    // 接受连接
    int accept(InetAddress *peeraddr);
    // 设置半关闭
    void shutdownWrite();
    void setTcpNoDelay(bool on);    // 设置Nagel算法 
    void setReuseAddr(bool on);     // 设置地址复用
    void setReusePort(bool on);     // 设置端口复用
    void setKeepAlive(bool on);     // 设置长连接
private:
    const int sockfd_;
};
\`\`\`

## buffer

Buffer类其实是封装了一个用户缓冲区，以及向这个缓冲区写数据读数据等一系列控制方法。

### .h

\`\`\`cpp
#pragma once

#include <vector>
#include <string>
#include <algorithm>
#include <stddef.h>

// 网络库底层的缓冲区类型定义
class Buffer
{
public:
    static const size_t kCheapPrepend = 8;//初始预留的prependabel空间大小
    static const size_t kInitialSize = 1024;

    explicit Buffer(size_t initalSize = kInitialSize)
        : buffer_(kCheapPrepend + initalSize)
        , readerIndex_(kCheapPrepend)
        , writerIndex_(kCheapPrepend)
    {
    }

    size_t readableBytes() const { return writerIndex_ - readerIndex_; }
    size_t writableBytes() const { return buffer_.size() - writerIndex_; }
    size_t prependableBytes() const { return readerIndex_; }

    // 返回缓冲区中可读数据的起始地址
    const char *peek() const { return begin() + readerIndex_; }
    void retrieve(size_t len)
    {
        if (len < readableBytes())
        {
            readerIndex_ += len; // 说明应用只读取了可读缓冲区数据的一部分，就是len长度 还剩下readerIndex+=len到writerIndex_的数据未读
        }
        else // len == readableBytes()
        {
            retrieveAll();
        }
    }
    void retrieveAll()
    {
        readerIndex_ = kCheapPrepend;
        writerIndex_ = kCheapPrepend;
    }

    // 把onMessage函数上报的Buffer数据 转成string类型的数据返回
    std::string retrieveAllAsString() { return retrieveAsString(readableBytes()); }
    std::string retrieveAsString(size_t len)
    {
        std::string result(peek(), len);
        retrieve(len); // 上面一句把缓冲区中可读的数据已经读取出来 这里肯定要对缓冲区进行复位操作
        return result;
    }

    // buffer_.size - writerIndex_
    void ensureWritableBytes(size_t len)
    {
        if (writableBytes() < len)
        {
            makeSpace(len); // 扩容
        }
    }

    // 把[data, data+len]内存上的数据添加到writable缓冲区当中
    void append(const char *data, size_t len)
    {
        ensureWritableBytes(len);
        std::copy(data, data+len, beginWrite());
        writerIndex_ += len;
    }
    char *beginWrite() { return begin() + writerIndex_; }
    const char *beginWrite() const { return begin() + writerIndex_; }

    // 从fd上读取数据
    ssize_t readFd(int fd, int *saveErrno);
    // 通过fd发送数据
    ssize_t writeFd(int fd, int *saveErrno);

private:
    // vector底层数组首元素的地址 也就是数组的起始地址
    char *begin() { return &*buffer_.begin(); }
    const char *begin() const { return &*buffer_.begin(); }

    void makeSpace(size_t len)
    {
        /**
         * | kCheapPrepend |xxx| reader | writer |                     // xxx标示reader中已读的部分
         * | kCheapPrepend | reader ｜          len          |
         **/
        if (writableBytes() + prependableBytes() < len + kCheapPrepend) // 也就是说 len > xxx前面剩余的空间 + writer的部分
        {
            buffer_.resize(writerIndex_ + len);
        }
        else // 这里说明 len <= xxx + writer 把reader搬到从xxx开始 使得xxx后面是一段连续空间
        {
            size_t readable = readableBytes(); // readable = reader的长度
            // 将当前缓冲区中从readerIndex_到writerIndex_的数据
            // 拷贝到缓冲区起始位置kCheapPrepend处，以便腾出更多的可写空间
            std::copy(begin() + readerIndex_,
                      begin() + writerIndex_,
                      begin() + kCheapPrepend);
            readerIndex_ = kCheapPrepend;
            writerIndex_ = readerIndex_ + readable;
        }
    }

    std::vector<char> buffer_;
    size_t readerIndex_;
    size_t writerIndex_;
};
\`\`\`

### .cc

\`\`\`cpp
#include <errno.h>
#include <sys/uio.h>
#include <unistd.h>

#include "Buffer.h"

/**
 * 从fd上读取数据 Poller工作在LT模式
 * Buffer缓冲区是有大小的！ 但是从fd上读取数据的时候 却不知道tcp数据的最终大小
 *
 * @description: 从socket读到缓冲区的方法是使用readv先读至buffer_，
 * Buffer_空间如果不够会读入到栈上65536个字节大小的空间，然后以append的
 * 方式追加入buffer_。既考虑了避免系统调用带来开销，又不影响数据的接收。
 **/
ssize_t Buffer::readFd(int fd, int *saveErrno)
{
    // 栈额外空间，用于从套接字往出读时，当buffer_暂时不够用时暂存数据，待buffer_重新分配足够空间后，在把数据交换给buffer_。
    char extrabuf[65536] = {0}; // 栈上内存空间 65536/1024 = 64KB

    /*
    struct iovec {
        ptr_t iov_base; // iov_base指向的缓冲区存放的是readv所接收的数据或是writev将要发送的数据
        size_t iov_len; // iov_len在各种情况下分别确定了接收的最大长度以及实际写入的长度
    };
    */

    // 使用iovec分配两个连续的缓冲区
    struct iovec vec[2];
    const size_t writable = writableBytes(); // 这是Buffer底层缓冲区剩余的可写空间大小 不一定能完全存储从fd读出的数据

    // 第一块缓冲区，指向可写空间
    vec[0].iov_base = begin() + writerIndex_;
    vec[0].iov_len = writable;
    // 第二块缓冲区，指向栈空间
    vec[1].iov_base = extrabuf;
    vec[1].iov_len = sizeof(extrabuf);

    // when there is enough space in this buffer, don't read into extrabuf.
    // when extrabuf is used, we read 128k-1 bytes at most.
    // 这里之所以说最多128k-1字节，是因为若writable为64k-1，那么需要两个缓冲区 第一个64k-1 第二个64k 所以做多128k-1
    // 如果第一个缓冲区>=64k 那就只采用一个缓冲区 而不使用栈空间extrabuf[65536]的内容
    const int iovcnt = (writable < sizeof(extrabuf)) ? 2 : 1;
    const ssize_t n = ::readv(fd, vec, iovcnt);

    if (n < 0)
    {
        *saveErrno = errno;
    }
    else if (n <= writable) // Buffer的可写缓冲区已经够存储读出来的数据了
    {
        writerIndex_ += n;
    }
    else // extrabuf里面也写入了n-writable长度的数据
    {
        writerIndex_ = buffer_.size();
        append(extrabuf, n - writable); // 对buffer_扩容 并将extrabuf存储的另一部分数据追加至buffer_
    }
    return n;
}

// inputBuffer_.readFd表示将对端数据读到inputBuffer_中，移动writerIndex_指针
// outputBuffer_.writeFd标示将数据写入到outputBuffer_中，从readerIndex_开始，可以写readableBytes()个字节
ssize_t Buffer::writeFd(int fd, int *saveErrno)
{
    ssize_t n = ::write(fd, peek(), readableBytes());
    if (n < 0)
    {
        *saveErrno = errno;
    }
    return n;
}
\`\`\`

### 重要的成员方法：

append(const char* data, size_t len)：将data数据添加到缓冲区中。  
retrieveAsString(size_t len); :获取缓冲区中长度为len的数据，并以strnig返回。  
retrieveAllString();获取缓冲区所有数据，并以string返回。  
ensureWritableByts(size_t len);当你打算向缓冲区写入长度为len的数据之前，先调用这个函数，这个函数会检查你的缓冲区可写空间能不能装下长度为len的数据，如果不能，就动态扩容。  
下面两个方法主要是封装了调用了上面几个方法：  
ssize_t Buffer::readFd(int fd, int* saveErrno);：客户端发来数据，readFd从该TCP接收缓冲区中将数据读出来并放到Buffer中。  
ssize_t Buffer::writeFd(int fd, int* saveErrno);：服务端要向这条TCP连接发送数据，通过该方法将Buffer中的数据拷贝到TCP发送缓冲区中。

​

---
## TcpServer

TcpServer类管理TcpConnetcion，供用户直接使用，生命周期由用户控制。接口如下，用户只需要设置好callback，然后调用start()即可。

下图是TcpServer新建立连接的相关函数调用顺序。

当在EventLoop::loop=>EPollPoller::poll()[当epoll_wait被唤醒]=>[并且唤醒的是listenning fd可读]就会返回所有就绪的Channel的事件，此时就会调用Accpetor::handleRead方法，创建TcpConnection对象，后面应该还会处理其他回调事件的。【这里或许可以考虑使用协程的addevent替换，但是引入协程性能一定会高吗？】

**补充：**

这里channel有几种：

1.Eventloop注册的Channel【eventfd主要是唤醒epoll_wait，当在执行pending的时候又来了新的回调防止阻塞太久】

2.Acceptor注册的Channel，其目的是就是listen fd新连接可到的时候，调用Accpetor::newConnection（）创建TcpConnection对象。

3.TcpConnection会注册四种fd感兴趣的事件，也就是TcpConnection对应的Channel。

![](images/yuque/img_muduo_06_01.png)

### .h

\`\`\`cpp
#pragma once

/**
 * 用户使用muduo编写服务器程序
 **/

#include <functional>
#include <string>
#include <memory>
#include <atomic>
#include <unordered_map>

#include "EventLoop.h"
#include "Acceptor.h"
#include "InetAddress.h"
#include "noncopyable.h"
#include "EventLoopThreadPool.h"
#include "Callbacks.h"
#include "TcpConnection.h"
#include "Buffer.h"

// 对外的服务器编程使用的类
class TcpServer
{
public:
    using ThreadInitCallback = std::function<void(EventLoop *)>;

    enum Option
    {
        kNoReusePort,//不允许重用本地端口
        kReusePort,//允许重用本地端口
    };

    TcpServer(EventLoop *loop,
              const InetAddress &listenAddr,
              const std::string &nameArg,
              Option option = kNoReusePort);
    ~TcpServer();

    void setThreadInitCallback(const ThreadInitCallback &cb) { threadInitCallback_ = cb; }
    void setConnectionCallback(const ConnectionCallback &cb) { connectionCallback_ = cb; }
    void setMessageCallback(const MessageCallback &cb) { messageCallback_ = cb; }
    void setWriteCompleteCallback(const WriteCompleteCallback &cb) { writeCompleteCallback_ = cb; }

    // 设置底层subloop的个数
    void setThreadNum(int numThreads);
    /**
     * 如果没有监听, 就启动服务器(监听).
     * 多次调用没有副作用.
     * 线程安全.
     */
    void start();

private:
    void newConnection(int sockfd, const InetAddress &peerAddr);
    void removeConnection(const TcpConnectionPtr &conn);
    void removeConnectionInLoop(const TcpConnectionPtr &conn);

    using ConnectionMap = std::unordered_map<std::string, TcpConnectionPtr>;

    EventLoop *loop_; // baseloop 用户自定义的loop

    const std::string ipPort_;
    const std::string name_;

    std::unique_ptr<Acceptor> acceptor_; // 运行在mainloop 任务就是监听新连接事件

    std::shared_ptr<EventLoopThreadPool> threadPool_; // one loop per thread

    ConnectionCallback connectionCallback_;       //有新连接时的回调
    MessageCallback messageCallback_;             // 有读写事件发生时的回调
    WriteCompleteCallback writeCompleteCallback_; // 消息发送完成后的回调

    ThreadInitCallback threadInitCallback_; // loop线程初始化的回调

    std::atomic_int started_;

    int nextConnId_;
    ConnectionMap connections_; // 保存所有的连接
};
\`\`\`

注意到并没有连接关闭回调，这是由TcpServer::removeConnection()负责的，进而把工作交给TcpConnecion::connectDestroyed(),用户不可更改设置。

### .cc

\`\`\`cpp
#include <functional>
#include <string.h>

#include "TcpServer.h"
#include "Logger.h"
#include "TcpConnection.h"

static EventLoop *CheckLoopNotNull(EventLoop *loop)
{
    if (loop == nullptr)
    {
        LOG_FATAL("%s:%s:%d mainLoop is null!\\n", __FILE__, __FUNCTION__, __LINE__);
    }
    return loop;
}

TcpServer::TcpServer(EventLoop *loop,
                     const InetAddress &listenAddr,
                     const std::string &nameArg,
                     Option option)
    : loop_(CheckLoopNotNull(loop))
    , ipPort_(listenAddr.toIpPort())
    , name_(nameArg)
    , acceptor_(new Acceptor(loop, listenAddr, option == kReusePort))
    , threadPool_(new EventLoopThreadPool(loop, name_))
    , connectionCallback_()
    , messageCallback_()
    , nextConnId_(1)
    , started_(0)
{
    // 当有新用户连接时，Acceptor类中绑定的acceptChannel_会有读事件发生，执行handleRead()调用TcpServer::newConnection回调
    acceptor_->setNewConnectionCallback(
        std::bind(&TcpServer::newConnection, this, std::placeholders::_1, std::placeholders::_2));
}

TcpServer::~TcpServer()
{
    for(auto &item : connections_)
    {
        TcpConnectionPtr conn(item.second);
        item.second.reset();    // 把原始的智能指针复位 让栈空间的TcpConnectionPtr conn指向该对象 当conn出了其作用域 即可释放智能指针指向的对象
        // 销毁连接
        conn->getLoop()->runInLoop(
            std::bind(&TcpConnection::connectDestroyed, conn));
    }
}

// 设置底层subloop的个数
void TcpServer::setThreadNum(int numThreads)
{
    threadPool_->setThreadNum(numThreads);
}

// 开启服务器监听
void TcpServer::start()
{
    if (started_++ == 0)    // 防止一个TcpServer对象被start多次
    {
        threadPool_->start(threadInitCallback_);    // 启动底层的loop线程池
        loop_->runInLoop(std::bind(&Acceptor::listen, acceptor_.get()));
    }
}

// 有一个新用户连接，acceptor会执行这个回调操作，负责将mainLoop接收到的请求连接(acceptChannel_会有读事件发生)通过回调轮询分发给subLoop去处理
void TcpServer::newConnection(int sockfd, const InetAddress &peerAddr)
{
    // 轮询算法 选择一个subLoop 来管理connfd对应的channel
    EventLoop *ioLoop = threadPool_->getNextLoop();
    char buf[64] = {0};
    snprintf(buf, sizeof buf, "-%s#%d", ipPort_.c_str(), nextConnId_);
    ++nextConnId_;  // 这里没有设置为原子类是因为其只在mainloop中执行 不涉及线程安全问题
    std::string connName = name_ + buf;

    LOG_INFO("TcpServer::newConnection [%s] - new connection [%s] from %s\\n",
             name_.c_str(), connName.c_str(), peerAddr.toIpPort().c_str());
    
    // 通过sockfd获取其绑定的本机的ip地址和端口信息
    sockaddr_in local;
    ::memset(&local, 0, sizeof(local));
    socklen_t addrlen = sizeof(local);
    if(::getsockname(sockfd, (sockaddr *)&local, &addrlen) < 0)
    {
        LOG_ERROR("sockets::getLocalAddr");
    }

    InetAddress localAddr(local);
    TcpConnectionPtr conn(new TcpConnection(ioLoop,
                                            connName,
                                            sockfd,
                                            localAddr,
                                            peerAddr));
    connections_[connName] = conn;
    // 下面的回调都是用户设置给TcpServer => TcpConnection的，至于Channel绑定的则是TcpConnection设置的四个，handleRead,handleWrite... 这下面的回调用于handlexxx函数中
    conn->setConnectionCallback(connectionCallback_);
    conn->setMessageCallback(messageCallback_);
    conn->setWriteCompleteCallback(writeCompleteCallback_);

    // 设置了如何关闭连接的回调
    conn->setCloseCallback(
        std::bind(&TcpServer::removeConnection, this, std::placeholders::_1));

    ioLoop->runInLoop(
        std::bind(&TcpConnection::connectEstablished, conn));
}

void TcpServer::removeConnection(const TcpConnectionPtr &conn)
{
    loop_->runInLoop(
        std::bind(&TcpServer::removeConnectionInLoop, this, conn));
}

void TcpServer::removeConnectionInLoop(const TcpConnectionPtr &conn)
{
    LOG_INFO("TcpServer::removeConnectionInLoop [%s] - connection %s\\n",
             name_.c_str(), conn->name().c_str());

    connections_.erase(conn->name());
    EventLoop *ioLoop = conn->getLoop();
    ioLoop->queueInLoop(
        std::bind(&TcpConnection::connectDestroyed, conn));
}
\`\`\`

### 重要函数方法分析

#### TcpServer的构造与析构：

构造函数的主要工作为成员申请资源，为各回调设置回调函数。

TcpServer析构工作内容很简单，主要销毁ConnectionMap中所有Tcp连接，而每个Tcp连接用的是一个TcpConnection对象来管理的。·

\`\`\`cpp
static EventLoop *CheckLoopNotNull(EventLoop *loop)//首先判断传入的loop是否有效，无效直接终止程序
{
    if (loop == nullptr)
    {
        LOG_FATAL("%s:%s:%d mainLoop is null!\\n", __FILE__, __FUNCTION__, __LINE__);
    }
    return loop;
}

TcpServer::TcpServer(EventLoop *loop,
                     const InetAddress &listenAddr,
                     const std::string &nameArg,
                     Option option)
    : loop_(CheckLoopNotNull(loop))
    , ipPort_(listenAddr.toIpPort())
    , name_(nameArg)
    , acceptor_(new Acceptor(loop, listenAddr, option == kReusePort))
    , threadPool_(new EventLoopThreadPool(loop, name_))
    , connectionCallback_()
    , messageCallback_()
    , nextConnId_(1)
    , started_(0)
{
    // 当有新用户连接时，Acceptor类中绑定的acceptChannel_会有读事件发生，执行handleRead()调用TcpServer::newConnection回调
    acceptor_->setNewConnectionCallback(
        std::bind(&TcpServer::newConnection, this, std::placeholders::_1, std::placeholders::_2));
}

TcpServer::~TcpServer()
{
    for(auto &item : connections_)
    {
        TcpConnectionPtr conn(item.second);
        item.second.reset();    // 把原始的智能指针复位 让栈空间的TcpConnectionPtr conn指向该对象 当conn出了其作用域 即可释放智能指针指向的对象
        // 销毁连接
        conn->getLoop()->runInLoop(
            std::bind(&TcpConnection::connectDestroyed, conn));
    }
}
\`\`\`

#### start：

TcpServer启动Tcp服务器，主要线程池的启动；Acceptor监听Tcp连接请求。

线程池需要指定其初始数量，当然，这需要在start()之前调用TcpServer::setThreadNum()设置。

\`\`\`cpp
// 开启服务器监听
void TcpServer::start()
{
    if (started_.fetch_add(1) == 0)    // 防止一个TcpServer对象被start多次
    {
        threadPool_->start(threadInitCallback_);    // 启动底层的loop线程池
        loop_->runInLoop(std::bind(&Acceptor::listen, acceptor_.get()));
    }
}
\`\`\`

#### NewConnection：

在学习这个类的时候有两个问题：

1.TcpServer如何获得新连接的conn fd？

TcpServer内部使用了Acceptor对象，Acceptor往Channel中注册了一个读事件，读事件handleRead又回去调用newConnection。

2.如何创建TcpConnetion对象？

新连接请求到达时，Acceptor回调newConnection()，通过TcpS​erver::newConnection创建一个新TcpConnection对象，用于管理一个Tcp连接。

**即 TcpServer::newConnection的回调顺序**

**重点：**  **EventLoop=>Channel=>Acceptor=>TcpServer。**

\`\`\`cpp
// 有一个新用户连接，acceptor会执行这个回调操作，负责将mainLoop接收到的请求连接(acceptChannel_会有读事件发生)通过回调轮询分发给subLoop去处理
void TcpServer::newConnection(int sockfd, const InetAddress &peerAddr)
{
    // 轮询算法 选择一个subLoop 来管理connfd对应的channel
    EventLoop *ioLoop = threadPool_->getNextLoop();
    char buf[64] = {0};
    snprintf(buf, sizeof buf, "-%s#%d", ipPort_.c_str(), nextConnId_);
    ++nextConnId_;  // 这里没有设置为原子类是因为其只在mainloop中执行 不涉及线程安全问题
    std::string connName = name_ + buf;

    LOG_INFO("TcpServer::newConnection [%s] - new connection [%s] from %s\\n",
             name_.c_str(), connName.c_str(), peerAddr.toIpPort().c_str());
    
    // 通过sockfd获取其绑定的本机的ip地址和端口信息
    sockaddr_in local;
    ::memset(&local, 0, sizeof(local));
    socklen_t addrlen = sizeof(local);
    if(::getsockname(sockfd, (sockaddr *)&local, &addrlen) < 0)
    {
        LOG_ERROR("sockets::getLocalAddr");
    }

    InetAddress localAddr(local);
    TcpConnectionPtr conn(new TcpConnection(ioLoop,
                                            connName,
                                            sockfd,
                                            localAddr,
                                            peerAddr));
    connections_[connName] = conn;
    // 下面的回调都是用户设置给TcpServer => TcpConnection的，至于Channel绑定的则是TcpConnection设置的四个，handleRead,handleWrite... 这下面的回调用于handlexxx函数中
    conn->setConnectionCallback(connectionCallback_);
    conn->setMessageCallback(messageCallback_);
    conn->setWriteCompleteCallback(writeCompleteCallback_);

    // 设置了如何关闭连接的回调
    conn->setCloseCallback(
        std::bind(&TcpServer::removeConnection, this, std::placeholders::_1));

    ioLoop->runInLoop(
        std::bind(&TcpConnection::connectEstablished, conn));
}

\`\`\`

**问题：**

在网络编程中，当一个服务器端的socket接收到一个新的连接请求时，它会通过 accept() 函数创建一个新的socket描述符（sockfd），用于与新连接的客户端进行通信。这个新的socket描述符代表了服务器端与客户端的连接通道。

在 TcpServer::newConnection 方法中，sockfd 是这个新建立的连接的socket描述符。虽然这个连接已经建立，但是为了进行数据的发送和接收，服务器需要知道这个连接的具体网络地址信息，即这个socket绑定的本地服务端IP地址和端口号。这些信息对于服务器来说是非常重要的，因为：

1.日志记录：记录服务端在当前连接中使用的ip和端口号，便于调试和追踪问题。

2.支持多网卡环境下的网络服务，服务端可能有多个网卡，绑定了不同的ip地址。如果服务端监听的是0.0.0.0( 即监听所有网卡上的地址），那么  \`accept\`  返回的  \`sockfd\`  实际绑定的本地 IP 和端口可能会因具体的客户端请求而异。  使用getsockname可以告诉我们此时建立连接的网卡的服务端的ip地址和port。

3.初始化Tcpconnection对象。

4.防御性编程：确保bin绑定的ip和port，通过getsockname确定没有问题。

---
## TcpConneciton

TcpConnection类是muduo库最核心的类，唯一默认用shared_ptr来管理的类，唯一继承自enable_shared_from_this的类。

这是因为其生命周期模糊：可能在连接断开时，还有其他地方持有它的引用，贸然delete会造成悬空指针。只有确保其他地方没有持有该对象的引用的时候，才能安全地销毁对象。

### .h

\`\`\`cpp
#pragma once

#include <memory>
#include <string>
#include <atomic>

#include "noncopyable.h"
#include "InetAddress.h"
#include "Callbacks.h"
#include "Buffer.h"
#include "Timestamp.h"

class Channel;
class EventLoop;
class Socket;

/**
 * TcpServer => Acceptor => 有一个新用户连接，通过accept函数拿到connfd
 * => TcpConnection设置回调 => 设置到Channel => Poller => Channel回调
 **/

class TcpConnection : noncopyable, public std::enable_shared_from_this<TcpConnection>
{
public:
    TcpConnection(EventLoop *loop,
                  const std::string &nameArg,
                  int sockfd,
                  const InetAddress &localAddr,
                  const InetAddress &peerAddr);
    ~TcpConnection();

    EventLoop *getLoop() const { return loop_; }
    const std::string &name() const { return name_; }
    const InetAddress &localAddress() const { return localAddr_; }
    const InetAddress &peerAddress() const { return peerAddr_; }

    bool connected() const { return state_ == kConnected; }

    // 发送数据
    void send(const std::string &buf);
    // 关闭连接
    void shutdown();

    void setConnectionCallback(const ConnectionCallback &cb)
    { connectionCallback_ = cb; }
    void setMessageCallback(const MessageCallback &cb)
    { messageCallback_ = cb; }
    void setWriteCompleteCallback(const WriteCompleteCallback &cb)
    { writeCompleteCallback_ = cb; }
    void setCloseCallback(const CloseCallback &cb)
    { closeCallback_ = cb; }
    void setHighWaterMarkCallback(const HighWaterMarkCallback &cb, size_t highWaterMark)
    { highWaterMarkCallback_ = cb; highWaterMark_ = highWaterMark; }

    // 连接建立
    void connectEstablished();
    // 连接销毁
    void connectDestroyed();

private:
    enum StateE
    {
        kDisconnected, // 已经断开连接
        kConnecting,   // 正在连接
        kConnected,    // 已连接
        kDisconnecting // 正在断开连接
    };
    void setState(StateE state) { state_ = state; }

    void handleRead(Timestamp receiveTime);
    void handleWrite();
    void handleClose();
    void handleError();

    void sendInLoop(const void *data, size_t len);
    void shutdownInLoop();

    EventLoop *loop_; // 这里是baseloop还是subloop由TcpServer中创建的线程数决定 若为多Reactor 该loop_指向subloop 若为单Reactor 该loop_指向baseloop
    const std::string name_;
    std::atomic_int state_;
    bool reading_;

    // Socket Channel 这里和Acceptor类似    Acceptor => mainloop    TcpConnection => subloop
    std::unique_ptr<Socket> socket_;
    std::unique_ptr<Channel> channel_;

    const InetAddress localAddr_;
    const InetAddress peerAddr_;

    // 这些回调TcpServer也有 用户通过写入TcpServer注册 TcpServer再将注册的回调传递给TcpConnection TcpConnection再将回调注册到Channel中
    ConnectionCallback connectionCallback_;       // 有新连接时的回调
    MessageCallback messageCallback_;             // 有读写消息时的回调
    WriteCompleteCallback writeCompleteCallback_; // 消息发送完成以后的回调
    HighWaterMarkCallback highWaterMarkCallback_;
    CloseCallback closeCallback_;
    size_t highWaterMark_;

    // 数据缓冲区
    Buffer inputBuffer_;    // 接收数据的缓冲区
    Buffer outputBuffer_;   // 发送数据的缓冲区 用户send向outputBuffer_发
};
\`\`\`

​

### .cc

\`\`\`cpp
#include <functional>
#include <string>
#include <errno.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <string.h>
#include <netinet/tcp.h>

#include "TcpConnection.h"
#include "Logger.h"
#include "Socket.h"
#include "Channel.h"
#include "EventLoop.h"

static EventLoop *CheckLoopNotNull(EventLoop *loop)
{
    if (loop == nullptr)
    {
        LOG_FATAL("%s:%s:%d mainLoop is null!\\n", __FILE__, __FUNCTION__, __LINE__);
    }
    return loop;
}

TcpConnection::TcpConnection(EventLoop *loop,
                             const std::string &nameArg,
                             int sockfd,
                             const InetAddress &localAddr,
                             const InetAddress &peerAddr)
    : loop_(CheckLoopNotNull(loop))
    , name_(nameArg)
    , state_(kConnecting)
    , reading_(true)
    , socket_(new Socket(sockfd))
    , channel_(new Channel(loop, sockfd))
    , localAddr_(localAddr)
    , peerAddr_(peerAddr)
    , highWaterMark_(64 * 1024 * 1024) // 64M
{
    // 下面给channel设置相应的回调函数 poller给channel通知感兴趣的事件发生了 channel会回调相应的回调函数
    channel_->setReadCallback(
        std::bind(&TcpConnection::handleRead, this, std::placeholders::_1));
    channel_->setWriteCallback(
        std::bind(&TcpConnection::handleWrite, this));
    channel_->setCloseCallback(
        std::bind(&TcpConnection::handleClose, this));
    channel_->setErrorCallback(
        std::bind(&TcpConnection::handleError, this));

    LOG_INFO("TcpConnection::ctor[%s] at fd=%d\\n", name_.c_str(), sockfd);
    socket_->setKeepAlive(true);
}

TcpConnection::~TcpConnection()
{
    LOG_INFO("TcpConnection::dtor[%s] at fd=%d state=%d\\n", name_.c_str(), channel_->fd(), (int)state_);
}

void TcpConnection::send(const std::string &buf)
{
    if (state_ == kConnected)
    {
        if (loop_->isInLoopThread()) // 这种是对于单个reactor的情况 用户调用conn->send时 loop_即为当前线程
        {
            sendInLoop(buf.c_str(), buf.size());
        }
        else
        {
            loop_->runInLoop(
                std::bind(&TcpConnection::sendInLoop, this, buf.c_str(), buf.size()));
        }
    }
}

/**
 * 发送数据 应用写的快 而内核发送数据慢 需要把待发送数据写入缓冲区，而且设置了水位回调
 **/
void TcpConnection::sendInLoop(const void *data, size_t len)
{
    ssize_t nwrote = 0;
    size_t remaining = len;
    bool faultError = false;

    if (state_ == kDisconnected) // 之前调用过该connection的shutdown 不能再进行发送了
    {
        LOG_ERROR("disconnected, give up writing");
    }

    // 表示channel_第一次开始写数据或者缓冲区没有待发送数据
    if (!channel_->isWriting() && outputBuffer_.readableBytes() == 0)
    {
        nwrote = ::write(channel_->fd(), data, len);
        if (nwrote >= 0)
        {
            remaining = len - nwrote;
            if (remaining == 0 && writeCompleteCallback_)
            {
                // 既然在这里数据全部发送完成，就不用再给channel设置epollout事件了
                loop_->queueInLoop(
                    std::bind(writeCompleteCallback_, shared_from_this()));
            }
        }
        else // nwrote < 0
        {
            nwrote = 0;
            if (errno != EWOULDBLOCK) // EWOULDBLOCK表示非阻塞情况下没有数据后的正常返回 等同于EAGAIN
            {
                LOG_ERROR("TcpConnection::sendInLoop");
                if (errno == EPIPE || errno == ECONNRESET) // SIGPIPE RESET
                {
                    faultError = true;
                }
            }
        }
    }
    /**
     * 说明当前这一次write并没有把数据全部发送出去 剩余的数据需要保存到缓冲区当中
     * 然后给channel注册EPOLLOUT事件，Poller发现tcp的发送缓冲区有空间后会通知
     * 相应的sock->channel，调用channel对应注册的writeCallback_回调方法，
     * channel的writeCallback_实际上就是TcpConnection设置的handleWrite回调，
     * 把发送缓冲区outputBuffer_的内容全部发送完成
     **/
    if (!faultError && remaining > 0)
    {
        // 目前发送缓冲区剩余的待发送的数据的长度
        size_t oldLen = outputBuffer_.readableBytes();
        if (oldLen + remaining >= highWaterMark_ && oldLen < highWaterMark_ && highWaterMarkCallback_)
        {
            loop_->queueInLoop(
                std::bind(highWaterMarkCallback_, shared_from_this(), oldLen + remaining));
        }
        outputBuffer_.append((char *)data + nwrote, remaining);
        if (!channel_->isWriting())
        {
            channel_->enableWriting(); // 这里一定要注册channel的写事件 否则poller不会给channel通知epollout
        }
    }
}

void TcpConnection::shutdown()
{
    if (state_ == kConnected)
    {
        setState(kDisconnecting);
        loop_->runInLoop(
            std::bind(&TcpConnection::shutdownInLoop, this));
    }
}

void TcpConnection::shutdownInLoop()
{
    if (!channel_->isWriting()) // 说明当前outputBuffer_的数据全部向外发送完成
    {
        socket_->shutdownWrite();
    }
}

// 连接建立
void TcpConnection::connectEstablished()
{
    setState(kConnected);
    channel_->tie(shared_from_this());
    channel_->enableReading(); // 向poller注册channel的EPOLLIN读事件

    // 新连接建立 执行回调
    connectionCallback_(shared_from_this());
}
// 连接销毁
void TcpConnection::connectDestroyed()
{
    if (state_ == kConnected)
    {
        setState(kDisconnected);
        channel_->disableAll(); // 把channel的所有感兴趣的事件从poller中删除掉
        connectionCallback_(shared_from_this());
    }
    channel_->remove(); // 把channel从poller中删除掉
}

// 读是相对服务器而言的 当对端客户端有数据到达 服务器端检测到EPOLLIN 就会触发该fd上的回调 handleRead取读走对端发来的数据
void TcpConnection::handleRead(Timestamp receiveTime)
{
    int savedErrno = 0;
    ssize_t n = inputBuffer_.readFd(channel_->fd(), &savedErrno);
    if (n > 0) // 有数据到达
    {
        // 已建立连接的用户有可读事件发生了 调用用户传入的回调操作onMessage shared_from_this就是获取了TcpConnection的智能指针
        messageCallback_(shared_from_this(), &inputBuffer_, receiveTime);
    }
    else if (n == 0) // 客户端断开
    {
        handleClose();
    }
    else // 出错了
    {
        errno = savedErrno;
        LOG_ERROR("TcpConnection::handleRead");
        handleError();
    }
}

void TcpConnection::handleWrite()
{
    if (channel_->isWriting())
    {
        int savedErrno = 0;
        ssize_t n = outputBuffer_.writeFd(channel_->fd(), &savedErrno);
        if (n > 0)
        {
            outputBuffer_.retrieve(n);
            if (outputBuffer_.readableBytes() == 0)
            {
                channel_->disableWriting();
                if (writeCompleteCallback_)
                {
                    // TcpConnection对象在其所在的subloop中 向pendingFunctors_中加入回调
                    loop_->queueInLoop(
                        std::bind(writeCompleteCallback_, shared_from_this()));
                }
                if (state_ == kDisconnecting)
                {
                    shutdownInLoop(); // 在当前所属的loop中把TcpConnection删除掉
                }
            }
        }
        else
        {
            LOG_ERROR("TcpConnection::handleWrite");
        }
    }
    else
    {
        LOG_ERROR("TcpConnection fd=%d is down, no more writing", channel_->fd());
    }
}

void TcpConnection::handleClose()
{
    LOG_INFO("TcpConnection::handleClose fd=%d state=%d\\n", channel_->fd(), (int)state_);
    setState(kDisconnected);
    channel_->disableAll();

    TcpConnectionPtr connPtr(shared_from_this());
    connectionCallback_(connPtr); // 执行连接关闭的回调
    closeCallback_(connPtr);      // 执行关闭连接的回调 执行的是TcpServer::removeConnection回调方法   // must be the last line
}

void TcpConnection::handleError()
{
    int optval;
    socklen_t optlen = sizeof optval;
    int err = 0;
    if (::getsockopt(channel_->fd(), SOL_SOCKET, SO_ERROR, &optval, &optlen) < 0)
    {
        err = errno;
    }
    else
    {
        err = optval;
    }
    LOG_ERROR("TcpConnection::handleError name:%s - SO_ERROR:%d\\n", name_.c_str(), err);
}
\`\`\`

### 构造函数与析构函数：

这里其实没有什么要说的给私有成员数据初始化，并且Socket socket_传入的是Acceptor的connfd(已经通过accept系统调用返回的监听全连接队列，服务器和客户端通信的通道。)

Channel就和上面说的一样这个Channel是属于Tcpconnection的。

localaddr表示服务端的ip和port。

peeraddr表示accpet系统调用后的客户端的ip和port。

\`\`\`cpp
static EventLoop *CheckLoopNotNull(EventLoop *loop)
{
    if (loop == nullptr)
    {
        LOG_FATAL("%s:%s:%d mainLoop is null!\\n", __FILE__, __FUNCTION__, __LINE__);
    }
    return loop;
}

TcpConnection::TcpConnection(EventLoop *loop,
                             const std::string &nameArg,
                             int sockfd,
                             const InetAddress &localAddr,
                             const InetAddress &peerAddr)
    : loop_(CheckLoopNotNull(loop))
    , name_(nameArg)
    , state_(kConnecting)
    , reading_(true)
    , socket_(new Socket(sockfd))
    , channel_(new Channel(loop, sockfd))
    , localAddr_(localAddr)
    , peerAddr_(peerAddr)
    , highWaterMark_(64 * 1024 * 1024) // 64M
{
    // 下面给channel设置相应的回调函数 poller给channel通知感兴趣的事件发生了 channel会回调相应的回调函数
    channel_->setReadCallback(
        std::bind(&TcpConnection::handleRead, this, std::placeholders::_1));
    channel_->setWriteCallback(
        std::bind(&TcpConnection::handleWrite, this));
    channel_->setCloseCallback(
        std::bind(&TcpConnection::handleClose, this));
    channel_->setErrorCallback(
        std::bind(&TcpConnection::handleError, this));

    LOG_INFO("TcpConnection::ctor[%s] at fd=%d\\n", name_.c_str(), sockfd);
    socket_->setKeepAlive(true);
}

TcpConnection::~TcpConnection()
{
    LOG_INFO("TcpConnection::dtor[%s] at fd=%d state=%d\\n", name_.c_str(), channel_->fd(), (int)state_);
}
\`\`\`

### handleRead:

\`\`\`cpp
// 读是相对服务器而言的 当对端客户端有数据到达 服务器端检测到EPOLLIN 就会触发该fd上的回调 handleRead取读走对端发来的数据
void TcpConnection::handleRead(Timestamp receiveTime)
{
    int savedErrno = 0;
    ssize_t n = inputBuffer_.readFd(channel_->fd(), &savedErrno);
    if (n > 0) // 有数据到达
    {
        // 已建立连接的用户有可读事件发生了 调用用户传入的回调操作onMessage shared_from_this就是获取了TcpConnection的智能指针
        messageCallback_(shared_from_this(), &inputBuffer_, receiveTime);
    }
    else if (n == 0) // 客户端断开
    {
        handleClose();
    }
    else // 出错了
    {
        errno = savedErrno;
        LOG_ERROR("TcpConnection::handleRead");
        handleError();
    }
}
\`\`\`

到这里Tcp的连接部分也算是完结了接下来，还是TcpConnection但是是前提部分的内容。

### connectEstablished:

这个连接事件在TcpServer::newConnection中就将其放入Eventloop::runInloop执行

\`\`\`cpp
// 连接建立
void TcpConnection::connectEstablished()
{
    setState(kConnected);
    channel_->tie(shared_from_this());
    channel_->enableReading(); // 向poller注册channel的EPOLLIN读事件

    // 新连接建立 执行回调
    connectionCallback_(shared_from_this());
}
\`\`\`

### 错误处理

Channel在处理通道事件handleEvent时，如果发生错误(即不是读取数据，也不是写数据完成)

调用链路：  
Channel::handleEvent() => 检测到错误，调用Channel::errorCallback_ => TcpConnection::handleError()

\`\`\`cpp
void TcpConnection::handleError()
{
    int optval;
    socklen_t optlen = sizeof optval;
    int err = 0;
    if (::getsockopt(channel_->fd(), SOL_SOCKET, SO_ERROR, &optval, &optlen) < 0)
    {
        err = errno;
    }
    else
    {
        err = optval;
    }
    LOG_ERROR("TcpConnection::handleError name:%s - SO_ERROR:%d\\n", name_.c_str(), err);
}
\`\`\`

### 发送数据：

#### Send：

\`\`\`cpp
void TcpConnection::send(const std::string &buf)
{
    if (state_ == kConnected)
    {
        if (loop_->isInLoopThread()) // 这种是对于单个reactor的情况 用户调用conn->send时 loop_即为当前线程
        {
            sendInLoop(buf.c_str(), buf.size());
        }
        else
        {
            loop_->runInLoop(
                std::bind(&TcpConnection::sendInLoop, this, buf.c_str(), buf.size()));
        }
    }
}
\`\`\`

#### SendInLoop

**功能概述：**   
1.将应用层的数据写入到内核的发送缓冲区。

2.处理内核缓冲区写满的情况：将剩余数据保存在用户空间的缓冲区(outputBuffer_)中。

3.如果数据发送完全，则触发发送完成的回调(writeCompleteCallback_)。

4.如果数据未发送完全，需要注册写事件(EPOLLOUT)，当内核缓冲区由空间时重新发送。

\`\`\`cpp
/**
 * 发送数据 应用写的快 而内核发送数据慢 需要把待发送数据写入缓冲区，而且设置了水位回调
 **/
void TcpConnection::sendInLoop(const void *data, size_t len)
{
    ssize_t nwrote = 0;
    size_t remaining = len;
    bool faultError = false;

    if (state_ == kDisconnected) // 之前调用过该connection的shutdown 不能再进行发送了
    {
        LOG_ERROR("disconnected, give up writing");
    }

    // 表示channel_第一次开始写数据或者缓冲区没有待发送数据
    if (!channel_->isWriting() && outputBuffer_.readableBytes() == 0)
    {
        nwrote = ::write(channel_->fd(), data, len);
        if (nwrote >= 0)
        {
            remaining = len - nwrote;
            if (remaining == 0 && writeCompleteCallback_)
            {
                // 既然在这里数据全部发送完成，就不用再给channel设置epollout事件了
                loop_->queueInLoop(
                    std::bind(writeCompleteCallback_, shared_from_this()));
            }
        }
        else // nwrote < 0
        {
            nwrote = 0;
            if (errno != EWOULDBLOCK) // 正常情况下errno==EWOULDBLOCK表示非阻塞模式缓冲区已满，这是一种预期行为，否则就是异常情况
                LOG_ERROR("TcpConnection::sendInLoop");
                if (errno == EPIPE || errno == ECONNRESET) // SIGPIPE RESET
                {
                    faultError = true;
                }
            }
        }
    }
    /**
     * 说明当前这一次write并没有把数据全部发送出去 剩余的数据需要保存到缓冲区当中
     * 然后给channel注册EPOLLOUT事件，Poller发现tcp的发送缓冲区有空间后会通知
     * 相应的sock->channel，调用channel对应注册的writeCallback_回调方法，
     * channel的writeCallback_实际上就是TcpConnection设置的handleWrite回调，
     * 把发送缓冲区outputBuffer_的内容全部发送完成
     **/
    if (!faultError && remaining > 0)
    {
        // 目前发送缓冲区剩余的待发送的数据的长度
        size_t oldLen = outputBuffer_.readableBytes();
        if (oldLen + remaining >= highWaterMark_ && oldLen < highWaterMark_ && highWaterMarkCallback_)
        {
            loop_->queueInLoop(
                std::bind(highWaterMarkCallback_, shared_from_this(), oldLen + remaining));
        }
        outputBuffer_.append((char *)data + nwrote, remaining);
        if (!channel_->isWriting())
        {
            channel_->enableWriting(); // 这里一定要注册channel的写事件 否则poller不会给channel通知epollout
        }
    }
}
\`\`\`

**关键的分析：**

1. 为什么需要用户空间缓冲区（outputBuffer_）？在非阻塞模式下，如果内核的发送缓冲区满了，write 会返回 EWOULDBLOCK，无法立即发送全部数据。  
为了保证数据不丢失，将未发送的数据保存在用户空间的缓冲区（outputBuffer_）中，待内核缓冲区有空间时再发送。
2. 为什么需要注册写事件（EPOLLOUT）？  
当发送缓冲区满时，需要依赖 EPOLLOUT 事件通知内核缓冲区有空间。  
EPOLLOUT 事件触发时，poller 会调用 handleWrite，将缓冲区中的数据发送出去。
3. 高水位回调（highWaterMarkCallback_）的作用  
在某些场景下，用户可能希望限制发送缓冲区的大小（如防止内存占用过高）。  
当缓冲区数据量超过 highWaterMark_ 时，触发回调通知用户程序。
4. 为什么判断 channel_->isWriting()？  
避免重复注册 EPOLLOUT 事件，降低系统开销。

---
我觉得主要的了解就到这里了，还有线程池的使用就交给各位自己去看项目代码感悟一下。有疑问也可以在下面提出！`},{id:"yq_muduo_07",bookId:"muduo-core",bookTitle:"网络库muduo-core",bookBadge:"muduo-core 核心",index:7,doc_id:201615054,title:"6、补充工具类",slug:"hf9ftffwy9yhwrt4",url:"https://www.yuque.com/chengxuyuancarl/gixnqn/hf9ftffwy9yhwrt4",level:0,category:"工具组件",wordCount:4188,updatedAt:"2025-01-09T09:35:34.000Z",hash:"muduo_hf9ftffwy9",status:"FULL",tags:["异步日志系统","双缓冲技术AsyncLogging","Timestamp时间戳","noncopyable","Socket","InetAddress"],linkedModule:"muduo_core",linkedModuleTitle:"高并发辅助工具与基础设施",linkedSourceFiles:["AsyncLogging.cc","LogFile.cc","Timestamp.cc","Socket.cc","InetAddress.cc"],linkedClasses:["AsyncLogging","LogFile","Timestamp","noncopyable","Socket","InetAddress"],linkedFunctions:["AsyncLogging::append()","Timestamp::now()"],interviewKeyPoints:["异步日志的双缓冲技术原理是什么？为什么要用指针 swap？","SO_REUSEPORT 与 SO_REUSEADDR 的区别是什么？"],summary:"深入剖析 AsyncLogging 双缓冲异步日志设计，解析前端无锁写入与后端独立落盘机制，剖析微秒级 Timestamp 与 Socket 基础配置。",content:`# 6、补充工具类

> 原始链接: [https://www.yuque.com/chengxuyuancarl/gixnqn/hf9ftffwy9yhwrt4](https://www.yuque.com/chengxuyuancarl/gixnqn/hf9ftffwy9yhwrt4)  
> 访问密码: \`khf4\` | 更新时间: 2025-01-09T09:35:34.000Z | 字数: 4188

---
lake

这里也算是项目的细节，主要是涉及到三个工具类的应用。

## 日志系统

muduo的日志库分采用前后端分离。产生日志的线程都可以称作前端。有一个线程专门负责把前端的日志写入文件，这个线程就称为后端。

**muduo日志库采用双缓冲技术** ，所谓双缓冲技术就是前后端各有一个（其实是各有两个）大小为4MB的Buffer，之所以各有一个Buffer，是为了当前端Buffer写满了之后，后端空闲的Buffer能够立刻和前端的Buffer互换，互换完成后就可以释放锁，让前端继续向互换后的Buffer中写入日志，而不必等待后端把日志全部写入文件后再释放锁，大大减小了锁的粒度，这也是muduo异步日志高效的关键原因之一。（详细请看陈硕的书P114，5.3节）

> 需要说明的是：muduo前后端各有两个大小为4MB的Buffer，下图为了方面明白异步日志的思想，简化为前后端各自只有一个Buffer这里的Buffer不是Buffer.h中定义的Buffer，而是FixedBuffer.h中定义的，可以理解为一个有4MB大小的字符数组

现在的关键是，前后端的Buffer什么时候互换呢？

- 第一种情况：前端Buffer写满了，就会唤醒后台线程互换Buffer，并把Buffer中的日志写入文件
- 第二种情况： **为了及时把前端Buffer中的日志写入文件，日志库也会每3秒执行一次交换Buffer的操作** 。(面试官可能会问你为什么要3秒交换一次Buffer)

下图就以第二种情况为例，展示日志库双缓冲原理。

![](images/yuque/img_muduo_07_01.png)

在0~3秒之间，当前端的线程调用了 \`LOG_INFO << 日志信息;\` ，会开辟一个4KB大小的空间，用于存储“日志信息”，当该语句执行结束时，就已经把日志信息都存储到前端的Buffer（黄色Buffer）中，同时析构自己刚开辟的4KB的空间。

在3秒之后，后端线程被唤醒，为了让前端阻塞时间更短，后端把自己的红色Buffer和前端的黄色Buffer互换，然后就可以释放锁，这样前端又能及时的向红色Buffer中写入新的日志信息。后端线程也可以把来自前端的黄色Buffer中的数据写入文件。

### 异步日志流程

异步日志前端产生日志和同步是一致的，下面主要说明异步情况下， \`LogStream::buffer_\` 中的数据是怎么输出到指定位置的。由于异步日志不是默认的方式，需要自行开启，下面就从开启异步日志开始讲解。

### 把日志写入缓冲区

经过同步日志分析，我们直到 \`LOG_INFO << data\` 执行完成时，就会调用 \`asyncOutput\` ，接下来我们看一下日志信息是怎么写到用户自己定义的缓冲区的（即 \`g_asyncLog->append(msg, len);\` 做了什么事）：  
 \`AsyncLogging::append\` 函数基本原理是：先将日志信息存储到用户自己开辟的大缓冲区，当缓冲区写满后，通知后台线程把缓冲区的数据写入文件。 \`apend\` 代码如下：注意 \`currentBuffer_\` 有4M大小，之所以很大，是为了多积累一些日志信息，然后一并交给后端写入文件，避免频繁通知后台写文件。另外， \`currentBuffer_->append()\` 是单纯的把日志信息写入 \`currentBuffer_\` 中，而不是像 \`LogFile\` 的 \`apend()\` 是将数据写入文件中。

\`\`\`cpp
// 前端如果开启异步日志的话，就会调用这个，把日志信息写入currentBuffer_中
void AsyncLogging::append(const char* logline, int len)
{
    // apend会在多个线程中调用，也就是多个线程会同时像currentBuffer_中写数据，因此要加锁
    std::lock_guard<std::mutex> lock(mutex_);
    // 缓冲区剩余空间足够则直接写入
    if (currentBuffer_->avail() > len)
    {
        currentBuffer_->append(logline, len);
    }
    else
    {
        // 当前缓冲区空间不够，将新信息写入备用缓冲区
        // 将写满的currentBuffer_装入vector中，即buffers_中，注意currentBuffer_是独占指针，
        // move后自己就指向了nullptr
        buffers_.push_back(std::move(currentBuffer_));
        // nextBuffer_不空，说明nextBuffer_指向的内存还没有被currentBuffer_抢走，也就是
        // nextBuffer_还没开始使用
        if (nextBuffer_) 
        {
            // 把nextBuffer_指向的内存区域交给currentBuffer_，nextBuffer_也被置空
            currentBuffer_ = std::move(nextBuffer_);
        } 
        else 
        {
            // 备用缓冲区也不够时，重新分配缓冲区，这种情况很少见
            currentBuffer_.reset(new Buffer);
        }
        currentBuffer_->append(logline, len);
        // 唤醒写入磁盘得后端线程
        cond_.notify_one();
    }
}
\`\`\`

## Buffer缓冲区

Buffer内部是个std::vector，前8个字节预留着用于记录数据长度，readIndex指向可读取数据的初始位置，writerIndex指向空闲区的起始位置。下图展示了Buffer初始状态、写入部分数据和读取部分数据的情况。

![](images/yuque/img_muduo_07_02.png)

在上图的基础上，如果接下来要继续写入大于"size减writerIndex"的数据怎么办？（见Buffer::makeSpace函数）

1. 如果要写入的数据只比"空闲区②"大，但是比“①+②”小，此时可以把未读取的数据往前挪，剩余的控件就足够写下要写的数据了。

![](images/yuque/img_muduo_07_03.png)

1. 如果要写入的数据大于“①+②”，则对Buffer进行扩容，扩容至刚好可以容纳需要写入的数据。

在代码中都会先将剩余未读取的的数据移到前面，空闲1和2的空间连续在一起后进行扩容。

![](images/yuque/img_muduo_07_04.png)

### 把socket上的数据写入Input Buffer

当socket上有数据可读时，会调用 \`TcpConnection::handleRead\` 函数，在该函数中，inputBuffer_会调用 \`Buffer::readFd\` 函数，把socket上的数据写入inputBuffer_中，核心代码如下：

\`\`\`cpp
void TcpConnection::handleRead(Timestamp receiveTime)
{
    ssize_t n = inputBuffer_.readFd(channel_->fd(), &savedErrno);
    if (n > 0)                      // 从fd读到了数据，并且放在了inputBuffer_上
    {
        // 已建立连接的用户有可读事件发生了 调用用户传入的回调操作onMessage shared_from_this就是获取了TcpConnection的智能指针
        messageCallback_(shared_from_this(), &inputBuffer_, receiveTime);
    }
}

ssize_t Buffer::readFd(int fd, int *saveErrno)
{
    // 栈额外空间，用于从套接字往出读时，当buffer_暂时不够用时暂存数据，待buffer_重新分配足够空间后，在把数据交换给buffer_。
    char extrabuf[65536] = {0};                     // 栈上内存空间 65536/1024 = 64KB

    struct iovec vec[2];                            // 使用iovec指向两个缓冲区
    const size_t writable = writableBytes();        // 可写缓冲区大小

    // 第一块缓冲区，指向可写空间
    vec[0].iov_base = begin() + writerIndex_;       // 当我们用readv从socket缓冲区读数据，首先会先填满这个vec[0], 也就是我们的Buffer缓冲区
    vec[0].iov_len = writable;
    // 第二块缓冲区，指向栈空间
    vec[1].iov_base = extrabuf;                     // 第二块缓冲区，如果Buffer缓冲区都填满了，那就填到我们临时创建的栈空间
    vec[1].iov_len = sizeof(extrabuf);

    // 如果Buffer缓冲区大小比extrabuf(64k)还小，那就Buffer和extrabuf都用上
    // 如果Buffer缓冲区大小比64k还大或等于，那么就只用Buffer。
    const int iovcnt = (writable < sizeof(extrabuf)) ? 2 : 1;
    const ssize_t n = ::readv(fd, vec, iovcnt);     // Buffer存不下，剩下的存入暂时存入到extrabuf中

    if (n < 0)
    {
        *saveErrno = errno;
    }
    else if (n <= writable)                         // Buffer的可写缓冲区已经够存储读出来的数据了
    {
        writerIndex_ += n;
    }
    else                                            // Buffer存不下，对Buffer扩容，然后把extrabuf中暂存的数据拷贝（追加）到Buffer
    {
        writerIndex_ = buffer_.size();
        append(extrabuf, n - writable);             // 根据情况对buffer_扩容 并将extrabuf存储的另一部分数据追加至buffer_
    }
    return n;

}
\`\`\`

\`Buffer::readFd\` 函数的功能就是把socket上的数据写入input buffer， **为了能够尽可能把socket上的数据都读取出来，同时节约一点内存空间，muduo借用了栈上的空间来达到这一目的** 。

具体如下：

**没有栈空间，是怎么导致空间浪费的？**   
需要指出的是 \`writableBytes()\` 函数在计算input buffer可写空间大小时，只计算了从空闲块②的大小，没有把空闲块①计算进来。所以，如果没有栈上的空间，并且通过 \`writableBytes()\` 函数来指明input buffer空闲大小，那么从socket上读取的数据大于空闲块②的大小时，就需要扩容input buffer，就变成了下面扩容后的图，显然，空闲块①还没有利用，这就是直接扩容导致了空间的浪费。

![](images/yuque/img_muduo_07_05.png)

![](images/yuque/img_muduo_07_06.png)

​

> 个人认为，其实也没必要用栈空间，只需要修改writableBytes()，让其返回的是空闲块①和②的大小即可，只不过改了writableBytes()，其他调用writableBytes()的函数，比如Buffer::readFd，就变得复杂了。

**有栈空间时，是怎么减少空间浪费的？**

> 见Buffer::apend()函数，apend函数会调用Buffer::makeSpace函数，makeSpace会根据空闲区域的大小和要写入数据的大小，来判断是否需要扩容

栈空间能够减少空间的浪费，只存在于这种情况：要写入input buffer的数据比"空闲区②"大，但是比“①+②”小。如果要写入的数据大于“①+②”，即使使用了栈空间，最终都是避免不了要扩容input buffer，所以和不用栈空间没什么区别。下面就说明：要写入的数据比"空闲区②"大，但是比“①+②”小时，是怎么减少内存浪费的。

![](images/yuque/img_muduo_07_07.png)

从上图可见，和没有栈空间的情况相比，用栈上的空间可以在“要写入的数据只比"空闲区②"大，但是比“①+②”小”的情况下，避免input buffer扩容。

### 把用户数据通过output buffer发送给对方

以EchoServer为例，如下代码所示，当收到客户端发送过来的信息后，我们要回复客户端，即在EchoServer::onMessage函数中调用TcpConnection::send函数把消息发送给客户端，接下来就看下TcpConnection::send函数是怎么通过output buffer发送给对方的。

\`\`\`cpp
// 可读写事件回调
void EchoServer::onMessage(const TcpConnectionPtr &conn, Buffer *buf, Timestamp time)
{
    // 把客户端发送的数据取出来
    std::string msg = buf->retrieveAllAsString();
    conn->send(msg);
}

void TcpConnection::send(const std::string &msg)   
{
    ...省略代码
    // 如果连接是已经建立的，就把buffer中的数据取出来发送出去
    sendInLoop(msg.c_str(), msg.size());
    ...省略代码
}

void TcpConnection::sendInLoop(const void *data, size_t len)
{
    ...省略代码
    // 把要发送的数据写入outputBuffer_
    outputBuffer_.append((char *)data, len);
    // 如果没有向Epoll注册可写事件，则注册可写事件
    if (!channel_->isWriting())
    {
        channel_->enableWriting(); 
    }
    ...省略代码
}
\`\`\`

从上面代码可见，TcpConnection::send函数并没有把数据发送给对方，只是把要发送的数据写入了output buffer，并且告知Epoll关注当前连接的可写事件，那什么时候发送呢？  
由于现在Epoll现在已经关注该连接的可写事件，当该链接的TCP发送缓冲区空闲时，Epoll就会触发该连接的可写事件，也就是会调用TcpConnection::handleWrite函数，该函数核心代码如下：

\`\`\`cpp
void TcpConnection::handleWrite()
{
    if (channel_->isWriting())  // 如果该连接关注了可写事件
    {
        int savedErrno = 0;
        // 把outputBuffer_中的数据发送给对方
        ssize_t n = outputBuffer_.writeFd(channel_->fd(), &savedErrno);
        if (n > 0)   // 如果发送了部分数据
        {
            // 把outputBuffer_的readerIndex往前移动n个字节，
            // 因为outputBuffer_刚已经发送出去了n字节
            outputBuffer_.retrieve(n);  // readerIndex往前移动n个字节        
            if (outputBuffer_.readableBytes() == 0)
            {
                //outputBuffer_中的数据全部发送完毕后注销写事件，
                // 以免epoll频繁触发可写事件，导致效力低下
                channel_->disableWriting();     
            }
        }
    }
}
\`\`\`

​

---
## 定时器思路

要实现定时器，只需要timerfd_create函数创建timerfd后，在epoll中关注timerfd的可读事件，然后通过timerfd_settime函数为timerfd指定超时时刻和超时间隔，就可以在内核启动一个定时器，当定时器到期后，epoll就会检测到timerfd可读，此时就会处理timerfd上的可读事件，即调用 \`TimerQueue::handleRead\` 函数。

从上述过程也可以看出，一个timerfd对应一个定时器，那多个定时器需要多个timerfd吗？ **muduo用了一个比较聪明做法，用一个timerfd就可以实现多个定时器的效果，其核心思想是：让timerfd的超时时刻总是设置为TimerQueue中最小的Timer的超时时刻** ，如下图所示：

![](images/yuque/img_muduo_07_08.png)

\`\`\`cpp
void TimerQueue::addTimer(TimerCallback cb,Timestamp when, double interval)
{
    Timer *timer = new Timer(std::move(cb), when, interval);
    loop_->runInLoop(std::bind(&TimerQueue::addTimerInLoop, this, timer));
}

void TimerQueue::addTimerInLoop(Timer* timer)
{
    // 将timer添加到TimerList（std::set<Entry>）时，判断其超时时刻是否是最早的
    bool eraliestChanged = insert(timer);

    // 如果新添加的timer的超时时刻确实是最早的，就需要重置timerfd_超时时刻
    if (eraliestChanged)
    {
        resetTimerfd(timerfd_, timer->expiration());
    }
}
\`\`\`

当timerfd超时时（即此时时刻达到100时）timerfd可读，其可读事件会调用TimerQueue::handleRead函数，该函数需要经过如下4个步骤来完成定时器的更新：

- 步骤1：从TimerQueue中取出超时的Timer（实现函数为 \`TimerQueue::getExpired\` ）。当前时刻为100，只要TimerQueue中Timer的超时时刻小于或者等于100，就认为超时，需要从TimerQueue中取出超时的Timer，此时TimerQueue中只剩下一个Timer，即超时时刻为120的Timer。
- 步骤2：遍历超时的Timer，分别执行该Timer保存的回调函数（该回调函数其实保存的就是EchoServer::onTimer函数）。
- 步骤3：重置超时Timer（实现函数为 \`TimerQueue::reset\` ）。从TimerQueue中取出的两个Timer中，第一个Timer是一次性定时器，直接删除即可，第二个Timer是重复定时器，但是TimerQueue中此时没有这个Timer了，因此，我们需要修改一下该Timer的超时时刻，即设置该Timer的超时时刻为"当前时刻100"+"时间间隔50"=150，然后把它再次添加到TimerQueue中。此时TimerQueue中已经有了两个Timer，一个超时时刻是120，一个是刚添加的超时时刻是150。
- 步骤4：重新设置timerfd的超时时刻（实现函数为TimerQueue.cc的resetTimerfd函数）。前面说过，TimerQueue是个set，其内部是红黑树，会自动排序，此时，可以通过timerfd_settime函数重新设置timerfd的超时时刻为TimerQueue中最小的Timer，即timerfd下次的超时时刻为120。

TimerQueue::handleRead函数实现如下：

\`\`\`cpp
void TimerQueue::handleRead()
{
    Timestamp now = Timestamp::now();
    readTimerfd(timerfd_);

    // 步骤1：获取超时的定时器并挨个调用定时器的回调函数
    std::vector<Entry> expired = getExpired(now);
    callingExpiredTimers_ = true;
    for (const Entry& it : expired)
    {
        // 步骤2：执行该定时器超时后要执行的回调函数
        it.second->run();   
    }
    callingExpiredTimers_ = false;

    // 步骤3，4：这些已经到期的定时器中，有些定时器是可重复的，
    // 有些是一次性的需要销毁的，因此重置这些定时器
    reset(expired, now);
}
\`\`\`

TimerQueue暴露出来的就只有一个方法：addTimer。TimerQueue已经帮我们都封装好了，只需要我们调用addTimer就能实现定时功能。

现在EventLoop对TimerQueue::addTimer函数进行了进一步封装，实现了三个功能不同的定时器：runAt：在某时刻触发（一次性定时器）；runAfer：多久后触发（一次性定时器）；runEvery：每隔多久触发一次（重复定时器）。

\`\`\`cpp
void EventLoop::runAt(Timestamp time, Functor&& cb) {
    timerQueue_->addTimer(std::move(cb), time, 0.0);
}

void EventLoop::runAfter(double delay, Functor&& cb) {
    Timestamp time(addTime(Timestamp::now(), delay)); 
    runAt(time, std::move(cb));
}

void EventLoop::runEvery(double interval, Functor&& cb) {
    Timestamp timestamp(addTime(Timestamp::now(), interval)); 
    timerQueue_->addTimer(std::move(cb), timestamp, interval);
\`\`\`

注意：本项目中省略了可自行补充Timer类`},{id:"yq_muduo_08",bookId:"muduo-core",bookTitle:"网络库muduo-core",bookBadge:"muduo-core 核心",index:8,doc_id:201526598,title:"7、拓展项目基础知识汇总",slug:"atwi4z2och21gzht",url:"https://www.yuque.com/chengxuyuancarl/gixnqn/atwi4z2och21gzht",level:0,category:"八股与扩展",wordCount:2585,updatedAt:"2025-01-08T07:28:43.000Z",hash:"muduo_atwi4z2och",status:"FULL",tags:["IO多路复用","select/poll/epoll","ET边缘触发vsLT水平触发","EPOLLONESHOT","阻塞vs非阻塞","吞吐量压测"],linkedModule:"muduo_core",linkedModuleTitle:"Linux 网络底层原理精研",linkedSourceFiles:["EPollPoller.cc","Socket.cc"],linkedClasses:["EPollPoller","Socket"],linkedFunctions:["epoll_ctl()","epoll_wait()"],interviewKeyPoints:["select/poll/epoll 的区别与底层实现？","为什么 ET 模式必须搭配非阻塞 I/O？","EPOLLONESHOT 事件解决了什么并发问题？"],summary:"深入剖析 select/poll/epoll 三大多路复用机制，详细对比水平触发（LT）与边缘触发（ET）在多线程下的行为差异与避坑方案。",content:`# 7、拓展项目基础知识汇总

> 原始链接: [https://www.yuque.com/chengxuyuancarl/gixnqn/atwi4z2och21gzht](https://www.yuque.com/chengxuyuancarl/gixnqn/atwi4z2och21gzht)  
> 访问密码: \`khf4\` | 更新时间: 2025-01-08T07:28:43.000Z | 字数: 2585

---
lake

## IO多路复用

### 说一下什么是ET，什么是LT，有什么区别？

epoll 支持两种事件触发模式，分别是边缘触发（edge-triggered，ET）和水平触发（level-triggered，LT）。

使用边缘触发模式时，当被监控的 Socket 描述符上有可读事件发生时，服务器端只会从 epoll_wait 中苏醒一次，即使进程没有调用 read 函数从内核读取数据，也依然只苏醒一次，因此我们程序要保证一次性将内核缓冲区的数据读取完；

使用水平触发模式时，当被监控的 Socket 上有可读事件发生时，服务器端不断地从 epoll_wait 中苏醒，直到内核缓冲区数据被 read 函数读完才结束，目的是告诉我们有数据需要读取.

水平触发的意思是只要满足事件的条件，比如内核中有数据需要读，就一直不断地把这个事件传递给用户；而边缘触发的意思是只有第一次满足条件的时候才触发，之后就不会再传递同样的事件了。

如果使用水平触发模式，当内核通知文件描述符可读写时，接下来还可以继续去检测它的状态，看它是否依然可读或可写。所以在收到通知后，没必要一次执行尽可能多的读写操作。

如果使用边缘触发模式，I/O 事件发生时只会通知一次，而且我们不知道到底能读写多少数据，所以在收到通知后应尽可能地读写数据，以免错失读写的机会。

因此，我们会循环从文件描述符读写数据，那么如果文件描述符是阻塞的，没有数据可读写时，进程会阻塞在读写函数那里，程序就没办法继续往下执行。所以，边缘触发模式一般和非阻塞 I/O 搭配使用，程序会一直执行 I/O 操作，直到系统调用（如 read 和 write）返回错误，错误类型为 EAGAIN 或 EWOULDBLOCK。

#### 为什么ET模式不可以文件描述符阻塞，而LT模式可以呢？

LT模式（Level-Triggered）：

描述：当文件描述符就绪时，会持续通知应用程序，直到事件被处理为止。

特点：如果文件描述符上有数据可读，调用 epoll_wait 会一直返回该文件描述符，即使应用程序没有立即读取数据。

阻塞：可以在阻塞模式下工作，因为即使文件描述符的状态没有变化，只要有数据可读或可写，应用程序会不断被通知。

ET模式（Edge-Triggered）：

描述：仅在文件描述符状态从未就绪变为就绪时通知一次，之后不会再通知，除非状态再次变化。

特点：应用程序必须尽可能地读取（或写入）数据，直到返回 EAGAIN 或 EWOULDBLOCK，以确保不会错过数据。

非阻塞：必须在非阻塞模式下工作，因为如果文件描述符是阻塞的，当没有数据可读时，读取操作会被阻塞，这与ET模式的设计理念（只在状态变化时通知）相违背。ET模式要求应用程序在获得通知后立即处理所有数据，否则可能错过后续数据。

​

LT模式容错性：LT模式的持续通知机制使其更容错，即使应用程序不能立即处理事件，下次调用 epoll_wait 仍会通知，因此允许阻塞模式。

ET模式高效性：ET模式旨在提高效率，减少不必要的系统调用和上下文切换，因此通知仅在状态变化时发生。非阻塞模式下，应用程序在每次获得通知后，尽可能多地处理数据，确保不会因为阻塞而错过通知。

#### 你用了epoll，说一下为什么用epoll，还有其他多路复用方式吗？区别是什么？

第一点，epoll 在内核里使用红黑树来跟踪进程所有待检测的文件描述字，把需要监控的 socket 通过 epoll_ctl() 函数加入内核中的红黑树里，红黑树是个高效的数据结构，增删改一般时间复杂度是 O(logn)。

而 select/poll 内核里没有类似 epoll 红黑树这种保存所有待检测的 socket 的数据结构，所以 select/poll 每次操作时都传入整个 socket 集合给内核，而 epoll 因为在内核维护了红黑树，可以保存所有待检测的 socket ，所以只需要传入一个待检测的 socket，减少了内核和用户空间大量的数据拷贝和内存分配。

第二点， epoll 使用事件驱动的机制，内核里维护了一个链表来记录就绪事件，当某个 socket 有事件发生时，通过回调函数内核会将其加入到这个就绪事件列表中，当用户调用 epoll_wait() 函数时，只会返回有事件发生的文件描述符的个数，不需要像 select/poll 那样轮询扫描整个 socket 集合，大大提高了检测的效率。

其他多路复用方式：

select：

- 实现：使用一个固定大小的数组来存储文件描述符，每次调用都需要将整个数组从用户态拷贝到内核态，检查每个文件描述符的状态。
- 优点：兼容性好，几乎所有的操作系统都支持。
- 缺点：效率低，最大文件描述符数量有限，处理大量文件描述符时性能差。

poll：

- 实现：使用一个链表来存储文件描述符，避免了 select 的数组大小限制，但仍需要每次调用时从用户态拷贝到内核态。
- 优点：没有文件描述符数量限制，改进了 select 的一些不足。
- 缺点：性能仍然不如 epoll，每次调用都要遍历整个链表，效率较低。

## 并发模型

### reactor、proactor模型的区别？

**Reactor：**

Reactor 是非阻塞同步网络模式，感知的是就绪可读写事件。在每次感知到有事件发生（比如可读就绪事件）后，就需要应用进程主动调用 read 方法来完成数据的读取，也就是要应用进程主动将 socket 接收缓存中的数据读到应用进程内存中，这个过程是同步的，读取完数据后应用进程才能处理数据。

**Proactor：**

因此，Reactor 可以理解为「来了事件操作系统通知应用进程，让应用进程来处理」，而 Proactor 可以理解为「来了事件操作系统来处理，处理完再通知应用进程」。这里的「事件」就是有新连接、有数据可读、有数据可写的这些 I/O 事件这里的「处理」包含从驱动读取到内核以及从内核读取到用户空间。

### reactor模式中，各个模式的区别？

第一种方案单 Reactor 单进程 / 线程，不用考虑进程间通信以及数据同步的问题，因此实现起来比较简单，这种方案的缺陷在于无法充分利用多核 CPU，而且处理业务逻辑的时间不能太长，否则会延迟响应，所以不适用于计算机密集型的场景，适用于业务处理快速的场景，比如 Redis（6.0之前 ） 采用的是单 Reactor 单进程的方案。

第二种方案单 Reactor 多线程，通过多线程的方式解决了方案一的缺陷，但它离高并发还差一点距离，差在只有一个 Reactor 对象来承担所有事件的监听和响应，而且只在主线程中运行，在面对瞬间高并发的场景时，容易成为性能的瓶颈的地方。

第三种方案多 Reactor 多进程 / 线程，通过多个 Reactor 来解决了方案二的缺陷，主 Reactor 只负责监听事件，响应事件的工作交给了从 Reactor，Netty 和 Memcache 都采用了「多 Reactor 多线程」的方案，Nginx 则采用了类似于 「多 Reactor 多进程」的方案。

Reactor 可以理解为「来了事件操作系统通知应用进程，让应用进程来处理」，而 Proactor 可以理解为「来了事件操作系统来处理，处理完再通知应用进程」。

## 测试相关问题

由于我这里基本就是重写了一下原来的muduo + 懒（不是主要原因）

所以

压力测试可以直接参考陈硕大神做的：

[muduo 与 libevent2 吞吐量对比](https://blog.csdn.net/Solstice/article/details/5864889)

[muduo 与 boost asio 吞吐量对比](https://blog.csdn.net/Solstice/article/details/5863411)`},{id:"yq_muduo_09",bookId:"muduo-core",bookTitle:"网络库muduo-core",bookBadge:"muduo-core 核心",index:9,doc_id:201526667,title:"8、简历写法&面试技巧",slug:"xcb415ib6gr6tq5w",url:"https://www.yuque.com/chengxuyuancarl/gixnqn/xcb415ib6gr6tq5w",level:0,category:"求职面试",wordCount:2286,updatedAt:"2025-12-29T07:15:56.000Z",hash:"muduo_xcb415ib6g",status:"FULL",tags:["腾讯IEG上岸","STAR法则","简历项目包装","面试避坑","难点提炼","引导面试官"],linkedModule:"muduo_core",linkedModuleTitle:"大厂求职实战与简历打造",linkedSourceFiles:["README.md"],linkedClasses:["TcpServer","EventLoop","Channel"],linkedFunctions:["main()"],interviewKeyPoints:["如何将 muduo 项目用 STAR 法则写入简历？","如何回答面试官关于项目难点和性能亮点的追问？"],summary:"24届腾讯 IEG 上岸录友倾囊相授：如何将 C++11 muduo 重构项目写成具有大厂吸引力的简历，提炼 5 大量化亮点与 STAR 应答法则。",content:`# 8、简历写法&面试技巧

> 原始链接: [https://www.yuque.com/chengxuyuancarl/gixnqn/xcb415ib6gr6tq5w](https://www.yuque.com/chengxuyuancarl/gixnqn/xcb415ib6gr6tq5w)  
> 访问密码: \`khf4\` | 更新时间: 2025-12-29T07:15:56.000Z | 字数: 2286

---
lake

> **推荐使用** [ **卡码简历** ](https://jianli.kamacoder.com/) **制作简历，高效方便。**

本人24届秋招，拿到了几个互联网后端的offer，目前入职腾讯ieg在提前实习，和各位录友大佬们分享一下自己简历的写法，我个人也是听卡哥的建议来写的，所以基础简历应该都差不多，我主要说一说简历中需要注意的点和面试中的一些心得体会。

## 本项目简历写法

![](images/yuque/img_muduo_09_01.png)

![](images/yuque/img_muduo_09_02.png)

![](images/yuque/img_muduo_09_03.png)

## 通用简历写法

1、 简历上所写的内容一定要熟悉，不是非常熟悉的可以不写，或者作为引申要是面试官问到了就展开说一说。

2、 不要所有都写上去，应该写一些概括的东西，详细的东西可以面试的时候聊；

同时可以设置一些可能会问到的点，这样面试更容易把握方向，知道可能会被问到的点；

3、 教育背景学校如果不太好，可以稍微往后写，最上面的应该是简历上面的亮点地方。

4、 如果有实习，可以写实习的主要内容，但不要大篇幅写实习的很细节的点，可以等面试官问你，你再解释；

如果没有实习，那么就应该在项目上多花点时间，起码在面试的时候有感兴趣，可以聊的点；

5、 项目我感觉是很重要的一环，阿里和美团等等都很看重项目，建议一个轮子鸡架项目，一个业务项目，这样可以由面试官自己挑感兴趣的地方来问；

6、 个人技能方面注意措词要得当，熟悉了解掌握等词要精确用，比如c++学的还算不错，不太建议用熟练掌握(其他语言、中间件等同理)；

7、 像一些无关紧要的奖项其实可以不写，写上反而减分，代表你没有含金量高的；

像英语四级也可以不写，可以写六级(其他奖项同理)；

8、 没有必须一页的说法，比如有三段实习，两个项目的，写一页可能有点费力，也可以两页，甚至一页半；

所有的把控标准都是简历上的内容只要有效即可，别出现废话和啰嗦的话就行了。

## 面试技巧

面试的话，首先就是不要紧张，把每一次面试都当作一次对话，结果不就是两种：过 和 不过。

面试过程中面对面试官问的一个问题，不要就简单的把这个问题的答案机械式的将八股重复一遍就行了， **你可以把这个点相关的所有知识点都从头到尾讲一遍** 。

这个时候一般情况下面试官是不会打断你的，而且也可以让他看到你的广度和深度，一个面试下来都按这样回答，基本上十个问题之内就能结束这场面试。

而且面试通过率会非常大，当然前提是你自己真的有东西。

基本面试都是由八股，实习，项目，算法题构成。

其中八股可能由项目拓展而出，场景题可能由实习项目引申而出。

也有可能直接来场景题，比如字节二面的时候，1个多小时就聊了一个场景题，其他什么也没问，让设计一个城市内的滴滴打车系统，当然这种情况也比较少，但常见的场景题也可以看看思路。

分开来说这几点：

### 八股

八股这个其实还是得勤看，先把星球里的[代码随想录知识星球最强八股文（第五版）](https://mp.weixin.qq.com/s/11-X0uJYwohnLiOWK3ugSg)扫一遍，然后可以深入看一下，可能面试会深入聊，直到你答不上来为止；

[代码随想录八股文-速记版](https://mp.weixin.qq.com/s/LTJzDnBRa81d1pLpwcWZcw) 可以用来面前突击一下，效果很好。

腾讯很注重c++、计算机网络、操作系统的考察；

字节注重一面感觉更注重你自己技术展那个语言的广度考察(不好把控会问到什么)；

尽量多说一点， **比如问到哪个八股了，你把你知道的和这个相关的都说一说** ，这样的好处 一个是让面试官知道你了解的很深入，还有就是更能把握面试的流程让你在主导，可能没问几个八股时间就差不多了；

**而不是每个只说几句话，这样既增大了问到不会的概率** ，而且还让面试官感觉你每个都知道的不太深入。

我个人感觉八股遇到不会的很正常，不会太影响面试的结果，前提是常规的得答出来，很偏的不会其实可以理解，不必太担心。

### 算法

算法可以说是很重要的一环，很多时候都有一票否决权，除非哪个面试官比较好 你要是写不出来会给你换个题继续试试。

我感觉这个只能是多写题，卡哥整理的刷题和力扣的hot100要多刷几遍，一般会涵盖面试中90%的题，其他10%也基本都是稍微的改编。

建议在写之前有不太清楚的点一定和面试官沟通清楚再写，要不然都写完了不符合要求。

那一般不会又等你再写一遍，很影响结果；

同时在写完之后和面试官大致讲讲代码的关键实现的点，帮助他能快速懂你的代码。

### 实习

这个其实大家别过于担心，有的同学说实习没有接触过太核心的项目，这很正常放松心态，把自己所做过的好好总结包装一下就行了。

能有实习已经领先了很多人了，一定心态要好(心态好了运气也会好 亲身经历)。

介绍实习的时候一般从实习工作的主要业务，自己负责的点，挑几个完成的很不错的可以展开讲，比如从业务背景，功能需求，方案评审的技术选型，实现细节，预期结果等等详细说一说。

我在面试的时候感觉实习还是问到的挺多的，会让你在其中选一个你自己写的比较好的来展开讲讲，还要能解释为什么这么做，选这个存储选型原因是什么等等。

对于没有实习的同学，也不要过分焦虑，因为暑期实习目前难度还是很大的， **大多数人其实没有一段拿得出手的实习** 。

### 项目

项目可以说是每个人都要有的，不管是自己独立开发的，还是公司的，实验室的都可以，主要是自己要做的有特色，比别人的有优势

(我秋招的时候，感觉在项目上有点吃亏，很多时候问我项目的比较少，大多都在问实习经历)。

对于烂大街的项目，其实没有说不能做，因为项目就是想看你对一个工程的整体掌握和考虑情况。

就算是烂大街的项目，只要你对他掌握的很好，回答的很深入，也有对比别人所没有的点和优势，那完全可以。

当然有新颖的项目更好，可以让面试官更有兴趣提问，但总之，把项目问题回答好 比有一个创新项目 更重要。

项目遵从star法则去回答就好，很多时候面试官会问你项目的细节实现问题，还会根据你刚刚所回答到的点 来继续深入的问你，所以一定要对你所回答的问题负责，不能随心所欲地说，可能会给自己挖坑。

和项目有关的知识点也要复习到，很多时候会根据项目来拓展知识点，而且会让你说项目有什么改进的地方，项目有什么亮点，有什么难点？这些也要提前做好准备。`},{id:"yq_muduo_10",bookId:"muduo-core",bookTitle:"网络库muduo-core",bookBadge:"muduo-core 核心",index:10,doc_id:201526699,title:"10、项目难点&常见问题汇总",slug:"ko7a7gi8yqzpke7t",url:"https://www.yuque.com/chengxuyuancarl/gixnqn/ko7a7gi8yqzpke7t",level:0,category:"难点与高频面试",wordCount:4226,updatedAt:"2025-04-26T13:59:37.000Z",hash:"muduo_ko7a7gi8yq",status:"FULL",tags:["数据发送中连接关闭","enable_shared_from_this","channel_->tie()","__thread/thread_local","跨线程安全","runInLoop/queueInLoop","eventfd唤醒","Buffer readv分散读","epoll惊群","SIGPIPE"],linkedModule:"muduo_core",linkedModuleTitle:"muduo 5大核心难点与面试官连环问",linkedSourceFiles:["TcpConnection.cc","EventLoop.cc","Buffer.cc","Channel.cc"],linkedClasses:["TcpConnection","EventLoop","Buffer","Channel"],linkedFunctions:["tie()","HandleEventWithGuard()","runInLoop()","queueInLoop()","wakeup()","readFd()"],interviewKeyPoints:["TcpConnection 正在发送数据时断开连接，如何保证数据安全发完再释放资源？","如何保证一个线程只有一个 EventLoop？","如何保证不能跨线程调用的函数不会跨线程执行？","Buffer 为什么使用 readv 分散读和 64KB 栈内存？","服务端如何防范 SIGPIPE 信号导致崩溃？"],summary:"重磅面试实战精选！深度剖析对象生命周期竞争、One Loop Per Thread 守卫、跨线程安全派发等 5 大硬核难点，提供 11 道面试官必杀问题与标准答案。",content:`# 10、项目难点&常见问题汇总

> 原始链接: [https://www.yuque.com/chengxuyuancarl/gixnqn/ko7a7gi8yqzpke7t](https://www.yuque.com/chengxuyuancarl/gixnqn/ko7a7gi8yqzpke7t)  
> 访问密码: \`khf4\` | 更新时间: 2025-04-26T13:59:37.000Z | 字数: 4226

---
lake

## 项目介绍

### 简单介绍一下你的项目

本项目是在学习并参考 muduo 源码的基础上，使用C++ 11 对muduo网络库进行了重构，去除 muduo对boost库的依赖， 并根据muduo的设计思想，实现的基于多 Reactor 多线程模型的网络库。基于非阻塞IO和事件驱动的C++高并发TCP网络库，使用的线程模型是one loop per thread，所谓one loop per thread指的是：  
一个线程只能有一个事件循环（EventLoop）  
一个文件描述符（file descriptor，通常简称fd）只能由一个线程进行读写，换句话说就是一个TCP连接必须归属于某个EventLoop管理。但返过来不一样，一个线程却可以管理多个fd。

## 项目常见问题以及难点汇总

### 项目中的难点？

**如果TcpConnection中有正在发送的数据，怎么保证在触发TcpConnection关闭机制后，能让TcpConnection先把数据发送完再释放TcpConnection对象的资源。**

\`\`\`cpp
/***** TcpConnection.cc *****/
void TcpConnection::connectEstablished()
{
    setState(kConnected);
    channel_->tie(shared_from_this());
    channel_->enableReading(); //向poller注册channel的epollin事件
    //新连接建立，执行回调
    connectionCallback_(shared_from_this());
}
\`\`\`

首先TcpConnection类继承了一个类(enable_shared_from_this)，

\`\`\`cpp
class TcpConnection :public std::enable_shared_from_this<TcpConnection>
\`\`\`

这个东西有两种用处第一种主要是在这个项目中防止用户在OnMessage中删除Tcp的对象，导致其他类使用tcp 的对象的时候出现悬空指针具体：

\`\`\`cpp
    // 可读写事件回调
    void onMessage(const TcpConnectionPtr &conn, Buffer *buf, Timestamp time)
    {
        std::string msg = buf->retrieveAllAsString();
        conn->send(msg);
        //这里如果传入的是TcpConnection的原始指针被误删除有悬空指针的风险
        // conn->shutdown();   // 关闭写端 底层响应EPOLLHUP => 执行closeCallback_
    }
\`\`\`

第二种情况就是我们下面要提的。

这个shared_ptr管理的TcpConnection的对象会作为channel_的Channel::tie()函数的函数参数。

具体代码如下：

\`\`\`cpp
/*****  Channel.h   ******/
std::weak_ptr<void> tie_; 
/*****  Channel.cc   ******/
void Channel::tie(const shared_ptr<void>& obj)
{
    tie_ = obj;
    tied_ = true;
}
void Channel::HandlerEvent(TimeStamp receiveTime)
{
    if(tied_){
        shared_ptr<void> guard = tie_.lock();
        if (guard)
            HandleEventWithGuard(receiveTime);
    }
    else{
        
        HandleEventWithGuard(receiveTime);
    }
}
\`\`\`

当事件监听器返回结果，这里提一句Channel绑定的是fd感兴趣的四个事件通常为读、写、错误、关闭等。只要发生了这四个事件的其中一个EpollPoller::poll【也就是epoll_wait】被唤醒，然后EventLoop将触发事件的调用Channel::HandleEvent执行。

具体参考如下：

\`\`\`cpp
/*****  EventLoop.cc   ******/
// 开启事件循环
void EventLoop::loop()
{
    looping_ = true;
    quit_ = false;

    LOG_INFO("EventLoop %p start looping\\n", this);

    while (!quit_)
    {
        activeChannels_.clear();
        pollRetureTime_ = poller_->poll(kPollTimeMs, &activeChannels_);//activeChannels_这个存放触发事件的Channel
        for (Channel *channel : activeChannels_)
        {
            // Poller监听哪些channel发生了事件 然后上报给EventLoop 通知channel处理相应的事件
            channel->handleEvent(pollRetureTime_);
        }
        /**
         * 执行当前EventLoop事件循环需要处理的回调操作 对于线程数 >=2 的情况 IO线程 mainloop(mainReactor) 主要工作：
         * accept接收连接 => 将accept返回的connfd打包为Channel => TcpServer::newConnection通过轮询将TcpConnection对象分配给subloop处理
         *
         * mainloop调用queueInLoop将回调加入subloop（该回调需要subloop执行 但subloop还在poller_->poll处阻塞） queueInLoop通过wakeup将subloop唤醒
         **/
        doPendingFunctors();
    }
    LOG_INFO("EventLoop %p stop looping.\\n", this);
    looping_ = false;
}
\`\`\`

在这个HandleEvent函数中，会先把tie_这个weak_ptr提升为强共享智能指针，说白了引用计数++我让你别死那么快。这里就算你外面调用删除析构了其他所有指向该TcpConnection对象的智能指针。你只要HandleEventWithGuard()函数没执行完，你这个TcpConnection对象都不会被析构释放堆内存。而HandleEventWithGuard()函数里面就有负责处理消息发送事件的逻辑。当HandleEventWithGuard()函数调用完毕，这个guard智能指针就会被释放，此时TcpConnection对象才算是真正的释放了。

​

### 项目中遇到的困难？是如何解决的？

#### 1、怎么保证一个线程只有一个EventLoop对象。

\`\`\`cpp
    // EventLoopThread.cc 子线程（子Reactor）执行函数
void EventLoopThread::threadFunc()
{
    EventLoop loop;
    ...省略代码
}

// EventLoop.cc
__thread EventLoop *t_loopInThisThread = nullptr;
EventLoop::EventLoop() : threadId_(CurrentThread::tid())
{
    if (t_loopInThisThread)
    {
        LOG_FATAL << "Another EventLoop" << t_loopInThisThread << " exists in this thread " << threadId_;
    }
    else
    {
        t_loopInThisThread = this;
    }
    ...省略代码
}
\`\`\`

只需使用_thread关键字，通过_thread修饰的变量，_thread变量每一个线程有一份独立实体，各个线程的值互不干扰。为了保证一个线程只有一个EventLoop对象，muduo定义了一个用该关键字修饰的EventLoop*变量，即_thread EventLoop *t_loopInThisThread=nullptr，当某个子线程启动时，我们只需要在子线程指向函数中构造一个EventLoop对象，EventLoop的构造函数会把t_loopInThisThread初始化为this，这样一来，如果该线程中再次创建一个EventLoop对象时，就会在其构造函数中终止程序（即执行了LOG_FATAL）。

补充：_thread可以更换成thread_local更符合c++的使用。

#### 2、怎么保证不应该跨线程调用的函数,不会跨线程调用

这个问题的前提是开发人员或者用户创建了一个新线程然后调用了如Tcpconnection::send的方法。

muduo保证one loop per thread的核心就是：每个线程(EventLoop)都准备一个待执行队列，用于存储执行函数，当其他线程需要调用某个不能跨线程调用的函数时(不能跨线程调用的函数比如有TcpConnection::sendInLoop、TimerQueue::addTimerInLoop、TcpConnection::shutdownInLoop、TcpConnection::connectEstablished，因为他们都涉及到对fd的操作)，只需要把该函数通过runInLoop或者queInLoop加入到本线程的待执行队列，然后由本线程从队列中取出函数并执行。

**以跨线程发送数据为例子**

遵循每个文件描述符只能由一个线程来操作的原则，我们对sockfd的操作只能在一个线程中进行，比如我们要向某个连接对应的sockfd发送消息（调用TcpConnection::send函数）， **这涉及到在sockfd上进行写操作** ，就不能跨线程进行，但是我们无法知道使用网络库的人会不会在跨线程调用TcpConnection::send，因此，就需要我们在网络库层面做到：即使用户跨线程调用TcpConnection::send也能够保证sockfd写操作不会跨线程进行。我们先来看下TcpConnection::send在干嘛。

\`\`\`cpp
//前提在OnMessage事件中
    // 可读写事件回调
    void onMessage(const TcpConnectionPtr &conn, Buffer *buf, Timestamp time)
    {
        std::string msg = buf->retrieveAllAsString();
        std::thread t([conn，msg](){
         conn->send(msg);
        });
        t.deatch();
        // conn->shutdown();   // 关闭写端 底层响应EPOLLHUP => 执行closeCallback_
    }
//比如上面的情况就会导致执行send是其他线程，而不是我线程池创建好的线程，
void TcpConnection::send(const std::string &buf)
{
    if (state_ == kConnected)
    {   
        // 如果当前执行的线程就是自己所属loop绑定的线程，则可以直接发送数据
        if (loop_->isInLoopThread())
        {
            sendInLoop(buf.c_str(), buf.size());
        }
        else
        {
            loop_->runInLoop(std::bind(&TcpConnection::sendInLoop, this, buf));
        }
    }
}
//网络库是通过判断是否是当前线程来防止这种跨线程函数调用的情况。
//EventLoop::runInLoop
//EventLoop除了之前提到的loop和quit函数，还有两个用于保证线程安全的函数runInLoop和queueInLoop，代码如下，这里先展示runInLoop函数：
// 在当前loop中执行cb
void EventLoop::runInLoop(Functor cb)
{
    if (isInLoopThread()) // 当前EventLoop中执行回调
    {
        cb();
    }
    else // 在非当前EventLoop线程中执行cb，就需要唤醒EventLoop所在线程执行cb
    {
        queueInLoop(cb);
    }
}
\`\`\`

具体解释：

可以看到send函数在调用sendInLoop发送数据之前，会先判断调用send函数的线程和TcpConnection所属loop_绑定的线程是否是同一个（每个TcpConnection都有个loop_成员变量记录自己所属哪个EventLoop，EventLoop在构造的时候也会用threadId_记录下自己属于哪个线程，所以loop_->isInLoopThread()就能判断loop_自己绑定的（或所属的）线程和当前调用TcpConnection::send函数的线程是否是同一个线程，

如果是同一个，说明并没有跨线程调用TcpConnection::send，因此可以直接调用sendInLoop发送数据（sendInLoop函数内部会对sockfd进行写操作），如果不是同一个，则需要借助EventLoop的runInLoop来保证sendInLoop函数不会跨线程调用。为了进一步了解EventLoop的runInLoop是怎么保证sendInLoop函数不会跨线程调用的，我们先来了解一下EventLoop的两个关键函数：runInLoop和queueInLoop。

\`\`\`cpp
void EventLoop::runInLoop(Functor cb)
{
    if (isInLoopThread()) // 当前EventLoop中执行回调
    {
        cb();
    }
    else // 在非当前EventLoop线程中执行cb，就需要唤醒EventLoop所在线程执行cb
    {
        queueInLoop(cb);
    }
}
void EventLoop::queueInLoop(Functor cb)
{
    {   
        std::unique_lock<std::mutex> lock(mutex_);
        pendingFunctors_.emplace_back(cb);
    }
    if (!isInLoopThread() || callingPendingFunctors_)  
    {
        wakeup();   
    }
}
\`\`\`

**具体讲解：**

runInLoop功能是：如果调用runInLoop的线程和EventLoop初始化时绑定的线程是同一个线程，那么可以直接执行回调函数cb，否则，就调用queuInLoop把cb加入到待执行队列中。

接着以调用TcpConnection::send函数为例，如果是跨线程调用TcpConnection::send，那么TcpConnection::send函数一定会调用 \`loop_->runInLoop(std::bind(&TcpConnection::sendInLoop, this, buf))\` （见上面TcpConnection::send函数内部实现），也就是说，执行runInLoop函数的线程和执行TcpConnection::send函数的线程是同一个，而且runInLoop函数的形参cb此时就是sendInLoop函数，在runInLoop函数中，会先执行isInLoopThread()判断一下调用runInLoop的线程和EventLoop绑定的线程是否是同一个，这里举的例子由于是跨线程，因此不是同一个，于是就会执行queueInLoop(cb)。接下来看下queueInLoop做了什么。

\`\`\`cpp
void EventLoop::queueInLoop(Functor cb)
{
    {   
        std::unique_lock<std::mutex> lock(mutex_);
        pendingFunctors_.emplace_back(cb);
    }
    if (!isInLoopThread() || callingPendingFunctors_)  
    {
        wakeup();   
    }
}
\`\`\`

queueInLoop的功能是：直接把回调函数加入**pendingFunctors_**中，并在必要的时候唤醒EventLoop绑定的线程。其中，pendingFunctors_就是一个容器，类型为： \`std::vector<std::function<void()>>\` ，用来存放待执行的函数。

---
继续前面跨线程调用TcpConnection::send为例，由于TcpConnection::send调用EventLoop::runInLoop，EventLoop::runInLoop又调用EventLoop::queueInLoop，所以这里执行queueInLoop的线程就是执行TcpConnection::send的线程，

即执行queueInLoop的线程不是EventLoop初始化时绑定的线程，也就满足的!isInLoopThread()，于是需要唤醒EventLoop绑定的线程，让它去从pendingFunctors_中取出cb（这里的例子cb就是sendInLoop函数），并执行。接下来看下wakeup()函数到底做了什么，是怎么唤醒的。

**tips** ：pendingFunctors_是多线程共享资源，其他线程负责往pendingFunctors_中存储待执行函数，本线程就负责从pendingFunctors_把函数取出来执行，相当于一个生产者消费者模型，所以再向pendingFunctors_中添加待执行函数时需要加锁。

**首先提及一个问题为什么需要唤醒？**

如下EventLoop::loop函数所示，由于子Reactor（子线程）管理的fd上没有任何事件发生时，该线程的EPoller就会一直阻塞在poll函数这里，也就无法执行doPendingFunctors函数了（该函数功能是从pendingFunctors_中取出函数来执行）。

\`\`\`cpp
void EventLoop::loop()
{
    while (!quit_)
    {
        activeChannels_.clear();
        epollReturnTime_ = epoller_->poll(kPollTimeMs, &activeChannels_);
        for (Channel *channel : activeChannels_)
        {
            channel->handleEvent(epollReturnTime_);
        }
        // 执行其他线程添加到pendingFunctors_中的函数
        doPendingFunctors();
    }
    looping_ = false;
}
\`\`\`

**怎么唤醒？**

我们要唤醒EventLoop所在线程，只需要让EventLoop不要阻塞在poll函数这里即可，要达到该目的，我们就需要让EPoller上注册的任意Channel有事件发生。具体如下：  
每个EventLoop都有一个wakeupFd_，同样把该fd封装成Channel，变成wakeupChannel_。在EventLoop构造时我们就为wakeupChannel_在EPoller上注册可读事件，所以当在queueInLoop函数中调用wakeup时，只需要在wakeupFd_上写入数据(见下面wakeup代码)，这样EPoller就会检测到wakeupFd_可读，于是就解除了阻塞，进而执行doPendingFunctors，即取出pendingFunctors_中存储的sendInLoop函数并执行，这样就实现了：即使在别的线程调用TcpConnection::send函数，也能确保sendInLoop函数（即对sockfd的写操作）能在EventLoop所属的线程中执行。

\`\`\`cpp
void EventLoop::wakeup()
{
    // wakeup() 的过程本质上是对wakeupFd_进行写操作，以触发该wakeupFd_上的可读事件,
    // 这样就起到了唤醒 EventLoop 的作用。
    uint64_t one = 1;
    ssize_t n = write(wakeupFd_, &one, sizeof(one));
}
\`\`\`

## 项目当中有什么亮点

### Channel的tie_涉及到的精妙之处

在没有tie_的时候，当客户端主动关闭连接时，服务器上该连接对应的sockfd上就会有事件发生，也就是该sockfd对应的Channel会调用Channel::handleEvent()来关闭连接，关闭连接就会释放释放TcpConnection，进而Channel对象也会析构，这就造成了Channel::handleEvent()还只执行到一半，Channel就已经被析构了，引发不可预测的后果，为了避免这个问题，可以使用弱指针tie_绑定到TcpConnection的共享指针上，如果tie_能够被转化为TcpConnection共享指针，这就延长了TcpConnection的生命周期，使之长过Channel::handleEvent()，这样一来，Channel::handleEvent()来关闭连接时，下面代码的guard变量依然持有一份TcpConnection，使其的引用计数不会减为0，也就是说Channel不会在执行完Channel::handleEvent()之前被析构。

\`\`\`cpp
void Channel::handleEvent(Timestamp receiveTime)
{
    if (tied_)
    {
        std::shared_ptr<void> guard = tie_.lock();
        if (guard)
        {
            handleEventWithGuard(receiveTime);
        }
    }
}

// 根据相应事件执行回调操作
void Channel::handleEventWithGuard(Timestamp receiveTime)
{
    // 对方关闭
    if ((revents_ & EPOLLHUP) && !(revents_ & EPOLLIN))
    {
        // 如果没有tie_，可能程序执行到这里就已经释放了Channel对象，如果
        // 继续往下执行，会引发不可预知的后果
        if (closeCallback_) closeCallback_();
    }
    ...省略处理其他事件的代码（如可读、可写）
}
\`\`\`

​

​

​

以下为星球录友面试记录，还没有整理答案，但是面试中的真实提问。

​

1. 你为什么要做这个项目，能说说出于什么目的做的嘛？
2. 你这个项目是自学的，那你做的时候参照过其他的项目没有？
3. 你的这个网络库是自制的，你的网络库和别的网络库有什么区别？
4. 你说到了重构，那你知道重构一个项目要考虑那些嘛，比如一个类要怎么设计？了解其他的设计模式嘛？从设计模式讲讲你对继承、封装、多态的理解？
5. 展开介绍一下这个项目？ 这个需要准备好，有条理有逻辑的说清楚
6. epoll、poll、select的区别，解决了什么问题？异步同步io的理解，什么时候用同步，什么时候异步？
7. 你提到了reactor，你知道其他的网络模型嘛？Nginx是怎么做的？你的主reactor连接后怎么分配从reactor的？了解那些负载均衡算法？你用了那个，怎么考虑的？ 延申问了hash相关的八股
8. 你这个项目有没有做过测试，支持多大的并发量？说的星球webserver那个项目的测试

回答我没有记录，都是凭借自己的理解回答的，一般面试官的套路是这样的： 面试官由你简历上介绍的那几行开始发问，然后引申，比如为什么你这里要这样，会不会有什么问题，可不可以用xxx方案，你还能想出什么方案等等，这些问题针对简历可以提前想好。如果面试遇到答不上来的也别害怕，直接问或者在反问环节问面试官这个问题的思路`},{id:"yq_01",index:1,doc_id:201056580,title:"学习建议",slug:"qhqvu2pcp37etht4",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/qhqvu2pcp37etht4",level:0,category:"学习指导",wordCount:538,updatedAt:"2026-08-24T08:56:34.000Z",hash:"3e25f0510fb9",status:"FULL",tags:["学习路线","C++进阶","源码研读","攻坚方法"],linkedModule:"mod_global",linkedModuleTitle:"全局学习与攻坚基准",linkedSourceFiles:["README.md","CMakeLists.txt"],linkedClasses:["http::HttpServer","ChatServer"],linkedFunctions:["main()"],interviewKeyPoints:["如何从零构建一个 C++ 网络项目？","C++ 学习应遵循怎样的完整路径？"],content:`# 学习建议

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/qhqvu2pcp37etht4](https://www.yuque.com/chengxuyuancarl/imh9xc/qhqvu2pcp37etht4)  
> 更新时间: 2026-08-24T08:56:34.000Z | 字数: 538

---

lake

### 项目要点

- 该项目的主要难点在于对C++网络编程要有一定了解
- 理解 HTTP 协议内容和 HTTP 通信过程
- 对 muduo 网络库有一定的了解（至少要知道 muduo 对外暴露的常用接口是干什么的，muduo 库是干什么用的）
- 请求解析的准确性，任何解析错误都可能导致请求处理失败或安全漏洞（作者开发过程中不止一次踩过坑）

​

### 如果你想要做这个项目，那我希望你有如下基础

- 至少有过一个 C++ 项目开发经验
- 在 Linux 平台下进行过 C/C++ 代码编写
- 熟悉 C++ 的常用特性，比如继承、多态等，对 C++11 的常用特性较为了解
- 熟悉面向对象编程
- 对 C++ 网络编程有所掌握，了解 HTTP 协议
- 使用过 mysql 数据库
- 之前做过或了解过 webserver 项目更好

​

### 学习项目指导时间：

花20天-30天的时间学完该HTTP框架（每天6-8小时左右），后续大家就可以在该HTTP框架上进行二次开发了。

整体代码在5000行左右：HTTP框架代码行数大概在3000左右，五子棋服务端代码量大概在1400行左右

- 建议先体验 muduo 库的使用，去写个demo用一用，学习 muduo 库到底是干什么的，使用它有什么优势。
- 学习完 muduo之后学习http目录下的 HttpServer、HttpRequest、HttpContext 和 HttpResponse 这些负责解析和封装 HTTP 报文的类。
- 花学习吸收 router 目录下的 Router 和 RouterHandler。
- 然后再去学习会话管理模块、中间件模块、集成数据库连接池和 HTTPS 模块
- 学习完 HTTP 框架之后，大家可以去项目目录中学习基于该 HTTP 框架实现的五子棋项目，去学习如何将这个 HTTP 框架应用起来。
- 后续大家还可以根据该 HTTP 框架去开发属于自己的项目。`,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_02",index:2,doc_id:200670829,title:"1.开篇",slug:"txnviq52or0spb1b",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/txnviq52or0spb1b",level:0,category:"架构导读",wordCount:196,updatedAt:"2026-04-03T08:16:47.000Z",hash:"ff01d94aac04",status:"FULL",tags:["C++生态","AI应用","Spring AI对比","系统设计"],linkedModule:"mod_global",linkedModuleTitle:"C++ AI 应用服务平台宏观设计",linkedSourceFiles:["README.md"],linkedClasses:["ChatServer"],linkedFunctions:["ChatServer::start()"],interviewKeyPoints:["为什么市面上很少有 C++ AI 应用开发项目？","C++ 相比 Java Spring AI 的底层性能优势与自研挑战？"],content:`# 1.开篇

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/txnviq52or0spb1b](https://www.yuque.com/chengxuyuancarl/imh9xc/txnviq52or0spb1b)  
> 更新时间: 2026-04-03T08:16:47.000Z | 字数: 196

---

lake

## 项目目标

- 帮助学习C++方向的人尽快上手实际地web开发，摆脱枯燥的语法学习
- 帮助学习C++的初学者打开思路，不局限于做一些组件项目，尝试做一些应用开发
- 让C++初学者学会使用知名开源框架去进行开发，而不用总是自己从头开始开发，在面对紧急需要时节省开发时间。

**项目名称：KamaServer**

**项目开源地址：**[**https://github.com/youngyangyang04/Kama-HTTPServer**](https://github.com/youngyangyang04/Kama-HTTPServer)

**​**

**基于本项目，开发的一个小应用: 卡码五子棋**

功能界面如下：

- 登录注册
- 游戏菜单
- 五子棋游戏（只能对战AI且AI水平较低）
- 卡码五子棋游戏后台展示

##`,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_03",index:3,doc_id:200689445,title:"2.项目介绍",slug:"utty1nkbh3idqrz6",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/utty1nkbh3idqrz6",level:0,category:"架构导读",wordCount:2817,updatedAt:"2026-07-13T05:47:27.000Z",hash:"373af272f709",status:"FULL",tags:["四层架构","Reactor","调用链","微服务架构"],linkedModule:"mod_global",linkedModuleTitle:"四层服务架构总览",linkedSourceFiles:["AIApps/ChatServer/src/main.cpp","HttpServer/src/http/HttpServer.cpp"],linkedClasses:["ChatServer","http::HttpServer"],linkedFunctions:["main()","ChatServer::initialize()"],interviewKeyPoints:["请详细画出你的 AI 应用服务平台四层技术架构？","请求从客户端到达各模块的调用时序？"],content:`# 2.项目介绍

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/utty1nkbh3idqrz6](https://www.yuque.com/chengxuyuancarl/imh9xc/utty1nkbh3idqrz6)  
> 更新时间: 2026-07-13T05:47:27.000Z | 字数: 2817

---

lake

## 项目背景

### 什么是 HTTP 框架？

HTTP 框架是一种软件库，旨在简化 Web 应用程序和服务的开发。它提供了一种结构化的方法来处理 HTTP 请求和响应，管理路由，并通常包括会话管理、安全性和数据处理的工具。HTTP 框架抽象了网络通信的复杂性，使开发人员能够专注于构建应用程序逻辑。

### 为什么要实现 HTTP 框架？

1. **效率**：通过提供可重用的组件和抽象，HTTP 框架减少了开发人员需要编写的样板代码，从而加快了开发过程。
2. **可扩展性**：框架通常内置支持处理多个并发请求，使构建可扩展的应用程序变得更加容易。
3. **可维护性**：结构良好的框架强制执行最佳实践和设计模式，使代码库更易于维护和扩展。
4. **安全性**：框架通常包括安全功能，如输入验证、输出编码以及防止常见漏洞（如 SQL 注入和跨站脚本攻击）。
5. **社区和支持**：流行的框架拥有庞大的社区和丰富的文档，为开发人员提供支持和资源。

## 项目概述

该项目是一个使用 Muduo 库构建的 HTTP 框架，Muduo 是一个用于高性能网络应用的 C++ 网络库。该框架旨在高效处理 HTTP 请求和响应，为构建 Web 应用程序提供基础。

### 关键组件

1. **HttpRequest 和 HttpResponse：**这些类封装了 HTTP 请求和响应的细节。HttpRequest 处理 HTTP 方法、头部和主体内容的解析，而 HttpResponse 管理 HTTP 响应的构建，包括状态码、头部和主体内容的设置。
2. **HttpContext：**该类管理 HTTP 请求在处理过程中的状态。它跟踪解析状态并存储 HttpRequest 对象，确保请求的完整性和一致性。
3. **HttpServer：**作为框架的核心，HttpServer 负责接受连接、读取请求和发送响应。它使用 Muduo 库的高效事件驱动架构来处理网络通信，支持高并发和低延迟。
4. **路由和处理器：**框架支持根据请求路径和方法将请求路由到特定的处理器。处理器负责处理请求并生成适当的响应，支持动态路由和中间件功能。
5. **日志记录和错误处理：**框架包括日志记录功能以跟踪请求处理，并提供错误处理机制以优雅地管理异常和无效请求。通过详细的日志记录和错误报告，开发者可以快速定位和解决问题。
6. **会话管理：**支持用户会话的创建、维护和销毁，确保用户状态的一致性和安全性。
7. **中间件支持：**允许开发者在请求处理的各个阶段插入自定义逻辑，增强系统的灵活性和可扩展性。

### 工作原理

1. **请求解析：**传入的 HTTP 请求由 HttpContext 类解析，提取方法、路径、头部和主体。解析后的请求被传递给路由系统。
2. **路由：**根据请求路径和方法，框架将请求路由到适当的处理器。路由系统支持静态和动态路径匹配，确保请求被正确处理。
3. **响应生成：**处理器处理请求并生成 HttpResponse，然后将其发送回客户端。响应生成过程包括设置状态码、头部和主体内容。
4. **连接管理：**框架使用 Muduo 的事件驱动架构管理连接，使其能够高效地处理多个并发连接。通过非阻塞 I/O 和多线程支持，系统能够在高负载下保持稳定。
5. **安全通信：**通过集成 OpenSSL，框架支持 HTTPS，确保数据传输的安全性和完整性。

### 未来增强

- **模板渲染：**添加支持渲染 HTML 模板以简化动态网页的创建。通过模板引擎，开发者可以轻松生成动态内容，提高开发效率。
- **WebSocket 支持：**扩展框架以支持 WebSocket 连接，实现实时通信。WebSocket 的引入将增强应用的互动性和响应速度，适用于聊天应用、实时更新等场景。
- **身份验证和授权：**集成 OAuth 和 JWT 等认证方式，增强系统的安全性和用户管理能力。
- **负载均衡和分布式支持：**通过引入负载均衡策略和分布式架构，提升系统的可扩展性和可靠性，支持大规模应用的部署。

### 项目难点

- **请求解析的准确性：**解析HTTP请求时，需要准确地解析请求行、头部和主体，任何解析错误都可能导致请求处理失败或安全漏洞
- **继承和多态技术：**完成URI到处理器的绑定。
- **灵活的路由机制：**框架需要提供灵活的路由机制，以便根据请求路径和方法将请求路由到正确的处理器。
- **模块化设计：框**架应采用模块化设计，以便于扩展和维护。新功能或组件应能方便地集成到现有框架中。
- **动态路由：**支持基于 URL 模式的动态路由（例如，支持 /users/:id 这样的路径）。
- **会话支持：**实现会话管理，支持用户登录状态的保持。持久化存储：支持将会话数据存储在数据库或内存中。
- **数据库集成：**

- 数据库连接池：实现数据库连接池，提高数据库访问效率。
- ORM 支持：集成一个轻量级的 ORM，简化数据库操作。

- **路由中间件：**允许在请求到达最终处理器之前进行预处理（例如，身份验证、日志记录）。
- **常用中间件：**提供一些常用的中间件，如 CORS 处理、请求限流、压缩（gzip）等。

这些重难点反映了在设计和实现 HTTP 框架时需要考虑的关键问题。解决这些问题需要深入理解 HTTP 协议、网络编程和系统设计等方面的知识。通过合理的架构设计和代码实现，可以有效地应对这些挑战。

## 结论

该 HTTP 框架为使用 C++ 构建 Web 应用程序提供了一个强大的基础。通过利用 Muduo 库，它提供了高性能和可扩展性，适用于广泛的应用程序。通过进一步的增强，它可以成为现代 Web 开发需求的全面解决方案。

​

## 该项目与WebServer的区别

大家可能会有这样的疑惑，同样是可以提供web服务，该项目跟 WebServer 项目有什么区别呢？下面我将根据我的理解去介绍这两者项目的区别。

为了让大家更清楚的理解，我将根据下面的架构图去介绍两个项目：

![](images/yuque/img_03_01.png)

首先介绍 WebServer 项目，根据我了解学习到的绝大多数市面上的 WebServer 项目，都是教你从 socket 开始写最终能够实现一个简单的 HTTP 访问和响应就算是结束了。也就说明了 WebServer 这个项目的工作重点在于不仅需要实现一个网络通信框架，还需要实现一个简单可用的应用层实现。

其次就是介绍 HTTP 框架项目，该项目的重点在于应用层部分的实现，该项目的网络通信框架部分是直接使用muduo 网络库而不需要自己手动去实现。

#### 这么说不是做WebServer的项目更有意义吗？WebServer项目不仅可以手动实现网络通信框架还可以利用自己实现的网络通信框架的基础上去搭建HTTP框架。

先给出结论，这种方法理论上可行，但是实践起来将会遇到非常多的困难，并且这个项目的完成周期也会很长。

为什么该项目直接使用 muduo 网络库作为通信框架，而不自己手动去搭建一个通信框架，原因就在于 muduo 网络库稳定（有过实际项目开发经验的同学一定懂得稳定这两个字是多么重要）。以我个人举例子，我看过 muduo网络库的源码，懂得其设计思想，并且网上资料很多，但是最终我本人开发出来的网络框架在实际应用的过程中依然有各种各样的问题（总有我考虑不周的点），所以看似自己搭一个网络框架能够写很多代码学到很多东西，但是项目一旦大起来再想推进进度将会十分困难，不是修 bug 就是在修 bug 的路上，而且排错非常困难，你不知道是网络框架出的问题还是上层应用出的问题。

#### 做WebServer还是做HTTP框架项目怎么选？

什么样的人适合做 WebServer

- C++初学者，只懂得C++基础语法，但是不懂如何使用C++开发网络项目
- 想学习网络框架的设计，想知道 muduo 等网络库是怎么来的，想知道网络通信框架内部实现。

什么样的人适合做 HTTP 框架

- 建议做过或者至少了解过 WebServer 或其他网络项目的人，对 C++ 网络编程有一定概念
- 学习过计算机网络，理解 HTTP 协议，该项目可以让大量 HTTP 相关理论知识得到实践

总的来说，做过 WebServer 的人再去做 HTTP 框架项目将会有更多的收获，HTTP 框架项目由于不需要考虑网络通信框架部分的实现，它可以在应用层上有很大的施展空间，拓展很多后端常用功能。并且 HTTP 框架项目相较而言更稳定，在此基础上实现业务功能更稳定，debug 的难度会降低很多，在这一点上 WebServer 项目是不能比的，大多数人实现的 WebServer 项目的稳定性都极差，很难往上加业务功能，更别说有的人的 WebServer 就是单纯用来学习其设计思想的，编译运行起来都一大堆 bug。`,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_04",index:4,doc_id:200754437,title:"3.环境准备",slug:"txt4ssk5pdgg166g",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/txt4ssk5pdgg166g",level:0,category:"构建部署",wordCount:1895,updatedAt:"2026-07-06T06:28:43.000Z",hash:"df67584bcaa5",status:"FULL",tags:["CMake","Linux依赖","C++17","第三方库","OpenSSL","RabbitMQ"],linkedModule:"mod_build",linkedModuleTitle:"CMake 构建体系与多方库链接",linkedSourceFiles:["CMakeLists.txt"],linkedClasses:[],linkedFunctions:["find_package(OpenSSL)","target_link_libraries"],interviewKeyPoints:["项目依赖了哪些核心 C++ 库，各自解决什么问题？","CMake 如何管理复杂第三方动态库与头文件搜索路径？"],content:`# 3.环境准备

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/txt4ssk5pdgg166g](https://www.yuque.com/chengxuyuancarl/imh9xc/txt4ssk5pdgg166g)  
> 更新时间: 2026-07-06T06:28:43.000Z | 字数: 1895

---

lake

**注意：该篇环境准备针对的应用层是五子棋+HTTP服务框架，AI应用层简历写法这些全部在第九点**

**​**

**建议购买一台云服务器，腾讯云或者阿里云，用来部署自己的项目 非常方便，无论是做本项目还是做其他项目，无论是自己练习，还是项目上线，都需要一台有公网Ip的独立服务器。 自己电脑安装虚拟机，不仅麻烦，经常出莫名其妙的问题。**

- [阿里云活动期间服务器购买](https://www.aliyun.com/minisite/goods?taskCode=shareNew2205&recordId=3641992&userCode=roof0wob)
- [腾讯云活动期间服务器购买](https://curl.qcloud.com/EiaMXllu)

# l编译环境

- 操作系统(虚拟机或云服务器均可)：Ubuntu 22.04.5
- 数据库：mysql 5.7.29
- boost_1_69_0
- muduo网络库

​

# 从零开始配置环境（更为推荐的docker配置版）

（注意：此镜像对应的应用层为卡玛五子棋，若是想看AI，查阅第九点）

![](images/yuque/img_04_01.png)

## 1:下载Docker

可以i查看这个文章来下载对应的docker

[https://blog.csdn.net/jackeydengjun/article/details/147185455](https://blog.csdn.net/jackeydengjun/article/details/147185455)

## 2：从远程拉取我配置好的镜像并创建容器

\`\`\`cpp
# 将我提供的远程镜像拉取到本地
docker pull huanheart/httpserver:v1
\`\`\`

如果在这个过程中出现

Error response from daemon: Get "[https://registry-1.docker.io/v2/":](https://registry-1.docker.io/v2/":) context deadline exceeded

跟着接下来这么做（如果还遇到问题，请在项目群中联系@卡哥助手-焕心）

\`\`\`cpp
# 生成该json
vim /etc/docker/daemon.json
\`\`\`

将下面内容复制上去

\`\`\`cpp
{
  "registry-mirrors": [
    "https://docker.registry.cyou",
    "https://docker-cf.registry.cyou",
    "https://dockercf.jsdelivr.fyi",
    "https://docker.jsdelivr.fyi",
    "https://dockertest.jsdelivr.fyi",
    "https://mirror2.aliyuncs.com",
    "https://dockerproxy.com",
    "https://mirror.baidubce.com",
    "https://docker.m.daocloud.io",
    "https://docker.nju.edu.cn",
    "https://docker.mirrors.sjtug.sjtu.edu.cn",
    "https://docker.mirrors.ustc.edu.cn",
    "https://mirror.iscas.ac.cn",
    "https://docker.rainbond.cc"
  ]
}

\`\`\`

保存之后重新启动docker，并重新拉取该镜像，应该就可以了，

或者试试下面几个

\`\`\`go
"https://docker.1ms.run",
"https://dockerproxy.com",
"https://hub.rat.dev"

\`\`\`

不可用了，大家可以自行网上搜索，或者在群里找要梯子,通过梯子的方式设置代理，而不是国内镜像源

\`\`\`cpp
sudo systemctl daemon-reexec
sudo systemctl restart docker
docker pull huanheart/httpserver:v1

\`\`\`

此时镜像就已经拉取好了，现在需要创建容器了

![](images/yuque/img_04_02.png)

创建容器,执行该命令（这边暴露5个端口是为后续可能用到多个端口做铺垫）

\`\`\`cpp
docker run -d \\
  --name httpserver-container \\
  -p 8001:8001 \\
  -p 8002:8002 \\
  -p 8003:8003 \\
  -p 8004:8004 \\
  -p 8005:8005 \\
  huanheart/httpserver:v1 \\
  tail -f /dev/null

\`\`\`

**注意：如果出现以下问题，说明端口被占用过了，将-p指定的端口换成另外一个即可**

![](images/yuque/img_04_03.png)

​

## 3：进入docker

先docker ps查看是否有这个容器

![](images/yuque/img_04_04.png)

通过docker exec -it 85aca0cab6f4 bash进入容器，**85aca0cab6f4为你的CONTAINER ID ，看上面的截图，每个人的不一样**

\`\`\`cpp
# 由于这边没有设置mysql自启动，需要手动启动一次，否则会导致错误
service mysql start
# 进入容器后，进入根目录
cd ~
# ls可以发现有如下内容，我们进入Kama-HTTPServer/build_temp/
cd Kama-HTTPServer/build_temp/
\`\`\`

![](images/yuque/img_04_05.png)

\`\`\`cpp
# 接着我们运行如下指令，拿8001端口举例
./simple_server -p 8001
\`\`\`

![](images/yuque/img_04_06.png)

最后我们去浏览器中访问即可,可以发现成功访问到了

![](images/yuque/img_04_07.png)

​

## 4：关于访问mysql的注意点：

这边容器的mysql的密码是123456，如果想要访问mysql的话记住这个密码即可

![](images/yuque/img_04_08.png)

# 从零开始配置环境（手动配置版）

（注意：此镜像对应的应用层为卡玛五子棋，若是想看AI，查阅第九点）

![](images/yuque/img_04_01.png)

**首先，我们要将HTTP框架项目从github上下载到自己的云服务器或者虚拟机上，其次我们就开始我们的环境配置了。**

先禁用自动更新服务，防止它与手动操作冲突

\`\`\`shell
sudo systemctl stop apt-daily.timer
sudo systemctl stop apt-daily-upgrade.timer
sudo systemctl disable apt-daily.timer
sudo systemctl disable apt-daily-upgrade.timer
\`\`\`

## 编译器相关

### g++、cmake、make

\`\`\`cpp
sudo apt update
sudo apt install g++ cmake make
\`\`\`

## MySql相关

### mysql 5.7压缩包下载：

使用 \`aria2\` 加速下载压缩包： \`aria2\` 是一个支持多协议、多源和多线程的下载工具。您可以安装 \`aria2\` 并使用它来下载文件

\`\`\`cpp
sudo apt install aria2
aria2c https://downloads.mysql.com/archives/get/p/23/file/mysql-server_5.7.29-1ubuntu18.04_amd64.deb-bundle.tar
\`\`\`

下载好压缩包之后解压缩

\`\`\`cpp
sudo tar -xvf mysql-server_5.7.29-1ubuntu18.04_amd64.deb-bundle.tar
\`\`\`

出现如图所示表示解压缩正确：

![](images/yuque/img_04_10.png)

### 安装mysql

安装依赖lib包

\`\`\`shell
sudo apt install ./libmysql*
sudo apt install libtinfo5
\`\`\`

安装客户端和服务端，按提示可能要先安装community版本

\`\`\`shell
sudo apt-get install ./mysql-community-client_5.7.29-1ubuntu18.04_amd64.deb
sudo apt-get install ./mysql-client_5.7.29-1ubuntu18.04_amd64.deb
sudo apt-get install ./mysql-community-server_5.7.29-1ubuntu18.04_amd64.deb
sudo apt-get install ./mysql-server_5.7.29-1ubuntu18.04_amd64.deb 
\`\`\`

第三行命令执行时会提示设置MySQL的密码，用户名默认root。**出现下图时，设置密码之后按回车键就行****（一键配置：这里让大家统一输入root）**。

![](images/yuque/img_04_11.png)

### 启动mysql

#### 检查状态

一般安装成功就自动启动，输入命令检查启动状态，绿色的active表示运行中

\`\`\`shell
systemctl status mysql.service
\`\`\`

按ctrl + c退出

#### 登录MySQL

使用root用户登录MySQL

\`\`\`shell
sudo mysql -uroot -proot
\`\`\`

安转好mysql以后，进入mysql后创建数据库数据表命令，以及设置root用户访问权限（比如放开远程连接）：

\`\`\`cpp
create database Gomoku;
use Gomoku;
CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);
UPDATE mysql.user SET host = '%' WHERE user = 'root' AND host = 'localhost';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;
FLUSH PRIVILEGES;
\`\`\`

在系统文件中也要开启远程访问权限，设置完毕后需要重启MySQL服务

\`\`\`cpp
sudo sed -i "s/^bind-address\\s*=.*/bind-address = 0.0.0.0/" /etc/mysql/mysql.conf.d/mysqld.cnf
sudo systemctl restart mysql
sudo ufw allow 3306
\`\`\`

## 第三方库：boost库、muduo网络库、nlohmann/json等相关库

##### boost库和muduo网络库的安装教程链接如下：boost库：[https://blog.csdn.net/QIANGWEIYUAN/article/details/88792874](https://blog.csdn.net/QIANGWEIYUAN/article/details/88792874)muduo库：[https://blog.csdn.net/QIANGWEIYUAN/article/details/89023980](https://blog.csdn.net/QIANGWEIYUAN/article/details/89023980)

### Linux下 Boost库环境搭建

先把Linux系统下的boost源码包boost_1_69_0.tar.gz通过命令下载下来，然后解压，如下：

\`\`\`cpp
wget https://www.programmercarl.com/download/boost_1_69_0.tar.gz
tar -zxvf boost_1_69_0.tar.gz
\`\`\`

tar解压完成后，进入源码文件目录，查看内容：

\`\`\`cpp
cd boost_1_69_0/
\`\`\`

运行bootstrap.sh工程编译构建程序，需要等待一会儿，查看目录：

\`\`\`cpp
./bootstrap.sh 
\`\`\`

后续要执行的命令(详情大家看boost库链接)：

\`\`\`cpp
./b2
sudo ./b2 install
cd ..
\`\`\`

### Linux下 muduo库环境搭建

这里直接给出安装命令（详情请看上述 muduo 库对应链接）

首先在boost库压缩包相同的目录下通过命令将 muduo-master.zip 下载到Linux系统下，其次就按照下面命令执行就可以了

\`\`\`cpp
wget https://www.programmercarl.com/download/muduo-master.zip
sudo apt install unzip
unzip muduo-master.zip
cd muduo-master
sudo chmod +x build.sh
./build.sh
./build.sh install
cd ..
cd build/
cd release-install-cpp11/
cd include/
sudo mv muduo/ /usr/include/
cd ..
cd lib/
sudo mv * /usr/local/lib/
\`\`\`

### nlohmann/json

ubuntu22.04按这个命令来：

\`\`\`cpp
sudo apt upgrade
sudo apt install nlohmann-json3-dev
\`\`\`

出现如图情况一直回车就行。

![](images/yuque/img_04_12.png)

![](images/yuque/img_04_13.png)

![](images/yuque/img_04_14.png)

### c++mysql库:

\`\`\`cpp
sudo apt install libmysqlcppconn-dev
\`\`\`

### 安装 OpenSSL 开发库

\`\`\`cpp
sudo apt install libssl-dev
\`\`\`

出现上面同样紫色的情况也是一路回车就好了

## 编译运行

如果大家是完全按照上述描述执行的，现在应该在这个目录下，只需要退出当前目录，找到HTTP项目目录就行

![](images/yuque/img_04_15.png)

\`\`\`cpp
cd ..
cd ..
cd ..
cd HTTP项目名称/
\`\`\`

编译命令

\`\`\`cpp
mkdir build
cd build/
cmake ..
make
\`\`\`

运行命令

这里大家可以自己通过 **-p 端口号 **来配置服务器运行端口号

\`\`\`cpp
sudo ./simple_server
\`\`\`

# 保持运行云服务器上

如果大家通过xshell将项目运行在云服务器上，想要在xshell关闭时项目依然运行，可参考如下：

![](images/yuque/img_04_16.png)

重新连接后恢复会话

\`\`\`cpp
tmux attach -t server_session
\`\`\``,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_05",index:5,doc_id:200767305,title:"4.框架梳理",slug:"wv4w7ko8ifnltdnb",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/wv4w7ko8ifnltdnb",level:0,category:"底层网络",wordCount:233,updatedAt:"2026-07-21T02:55:14.000Z",hash:"c0c39c61a9c6",status:"FULL",tags:["muduo","Reactor","TcpServer","EventLoop","连接管理"],linkedModule:"mod_http_server",linkedModuleTitle:"HttpServer 核心服务框架",linkedSourceFiles:["HttpServer/include/http/HttpServer.h","HttpServer/src/http/HttpServer.cpp"],linkedClasses:["http::HttpServer","muduo::net::TcpServer","muduo::net::EventLoop"],linkedFunctions:["HttpServer::start()","onConnection()","onMessage()","onRequest()"],interviewKeyPoints:["为什么要基于 muduo 构建 HTTP 服务器？","One Loop Per Thread 线程模型在多连接场景下的特点？"],content:`# 4.框架梳理

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/wv4w7ko8ifnltdnb](https://www.yuque.com/chengxuyuancarl/imh9xc/wv4w7ko8ifnltdnb)  
> 更新时间: 2026-07-21T02:55:14.000Z | 字数: 233

---

lake

## 框架组成

该HTTP框架的实现主要分为以下几个部分：

- HttpRequest（HTTP请求）：表示一个HTTP请求。负责解析HTTP方法、头部和主体内容
- HttpResponse（HTTP响应）：表示一个HTTP响应。构建带有适当状态码、头部和主体内容的响应
- HttpContext：该类管理 HTTP 请求在处理过程中的状态。它跟踪解析状态并存储 \`HttpRequest\` 对象。

1. HttpServer：框架的核心，\`HttpServer\` 负责接受连接、读取请求和发送响应。它使用 Muduo 库高效地处理网络通信。

- 静态路由、动态路由和处理器（Router）：管理HTTP请求的路由，根据请求路径和方法将其路由到适当的处理器
- 会话管理模块
- 中间件模块
- 集成数据库连接池模块
- HTTPS拓展模块

####`,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_06",index:6,doc_id:201988735,title:"HTTP报文解析封装模块",slug:"cvyq9iyyeuqs7n6w",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/cvyq9iyyeuqs7n6w",level:1,category:"协议解析",wordCount:1920,updatedAt:"2026-06-18T09:58:10.000Z",hash:"19618e9ac57d",status:"FULL",tags:["有限状态机","FSM","零拷贝","TCP粘包","HTTP解码"],linkedModule:"mod_http_codec",linkedModuleTitle:"HTTP 报文解析与封装 (HttpContext)",linkedSourceFiles:["HttpServer/src/http/HttpContext.cpp","HttpServer/src/http/HttpRequest.cpp","HttpServer/src/http/HttpResponse.cpp"],linkedClasses:["http::HttpContext","http::HttpRequest","http::HttpResponse"],linkedFunctions:["HttpContext::parseRequest()","processRequestLine()","appendToBuffer()"],interviewKeyPoints:["HTTP 解析的状态机如何设计？","如何高效解决 TCP 粘包与拆包问题？","零拷贝思想在 HTTP 报文解析中如何体现？"],content:`# HTTP报文解析封装模块

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/cvyq9iyyeuqs7n6w](https://www.yuque.com/chengxuyuancarl/imh9xc/cvyq9iyyeuqs7n6w)  
> 更新时间: 2026-06-18T09:58:10.000Z | 字数: 1920

---

lake

## 模块分析

### HttpRequest（HTTP请求）

\`HttpRequest\`对象就是对HTTP请求报文的封装，将请求报文的重要信息封装到对象中。看一下他的成员变量就懂了：

\`\`\`cpp
Method                                       method_; // 请求方法
std::string                                  version_; // http版本
std::string                                  path_; // 请求路径
std::unordered_map<std::string, std::string> pathParameters_; // 路径参数
std::unordered_map<std::string, std::string> queryParameters_; // 查询参数
muduo::Timestamp                             receiveTime_; // 接收时间
std::map<std::string, std::string>           headers_; // 请求头
std::string                                  content_; // 请求体
uint64_t                                     contentLength_ { 0 }; // 请求体长度
\`\`\`

再简单分析一下他的几个成员函数就更能清晰的知道这个类的作用了。

关键成员方法：

- setMethod()：设置 HTTP 方法（GET、POST 等）。
- addHeader()：向请求中添加头部。
- setBody()：设置请求的主体内容。

通过上述描述我们知道了\`HttpRequest\`类的是用于封装HTTP请求报文信息的，那么我们应该如何验证客户端发送过来HTTP报文的格式和基本内容是否符合规范呢？这时就轮到\`HttpContext\`发挥作用了。

### HttpContext

我们通过分析\`HttpContext\`中的成员变量和成员函数就不难发现，\`HttpContext\`是用于解析\`HttpContext\`报文并把信息封装到\`HttpRequest\`中的。

HttpContext重要成员变量：

\`\`\`cpp
enum HttpRequestParseState
{
    kExpectRequestLine, // 解析请求行
    kExpectHeaders, // 解析请求头
    kExpectBody, // 解析请求体
    kGotAll, // 解析完成
};

HttpRequestParseState state_;
HttpRequest           request_;
\`\`\`

HttpContext的重要成员函数：

**解析请求报文：**

\`\`\`cpp
// 将报文解析出来将关键信息封装到HttpRequest对象里面去
bool HttpContext::parseRequest(Buffer *buf, Timestamp receiveTime)
{
    bool ok = true; // 解析每行请求格式是否正确
    bool hasMore = true;
    while (hasMore)
    {
        if (state_ == kExpectRequestLine)
        {
            const char *crlf = buf->findCRLF(); // 注意这个返回值边界可能有错
            if (crlf)
            {
                ok = processRequestLine(buf->peek(), crlf);
                if (ok)
                {
                    request_.setReceiveTime(receiveTime);
                    buf->retrieveUntil(crlf + 2);
                    state_ = kExpectHeaders;
                }
                else
                {
                    hasMore = false;
                }
            }
            else
            {
                hasMore = false;
            }
        }
        else if (state_ == kExpectHeaders)
        {
            const char *crlf = buf->findCRLF();
            if (crlf)
            {
                const char *colon = std::find(buf->peek(), crlf, ':');
                if (colon < crlf)
                {
                    request_.addHeader(buf->peek(), colon, crlf);
                }
                else if (buf->peek() == crlf)
                { // 空行，结束Header
                    if (!request_.getHeader("Content-Length").empty())
                    {
                        request_.setContentLength(std::stoi(request_.getHeader("Content-Length")));
                    }

                    if (request_.contentLength() == 0)
                    {
                        state_ = kGotAll;
                        hasMore = false;
                    }
                    else // 有请求体
                    {
                        state_ = kExpectBody;
                    }
                }
                else
                {
                    ok = false; // Header行格式错误
                    hasMore = false;
                }
                buf->retrieveUntil(crlf + 2); // 开始读指针指向下一行数据
            }
            else
            {
                hasMore = false;
            }
        }
        else if (state_ == kExpectBody)
        {
            // 检查缓冲区中是否有足够的数据，
            if (buf->readableBytes() < request_.contentLength())
            {
                hasMore = false; // 数据不完整，等待更多数据
                return true;
            }

            // 只读取 Content-Length 指定的长度
            std::string body(buf->peek(), buf->peek() + request_.contentLength());
            request_.setBody(body);

            // 准确移动读指针
            buf->retrieve(request_.contentLength());

            state_ = kGotAll;
            hasMore = false;
        }
    }
    return ok;
}
\`\`\`

**解析请求行：**

\`\`\`cpp
// 解析请求行
bool HttpContext::processRequestLine(const char *begin, const char *end)
{
    bool succeed = false;
    const char *start = begin;
    const char *space = std::find(start, end, ' ');
    if (space != end && request_.setMethod(start, space))
    {
        start = space + 1;
        space = std::find(start, end, ' ');
        if (space != end)
        {
            const char *argumentStart = std::find(start, space, '?');
            if (argumentStart != space) // 请求带参数
            {
                request_.setPath(start, argumentStart); // 注意这些返回值边界
                request_.setQueryParameters(argumentStart + 1, space);
            }
            else // 请求不带参数
            {
                request_.setPath(start, space);
            }

            start = space + 1;
            succeed = ((end - start == 8) && std::equal(start, end - 1, "HTTP/1."));
            if (succeed)
            {
                if (*(end - 1) == '1')
                {
                    request_.setVersion("HTTP/1.1");
                }
                else if (*(end - 1) == '0')
                {
                    request_.setVersion("HTTP/1.0");
                }
                else
                {
                    succeed = false;
                }
            }
        }
    }
    return succeed;
}
\`\`\`

### HttpResponse（HTTP响应）

\`HttpResponse\`的封装跟\`HttpRequest\`的封装同理，是对HTTP响应报文信息的封装，这里不详细介绍了，直接看代码没问题。

### HttpServer

当看完\`HttpResponse\`和\`HttpRequest\`之后，肯定会疑惑他们之间是怎么建立起联系的？他们又是什么时候调用的？那这时候就需要用到\`HttpServer\`了。\`HttpServer\`是框架的核心，也是接入Muduo网络库的地方。\`HttpServer\`中主要实现的重要的块分别是新连接建立时回调、接收连接数据的消息回调、对业务层提供业务回调接口等功能。下面我逐一为大家介绍。

#### 成员变量

\`\`\`cpp
muduo::net::InetAddress                      listenAddr_; // 监听地址
muduo::net::TcpServer                        server_; 
muduo::net::EventLoop                        mainLoop_; // 主循环
HttpCallback                                 httpCallback_; // 回调函数
Router                                       router_; // 路由
\`\`\`

#### 新连接建立时回调(onConnection)

每次客户端连接服务端之后都会调用这个函数，该函数是通过Muduo网络库中提供的接口注册上的。

\`\`\`cpp
void HttpServer::onConnection(const muduo::net::TcpConnectionPtr &conn)
{
    // 给连接设置一个HttpContext对象用于解析请求报文，提取封装请求信息
    if (conn->connected())
    {
        conn->setContext(HttpContext());
    }
}
\`\`\`

#### 接收连接数据的消息回调（onMessage）

服务端程序在接收到跟服务端建立连接的客户端的数据时，会调用该函数，同样是通过Muduo网络库中提供的接口注册上的。

\`\`\`cpp
void HttpServer::onMessage(const muduo::net::TcpConnectionPtr &conn,
                           muduo::net::Buffer *buf,
                           muduo::Timestamp receiveTime)
{
    try
    {
        // HttpContext对象用于解析出buf中的请求报文，并把报文的关键信息封装到HttpRequest对象中
        HttpContext *context = boost::any_cast<HttpContext>(conn->getMutableContext());
        if (!context->parseRequest(buf, receiveTime)) // 解析一个http请求
        {
            // 如果解析http报文过程中出错
            conn->send("HTTP/1.1 400 Bad Request\\r\\n\\r\\n");
            conn->shutdown();
        }

        // 如果buf缓冲区中解析出一个完整的数据包才封装响应报文
        if (context->gotAll())
        {
            onRequest(conn, context->request());
            context->reset();
        }
    }
    catch (const std::exception &e)
    {
        // 捕获异常，返回错误信息
        LOG_ERROR << "Exception in onMessage: " << e.what();
        conn->send("HTTP/1.1 400 Bad Request\\r\\n\\r\\n");
        conn->shutdown();
    }
}
\`\`\`

#### 当接收到消息回调后调用的处理

\`\`\`cpp
void HttpServer::onRequest(const muduo::net::TcpConnectionPtr &conn, const HttpRequest &req)
{
    const std::string &connection = req.getHeader("Connection");
    bool close = ((connection == "close") ||
                  (req.getVersion() == "HTTP/1.0" && connection != "Keep-Alive"));
    HttpResponse response(close);
    
    // 处理OPTIONS请求
    if (req.method() == HttpRequest::kOptions)
    {
        response.setStatusLine(req.getVersion(), HttpResponse::k200Ok, "OK");
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        response.addHeader("Access-Control-Allow-Headers", "Content-Type");
        response.addHeader("Access-Control-Max-Age", "86400");

        muduo::net::Buffer buf;
        response.appendToBuffer(&buf);
        conn->send(&buf);
        return;
    }

    // 根据请求报文信息来封装响应报文对象
    httpCallback_(req, &response); // 执行onHttpCallback函数

    // 可以给response设置一个成员，判断是否请求的是文件，如果是文件设置为true，并且存在文件位置在这里send出去。
    muduo::net::Buffer buf;
    response.appendToBuffer(&buf);

    conn->send(&buf);

    // 如果是短连接的话，返回响应报文后就断开连接
    if (response.closeConnection())
    {
        conn->shutdown();
    }
}

// 执行请求对应的路由处理函数
void HttpServer::onHttpCallback(const HttpRequest &req, HttpResponse *resp)
{
    if (!router_.route(req, resp))
    {
        std::cout << "请求的啥，url：" << req.method() << " " << req.path() << std::endl;
        std::cout << "未找到路由，返回404" << std::endl;
        resp->setStatusCode(HttpResponse::k404NotFound);
        resp->setStatusMessage("Not Found");
        resp->setCloseConnection(true);
    }
}
\`\`\`

#### 对业务层提供业务回调接口

业务层可以通过这些提供的接口，注册 URI -> 回调函数。大家可能会疑惑为什么有的第二个参数是\`const HttpCallback& cb\`，有的第二个参数是\`Router::HandlerPtr handler\`，这是因为该HTTP框架提供了两种注册回调的方式：一种是直接注册可执行的函数对象，另一种是通过继承\`RouterHandler\`基类，重写相应的执行函数（这里看不懂没事，后面会介绍\`RouterHandler\`）。前者适用于回调函数执行简单的场景，后者适用于回调函数执行更复杂的场景，不过总的来说他们都是注册请求URI对应执行的回调函数。

\`\`\`cpp
    // 注册静态路由处理器
    void Get(const std::string& path, const HttpCallback& cb)
    {
        router_.registerCallback(HttpRequest::kGet, path, cb);
    }
    
    // 注册静态路由处理器
    void Get(const std::string& path, Router::HandlerPtr handler)
    {
        router_.registerHandler(HttpRequest::kGet, path, handler);
    }

    void Post(const std::string& path, const HttpCallback& cb)
    {
        router_.registerCallback(HttpRequest::kPost, path, cb);
    }

    void Post(const std::string& path, Router::HandlerPtr handler)
    {
        router_.registerHandler(HttpRequest::kPost, path, handler);
    }

    // 注册动态路由处理器
    void addRoute(HttpRequest::Method method, const std::string& path, Router::HandlerPtr handler)
    {
        router_.addRegexHandler(method, path, handler);
    }

    // 注册动态路由处理函数
    void addRoute(HttpRequest::Method method, const std::string& path, const Router::HandlerCallback& callback)
    {
        router_.addRegexCallback(method, path, callback);
    }
\`\`\`

###`,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_07",index:7,doc_id:201988009,title:"路由模块",slug:"zppc2xnmk41tp8e3",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/zppc2xnmk41tp8e3",level:1,category:"路由模块",wordCount:1998,updatedAt:"2026-07-18T06:49:46.000Z",hash:"bd52a547c9f0",status:"FULL",tags:["动态路由","std::regex","哈希路由","路径参数提取","Bug排查"],linkedModule:"mod_router",linkedModuleTitle:"动态正则与哈希双层路由模块 (Router)",linkedSourceFiles:["HttpServer/src/router/Router.cpp","HttpServer/include/router/RouterHandler.h"],linkedClasses:["http::router::Router","http::router::RouteKey","http::router::RouterHandler"],linkedFunctions:["Router::registerHandler()","addRegexHandler()","route()","matchRegexRoute()"],interviewKeyPoints:["静态哈希路由与动态正则路由如何高效结合？","【实战Bug】正则回调传参缺陷分析：为什么必须传递 newReq 而非原始 req？"],content:`# 路由模块

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/zppc2xnmk41tp8e3](https://www.yuque.com/chengxuyuancarl/imh9xc/zppc2xnmk41tp8e3)  
> 更新时间: 2026-07-18T06:49:46.000Z | 字数: 1998

---

lake

## 理论部分

参考：

### 1.什么是路由?

在Web开发过程中，经常会遇到『路由』的概念。那么，到底什么是路由？简单来说，路由就是URL到函数的映射。

路由的概念最开始是由后端提出来的，在以前用模板引擎开发页面的时候，是使用路由返回不同的页面，

大致流程可以看成这样：

（1）浏览器发出请求

（2）服务器端监听到80端口或者443有请求过来，并解析url路径

（3）根据服务器的路由配置，返回相应信息（可以是html文件，json数据，也可以是图片）

（4）浏览器根据数据包的\`content-type\`来决定如何解析数据

简单来说路由就是用来跟后端服务器进行交互的一种方式，通过不同的路径来请求不同的资源，请求不同的页面是路由的其中一项功能。

### 2.router 和 route 的区别

route就是一条路由，它将一个URL路径和一个函数进行映射，例如：

\`\`\`cpp
/users        ->  getAllUsers()
/users/count  ->  getUsersCount()
\`\`\`

这就是两条路由，当访问 /users 的时候，会执行 \`getAllUsers()\`函数；当访问 /users/count 的时候，会执行 \`getUsersCount()\` 函数。

而 router 可以理解为一个容器，或者说一种机制，它管理了一组 route。简单来说，route 只是进行了URL和函数的映射，而在当接收到一个URL之后，去路由映射表中查找相应的函数，这个过程是由 router 来处理的。一句话概括就是 "The router routes you to a route"。

### 3.服务端路由

对于服务器来说，当接收到客户端发来的HTTP请求，会根据请求的URL，来找到相应的映射函数，然后执行该函数，并将函数的返回值发送给客户端。对于最简单的静态资源服务器，可以认为，所有URL的映射函数就是一个文件读取操作。对于动态资源，映射函数可能是一个数据库读取操作，也可能是进行一些数据的处理，等等。

以 Express 为例:

\`\`\`javascript
app.get('/', (req, res) => {
  res.sendFile('index')
})

app.get('/users', (req, res) => {
  db.queryAllUsers()
    .then(data => res.send(data))
})
\`\`\`

这里定义了两条路由：

- 当访问 / 的时候，会返回 index 页面
- 当访问 /users 的时候，会从数据库中取出所有用户数据并返回

不仅仅是URL 在 router 匹配 route 的过程中，不仅会根据URL来匹配，还会根据请求的方法来看是否匹配。例如上面的例子，如果通过 POST 方法来访问 /users，就会找不到正确的路由。

​

## 代码实现

### 路由（Router）模块

路由模块是用于管理HTTP请求的路由，根据请求路径和方法将其路由到适当的处理器（回调函数）。该模块主要实现了动态路由和静态路由两种方式，也就是支持精准路径匹配的静态路由和基于正则表达式的动态路由。

#### 静态路由注册

静态路由注册主要是将只有当url中的路径完全匹配注册的路径时，才去执行相应的回调。注册路由本质上就是将把key和value注册到哈希表中（key是请求方法+请求路径），value是请求回调。

\`\`\`cpp
// 路由键（请求方法 + URI）
struct RouteKey
{
    HttpRequest::Method method;
    std::string path;
    bool operator==(const RouteKey &other) const
    {
        return method == other.method && path == other.path;
    }
};
// 为RouteKey 定义哈希函数
struct RouteKeyHash
{
    // size_t operator()(const RouteKey& key) const
    // {
    //     return std::hash<int>{}(static_cast<int>(key.method)) ^
    //            std::hash<std::string>{}(key.path);
    // }
    size_t operator()(const RouteKey &key) const
    {
        size_t methodHash = std::hash<int>{}(static_cast<int>(key.method));
        size_t pathHash = std::hash<std::string>{}(key.path);
        return methodHash * 31 + pathHash;
    }
};
// 注册路由处理器
void registerHandler(HttpRequest::Method method, const std::string &path, HandlerPtr handler);
// 注册回调函数形式的处理器
void registerCallback(HttpRequest::Method method, const std::string &path, const HandlerCallback &callback);

std::unordered_map<RouteKey, HandlerPtr, RouteKeyHash> handlers_;       // 精准匹配
std::unordered_map<RouteKey, HandlerCallback, RouteKeyHash> callbacks_; // 精准匹配
\`\`\`

#### 动态路由注册

注册动态路由，根据正则匹配实现，动态路由的注册，使得查询url相应的回调的时候，即使url中带有路径参数（形如：user/:123）和查询参数(形如：user?userId=1)都不相同也能够正确的匹配到相应的并且是统一的接口。

首先介绍一下对外提供的注册函数\`addRegexHandler\`和\`addRegexCallback\`，这两个函数除了添加进入路由容器的作用还有就是通过正则表达式函数，将路径参数（url中/:后面的参数）转化为统一的\`/([^/]+)\`，比如说原本是\`user/:123\`和\`user/:222\`添加进入路由容器之前需要转化为\`user/([^/]+)\`，这样即使传给服务端的URL路径参数不同，但是他们都能匹配到相同的回调处理器。

\`\`\`cpp
// 注册动态路由处理器
void addRegexHandler(HttpRequest::Method method, const std::string &path, HandlerPtr handler)
{
    std::regex pathRegex = convertToRegex(path);
    regexHandlers_.emplace_back(method, pathRegex, handler);
}
// 注册动态路由处理函数
void addRegexCallback(HttpRequest::Method method, const std::string &path, const HandlerCallback &callback)
{
    std::regex pathRegex = convertToRegex(path);
    regexCallbacks_.emplace_back(method, pathRegex, callback);
}

private:
    std::regex convertToRegex(const std::string &pathPattern)
    { // 将路径模式转换为正则表达式，支持匹配任意路径参数
        std::string regexPattern = "^" + std::regex_replace(pathPattern, std::regex(R"(/:([^/]+))"), R"(/([^/]+))") + "$";
        return std::regex(regexPattern);
    }

    // 提取路径参数
    void extractPathParameters(const std::smatch &match, HttpRequest &request)
    {
        // Assuming the first match is the full path, parameters start from index 1
        for (size_t i = 1; i < match.size(); ++i)
        {
            request.setPathParameters("param" + std::to_string(i), match[i].str());
        }
    }

private:
    struct RouteCallbackObj
    {
        HttpRequest::Method method_;
        std::regex pathRegex_;
        HandlerCallback callback_;
        RouteCallbackObj(HttpRequest::Method method, std::regex pathRegex, const HandlerCallback &callback)
            : method_(method), pathRegex_(pathRegex), callback_(callback) {}
    };

    struct RouteHandlerObj
    {
        HttpRequest::Method method_;
        std::regex pathRegex_;
        HandlerPtr handler_;
        RouteHandlerObj(HttpRequest::Method method, std::regex pathRegex, HandlerPtr handler)
            : method_(method), pathRegex_(pathRegex), handler_(handler) {}
    };

    std::vector<RouteHandlerObj> regexHandlers_;     // 正则匹配
    std::vector<RouteCallbackObj>  regexCallbacks_;   // 正则匹配
\`\`\`

#### 执行路由回调

这个函数调用于当解析完HTTP请求，根据路由的键（请求方法+路径）去查找执行对应的回调处理器（正常情况一次只会查找执行到一次回调处理）。业务层需要将路径、回调处理器这对键值对注册到路由容器中，否则即使执行\`route\`函数也不会找到相应回调，最后返回\`false\`。

\`\`\`cpp
bool Router::route(const HttpRequest &req, HttpResponse *resp)
{
    RouteKey key{req.method(), req.path()};

    // 查找处理器
    auto handlerIt = handlers_.find(key);
    if (handlerIt != handlers_.end())
    {
        handlerIt->second->handle(req, resp);
        return true;
    }

    // 查找回调函数
    auto callbackIt = callbacks_.find(key);
    if (callbackIt != callbacks_.end())
    {
        callbackIt->second(req, resp);
        return true;
    }

    // 查找动态路由处理器
    for (const auto &[method, pathRegex, handler] : regexHandlers_)
    {
        std::smatch match;
        std::string pathStr(req.path());
        // 如果方法匹配并且动态路由匹配，则执行处理器
        if (method == req.method() && std::regex_match(pathStr, match, pathRegex))
        {
            // Extract path parameters and add them to the request
            HttpRequest newReq(req); // 因为这里需要用这一次所以是可以改的
            extractPathParameters(match, newReq);
            
            handler->handle(newReq, resp);
            return true;
        }
    }

    // 查找动态路由回调函数
    for (const auto &[method, pathRegex, callback] : regexCallbacks_)
    {
        std::smatch match;
        std::string pathStr(req.path());
        // 如果方法匹配并且动态路由匹配，则执行回调函数
        if (method == req.method() && std::regex_match(pathStr, match, pathRegex))
        {
             // Extract path parameters and add them to the request
            HttpRequest newReq(req); // 因为这里需要用这一次所以是可以改的
            extractPathParameters(match, newReq);

            callback(req, resp);
            return true;
        }
    }

    return false;
}
\`\`\`

### 路由处理器

这里主要是实现一个抽象类，业务层想要实现某个路由回调的话，可以通过继承这个抽象类并重写他的route函数作为路由回调执行函数。代码如下：

\`\`\`cpp
class RouterHandler 
{
public:
    virtual ~RouterHandler() = default;
    virtual void handle(const HttpRequest& req, HttpResponse* resp) = 0;
};
\`\`\``,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_08",index:8,doc_id:201944564,title:"会话管理模块",slug:"zdui8tc6y3217hob",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/zdui8tc6y3217hob",level:1,category:"会话安全",wordCount:1883,updatedAt:"2026-08-17T02:13:03.000Z",hash:"9ae2b4e6d6eb",status:"FULL",tags:["Session","Cookie","多租户","过期淘汰","互斥锁"],linkedModule:"mod_session",linkedModuleTitle:"会话管理与多租户隔离 (SessionManager)",linkedSourceFiles:["HttpServer/src/session/SessionManager.cpp","HttpServer/src/session/Session.cpp"],linkedClasses:["http::session::SessionManager","http::session::Session","MemorySessionStorage"],linkedFunctions:["createSession()","getSession()","cleanExpiredSessions()"],interviewKeyPoints:["Cookie SESSIONID 的生命周期与过期淘汰机制？","多线程并发访问下 Session 字典的线程安全与锁粒度控制？"],content:`# 会话管理模块

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/zdui8tc6y3217hob](https://www.yuque.com/chengxuyuancarl/imh9xc/zdui8tc6y3217hob)  
> 更新时间: 2026-08-17T02:13:03.000Z | 字数: 1883

---

lake

## 理论部分

部分参考：[https://blog.csdn.net/qq_44627608/article/details/106277191](https://blog.csdn.net/qq_44627608/article/details/106277191)

### 为什么要进行会话管理

- HTTP基于请求/响应模式

- 所有请求都是相互独立的，无连续性的

- HTTP是无连接的协议（短连接）

- 限制每次连接只处理一个请求（短连接）

- HTTP是无状态协议

- 协议对于事务处理没有记忆能力

### 会话管理的产生

- 对于简单的页面浏览或信息获取，HTTP协议即可胜任

- 浏览资讯
- 查看在线图书目录

- 对于需要客户端和服务端多次交互的网络应用，则必须记住客户端的状态

- 网上的购物车
- 用户登录

### 会话管理概念

会话就是一个客户端连续不断地和服务端进行请求/响应的一系列交互，多次请求间建立关联的方式称为会话管理，或会话跟踪

- 会话状态，指服务器与浏览器在会话过程中产生的状态信息

### 会话的实现过程

HTTP没有提供任何记住客户端的途径，服务器如何建立、维护与客户端的会话

![](images/yuque/img_08_01.png)

当服务端接收到客户端的首次请求时，服务器初始化一个会话并分配给该会话一个唯一标识符(sessionId)，在以后的请求中，客户端必须将唯一标识符包含在请求中，服务器根据此表示符将请求与对应的会话联系起来。

### 使用会话的主要场景：

##### 用户认证：

- 登录时创建会话并存储用户信息
- 在需要认证的接口中检查会话状态
- 登出时清除会话

##### 用户状态维护：

- 存储用户偏好设置
- 保存游戏状态
- 维护购物车信息

##### 访问控制：

- 检查用户权限
- 限制访问特定资源
- 实现角色基础的访问控制

通过这种方式，你可以在整个应用程序中维护用户状态，实现用户认证和授权功能。会话管理使得在无状态的 HTTP 协议上实现有状态的用户交互成为可能。

​

## 代码解析

代码参考：

该会话管理系统旨在处理Web应用程序中的用户会话。它提供创建、管理和销毁会话的功能，并存储会话数据。系统由几个关键组件组成：

- Session（会话）：表示一个用户会话。
- SessionManager（会话管理器）：管理会话的生命周期。
- SessionStorage（会话存储）：会话存储实现的抽象类。
- MemorySessionStorage（内存会话存储）：SessionStorage的内存实现。

### Session（会话）

Session类表示一个用户会话。它保存会话数据并管理会话过期。

- 构造函数：使用唯一ID、SessionManager的引用和可选的过期时间（默认1小时）初始化会话。
- getId()：返回会话ID。
- isExpired()：检查会话是否已过期。
- refresh()：重置会话的过期时间。
- setValue()：在会话数据中存储键值对。
- getValue()：从会话数据中按键检索值。
- remove()：从会话数据中移除键值对。
- clear()：清空所有会话数据。

### SessionManager（会话管理器）

SessionManager类负责创建、检索和销毁会话。它还处理会话存储。

- 构造函数：使用SessionStorage实现和用于会话ID创建的随机数生成器初始化会话管理器。
- getSession()：从请求中检索现有会话或创建新会话。
- destroySession()：从存储中移除会话。
- cleanExpiredSessions()：用于清理过期会话（实现依赖于存储类型）。
- updateSession()：将会话保存到存储中。
- generateSessionId()：生成唯一的会话ID。
- getSessionIdFromCookie()：从请求的Cookie中提取会话ID。
- setSessionCookie()：在响应中设置会话ID作为Cookie。

### SessionStorage（会话存储）

定义会话存储接口的抽象类。

- save()：保存会话。
- load()：通过ID加载会话。
- remove()：通过ID移除会话。

### MemorySessionStorage（内存会话存储）

SessionStorage的内存实现。

- save()：在内存中存储会话。
- load()：从内存中检索会话，并检查是否过期。
- remove()：从内存中删除会话。

### 设计原理

- 关注点分离：系统将会话管理（\`SessionManager\`）与会话存储（\`SessionStorage\`）分开。这允许存储实现的灵活性（例如，内存、数据库，会话数据可以存在内存中也可以存在数据库中）。
- 自动过期：会话根据可配置的超时时间自动过期，通过限制会话寿命增强安全性。
- 自动持久化：如果关联了\`SessionManager\`，会话数据的更改会自动保存，确保数据一致性。
- 随机会话ID：会话ID使用随机数生成器生成，以确保唯一性和安全性。

### 会话使用案例

在 HTTP 框架中使用会话管理，主要在路由处理器（\`Handler\`）中使用。我将通过几个在项目中的具体例子来说明如何使用会话管理功能。

#### 1. 在 HttpServer 类中添加 SessionManager

首先，需要在 HttpServer 类中添加 \`SessionManager\`：

\`\`\`cpp
class HttpServer {
public:
    // ... 其他代码 ...
    void setSessionManager(std::unique_ptr<SessionManager> sessionManager) {
        sessionManager_ = std::move(sessionManager);
    }

    SessionManager* getSessionManager() { return sessionManager_.get(); }

private:
    std::unique_ptr<SessionManager> sessionManager_;
    // ... 其他成员 ...
};
\`\`\`

#### 2. 在处理器中使用会话

以登录处理器为例，展示如何使用会话：

\`\`\`cpp
#include "../include/handlers/LoginHandler.h"

void LoginHandler::handle(const HttpRequest& req, HttpResponse* resp) {
    try {
        // 解析请求体
        json request = json::parse(req.getBody());
        std::string username = request["username"].get<std::string>();
        std::string password = request["password"].get<std::string>();

        // 验证用户
        int userId = server_->queryUserId(username, password);
        if (userId != -1) {
            // 获取会话
            auto session = server_->getSessionManager()->getSession(req, resp);
            
            // 在会话中存储用户信息
            session->setValue("userId", std::to_string(userId));
            session->setValue("username", username);
            session->setValue("isLoggedIn", "true");

            // 返回成功响应
            json successResp;
            successResp["status"] = "ok";
            successResp["message"] = "login successful";
            successResp["userId"] = userId;
            std::string successBody = successResp.dump(4);
            
            server_->packageResp(req.getVersion(), HttpResponse::k200Ok, "OK", 
                               false, "application/json", successBody.size(), 
                               successBody, resp);
        } else {
            // ... 处理登录失败 ...
        }
    } catch (const std::exception& e) {
        // ... 错误处理 ...
    }
}
\`\`\`

#### 3. 创建需要身份验证的处理器

\`\`\`cpp
class GameHandler : public RouterHandler {
public:
    void handle(const HttpRequest& req, HttpResponse* resp) override {
        // 检查用户是否已登录
        auto session = server_->getSessionManager()->getSession(req, resp);
        
        if (session->getValue("isLoggedIn") != "true") {
            // 用户未登录，返回未授权错误
            json errorResp;
            errorResp["status"] = "error";
            errorResp["message"] = "Unauthorized";
            std::string errorBody = errorResp.dump(4);
            
            server_->packageResp(req.getVersion(), HttpResponse::k401Unauthorized,
                               "Unauthorized", false, "application/json",
                               errorBody.size(), errorBody, resp);
            return;
        }

        // 获取用户信息
        std::string userId = session->getValue("userId");
        std::string username = session->getValue("username");

        // 处理游戏逻辑
        // ...
    }
};
\`\`\`

#### 4. 登出处理器示例

\`\`\`cpp
void LogoutHandler::handle(const HttpRequest& req, HttpResponse* resp) {
    // 获取会话
    auto session = server_->getSessionManager()->getSession(req, resp);
    
    // 清除会话数据
    session->clear();
    
    // 销毁会话
    server_->getSessionManager()->destroySession(session->getId());

    // 返回成功响应
    json successResp;
    successResp["status"] = "ok";
    successResp["message"] = "logout successful";
    std::string successBody = successResp.dump(4);
    
    server_->packageResp(req.getVersion(), HttpResponse::k200Ok, "OK",
                        false, "application/json", successBody.size(),
                        successBody, resp);
}
\`\`\`

#### 5. 在服务器初始化时设置会话管理器

\`\`\`cpp
void GomokuServer::initialize() {
    // 创建会话存储
    auto sessionStorage = std::make_unique<MemorySessionStorage>();
    
    // 创建会话管理器
    auto sessionManager = std::make_unique<SessionManager>(std::move(sessionStorage));
    
    // 设置会话管理器
    setSessionManager(std::move(sessionManager));

    // 初始化路由
    initializeRouter();
}
\`\`\``,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_09",index:9,doc_id:201992724,title:"中间件模块",slug:"uykqx710gggbu767",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/uykqx710gggbu767",level:1,category:"中间件",wordCount:1777,updatedAt:"2026-08-08T02:07:31.000Z",hash:"2ad0a651e4ec",status:"FULL",tags:["责任链","洋葱模型","CORS跨域","OPTIONS预检"],linkedModule:"mod_middleware",linkedModuleTitle:"洋葱模型中间件链与跨域处理 (MiddlewareChain)",linkedSourceFiles:["HttpServer/src/middleware/MiddlewareChain.cpp","HttpServer/src/middleware/cors/CorsMiddleware.cpp"],linkedClasses:["http::middleware::Middleware","http::middleware::MiddlewareChain","CorsMiddleware"],linkedFunctions:["addMiddleware()","executePre()","executePost()","handleCors()"],interviewKeyPoints:["洋葱模型在 C++ 中如何优雅实现？","CORS 预检请求 (OPTIONS) 处理流程及必要的响应头配置？"],content:`# 中间件模块

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/uykqx710gggbu767](https://www.yuque.com/chengxuyuancarl/imh9xc/uykqx710gggbu767)  
> 更新时间: 2026-08-08T02:07:31.000Z | 字数: 1777

---

lake

## 理论部分

### 一、什么是http中间件

HTTP 中间件是一种处理 HTTP 请求和响应的函数或组件，它在客户端请求到达服务器处理逻辑之前、或者服务器响应返回客户端之前执行。中间件通过提供一种模块化的方式来添加功能，使得 HTTP 服务器的架构更加灵活和可扩展。常用的应用场景有：

1. 客户端身份校验
2. 用户鉴权
3. 客户端对服务器提供的特定服务是否有访问权限
4. 验证用户 session，并保持通信存活
5. 客户端请求参数解密
6. 客户端参数格式化
7. 日志记录器，用于记录每个 REST API 访问请求
8. 跨域配置
9. 返回数据格式化
10. Header设置

### 为什么叫 "中间件"？

"中间件" 一词表明它在客户端与服务器之间起着中间处理的作用。客户端发送请求时，请求流过多个中间件处理函数，最终到达实际的路由处理逻辑；服务器生成响应时，响应也会经过中间件处理后再返回给客户端。它们处于数据流的 "中间"，因此得名。

![](images/yuque/img_09_01.png)

### 中间件的作用

- **请求预处理**：解析请求体、处理认证和授权。
- **响应格式化**：修改或格式化服务器的响应数据。
- **日志记录**：记录请求和响应的信息以便于调试和监控。
- **错误处理**：捕获并处理服务器运行中的异常。

### 常见的 HTTP 中间件例子

#### 1. Express.js（Node.js 中的 HTTP 框架）

- **body-parser**: 解析 JSON、URL 编码和其他格式的请求体。
- **morgan**: 记录 HTTP 请求的日志。
- **cors**: 处理跨域资源共享（CORS）问题。

#### 2. Django（Python Web 框架）

- **AuthenticationMiddleware**: 处理用户认证。
- **CsrfViewMiddleware**: 提供 CSRF 保护。
- **GZipMiddleware**: 对响应进行 GZip 压缩。

#### 3. ASP.NET Core

- **Routing Middleware**: 控制请求的路由。
- **Authentication Middleware**: 验证用户身份。
- **Static File Middleware**: 提供对静态文件的访问。

### 中间件的实现原理

中间件通常实现一个特定的接口，用来接收请求、响应对象以及一个 \`next\` 回调函数。

示例（基于 Express.js）：

\`\`\`javascript
function myMiddleware(req, res, next) {
  console.log('处理中间件逻辑');
  next(); // 调用 next() 以将控制权交给下一个中间件
}
\`\`\`

每个中间件可以选择处理请求、修改请求或响应，甚至终止请求-响应循环，而无需调用 \`next()\`。

### 中间件的优势

- **模块化**：可以将复杂的功能拆分为多个独立的中间件。
- **复用性**：通用功能（如身份验证、日志记录）可以作为独立的中间件在多个项目中复用。
- **可扩展性**：易于向应用程序添加新功能。

## 结论

HTTP 中间件是现代 Web 应用程序中不可或缺的组成部分，它简化了请求处理链条，使得 Web 服务器具备更好的扩展能力和模块化设计。通过中间件，开发者能够更加灵活地控制应用的行为和特性。

## 代码实现

这里以跨域中间件为例来介绍中间件的完整实现流程。这里先介绍跨域中间件的相关知识

#### 什么是跨域？跨域中间件的作用是什么？

跨域就是当前主机访问的服务器不在本地而是去访问别域名的服务器。跨域中间件的作用就是给服务器设置，哪些域名的客户端可以访问服务器（一般是*也就是所有客户端都可以访问）、哪些方法可以跨域请求、包含什么样的头文件可以跨域

#### 1.中间件基类接口 (Middleware.h)

\`\`\`cpp
class Middleware {
public:
    virtual ~Middleware() = default;
    
    // 请求前处理
    virtual void before(HttpRequest& request) = 0;
    
    // 响应后处理
    virtual void after(HttpResponse& response) = 0;
    
    // 设置下一个中间件
    void setNext(std::shared_ptr<Middleware> next) {
        nextMiddleware = next;
    }

protected:
    std::shared_ptr<Middleware> nextMiddleware;
};
\`\`\`

#### 2. 中间件链管理 (MiddlewareChain.h)

\`\`\`cpp
class MiddlewareChain {
public:
    void addMiddleware(std::shared_ptr<Middleware> middleware);
    void processBefore(HttpRequest& request);
    void processAfter(HttpResponse& response);

private:
    std::vector<std::shared_ptr<Middleware>> middlewares;
};
\`\`\`

#### 3. CORS配置类 (CorsConfig.h)

\`\`\`cpp
struct CorsConfig {
    std::vector<std::string> allowedOrigins;
    std::vector<std::string> allowedMethods;
    std::vector<std::string> allowedHeaders;
    bool allowCredentials = false;
    int maxAge = 3600;
    
    static CorsConfig defaultConfig() {
        CorsConfig config;
        config.allowedOrigins = {"*"};
        config.allowedMethods = {"GET", "POST", "PUT", "DELETE", "OPTIONS"};
        config.allowedHeaders = {"Content-Type", "Authorization"};
        return config;
    }
};
\`\`\`

#### 4. CORS中间件实现 (CorsMiddleware.h)

\`\`\`cpp
class CorsMiddleware : public Middleware 
{
public:
    explicit CorsMiddleware(const CorsConfig& config = CorsConfig::defaultConfig());
    
    void before(HttpRequest& request) override;
    void after(HttpResponse& response) override;

    std::string join(const std::vector<std::string>& strings, const std::string& delimiter);

private:
    CorsConfig config_;
    const HttpRequest* request_; // 添加请求引用成员
    
    bool isOriginAllowed(const std::string& origin) const;
    void handlePreflightRequest(const HttpRequest& request, HttpResponse& response);
    void addCorsHeaders(HttpResponse& response, const std::string& origin);
};
\`\`\`

#### 5. CORS中间件实现 (CorsMiddleware.cpp)

\`\`\`cpp
CorsMiddleware::CorsMiddleware(const CorsConfig& config) : config_(config) {}

void CorsMiddleware::before(HttpRequest& request) {
    request_ = &request;
    if (request.method() == HttpRequest::Method::kOptions) {
        HttpResponse response;
        handlePreflightRequest(request, response);
        throw response; // 抛出响应（CORS预检请求），告诉HttpServer不需要再处理请求
    }
}

void CorsMiddleware::after(HttpResponse& response) {
    const std::string& origin = request_->getHeader("Origin");
    if (!origin.empty() && isOriginAllowed(origin)) {
        addCorsHeaders(response, origin);
    }
}

bool CorsMiddleware::isOriginAllowed(const std::string& origin) const {
    if (config_.allowedOrigins.empty() || 
        std::find(config_.allowedOrigins.begin(), config_.allowedOrigins.end(), "*") != config_.allowedOrigins.end()) {
        return true;
    }
    return std::find(config_.allowedOrigins.begin(), config_.allowedOrigins.end(), origin) != config_.allowedOrigins.end();
}

void CorsMiddleware::handlePreflightRequest(const HttpRequest& request, HttpResponse& response) {
    const std::string& origin = request.getHeader("Origin");
    if (!isOriginAllowed(origin)) 
    {   // 如果请求源不允许，返回403 Forbidden
        response.setStatusCode(HttpResponse::k403Forbidden);
        return;
    }

    addCorsHeaders(response, origin);
    response.setStatusCode(HttpResponse::k204NoContent);
}

void CorsMiddleware::addCorsHeaders(HttpResponse& response, const std::string& origin) {
    // 设置允许的源
    response.addHeader("Access-Control-Allow-Origin", origin);
    
    // 设置允许的凭证
    if (config_.allowCredentials) {
        response.addHeader("Access-Control-Allow-Credentials", "true");
    }
    
    // 设置允许的方法
    if (!config_.allowedMethods.empty()) {
        std::ostringstream methods;
        for (size_t i = 0; i < config_.allowedMethods.size(); ++i) {
            if (i > 0) methods << ", ";
            methods << config_.allowedMethods[i];
        }
        response.addHeader("Access-Control-Allow-Methods", methods.str());
    }
    
    // 设置允许的头部
    if (!config_.allowedHeaders.empty()) {
        std::ostringstream headers;
        for (size_t i = 0; i < config_.allowedHeaders.size(); ++i) {
            if (i > 0) headers << ", ";
            headers << config_.allowedHeaders[i];
        }
        response.addHeader("Access-Control-Allow-Headers", headers.str());
    }
    
    // 设置预检请求的有效期
    response.addHeader("Access-Control-Max-Age", std::to_string(config_.maxAge));
}

// 工具函数：将字符串数组连接成单个字符串
std::string CorsMiddleware::join(const std::vector<std::string>& strings, const std::string& delimiter) {
    std::ostringstream result;
    for (size_t i = 0; i < strings.size(); ++i) {
        if (i > 0) result << delimiter;
        result << strings[i];
    }
    return result.str();
}
\`\`\`

#### 项目中如何在项目中使用跨域中间件？

1.修改 HttpServer.h

\`\`\`cpp
#include "middleware/MiddlewareChain.h"
#include "middleware/cors/CorsMiddleware.h"

class HttpServer {
private:
    middleware::MiddlewareChain middlewareChain_;
    
public:
    // 添加中间件的方法
    void addMiddleware(std::shared_ptr<middleware::Middleware> middleware) {
        middlewareChain_.addMiddleware(middleware);
    }
    
    // 其他现有代码...
};
\`\`\`

2.在 HttpServer 的请求处理流程中使用中间件

\`\`\`cpp
void HttpServer::handleRequest(HttpRequest& request, HttpResponse& response) {
    try {
        // 处理请求前的中间件
        middlewareChain_.processBefore(request);
        
        // 原有的路由处理逻辑
        // ...
        
        // 处理响应后的中间件
        middlewareChain_.processAfter(response);
    }
    catch (const HttpResponse& res) {
        // 处理中间件抛出的响应（如CORS预检请求）
        response = res;
    }
    catch (const std::exception& e) {
        // 错误处理
        response.setStatus(HttpResponse::k500InternalServerError);
        response.setBody(e.what());
    }
}
\`\`\`

3.使用示例

\`\`\`cpp
int main() {
    HttpServer server;
    
    // 创建CORS配置
    http::middleware::CorsConfig corsConfig;
    corsConfig.allowedOrigins = {"http://localhost:3000"};
    corsConfig.allowedMethods = {"GET", "POST", "PUT", "DELETE", "OPTIONS"};
    corsConfig.allowedHeaders = {"Content-Type", "Authorization"};
    corsConfig.allowCredentials = true;
    corsConfig.maxAge = 3600;
    
    // 添加CORS中间件
    auto corsMiddleware = std::make_shared<http::middleware::CorsMiddleware>(corsConfig);
    server.addMiddleware(corsMiddleware);
    
    // 添加路由
    server.get("/api/users", [](HttpRequest& req, HttpResponse& res) {
        // 处理请求...
    });
    
    server.start(8080);
    return 0;
}
\`\`\``,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_10",index:10,doc_id:202406967,title:"集成数据库连接池模块",slug:"uu8ekvcsivhcrbgo",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/uu8ekvcsivhcrbgo",level:1,category:"数据库",wordCount:2963,updatedAt:"2026-03-17T09:08:41.000Z",hash:"8f451574887e",status:"FULL",tags:["MySQL连接池","RAII","心跳保活","条件变量","事务"],linkedModule:"mod_db_pool",linkedModuleTitle:"MySQL 连接池与数据库访问封装",linkedSourceFiles:["HttpServer/src/utils/db/DbConnectionPool.cpp","HttpServer/src/utils/MysqlUtil.cpp"],linkedClasses:["http::db::DbConnectionPool","http::db::DbConnection","http::MysqlUtil"],linkedFunctions:["getConnection()","releaseConnection()","query()","executeUpdate()"],interviewKeyPoints:["如何设计一个支持连接复用与生命周期管理的 MySQL 连接池？","RAII 思想在数据库连接自动借还与异常安全中的应用？","如何检测 MySQL 连接断开并实现自动保活探活？"],content:`# 集成数据库连接池模块

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/uu8ekvcsivhcrbgo](https://www.yuque.com/chengxuyuancarl/imh9xc/uu8ekvcsivhcrbgo)  
> 更新时间: 2026-03-17T09:08:41.000Z | 字数: 2963

---

lake

## 理论介绍、

引用文章链接：[https://blog.csdn.net/CrankZ/article/details/82874158](https://blog.csdn.net/CrankZ/article/details/82874158)

### 如何提高MYSQL(基于C/S设计)数据库的访问瓶颈?

1. 数据库就可以看成是一个磁盘，将数据都存储在磁盘上，当有热点数据时，我们就需要在磁盘上频繁的进行I/O操作，为了避免磁盘频繁的I/O，我们可以在服务器添加缓存服务器缓存常用数据(redis或者memory cache他们存储数据的方式通常是键值对，而mysql存储数据的方式是二维表).
2. 服务器应用与数据库之间的关系是客户端与服务器之间的关系，还可以增加连接池，来提高MYSQL Server的访问效率，再高并发情况下，大量的tcp三次握手，MYSQL Server连接认证，MYSQL Server关闭连接回收资源和TCP四次回收所耗费的性能时间也是非常明显的，增加连接池就是为了减少这一部分性能的损耗

### 什么是连接池

数据库连接池负责分配、管理和释放数据库连接，它允许应用程序重复使用一个现有的数据库连接，而不是再重新建立一个。

### 为什么要使用连接池

数据库连接是一种关键的有限的昂贵的资源，这一点在多用户的网页应用程序中体现得尤为突出。  一个数据库连接对象均对应一个物理数据库连接，每次操作都打开一个物理连接，使用完都关闭连接，这样造成系统的 性能低下。

数据库连接池的解决方案是在应用程序启动时建立足够的数据库连接，并将这些连接组成一个连接池(简单说：在一个“池”里放了好一定数量的已经建立完成的连接，是现成可直接使用的连接)，由应用程序动态地对池中的连接进行从向池中申请、使用和使用完后放回池中。对于多于连接池中连接数的并发请求，应该在请求队列中排队等待。并且应用程序可以根据池中连接的使用率，动态增加或减少池中的连接数。 连接池技术尽可能多地重用了消耗内存地资源，大大节省了内存，提高了服务器地服务效率，能够支持更多的客户服务。通过使用连接池，将大大提高程序运行效率，同时，我们可以通过其自身的管理机制来监视数据库连接的数量、使用情况等。

### 传统的连接机制与数据库连接池的运行机制区别

下面以访问MySQL为例，执行一个SQL命令，需要经过哪些流程。

![](images/yuque/img_10_01.png)

执行一条SQL语句的完整流程就是：

1. TCP三次握手建立连接
2. MYSQL连接认证并分配相应资源
3. 执行SQL语句
4. MYSQL连接关闭并回收相应资源
5. TCP的四次回收关闭连接

#### 是否使用连接池的区别

不使用连接池：不使用连接池的话那么我们每次使用连接执行sql语句都会面临上面的执行过程。可以看到为了执行一条SQL语句，需要进行繁琐的建立连接和释放连接的过程，在高并发的执行sql语句的情况下，执行效率一定会大大降低，响应速度也会随之变得迟钝。

使用连接池：使用连接池的话，只会在程序启动连接池初始化的时候将执行连接建立的操作，在程序退出的时候执行连接销毁的操作。在程序运行的过程中需要执行数据库操作时，可以直接从连接池中取出现成的连接使用，使用完毕(执行完sql语句)后再将连接放回连接池即可。

#### 使用连接池后的优点

1. 较少了网络开销
2. 系统的性能会有一个实质的提升
3. 没了麻烦的TIME_WAIT状态

​

### 数据库连接池的工作原理

连接池的工作原理主要由三部分组成，分别为

- 连接池的建立
- 连接池中连接的使用管理
- 连接池的关闭

第一、连接池的建立。一般在系统初始化时，连接池会根据系统配置建立，并在池中创建了几个连接对象，以便使用时能从连接池中获取。连接池中的连接不能随意创建和关闭，这样避免了连接随意建立和关闭造成的系统开销。C++中提供了很多容器类可以方便的构建连接池，例如vector、queue等。

第二、连接池的管理。连接池管理策略是连接池机制的核心，连接池内连接的分配和释放对系统的性能有很大的影响。其管理策略是：

当客户请求数据库连接时，首先查看连接池中是否有空闲连接，如果存在空闲连接，则将连接分配给客户使用；如果没有空闲连接，则查看当前所开的连接数是否已经达到最大连接数，如果没达到就重新创建一个连接给请求的客户；如果达到就按设定的最大等待时间进行等待，如果超出最大等待时间，则抛出异常给客户。

当用户使用连接完毕之后，就将连接重新放回数据库连接池容器之中。

该策略保证了数据库连接的有效复用，避免频繁的建立、释放连接所带来的系统资源开销。

第三、连接池的关闭。当应用程序退出时，关闭连接池中所有的连接，释放连接池相关的资源，该过程正好与创建相反。

## 代码实现

### 基础架构设计

该项目连接池主要包含三个核心类：

- DbConnection: 管理单个数据库连接
- DbConnectionPool: 管理连接池
- MysqlUtil: 提供便捷的数据库操作接口

#### DbConnection

DbConnection 类负责管理与 MySQL 数据库的单个连接。它提供了执行查询、更新、连接检查和重连等功能。通过使用 C++ 的 RAII（资源获取即初始化）和智能指针，确保资源的安全管理和异常处理。

##### 类定义

\`\`\`cpp
class DbConnection {
public:
    DbConnection(const std::string& host,
                const std::string& user,
                const std::string& password,
                const std::string& database);
    
    template<typename... Args>
    sql::ResultSet* executeQuery(const std::string& sql, Args&&... args);
    
    template<typename... Args>
    int executeUpdate(const std::string& sql, Args&&... args);
    
    bool ping();
    void reconnect();
    void cleanup();

private:
    std::shared_ptr<sql::Connection> conn_;
    std::mutex mutex_;
    std::string host_;
    std::string user_;
    std::string password_;
    std::string database_;
    
    void bindParams(sql::PreparedStatement*, int);
    
    template<typename T, typename... Args>
    void bindParams(sql::PreparedStatement* stmt, int index, 
                   T&& value, Args&&... args);
};
\`\`\`

下面我将介绍一下该类的关键功能

##### 构造函数

功能：初始化数据库连接。

\`\`\`cpp
DbConnection::DbConnection(const std::string& host,
                           const std::string& user,
                           const std::string& password,
                           const std::string& database)
    : host_(host), user_(user), password_(password), database_(database) {
    try {
        sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();
        conn_.reset(driver->connect(host_, user_, password_));
        conn_->setSchema(database_);
    } catch (const sql::SQLException& e) {
        throw DbException(e.what());
    }
}
\`\`\`

##### 执行查询

功能：执行SQL查询并返回结果集

线程安全: 使用 std::lock_guard 保护共享资源。

预编译和执行SQL查询： 使用 \`PreparedStatement\` 代替拼接 SQL 字符串，提供了动态参数绑定的能力，从而实现灵活的查询和防止 SQL 注入攻击。

安全高效的参数绑定：\`bindParams\` 使用 \`std::forward\` 保留参数类型，避免不必要的拷贝，提高了效率。预编译语句也能加快重复执行相同语句的速度。

\`\`\`cpp
template<typename... Args>
sql::ResultSet* DbConnection::executeQuery(const std::string& sql, Args&&... args) {
    std::lock_guard<std::mutex> lock(mutex_);
    try {
        std::unique_ptr<sql::PreparedStatement> stmt(
            conn_->prepareStatement(sql)
        );
        bindParams(stmt.get(), 1, std::forward<Args>(args)...);
        return stmt->executeQuery();
    } catch (const sql::SQLException& e) {
        throw DbException(e.what());
    }
}
\`\`\`

##### 执行更新

功能: 执行 SQL 更新操作。

返回值: 返回受影响的行数。

\`\`\`cpp
template<typename... Args>
int DbConnection::executeUpdate(const std::string& sql, Args&&... args) {
    std::lock_guard<std::mutex> lock(mutex_);
    try {
        std::unique_ptr<sql::PreparedStatement> stmt(
            conn_->prepareStatement(sql)
        );
        bindParams(stmt.get(), 1, std::forward<Args>(args)...);
        return stmt->executeUpdate();
    } catch (const sql::SQLException& e) {
        throw DbException(e.what());
    }
}
\`\`\`

##### 连接检查

功能: 检查连接是否有效。

返回值: 返回 true 表示连接有效。

这里ping是为了让连接池的连接保持活性，如果发现连接池中的连接断开了需要及时reconnect()进行重连

\`\`\`cpp
bool DbConnection::ping() {
    try {
        std::unique_ptr<sql::Statement> stmt(conn_->createStatement());
        stmt->execute("SELECT 1");
        return true;
    } catch (const sql::SQLException& e) {
        return false;
    }
}
\`\`\`

##### 重新连接

功能: 重新建立数据库连接。

\`\`\`cpp
void DbConnection::reconnect() {
    std::lock_guard<std::mutex> lock(mutex_);
    try {
        if (conn_) {
            conn_->reconnect();
        } else {
            sql::mysql::MySQL_Driver* driver = sql::mysql::get_mysql_driver_instance();
            conn_.reset(driver->connect(host_, user_, password_));
            conn_->setSchema(database_);
        }
    } catch (const sql::SQLException& e) {
        throw DbException(e.what());
    }
}
\`\`\`

#### DbConnectionPool

DbConnectionPool 是一个用于管理数据库连接的类，旨在提高数据库访问的效率和性能。通过复用连接，减少了频繁创建和销毁连接的开销。

核心功能如下：

##### 单例模式

连接池采用单例模式，确保全局只有一个连接池实例。

\`\`\`cpp
class DbConnectionPool {
public:
    static DbConnectionPool& getInstance() {
        static DbConnectionPool instance;
        return instance;
    }
    // ...
};
\`\`\`

##### 获取连接

getConnection 方法从连接池中获取一个可用的数据库连接。如果没有可用连接，则会等待。如果获取连接前未初始化会抛出异常。

获取到连接之后需要判断连接是否有效，如果失效则进行重连。

注意这里返回的智能指针的第二个参数是一个lambada表达式，代表重写std::shared_ptr的析构函数（也就是重写智能指针的删除器函数）

\`\`\`cpp
std::shared_ptr<DbConnection> getConnection() {
    std::unique_lock<std::mutex> lock(mutex_);
    
    while (connections_.empty()) {
        if (!initialized_) {
            throw DbException("Connection pool not initialized");
        }
        cv_.wait(lock);
    }
    
    auto conn = connections_.front();
    connections_.pop();
    
    lock.unlock();
    
    try {
        if (!conn->ping()) {
            conn->reconnect();
        }
        
        return std::shared_ptr<DbConnection>(conn.get(), 
            [this, conn](DbConnection*) {
                std::lock_guard<std::mutex> lock(mutex_);
                connections_.push(conn);
                cv_.notify_one();
            });
            
    } catch (const std::exception& e) {
        connections_.push(conn);
        cv_.notify_one();
        throw;
    }
}
\`\`\`

##### 连接检查

checkConnections 方法定期检查连接池中的连接是否有效，并尝试重连失效的连接（由连接池初始化时连接池新开一个线程来执行）。

\`\`\`cpp
void checkConnections() {
    while (true) {
        try {
            std::vector<std::shared_ptr<DbConnection>> connsToCheck;
            {
                std::unique_lock<std::mutex> lock(mutex_);
                if (connections_.empty()) {
                    std::this_thread::sleep_for(std::chrono::seconds(1));
                    continue;
                }
                
                auto temp = connections_;
                while (!temp.empty()) {
                    connsToCheck.push_back(temp.front());
                    temp.pop();
                }
            }
            
            for (auto& conn : connsToCheck) {
                if (!conn->ping()) {
                    try {
                        conn->reconnect();
                    } catch (const std::exception& e) {
                        LOG_ERROR << "Failed to reconnect: " << e.what();
                    }
                }
            }
            
            std::this_thread::sleep_for(std::chrono::seconds(60));
        } catch (const std::exception& e) {
            LOG_ERROR << "Error in check thread: " << e.what();
            std::this_thread::sleep_for(std::chrono::seconds(5));
        }
    }
}
\`\`\`

#### MysqlUtil

MysqlUtil 是一个便捷的工具类，提供了对数据库的简单接口，隐藏了底层连接池的复杂性。它通过静态方法提供数据库的初始化、查询和更新操作，适合在应用程序中快速集成和使用。

主要是实现了三个方法，一个就是数据库连接池的初始化，其次就是从连接池中获取连接执行查询操作和执行（增删改）操作。主要作用就是为了简化接口，让业务层能够更轻松地使用连接池进行增删改查的工作。

\`\`\`cpp
class MysqlUtil
{
public:
    static void init(const std::string& host, const std::string& user,
                    const std::string& password, const std::string& database,
                    size_t poolSize = 10)
    {
        http::db::DbConnectionPool::getInstance().init(
            host, user, password, database, poolSize);
    }

    template<typename... Args>
    sql::ResultSet* executeQuery(const std::string& sql, Args&&... args)
    {
        auto conn = http::db::DbConnectionPool::getInstance().getConnection();
        return conn->executeQuery(sql, std::forward<Args>(args)...);
    }

    template<typename... Args>
    int executeUpdate(const std::string& sql, Args&&... args)
    {
        auto conn = http::db::DbConnectionPool::getInstance().getConnection();
        return conn->executeUpdate(sql, std::forward<Args>(args)...);
    }
};
\`\`\``,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_11",index:11,doc_id:202562077,title:"HTTPS模块",slug:"ex4pw2l4dmkvkmgl",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/ex4pw2l4dmkvkmgl",level:1,category:"网络安全",wordCount:5778,updatedAt:"2026-06-18T10:32:08.000Z",hash:"4bfc7611b797",status:"FULL",tags:["HTTPS","OpenSSL","TLS握手","非阻塞SSL","双向加解密"],linkedModule:"mod_ssl",linkedModuleTitle:"HTTPS / TLS 加密传输层封装",linkedSourceFiles:["HttpServer/src/ssl/SslContext.cpp","HttpServer/src/ssl/SslConnection.cpp"],linkedClasses:["http::ssl::SslContext","http::ssl::SslConnection"],linkedFunctions:["initOpenSsl()","handshake()","read()","write()"],interviewKeyPoints:["HTTPS 握手完整流程？非对称加密与对称加密结合的时机？","在非阻塞 Reactor 架构下处理 SSL_ERROR_WANT_READ / WANT_WRITE 的关键技术细节？"],content:`# HTTPS模块

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/ex4pw2l4dmkvkmgl](https://www.yuque.com/chengxuyuancarl/imh9xc/ex4pw2l4dmkvkmgl)  
> 更新时间: 2026-06-18T10:32:08.000Z | 字数: 5778

---

lake

**提示：【本模块有一些bug，大家可以先直接跳过】**

参考文章：

[https://zhuanlan.zhihu.com/p/631089816](https://zhuanlan.zhihu.com/p/631089816)

[https://www.runoob.com/w3cnote/http-vs-https.html](https://www.runoob.com/w3cnote/http-vs-https.html)

# 理论部分

## 概述

为实现Web浏览器和网站服务器之间的信息传递，我们一般会采用[HTTP协议](https://zhida.zhihu.com/search?content_id=228373455&content_type=Article&match_order=1&q=HTTP%E5%8D%8F%E8%AE%AE&zhida_source=entity)进行通信。不过需要注意的是，HTTP以明文方式发送内容且没有提供任何形式的数据加密功能，在涉及敏感信息（如信用卡号、密码等支付相关内容）时存在安全隐患。因此，我们应该使用另一种更为安全可靠的协议：HTTPS。HTTPS在HTTP基础上引入了SSL协议，并通过证书验证服务器身份以确保通信过程中数据得到合理保护和加密处理。

## **HTTP和HTTPS的基本概念**

HTTP是一种广泛使用的[网络协议](https://zhida.zhihu.com/search?content_id=228373455&content_type=Article&match_order=1&q=%E7%BD%91%E7%BB%9C%E5%8D%8F%E8%AE%AE&zhida_source=entity)，用于浏览器和服务器之间的请求和应答。它基于TCP协议，用于从WWW服务器传输超文本到本地浏览器。HTTP可以提高浏览器效率，减少网络传输。

HTTPS旨在提供一个安全、可靠的[HTTP通道](https://zhida.zhihu.com/search?content_id=228373455&content_type=Article&match_order=1&q=HTTP%E9%80%9A%E9%81%93&zhida_source=entity)。简而言之，它是对HTTP进行加密保护后的版本，在其基础上添加了[SSL层](https://zhida.zhihu.com/search?content_id=228373455&content_type=Article&match_order=1&q=SSL%E5%B1%82&zhida_source=entity)以实现更高级别的安全性保障。HTTPS所采用加密技术基于SSL来实现。

## HTTP与HTTPS有什么区别？

由于HTTP协议传输的数据是明文格式的，因此发送隐私信息时存在着安全风险。为确保数据传输安全性，[网景公司](https://zhida.zhihu.com/search?content_id=228373455&content_type=Article&match_order=1&q=%E7%BD%91%E6%99%AF%E5%85%AC%E5%8F%B8&zhida_source=entity)推出了SSL（Secure Sockets Layer）协议，并在其基础上创造出了HTTPS通信方式。简而言之，HTTPS是一种安全、支持加密传输和身份认证功能的网络通信方式，它是在SSL与HTTP结合后诞生的。

HTTPS和HTTP的区别主要如下：

1、https协议需要到ca申请证书，一般免费证书较少，因而需要一定费用。

2、http是[超文本传输协议](https://zhida.zhihu.com/search?content_id=228373455&content_type=Article&match_order=1&q=%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE&zhida_source=entity)，信息是明文传输，https则是具有安全性的ssl加密传输协议。

3、http和https使用的是完全不同的连接方式，用的端口也不一样，前者是80，后者是443。

4、http的连接很简单，是无状态的；HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，比[http协议](https://zhida.zhihu.com/search?content_id=228373455&content_type=Article&match_order=1&q=http%E5%8D%8F%E8%AE%AE&zhida_source=entity)安全。

## HTTPS 的工作原理

我们都知道 HTTPS 能够加密信息，以免敏感信息被第三方获取，所以很多银行网站或电子邮箱等等安全级别较高的服务都会采用 HTTPS 协议。

![](images/yuque/img_11_01.png)

**1、客户端发起 HTTPS 请求**

这个没什么好说的，就是用户在浏览器里输入一个 https 网址，然后连接到 server 的 443 端口。

**2、服务端的配置**

采用 HTTPS 协议的服务器必须要有一套数字证书，可以自己制作，也可以向组织申请，区别就是自己颁发的证书需要客户端验证通过，才可以继续访问，而使用受信任的公司申请的证书则不会弹出提示页面(startssl 就是个不错的选择，有 1 年的免费服务)。

这套证书其实就是一对公钥和私钥，如果对公钥和私钥不太理解，可以想象成一把钥匙和一个锁头，只是全世界只有你一个人有这把钥匙，你可以把锁头给别人，别人可以用这个锁把重要的东西锁起来，然后发给你，因为只有你一个人有这把钥匙，所以只有你才能看到被这把锁锁起来的东西。

**3、传送证书**

这个证书其实就是公钥，只是包含了很多信息，如证书的颁发机构，过期时间等等。

**4、客户端解析证书**

这部分工作是有客户端的TLS来完成的，首先会验证公钥是否有效，比如颁发机构，过期时间等等，如果发现异常，则会弹出一个警告框，提示证书存在问题。

如果证书没有问题，那么就生成一个随机值，然后用证书对该随机值进行加密，就好像上面说的，把随机值用锁头锁起来，这样除非有钥匙，不然看不到被锁住的内容。

**5、传送加密信息**

这部分传送的是用证书加密后的随机值，目的就是让服务端得到这个随机值，以后客户端和服务端的通信就可以通过这个随机值来进行加密解密了。

**6、服务端解密信息**

服务端用私钥解密后，得到了客户端传过来的随机值(对称秘钥)，然后把内容通过该值进行对称加密，所谓对称加密就是，将信息和私钥通过某种算法混合在一起，这样除非知道私钥，不然无法获取内容，而正好客户端和服务端都知道这个私钥，所以只要加密算法够彪悍，私钥够复杂，数据就够安全。

**7、传输加密后的信息**

这部分信息是服务段用私钥加密后的信息，可以在客户端被还原。

**8、客户端解密信息**

客户端用之前生成的私钥解密服务段传过来的信息，于是获取了解密后的内容，整个过程第三方即使监听到了数据，也束手无策。

### 加密方式

HTTPS的加密方式是对称加密和非对称加密两种加密方式混合的方式，先执行非对称加密再执行对称加密。

#### 为什么使用混合加密方式？

如果直接使用对称加密，发送方通过密钥对报文进行加密，接收方收到报文后通过相同的密钥对报文进行解密。但是问题就出在发送方如何把密钥安全地送到接收方手上，并且不被任何中间人所截获，因为接收方能通过密钥解密，那么其他中间人拿到密钥后也能对报文进行解密，那么这个密钥就失去了作用。

如果直接使用非对称密钥的话，接收方要在发送方发送数据前把公钥（所有人都可以获取公钥，专门用于加密）传给发送方，接收方自己保留一个私钥（专门用于解密），发送方发送数据时就用公钥进行加密，中间人由于没有私钥只能拿到公钥所以无法对报文进行解密，所以保证了报文的安全。但是非对称加密的完成过程相较繁琐，如果每条数据的发送都需要进行非对称加密，响应速度将会大大降低。

所有就有了混合加密方式，接收方先将公钥发送给发送方，发送方生成对称密钥，用公钥对对称密钥进行加密之后，将对称密钥发送给接收方，接收方通过私钥解密出对称密钥，保证了只有通信的双方拿到对称密钥，从此以后双方就可以通过对称密钥来保证数据的安全传输了。

### 证书

证书的使用步骤：

1. 服务器的运营人员会通过数字证书认证机构进行身份认证。当机构验证其身份后，会对服务器的公钥进行数字签名，并将其与公钥绑定在一起形成公钥证书
2. 客户端接收到服务器发送的公钥证书后，会向数字证书认证机构验证数字签名的正确性，以确保公钥未被篡改或替换
3. 即使中间人想伪造公钥证书，也无法通过数字证书认证机构的验证，因此无法欺骗客户端。
4. 通过数字签名和验证机制，确保了公钥的真实性和安全性。
5. 服务器使用数字证书认证来确认其身份并获取由机构颁发的公钥。客户端接收到该公钥时会通过验证来确保其未被篡改。这种方法可以防止中间人攻击并保护通信安全

## **HTTPS的优点与缺点**

HTTPS（HyperText Transfer Protocol Secure）是一种用于安全通信的协议，它在 HTTP 基础上添加了 SSL/TLS 加密层。以下是 HTTPS 的优点和缺点：

### **优点**

1. **数据加密**HTTPS 使用 SSL/TLS 加密，保护用户与服务器之间的数据传输，防止数据被窃取或篡改，尤其适用于敏感信息如密码、信用卡号等。
2. **身份验证**HTTPS 使用数字证书验证服务器的真实性，确保用户连接到的是合法网站，而不是伪造或恶意网站。
3. **数据完整性**通过加密和哈希校验，HTTPS 确保数据在传输过程中没有被篡改。
4. **搜索引擎排名优化**搜索引擎（如 Google）倾向于优先排名使用 HTTPS 的网站，从而提升网站的 SEO。
5. **用户信任**浏览器会标记未使用 HTTPS 的网站为“不安全”，而 HTTPS 网站增强了用户信任感。

### **缺点**

1. **性能开销**HTTPS 需要加密和解密数据，这增加了服务器和客户端的计算负载，对性能有一定影响。不过，现代硬件和优化技术（如 TLS 1.3）已大大减轻了性能损耗。
2. **成本（部分情况下）**虽然有免费的 SSL 证书提供商（如 Let’s Encrypt），一些企业仍选择购买更高级的证书，这会产生费用。
3. **配置复杂性**HTTPS 需要正确配置 SSL/TLS 证书，包括证书安装、续期和中间证书管理，操作复杂性可能导致安全隐患。
4. **兼容性问题**旧版本的浏览器或设备可能不支持现代的 HTTPS/TLS 标准，导致部分用户无法访问。

# 代码部分

这里作为知识点应对面试，给大家展现实现思路，让大家清楚大概是如何实现的。没有完全实现所有功能，后续如果有机会的话我可能会抽时间验证一下（如果大家有时间的话可以自行验证并实现HTTPS的所有功能）。

### 概述

在 HTTP 服务器的基础上实现 HTTPS 需要引入 SSL/TLS 协议。通过使用 OpenSSL 库，我们可以在现有的 HTTP 服务器上添加加密层，确保数据传输的安全性。

### 基础架构设计

HTTPS 的实现主要涉及以下几个步骤：

1. 配置 OpenSSL 环境
2. 创建 SSL 上下文
3. 在现有的 HTTP 服务器中集成 SSL
4. 处理 SSL 握手和加密通信

### 配置OpenSSL环境

#### 3.1 安装 OpenSSL

确保系统中安装了 OpenSSL 库。可以通过以下命令安装：

\`\`\`cpp
sudo apt update
sudo apt install libssl-dev
\`\`\`

#### 3.2 生成 SSL 证书

使用 OpenSSL 生成自签名证书：

\`\`\`cpp
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt
\`\`\`

如果有**云服务器且有域名**可以使用这种生成证书的方式:

最常用的免费SSL证书提供方是Let's Encrypt。以下是获取步骤：

使用Certbot获取Let's Encrypt证书：

\`\`\`cpp
sudo apt-get install certbot

# 获取证书
sudo certbot certonly --standalone -d your-domain.com
\`\`\`

### HTTPS测试主程序

\`\`\`cpp
#include "../include/http/HttpServer.h"
#include <muduo/base/Logging.h>
#include "../include/ssl/SslConfigLoader.h"

int main(int argc, char *argv[])
{
    // 设置日志级别
    muduo::Logger::setLogLevel(muduo::Logger::DEBUG);

    try
    {
        // 创建服务器实例
        auto serverPtr = std::make_unique<http::HttpServer>(443, "HTTPSServer", true);

        // 加载 SSL 配置
        ssl::SslConfig sslConfig;

        // 获取当前工作目录
        char cwd[PATH_MAX];
        if (getcwd(cwd, sizeof(cwd)) != nullptr)
        {
            LOG_INFO << "Current working directory: " << cwd;
        }

        // 设置证书文件（使用绝对路径）
        std::string certFile = "/etc/letsencrypt/live/growingshark.asia/fullchain.pem";
        std::string keyFile = "/etc/letsencrypt/live/growingshark.asia/privkey.pem";

        LOG_INFO << "Loading certificate from: " << certFile;
        LOG_INFO << "Loading private key from: " << keyFile;

        sslConfig.setCertificateFile(certFile);
        sslConfig.setPrivateKeyFile(keyFile);
        sslConfig.setProtocolVersion(ssl::SSLVersion::TLS_1_2);

        // 验证文件是否存在
        if (access(certFile.c_str(), R_OK) != 0)
        {
            LOG_FATAL << "Cannot read certificate file: " << certFile;
            return 1;
        }
        if (access(keyFile.c_str(), R_OK) != 0)
        {
            LOG_FATAL << "Cannot read private key file: " << keyFile;
            return 1;
        }

        serverPtr->setSslConfig(sslConfig);

        // 设置线程数
        serverPtr->setThreadNum(4);

        // 添加一些测试路由
        serverPtr->Get("/", [](const http::HttpRequest &req, http::HttpResponse *resp)
                   {
            resp->setStatusCode(http::HttpResponse::k200Ok);
            resp->setStatusMessage("OK");
            resp->setContentType("text/plain");
            resp->setBody("Hello, World!"); });

        // 启动服务器
        LOG_INFO << "Server starting on port 443...";
        serverPtr->start();
    }
    catch (const std::exception &e)
    {
        LOG_FATAL << "Server start failed: " << e.what();
        return 1;
    }

    return 0;
}
\`\`\`

### 创建 SSL 上下文

SSL 上下文 (\`SSL_CTX\`) 是 OpenSSL 中用于管理 SSL/TLS 协议的核心结构。它负责存储 SSL 配置、证书、密钥等信息，并用于创建 SSL 连接。创建 SSL 上下文是实现 HTTPS 的关键步骤。

创建一个新的 SSL 上下文，用于管理 SSL 连接。

#### 主要功能

- 初始化 SSL 环境：设置 SSL/TLS 协议版本和选项。
- 加载证书和私钥：用于验证服务器身份和加密通信。
- 配置 SSL 参数：如会话缓存、验证模式等。

#### SslConfig 类

SslConfig 类用于存储 SSL 配置，包括证书和密钥文件路径

\`\`\`cpp
class SslConfig 
{
public:
    SslConfig();
    ~SslConfig() = default;

    // 证书配置
    void setCertificateFile(const std::string& certFile) { certFile_ = certFile; }
    void setPrivateKeyFile(const std::string& keyFile) { keyFile_ = keyFile; }
    void setCertificateChainFile(const std::string& chainFile) { chainFile_ = chainFile; }
    
    // 协议版本和加密套件配置
    void setProtocolVersion(SSLVersion version) { version_ = version; }
    void setCipherList(const std::string& cipherList) { cipherList_ = cipherList; }
    
    // 客户端验证配置
    void setVerifyClient(bool verify) { verifyClient_ = verify; }
    void setVerifyDepth(int depth) { verifyDepth_ = depth; }
    
    // 会话配置
    void setSessionTimeout(int seconds) { sessionTimeout_ = seconds; }
    void setSessionCacheSize(long size) { sessionCacheSize_ = size; }

    // Getters
    const std::string& getCertificateFile() const { return certFile_; }
    const std::string& getPrivateKeyFile() const { return keyFile_; }
    const std::string& getCertificateChainFile() const { return chainFile_; }
    SSLVersion getProtocolVersion() const { return version_; }
    const std::string& getCipherList() const { return cipherList_; }
    bool getVerifyClient() const { return verifyClient_; }
    int getVerifyDepth() const { return verifyDepth_; }
    int getSessionTimeout() const { return sessionTimeout_; }
    long getSessionCacheSize() const { return sessionCacheSize_; }

private:
    std::string certFile_; // 证书文件
    std::string keyFile_; // 私钥文件
    std::string chainFile_; // 证书链文件
    SSLVersion  version_; // 协议版本
    std::string cipherList_; // 加密套件
    bool        verifyClient_; // 是否验证客户端
    int         verifyDepth_; // 验证深度
    int         sessionTimeout_; // 会话超时时间
    long        sessionCacheSize_; // 会话缓存大小
};
\`\`\`

#### SslContext 类定义

SslContext 类用于初始化和管理 SSL 上下文。

\`\`\`cpp
class SslContext : muduo::noncopyable 
{
public:
    explicit SslContext(const SslConfig& config);
    ~SslContext();

    bool initialize();
    SSL_CTX* getNativeHandle() { return ctx_; }

private:
    bool loadCertificates();
    bool setupProtocol();
    void setupSessionCache();
    static void handleSslError(const char* msg);

private:
    SSL_CTX*  ctx_; // SSL上下文
    SslConfig config_; // SSL配置
};
\`\`\`

#### SslContext 类核心功能实现

**初始化 SSL 上下文**

使用 TLS_server_method() 创建一个新的 SSL 上下文。

检查上下文创建是否成功。

\`\`\`cpp
bool SslContext::initialize()
{
    // 初始化 OpenSSL
    OPENSSL_init_ssl(OPENSSL_INIT_LOAD_SSL_STRINGS | 
                    OPENSSL_INIT_LOAD_CRYPTO_STRINGS, nullptr);

    // 创建 SSL 上下文
    const SSL_METHOD* method = TLS_server_method();
    ctx_ = SSL_CTX_new(method);
    if (!ctx_)
    {
        handleSslError("Failed to create SSL context");
        return false;
    }

    // 设置 SSL 选项
    long options = SSL_OP_NO_SSLv2 | SSL_OP_NO_SSLv3 | 
                  SSL_OP_NO_COMPRESSION |
                  SSL_OP_CIPHER_SERVER_PREFERENCE;
    SSL_CTX_set_options(ctx_, options);

    // 加载证书和私钥
    if (!loadCertificates())
    {
        return false;
    }

    // 设置协议版本
    if (!setupProtocol())
    {
        return false;
    }

    // 设置会话缓存
    setupSessionCache();

    LOG_INFO << "SSL context initialized successfully";
    return true;
}
\`\`\`

**加载证书和私钥**

使用 SSL_CTX_use_certificate_file 加载服务器证书。

使用 SSL_CTX_use_PrivateKey_file 加载服务器私钥。

\`\`\`cpp
bool SslContext::loadCertificates()
{
    // 加载证书
    if (SSL_CTX_use_certificate_file(ctx_,
     config_.getCertificateFile().c_str(), SSL_FILETYPE_PEM) <= 0)
    {
        handleSslError("Failed to load server certificate");
        return false;
    }

    // 加载私钥
    if (SSL_CTX_use_PrivateKey_file(ctx_, 
        config_.getPrivateKeyFile().c_str(), SSL_FILETYPE_PEM) <= 0)
    {
        handleSslError("Failed to load private key");
        return false;
    }

    // 验证私钥
    if (!SSL_CTX_check_private_key(ctx_))
    {
        handleSslError("Private key does not match the certificate");
        return false;
    }

    // 加载证书链
    if (!config_.getCertificateChainFile().empty())
    {
        if (SSL_CTX_use_certificate_chain_file(ctx_,
            config_.getCertificateChainFile().c_str()) <= 0)
        {
            handleSslError("Failed to load certificate chain");
            return false;
        }
    }

    return true;
}
\`\`\`

### 集成 SSL 到 HTTP 服务器

将 SSL 集成到 HTTP 服务器中是实现 HTTPS 的关键步骤。通过在现有的 HTTP 服务器中添加 SSL 支持，我们可以确保数据传输的安全性。以下是集成 SSL 的详细步骤和核心实现功能。

#### 主要功能

- SSL 上下文初始化：创建和配置 SSL 上下文。
- SSL 连接管理：处理 SSL 握手和加密通信。
- 服务器配置：在服务器中集成 SSL 支持。

##### SSL 上下文初始化

功能：创建和配置 SSL 上下文，用于管理 SSL 连接。流程：

1. 创建 \`SslConfig\` 对象，存储证书和密钥文件路径。
2. 使用 \`SslConfig\` 初始化 \`SslContext\`，加载证书和私钥。

##### SSL连接管理

功能：处理SSL握手和加密通信

流程：

1. 在新连接建立时，创建\`SslConnection\`对象。
2. 调用\`startHandshake\`方法，开始 SSL 握手。
3. 在握手完成后，处理加密数据的读写。

##### 服务器配置

功能：在服务器中集成 SSL 支持。流程：

1. 在 \`HttpServer::start\` 方法中，初始化 SSL 上下文。
2. 在连接建立时，使用 \`SslConnection\` 处理 SSL 连接。

#### SslConnection 类定义

\`SslConnection\` 类用于处理 SSL 连接，包括握手和数据加密/解密。

\`\`\`cpp
class SslConnection : muduo::noncopyable 
{
public:
    using TcpConnectionPtr = std::shared_ptr<muduo::net::TcpConnection>;
    using BufferPtr = muduo::net::Buffer*;
    
    SslConnection(const TcpConnectionPtr& conn, SslContext* ctx);
    ~SslConnection();

    void startHandshake();
    void send(const void* data, size_t len);
    void onRead(const TcpConnectionPtr& conn, BufferPtr buf, muduo::Timestamp time);
    bool isHandshakeCompleted() const { return state_ == SSLState::ESTABLISHED; }
    muduo::net::Buffer* getDecryptedBuffer() { return &decryptedBuffer_; }
    // SSL BIO 操作回调
    static int bioWrite(BIO* bio, const char* data, int len);
    static int bioRead(BIO* bio, char* data, int len);
    static long bioCtrl(BIO* bio, int cmd, long num, void* ptr);
    // 设置消息回调函数
    void setMessageCallback(const MessageCallback& cb) { messageCallback_ = cb; }
private:
    void handleHandshake();
    void onEncrypted(const char* data, size_t len);
    void onDecrypted(const char* data, size_t len);
    SSLError getLastError(int ret);
    void handleError(SSLError error);

private:
    SSL*                ssl_; // SSL 连接
    SslContext*         ctx_; // SSL 上下文
    TcpConnectionPtr    conn_; // TCP 连接
    SSLState            state_; // SSL 状态
    BIO*                readBio_;   // 网络数据 -> SSL
    BIO*                writeBio_;  // SSL -> 网络数据
    muduo::net::Buffer  readBuffer_; // 读缓冲区
    muduo::net::Buffer  writeBuffer_; // 写缓冲区
    muduo::net::Buffer  decryptedBuffer_; // 解密后的数据
    MessageCallback     messageCallback_; // 消息回调
};
\`\`\`

#### SslConnection 类实现

\`\`\`cpp
// 自定义 BIO 方法
static BIO_METHOD* createCustomBioMethod() 
{
    BIO_METHOD* method = BIO_meth_new(BIO_TYPE_MEM, "custom");
    BIO_meth_set_write(method, SslConnection::bioWrite);
    BIO_meth_set_read(method, SslConnection::bioRead);
    BIO_meth_set_ctrl(method, SslConnection::bioCtrl);
    return method;
}

SslConnection::SslConnection(const TcpConnectionPtr& conn, SslContext* ctx)
    : ssl_(nullptr)
    , ctx_(ctx)
    , conn_(conn)
    , state_(SSLState::HANDSHAKE)
    , readBio_(nullptr)
    , writeBio_(nullptr)
    , messageCallback_(nullptr)
{
    // 创建 SSL 对象
    ssl_ = SSL_new(ctx_->getNativeHandle());
    if (!ssl_) {
        LOG_ERROR << "Failed to create SSL object: " << ERR_error_string(ERR_get_error(), nullptr);
        return;
    }

    // 创建 BIO
    readBio_ = BIO_new(BIO_s_mem());
    writeBio_ = BIO_new(BIO_s_mem());
    
    if (!readBio_ || !writeBio_) {
        LOG_ERROR << "Failed to create BIO objects";
        SSL_free(ssl_);
        ssl_ = nullptr;
        return;
    }

    SSL_set_bio(ssl_, readBio_, writeBio_);
    SSL_set_accept_state(ssl_);  // 设置为服务器模式
    
    // 设置 SSL 选项
    SSL_set_mode(ssl_, SSL_MODE_ACCEPT_MOVING_WRITE_BUFFER);
    SSL_set_mode(ssl_, SSL_MODE_ENABLE_PARTIAL_WRITE);
    
    // 设置连接回调
    conn_->setMessageCallback(
        std::bind(&SslConnection::onRead, this, std::placeholders::_1,
                 std::placeholders::_2, std::placeholders::_3));
}

SslConnection::~SslConnection() 
{
    if (ssl_) 
    {
        SSL_free(ssl_);  // 这会同时释放 BIO
    }
}

void SslConnection::startHandshake() 
{
    SSL_set_accept_state(ssl_);
    handleHandshake();
}

void SslConnection::send(const void* data, size_t len) 
{
    if (state_ != SSLState::ESTABLISHED) {
        LOG_ERROR << "Cannot send data before SSL handshake is complete";
        return;
    }
    
    int written = SSL_write(ssl_, data, len);
    if (written <= 0) {
        int err = SSL_get_error(ssl_, written);
        LOG_ERROR << "SSL_write failed: " << ERR_error_string(err, nullptr);
        return;
    }
    
    char buf[4096];
    int pending;
    while ((pending = BIO_pending(writeBio_)) > 0) {
        int bytes = BIO_read(writeBio_, buf, 
                           std::min(pending, static_cast<int>(sizeof(buf))));
        if (bytes > 0) {
            conn_->send(buf, bytes);
        }
    }
}

void SslConnection::onRead(const TcpConnectionPtr& conn, BufferPtr buf, 
                         muduo::Timestamp time) 
{
    if (state_ == SSLState::HANDSHAKE) {
        // 将数据写入 BIO
        BIO_write(readBio_, buf->peek(), buf->readableBytes());
        buf->retrieve(buf->readableBytes());
        handleHandshake();
        return;
    } else if (state_ == SSLState::ESTABLISHED) {
        // 解密数据
        char decryptedData[4096];
        int ret = SSL_read(ssl_, decryptedData, sizeof(decryptedData));
        if (ret > 0) {
            // 创建新的 Buffer 存储解密后的数据
            muduo::net::Buffer decryptedBuffer;
            decryptedBuffer.append(decryptedData, ret);
            
            // 调用上层回调处理解密后的数据
            if (messageCallback_) {
                messageCallback_(conn, &decryptedBuffer, time);
            }
        }
    }
}

void SslConnection::handleHandshake() 
{
    int ret = SSL_do_handshake(ssl_);
    
    if (ret == 1) {
        state_ = SSLState::ESTABLISHED;
        LOG_INFO << "SSL handshake completed successfully";
        LOG_INFO << "Using cipher: " << SSL_get_cipher(ssl_);
        LOG_INFO << "Protocol version: " << SSL_get_version(ssl_);
        
        // 握手完成后，确保设置了正确的回调
        if (!messageCallback_) {
            LOG_WARN << "No message callback set after SSL handshake";
        }
        return;
    }
    
    int err = SSL_get_error(ssl_, ret);
    switch (err) {
        case SSL_ERROR_WANT_READ:
        case SSL_ERROR_WANT_WRITE:
            // 正常的握手过程，需要继续
            break;
            
        default: {
            // 获取详细的错误信息
            char errBuf[256];
            unsigned long errCode = ERR_get_error();
            ERR_error_string_n(errCode, errBuf, sizeof(errBuf));
            LOG_ERROR << "SSL handshake failed: " << errBuf;
            conn_->shutdown();  // 关闭连接
            break;
        }
    }
}

void SslConnection::onEncrypted(const char* data, size_t len) 
{
    writeBuffer_.append(data, len);
    conn_->send(&writeBuffer_);
}

void SslConnection::onDecrypted(const char* data, size_t len) 
{
    decryptedBuffer_.append(data, len);
}

SSLError SslConnection::getLastError(int ret) 
{
    int err = SSL_get_error(ssl_, ret);
    switch (err) 
    {
        case SSL_ERROR_NONE:
            return SSLError::NONE;
        case SSL_ERROR_WANT_READ:
            return SSLError::WANT_READ;
        case SSL_ERROR_WANT_WRITE:
            return SSLError::WANT_WRITE;
        case SSL_ERROR_SYSCALL:
            return SSLError::SYSCALL;
        case SSL_ERROR_SSL:
            return SSLError::SSL;
        default:
            return SSLError::UNKNOWN;
    }
}

void SslConnection::handleError(SSLError error) 
{
    switch (error) 
    {
        case SSLError::WANT_READ:
        case SSLError::WANT_WRITE:
            // 需要等待更多数据或写入缓冲区可用
            break;
        case SSLError::SSL:
        case SSLError::SYSCALL:
        case SSLError::UNKNOWN:
            LOG_ERROR << "SSL error occurred: " << ERR_error_string(ERR_get_error(), nullptr);
            state_ = SSLState::ERROR;
            conn_->shutdown();
            break;
        default:
            break;
    }
}

int SslConnection::bioWrite(BIO* bio, const char* data, int len) 
{
    SslConnection* conn = static_cast<SslConnection*>(BIO_get_data(bio));
    if (!conn) return -1;

    conn->conn_->send(data, len);
    return len;
}

int SslConnection::bioRead(BIO* bio, char* data, int len) 
{
    SslConnection* conn = static_cast<SslConnection*>(BIO_get_data(bio));
    if (!conn) return -1;

    size_t readable = conn->readBuffer_.readableBytes();
    if (readable == 0) 
    {
        return -1;  // 无数据可读
    }

    size_t toRead = std::min(static_cast<size_t>(len), readable);
    memcpy(data, conn->readBuffer_.peek(), toRead);
    conn->readBuffer_.retrieve(toRead);
    return toRead;
}

long SslConnection::bioCtrl(BIO* bio, int cmd, long num, void* ptr) 
{
    switch (cmd) 
    {
        case BIO_CTRL_FLUSH:
            return 1;
        default:
            return 0;
    }
}
\`\`\`

#### 集成到HttpServer中

在程序启动的时候，完成SSL相关配置，例如:

\`\`\`cpp
#include "HttpServer.h"

void HttpServer::start(const std::string& certFile, const std::string& keyFile) {
    ssl::SslConfig sslConfig(certFile, keyFile);
    sslContext_ = ssl::SslContext(sslConfig);
    // 初始化服务器并开始监听
    // 在连接建立时创建 SslConnection
}
\`\`\`

在新连接建立的时候，创建\`SslConnection\`对象

\`\`\`cpp
void HttpServer::onConnection(const muduo::net::TcpConnectionPtr &conn)
{
    // 给连接设置一个HttpContext对象用于解析请求报文，提取封装请求信息
    if (conn->connected())
    {
        if (useSSL_)
        {
            auto sslConn = std::make_unique<ssl::SslConnection>(conn, sslCtx_.get());
            sslConns_[conn] = std::move(sslConn);
            sslConns_[conn]->startHandshake();
        }
        conn->setContext(HttpContext());
    }
    else 
    {
        if (useSSL_)
        {
            sslConns_.erase(conn);
        }
    }
}
\`\`\`

每次使用有消息发送过来时，判断是否使用HTTPS服务

\`\`\`cpp
void HttpServer::onMessage(const muduo::net::TcpConnectionPtr &conn,
                           muduo::net::Buffer *buf,
                           muduo::Timestamp receiveTime)
{
    try
    {
        // 这层判断只是代表是否支持ssl
        if (useSSL_)
        {
            // 1.查找对应的SSL连接
            auto it = sslConns_.find(conn);
            if (it != sslConns_.end())
            {
                // 2. SSL连接处理数据
                it->second->onRead(conn, buf, receiveTime);

                // 3. 如果 SSL 握手还未完成，直接返回
                if (!it->second->isHandshakeCompleted())
                {
                    return;
                }

                // 4. 从SSL连接的解密缓冲区获取数据
                muduo::net::Buffer* decryptedBuf = it->second->getDecryptedBuffer();
                if (decryptedBuf->readableBytes() == 0)
                    return; // 没有解密后的数据

                // 5. 使用解密后的数据进行HTTP 处理
                buf = decryptedBuf; // 将 buf 指向解密后的数据

            }
        }
        // HttpContext对象用于解析出buf中的请求报文，并把报文的关键信息封装到HttpRequest对象中
        HttpContext *context = boost::any_cast<HttpContext>(conn->getMutableContext());
        if (!context->parseRequest(buf, receiveTime)) // 解析一个http请求
        {
            // 如果解析http报文过程中出错
            conn->send("HTTP/1.1 400 Bad Request\\r\\n\\r\\n");
            conn->shutdown();
        }
        // 如果buf缓冲区中解析出一个完整的数据包才封装响应报文
        if (context->gotAll())
        {
            onRequest(conn, context->request());
            context->reset();
        }
    }
    catch (const std::exception &e)
    {
        // 捕获异常，返回错误信息
        LOG_ERROR << "Exception in onMessage: " << e.what();
        conn->send("HTTP/1.1 400 Bad Request\\r\\n\\r\\n");
        conn->shutdown();
    }
}
\`\`\``,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_12",index:12,doc_id:201056305,title:"5. 框架优化思路",slug:"nco82v1n6t0vid1g",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/nco82v1n6t0vid1g",level:0,category:"性能调优",wordCount:462,updatedAt:"2025-12-12T08:38:15.000Z",hash:"80e833894f27",status:"FULL",tags:["零拷贝","无锁化","Buffer内存池","上下文切换优化"],linkedModule:"mod_optimization",linkedModuleTitle:"C++ 框架性能优化思路与演进",linkedSourceFiles:["HttpServer/src/http/HttpContext.cpp"],linkedClasses:["muduo::net::Buffer"],linkedFunctions:["Buffer::retrieve()","Buffer::prepend()"],interviewKeyPoints:["如何提升自研 HTTP 框架的 QPS 与并发吞吐量？","网络库中内存拷贝与系统调用开销的优化策略？"],content:`# 5. 框架优化思路

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/nco82v1n6t0vid1g](https://www.yuque.com/chengxuyuancarl/imh9xc/nco82v1n6t0vid1g)  
> 更新时间: 2025-12-12T08:38:15.000Z | 字数: 462

---

lake

### 拓展中间件

- 在中间件模块的基础上拓展更多的中间件：提供一些常用的中间件，如 请求限流、压缩（gzip）等。

### 身份验证和授权

- **功能****描述**：实现用户身份验证和权限管理。
- **应用****场景**：需要用户登录和权限控制的应用。
- **实现要点**：
- 支持 OAuth、JWT 等认证方式。
- 实现用户角色和权限管理。
- 提供认证和授权的中间件。

### 缓存支持

- **功能描述：**实现请求和响应的缓存机制。
- **应用场景：**提高系统性能，减少重复计算。
- **实现****要****点****：**
- 支持内存缓存和分布式缓存。
- 提供缓存策略的配置接口。
- 实现缓存的过期和更新机制。

### 身份验证和授权

- **功能描述：**实现用户身份验证和权限管理。
- **应用场景：**需要用户登录和权限控制的应用。
- **实现要点：**
- 支持 OAuth、JWT 等认证方式。
- 实现用户角色和权限管理。
- 提供认证和授权的中间件。

### 模板渲染

- **功能描述：**结合数据和模板文件生成动态 HTML 内容，支持常见的模板语法如变量插值、条件语句、循环等。
- **应用场景：**动态网页生成、视图层分离、多页面应用开发。
- **实现要点：**
- 支持多种模板引擎，如 Mustache、Jinja 等。
- 实现模板解析和渲染，支持变量插值、条件判断和循环。
- 提供模板缓存机制，提高渲染性能。
- 提供简单易用的渲染接口，支持数据模型绑定。

​`,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_13",index:13,doc_id:201058833,title:"6. 框架应用之卡码五子棋",slug:"nt4z0cem8515gx5z",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/nt4z0cem8515gx5z",level:0,category:"实战案例",wordCount:2200,updatedAt:"2026-06-09T12:55:32.000Z",hash:"229ecbe39cf8",status:"FULL",tags:["卡码五子棋","第一代应用","业务架构","架构演化对比"],linkedModule:"mod_gomoku_archive",linkedModuleTitle:"第一代示范应用之卡码五子棋",linkedSourceFiles:["AIApps/ChatServer/resource/menu.html"],linkedClasses:[],linkedFunctions:[],interviewKeyPoints:["从五子棋并发游戏服务演化为 AI 应用服务平台的架构权衡与技术跃迁？"],content:`# 6. 框架应用之卡码五子棋

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/nt4z0cem8515gx5z](https://www.yuque.com/chengxuyuancarl/imh9xc/nt4z0cem8515gx5z)  
> 更新时间: 2026-06-09T12:55:32.000Z | 字数: 2200

---

lake

这边文章我将通过卡码五子棋这个项目教会大家如何去应用该HTTP框架，介绍该HTTP框架给业务层提供了哪些接口。

## 1 概述

HttpServer 是一个轻量级的 HTTP 服务器框架，提供了处理 HTTP 请求、路由管理、中间件支持等功能。通过分析五子棋项目中的代码，我们可以了解如何使用 HttpServer 框架来构建一个 Web 应用。

## 2 对外提供的核心组件

### 2.1 HttpRequest 和 HttpResponse

HttpRequest：表示客户端的 HTTP 请求，包含请求方法、URL、头信息等。

HttpResponse：表示服务器的 HTTP 响应，包含状态码、头信息、响应体等。

### 2.2 RouterHandler

RouterHandler：用于处理特定路由的请求。用户可以继承 RouterHandler 类并实现 handle 方法来处理请求。

### 2.3 HttpServer

HttpServer：核心服务器类，负责监听端口、接受连接、分发请求。

## 3 使用步骤

### 3.1 初始化服务器

在五子棋项目中，GomokuServer 类将 HttpServer 作为成员变量（组合关系），并在构造函数中初始化服务器。

\`\`\`cpp
GomokuServer::GomokuServer(int port, const std::string &name, muduo::net::TcpServer::Option option)
    : httpServer_(port, name, option), maxOnline_(0)
{
    initialize();
}
\`\`\`

对HttpServer进行相应的配置和初始化

\`\`\`cpp
void GomokuServer::initialize()
{
    // 初始化数据库连接池
    http::MysqlUtil::init("tcp://127.0.0.1:3306", "wy", "wy2959002395", "Gomoku", 10);
    // 初始化会话
    initializeSession();
    // 初始化中间件
    initializeMiddleware();
    // 初始化路由
    initializeRouter();
}
\`\`\`

### 3.2 配置路由

通过 initializeRouter 方法配置路由，将 URL 路径与处理器绑定。

\`\`\`cpp
void GomokuServer::initializeRouter()
{
    httpServer_.Get("/", std::make_shared<EntryHandler>(this));
    httpServer_.Post("/aiBot/move", std::make_shared<AiGameMoveHandler>(this));
    httpServer_.Get("/aiBot/start", std::make_shared<AiGameStartHandler>(this));
}
\`\`\`

### 3.3 实现请求处理器

继承 RouterHandler 类，实现 handle 方法来处理请求。

#### 3.3.1 EntryHandler 示例

\`\`\`cpp
void EntryHandler::handle(const http::HttpRequest& req, http::HttpResponse* resp)
{
    std::string reqFile = "../WebApps/GomokuServer/resource/entry.html";
    FileUtil fileOperater(reqFile);
    if (!fileOperater.isValid())
    {
        LOG_WARN << reqFile << " not exist";
        fileOperater.resetDefaultFile(); // 404 NOT FOUND
    }

    std::vector<char> buffer(fileOperater.size());
    fileOperater.readFile(buffer);
    std::string bufStr = std::string(buffer.data(), buffer.size());
    
    resp->setStatusLine(req.getVersion(), http::HttpResponse::k200Ok, "OK");
    resp->setCloseConnection(false);
    resp->setContentType("text/html");
    resp->setContentLength(bufStr.size());
    resp->setBody(bufStr);
}
\`\`\`

### 3.4 启动服务器

调用 start 方法启动服务器，开始监听端口并处理请求。

\`\`\`cpp
void GomokuServer::start()
{
    httpServer_.start();
}
\`\`\`

### 3.5 HttpRequest类和HttpResponse类

以展示后台数据为例，我们需要知道HttpRequest类和HttpResponse类中对外暴露的接口。

\`\`\`cpp
// 获取后台数据
void GomokuServer::getBackendData(const http::HttpRequest &req, http::HttpResponse *resp)
{
    try 
    {
        // 获取数据
        int curOnline = getCurOnline();
        LOG_INFO << "当前在线人数: " << curOnline;
        
        int maxOnline = getMaxOnline();
        LOG_INFO << "历史最高在线人数: " << maxOnline;
        
        int totalUser = getUserCount();
        LOG_INFO << "已注册用户总数: " << totalUser;

        // 构造 JSON 响应
        nlohmann::json respBody;
        respBody = {
            {"curOnline", curOnline},
            {"maxOnline", maxOnline},
            {"totalUser", totalUser}
        };

        // 转换为字符串
        std::string responseStr = respBody.dump(4);
        
        // 设置响应
        resp->setStatusLine(req.getVersion(), http::HttpResponse::k200Ok, "OK");
        resp->setContentType("application/json");
        resp->setBody(responseStr);
        resp->setContentLength(responseStr.size());
        resp->setCloseConnection(false);

        LOG_INFO << "Backend data response prepared successfully";
    }
    catch (const std::exception& e) 
    {
        LOG_ERROR << "Error in getBackendData: " << e.what();
        
        // 错误响应
        nlohmann::json errorBody = {
            {"error", "Internal Server Error"},
            {"message", e.what()}
        };
        
        std::string errorStr = errorBody.dump();
        resp->setStatusCode(http::HttpResponse::k500InternalServerError);
        resp->setStatusMessage("Internal Server Error");
        resp->setContentType("application/json");
        resp->setBody(errorStr);
        resp->setContentLength(errorStr.size());
        resp->setCloseConnection(true);
    }
}
\`\`\`

## 项目拓展

该五子棋项目仅仅只是一个demo项目，目前存在的问题是AI对战的对手水平很低，联机对战还没有实现，以及大家到时候可以拓展加入房间、悔棋等功能。我这里大概给大家介绍一下，如果大家想要改进大致在哪里改。

#### 提高AI对战水平

AI判断落棋位置并不是通过调用第三方接口实现的（不是真AI），目前实现的这个AI对手，水平较低，如果大家想要提升AI水平可以参考**极大极小搜索**和**α-β剪枝算法。**代码在如下部分改：

\`\`\`cpp
// AI移动
void AiGame::aiMove() 
{
    if (gameOver_ || isDraw()) return;
    
    std::this_thread::sleep_for(std::chrono::milliseconds(500)); // 添加500毫秒延时
    int x, y;
    // 获取AI的最佳移动位置
    std::tie(x, y) = getBestMove();
    board_[x][y] = AI_PLAYER;
    moveCount_++;
    lastMove_ = {x, y};
    
    if (checkWin(x, y, AI_PLAYER)) 
    {
        gameOver_ = true;
        winner_ = "ai";
    }
}

// 辅助函数：评估某个位置的威胁程度
int AiGame::evaluateThreat(int r, int c) 
{
    int threat = 0;

    // 检查四个方向上的玩家连子数
    const int directions[4][2] = {{1, 0}, {0, 1}, {1, 1}, {1, -1}};
    for (auto& dir : directions) 
    {
        int count = 1;
        for (int i = 1; i <= 2; i++) 
        { // 探查2步
            int nr = r + i * dir[0], nc = c + i * dir[1];
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board_[nr][nc] == HUMAN_PLAYER) 
            {
                count++;
            }
        }
        threat += count; // 威胁分数累加
    }
    return threat;
}

// 辅助函数：判断某个空位是否靠近已有棋子
bool AiGame::isNearOccupied(int r, int c) 
{
    const int directions[8][2] = {
        {1, 0}, {-1, 0}, {0, 1}, {0, -1}, {1, 1}, {-1, -1}, {1, -1}, {-1, 1}
    };
    for (auto& dir : directions) 
    {
        int nr = r + dir[0], nc = c + dir[1];
        if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board_[nr][nc] != EMPTY) 
        {
            return true; // 该空位靠近已有棋子
        }
    }
    return false;
}

// 检查胜利条件
bool AiGame::checkWin(int x, int y, const std::string& player) 
{
    // 检查方向数组：水平、垂直、对角线、反对角线
    const int dx[] = {1, 0, 1, 1};
    const int dy[] = {0, 1, 1, -1};
    
    for (int dir = 0; dir < 4; dir++) 
    {
        int count = 1;  // 当前位置已经有一个棋子
        
        // 正向检查
        for (int i = 1; i < 5; i++) 
        {
            int newX = x + dx[dir] * i;
            int newY = y + dy[dir] * i;
            if (!isInBoard(newX, newY) || board_[newX][newY] != player) break;
            count++;
        }
        
        // 反向检查
        for (int i = 1; i < 5; i++) 
        {
            int newX = x - dx[dir] * i;
            int newY = y - dy[dir] * i;
            if (!isInBoard(newX, newY) || board_[newX][newY] != player) break;
            count++;
        }
        
        if (count >= 5) return true;
    }
    return false;
}

std::pair<int, int> AiGame::getBestMove()
{
    std::pair<int, int> bestMove = {-1, -1}; // 最佳落子位置
    int maxThreat = -1;                      // 记录最大的威胁分数

    // 1. 优先尝试进攻获胜或阻止玩家获胜
    for (int r = 0; r < BOARD_SIZE; r++) 
    {
        for (int c = 0; c < BOARD_SIZE; c++) 
        {
            if (board_[r][c] != EMPTY) continue; // 确保当前位置为空闲

            // 模拟 AI 落子，判断是否可以获胜
            board_[r][c] = AI_PLAYER;
            if (checkWin(r, c, AI_PLAYER)) 
            {
                // board_[r][c] = AI_PLAYER; // 恢复棋盘
                return {r, c};      // 立即获胜
            }
            board_[r][c] = EMPTY;

            // 模拟玩家落子，判断是否需要防守
            board_[r][c] = HUMAN_PLAYER;
            if (checkWin(r, c, HUMAN_PLAYER)) 
            {
                board_[r][c] = AI_PLAYER; // 恢复棋盘
                return {r, c};      // 立即防守
            }
            board_[r][c] = EMPTY;
        }
    }

    // 2. 评估每个空位的威胁程度，选择最佳防守位置
    for (int r = 0; r < BOARD_SIZE; r++) 
    {
        for (int c = 0; c < BOARD_SIZE; c++) 
        {
            if (board_[r][c] != EMPTY) continue; // 确保当前位置为空闲

            int threatLevel = evaluateThreat(r, c); // 评估威胁程度
            if (threatLevel > maxThreat) 
            {
                maxThreat = threatLevel;
                bestMove = {r, c};
            }
        }
    }

    // 3. 如果找不到威胁点，选择靠近玩家或已有棋子的空位
    if (bestMove.first == -1) 
    {
        std::vector<std::pair<int, int>> nearCells;

        for (int r = 0; r < BOARD_SIZE; r++) 
        {
            for (int c = 0; c < BOARD_SIZE; c++) 
            {
                if (board_[r][c] == EMPTY && isNearOccupied(r, c)) 
                { // 确保当前位置为空闲且靠近已有棋子
                    nearCells.push_back({r, c});
                }
            }
        }

        // 如果找到靠近已有棋子的空位，随机选择一个
        if (!nearCells.empty()) 
		{
            int num = rand();
			board_[nearCells[num % nearCells.size()].first][nearCells[num % nearCells.size()].second] = AI_PLAYER;
            return nearCells[num % nearCells.size()];
        }

        // 4. 如果所有策略都无效，选择第一个空位（保证 AI 落子）
        for (int r = 0; r < BOARD_SIZE; r++) 
        {
            for (int c = 0; c < BOARD_SIZE; c++) 
            {
                if (board_[r][c] == EMPTY) 
				{
					board_[r][c] = AI_PLAYER;
                    return {r, c}; // 返回第一个空位
                }
            }
        }
    }
	
	board_[bestMove.first][bestMove.second] = AI_PLAYER;
    return bestMove; // 返回最佳防守点或其他策略的结果
}
\`\`\`

#### 联机对战以及其他新功能拓展

拓展新功能就参考Gomoku/include/handlers目录下的文件写法，先继承\`RouterHandler\`，然后再重写\`handle\`函数，\`handle\`函数则是路由处理回调函数。当客户端访问对应路径的时候会执行这个\`handle\`函数。

继承案例如下：

\`\`\`cpp
class AiGameStartHandler : public http::router::RouterHandler
{
public:
    explicit AiGameStartHandler(GomokuServer* server) : server_(server) {}

    void handle(const http::HttpRequest& req, http::HttpResponse* resp) override;

private:
    GomokuServer* server_;
};
\`\`\`

实现处理器之后，将路由注册到五子棋服务器上，例如这样：

\`\`\`cpp
void GomokuServer::initializeRouter()
{
    // 注册url回调处理器
    // 登录注册入口页面
    httpServer_.Get("/", std::make_shared<EntryHandler>(this));
    httpServer_.Get("/entry", std::make_shared<EntryHandler>(this));
    // 登录
    httpServer_.Post("/login", std::make_shared<LoginHandler>(this));
    // 注册
    httpServer_.Post("/register", std::make_shared<RegisterHandler>(this));
    // 登出
    httpServer_.Post("/user/logout", std::make_shared<LogoutHandler>(this));
    // 菜单页面
    httpServer_.Get("/menu", std::make_shared<MenuHandler>(this));
    // 开始对战ai
    httpServer_.Get("/aiBot/start", std::make_shared<AiGameStartHandler>(this));
    // 下棋
    httpServer_.Post("/aiBot/move", std::make_shared<AiGameMoveHandler>(this));
    // 重新开始对战ai
    httpServer_.Get("/aiBot/restart", 
    [this](const http::HttpRequest& req, http::HttpResponse* resp) {
            restartChessGameVsAi(req, resp);
    });

    // 后台界面
    httpServer_.Get("/backend", std::make_shared<GameBackendHandler>(this));
    // 后台数据获取
    httpServer_.Get("/backend_data", [this](const http::HttpRequest& req, http::HttpResponse* resp) {
        getBackendData(req, resp);
    });
}
\`\`\`

#### 前端部分修改

前端部分代码都写在 Gomoku/resource 目录下，前端部分实现没有使用vue、react等框架，而是直接写html文件，如果前端水平不错的同学可以用框架重构一下，如果仅仅只是想拓展功能，就继续往该目录下添加对应功能的 html 文件就可以了。`,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_14",index:14,doc_id:201059023,title:"7.简历写法",slug:"cg4wm1gzr0hr6o07",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/cg4wm1gzr0hr6o07",level:0,category:"求职面试",wordCount:1245,updatedAt:"2026-05-20T09:35:38.000Z",hash:"54ce3244dd76",status:"FULL",tags:["STAR法则","简历写法","亮点包装","量化指标","求职护城河"],linkedModule:"mod_career",linkedModuleTitle:"官方推荐：项目简历写法与亮点包装",linkedSourceFiles:[],linkedClasses:[],linkedFunctions:[],interviewKeyPoints:["如何用 STAR 法则撰写 CppAIService 项目经历？","如何向面试官展示项目的技术深度、业务难点与量化指标？"],content:`# 7.简历写法

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/cg4wm1gzr0hr6o07](https://www.yuque.com/chengxuyuancarl/imh9xc/cg4wm1gzr0hr6o07)  
> 更新时间: 2026-05-20T09:35:38.000Z | 字数: 1245

---

lake

**推荐使用 **[**卡码简历**](https://jianli.kamacoder.com/)** 制作简历，高效方便。**

## 简历写法

### 一般简历写法

#### cpp-HTTP服务框架

**项目描述: **基于C++实现自定义的 HttpServer 框架，该项目包括 HTTP/HTTPS 支持、动态路由处理、会话管理等功能。并基于该框架开发了一个简易的五子棋在线对战游戏，包含登录注册、菜单选择、人机对战等功能。

**主要工作**

- **高性能服务器架构：**搭建基于 Reactor 模型的高性能 HTTP 服务器，支持多线程并发处理，提升系统吞吐量。
- **安全通信：**集成 OpenSSL 实现 HTTPS 支持，确保数据传输的安全性和完整性。
- **灵活的路由管理：**设计并实现动态路由管理系统，支持多种 HTTP 请求方法的高效分发。
- **健壮的会话管理：**实现会话管理功能，支持用户登录状态维护、会话超时处理，提升用户体验。
- **中间件支持：**开发中间件模块，提供请求和响应的预处理和后处理机制，增强系统扩展性。
- **性能优化：**通过缓存机制和连接池技术优化服务器性能，显著提高请求处理效率。
- **应用开发：**基于框架开发五子棋在线对战游戏，支持登录注册和人机对战等功能，提升用户互动性。

**个人收获**

- **C++新特性应用：**在项目中大量使用 **C++11 **及以上特性，如完美转发、可变参数模版等，增强了 **C++ **编程能力。
- **网络编程方面：**深入理解 **HTTP** 协议，通过日志记录和异常处理等手段定位并解决了多种程序运行异常问题，提高了网络编程能力。

### 进阶简历写法：

**工作描述：** 参与开发基于**C++****实现的自定义****HttpServer**框架，该项目包括**HTTP/HTTPS**支持、动态路由处理、会话管理等功能。并基于该框架开发了一个简易的五子棋在线对战游戏，包含登录注册、菜单选择、人机对战等功能。

**主要工作：**

- **高性能服务器架构**：搭建基于**Reactor**模型的高性能**HTTP**服务器，支持多线程并发处理，提升系统吞吐量。
- **安全通信**：集成**OpenSSL**实现**HTTPS**支持，确保数据传输的安全性和完整性。
- **灵活的路由管理**：设计并实现动态路由管理系统，支持多种**HTTP**请求方法的高效分发。
- **健壮的会话管理**：实现会话管理功能，支持用户登录状态维护、会话超时处理，提升用户体验。
- **中间件支持**：开发中间件模块，提供请求和响应的预处理和后处理机制，增强系统扩展性。
- **性能优化**：通过缓存机制和连接池技术优化服务器性能，显著提高请求处理效率。
- **应用开发**：基于框架开发五子棋在线对战游戏，支持登录注册和人机对战等功能，提升用户互动性。

**项目难点：**

- **确保HTTPS的安全性和性能**：在保证数据传输安全的同时，优化加密解密过程以减少性能损耗。
- **实现高效的路由管理系统**：设计一个既灵活又高效的路由分发机制，以支持多种请求类型和动态路由。

**个人收获：**

- **C++新特性应用**：在项目中大量使用**C++11**及以上特性，如完美转发、可变参数模版等，增强了C++编程能力。
- **网络编程方面**：深入理解**HTTP**协议，处理解决了多种网络编程异常，提高了C++网络编程能力。
- **多线程并发处理**：通过实现基于**Reactor**模型的服务器，提升了对多线程编程的理解和应用能力。
- **安全通信实践**：通过集成**OpenSSL**，增强了对数据加密和通信安全的认识和实践经验。
- **系统性能优化**：通过缓存机制和连接池技术，学习了如何有效提高系统性能和资源利用率。
- **中间件开发经验**：开发中间件模块，增强了对系统扩展性和模块化设计的理解。
- **应用开发实战**：基于框架开发五子棋在线对战游戏，提升了实际应用开发和用户交互设计的能力。`,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_15",index:15,doc_id:201059053,title:"8.相关面试题",slug:"vo3k9g461bx11g51",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/vo3k9g461bx11g51",level:0,category:"求职面试",wordCount:10362,updatedAt:"2026-03-15T09:50:08.000Z",hash:"e00547aa4dde",status:"FULL",tags:["大厂八股","Reactor核心","高频追问","实战踩坑","深挖考点"],linkedModule:"mod_interview_hub",linkedModuleTitle:"相关高频面试题与连环追问解析 (10,362字)",linkedSourceFiles:["HttpServer/src/http/HttpServer.cpp","AIApps/ChatServer/src/ChatServer.cpp"],linkedClasses:["muduo::net::EventLoop","muduo::net::Channel"],linkedFunctions:["eventfd","epoll_wait"],interviewKeyPoints:["epoll 边缘触发 (ET) 与水平触发 (LT) 的区别及适用场景？","为什么 muduo 在非阻塞模式下必须使用应用层 Buffer？","SIGPIPE 信号产生的原因及在服务端开发中为何必须忽略？","如何保证多线程环境下析构对象的线程安全性？"],content:`# 8.相关面试题

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/vo3k9g461bx11g51](https://www.yuque.com/chengxuyuancarl/imh9xc/vo3k9g461bx11g51)  
> 更新时间: 2026-03-15T09:50:08.000Z | 字数: 10362

---

lake

项目相关面试题分为**结合项目的面试题**和**项目相关的纯八股面试题**，如果是**结合项目的面试题**我会在文档中给大家解答，如果是**项目相关的纯八股面试题**，我会给出对应卡码笔记链接。

注意：部分相关解答可能跟项目本身有些不符合，欢迎在星球项目答疑群提出

## 项目相关面试题

#### 你在开发自定义HttpServer框架中具体负责了哪些部分？

在开发自定义 HttpServer 框架中，我具体负责了以下几个关键部分：

- **高性能服务器架构：**设计并实现了基于 Reactor 模型的多线程 HTTP 服务器，确保高并发场景下的稳定性和响应速度。
- **HTTPS 支持：**集成 OpenSSL 库，实现了 HTTPS 支持，确保数据传输的安全性和完整性。
- **路由管理系统：**设计并实现了灵活的路由管理系统，支持动态路由分发和多种 HTTP 请求方法。
- **中间件模块：**开发了中间件机制，支持请求和响应的预处理和后处理，增强了系统的扩展性。
- **会话管理：**实现了会话管理功能，支持用户登录状态的维护和会话超时处理，提升了用户体验。
- **性能优化：**通过缓存机制和连接池技术优化了服务器性能，显著提高了请求处理效率。这些工作确保了框架的高效性、灵活性和安全性，为开发者提供了一个便捷的工具来构建现代 Web 应用。

#### 你在实现基于Reactor模型的高性能HTTP服务器时遇到了哪些挑战？

- **多线程并发处理：**确保多线程环境下的线程安全是一个主要挑战。需要仔细设计锁机制，以避免竞争条件和死锁，同时最大化并发性能。
- **错误处理和恢复：**在网络通信中，处理各种可能的错误，比如连接超时的问题，在我刚开始设计数据库连接池的时候，没有考虑到连接池中的连接会超时的问题，出现的问题就是我的登录注册功能在程序运行的第二天就使用不了了，然后重启程序后功能又恢复了正常。我通过给项目打日志的方式最终定位到连接超时的问题，最终的解决方案就是给数据库连接池设置详细的异常处理机制，比如连接池启动的时候专门开一个线程定期检查连接是否超时，超时则重连，以及每次使用连接池的连接前先检查一下连接是否已经失效。
- **可拓展性设计：**在设计架构时，为了方便测试该HTTP服务框架的功能正常，我是HTTP服务框架和五子棋业务同时写的，刚开始设计的时候业务层代码和HTTP框架的代码耦合比较严重，导致继续拓展HTTP框架代码比较困难，最后我按照面向对象的设计原则将代码重构了一遍，使得HTTP服务框架有良好的可拓展性，可以实现开闭原则等面向对象的设计原则。
- **性能调优：**通过分析和优化代码、减少系统调用、使用更高效的数据结构等手段，持续提高服务器的性能和响应速度，比如说用连接池替换了普通的数据库连接。
- **资源管理：**在高并发请求下，管理连接、内存和其他资源的分配和释放是一个复杂的问题。需要实现高效的资源池和垃圾回收机制，以避免资源泄漏和性能瓶颈。该项目在设计的时候每当有动态分配的资源时就会及时考虑在哪里进行资源的释放。

#### 描述一下你是如何集成OpenSSL来实现HTTPS支持的。

在集成 OpenSSL 实现HTTPS支持的过程中，我采取了以下步骤：

1. 环境配置：首先，确保开发环境中正确安装了 OpenSSL 库，并配置项目以链接 OpenSSL。
2. SSL 上下文创建：使用 OpenSSL 提供的 API 创建 SSL 上下文（SSL_CTX）。这一步涉及合适的 SSL/TLS 协议版本，并设置必要的选项。
3. 加载证书和私钥：从文件中加载服务器的 SSL 证书和私钥，并将它们绑定到 SSL 上下文中。这确保了服务器能够进行身份验证和加密通信。
4. SSL 连接管理：在每个客户端连接上创建一个 SSL 对象(SSL)，并将其与相应的网络连接绑定。使用 SSL 对象处理握手、加密和解密操作。
5. 握手过程：在连接建立后，执行 SSL 握手过程，确保客户端和服务器之间的安全通信通道建立成功。
6. 数据加密和解密：在数据传输过程中 ，使用 SSL 对象对数据进行加密和解密，确保数据的机密性和完整性。
7. 错误处理：实现详细的错误处理机制，捕获和处理 SSL 操作中的各种错误，确保系统的稳定性和安全性。

通过这些步骤，我成功将OpenSSL集成到 HTTP 服务器中，实现了 HTTPS 支持，确保了数据传输的安全性和完整性。

#### 你设计的动态路由管理系统是如何支持多种HTTP请求方法的？

在设计动态路由管理系统时，我确保它能够支持多种 HTTP 请求方法（如 GET、POST、PUT、DELETE 等），具体实现如下：

1. 请求方法映射：为每种 HTTP 请求方法创建一个独立的路由表。每个路由表存储该方法对应的路径和处理器的映射关系。这种设计使得系统可以根据请求方法快速定位到相应的路由表。
2. 路由注册接口：提供简洁的接口供开发者注册路由。开发者可以通过调用 Get(), Post(), Put(), Delete() 等方法，将路径和处理器绑定到相应的请求方法上。
3. 请求解析：在接收到 HTTP 请求后，首先解析请求方法和 URL 路径。根据请求方法选择对应的路由表，并在该表中查找匹配的路径。
4. 路径匹配：支持静态路径和动态路径参数的匹配。对于动态路径，使用正则表达式或类似机制解析路径参数，并将其传递给处理器。
5. 处理器调用：一旦找到匹配的路径，调用绑定的处理器来处理请求。处理器可以访问请求的详细信息（如路径参数、请求体等）并生成相应的响应。
6. 中间件支持：在路由处理之前，允许中间件对请求进行预处理，提供额外的功能如身份验证、日志记录等。

通过这些设计，我的动态路由管理系统能够高效地支持多种 HTTP 请求方法，提供灵活的路由配置和处理能力。

#### 会话管理功能是如何实现的，你如何处理会话超时？

在实现会话管理功能时，我设计了一个系统来有效地管理用户会话，并处理会话超时。以下是具体的实现细节：

1. 会话存储：使用 SessionStorage 类来存储和管理会话数据。会话数据可以存储在内存中或持久化到数据库中，以便在服务器重启后恢复。
2. 会话创建和销毁：在用户登录时创建新的会话，生成唯一的会话 ID，并将其与用户数据关联。会话结束或用户注销时，销毁会话并清理相关数据。
3. 会话超时处理：超时设置：为每个会话设置一个超时时间（如 60 分钟）。在会话创建时记录最后活动时间。定期检查：使用定时器或后台线程定期检查所有会话的最后活动时间。如果会话超过设定的超时时间，则将其标记为超时并销毁。活动更新：在用户进行任何操作时，更新会话的最后活动时间，以延长会话的有效期。
4. 会话验证：在每次请求时，验证会话 ID 的有效性，确保用户的身份和权限。无效或超时的会话将被拒绝访问。

通过这些设计和实现，我的会话管理系统能够有效地管理用户会话，确保用户身份的持续性和安全性，同时通过超时机制防止资源滥用和安全风险。

#### 你开发的中间件模块有哪些功能，它们如何增强了系统扩展性？

在开发中间件模块时，我设计了一套灵活的机制来增强系统的扩展性和可维护性。以下是中间件模块的主要功能及其对系统扩展性的贡献：

1. 请求预处理：中间件可以在请求到达路由处理器之前对其进行预处理。这包括身份验证、请求日志记录、请求体解析等功能。通过将这些通用功能抽象为中间件，开发者可以在不修改核心业务逻辑的情况下轻松添加或移除功能。
2. 响应后处理：中间件还可以在响应生成后进行后处理。这包括响应压缩、响应头添加、缓存控制等功能。后处理中间件可以统一管理响应的格式和内容，确保一致性。
3. 错误处理：提供全局错误处理机制，捕获和处理请求处理过程中发生的异常。中间件可以统一记录错误日志、返回标准化的错误响应，提升系统的健壮性。
4. 跨域资源共享 (CORS)：通过中间件配置 CORS 规则，允许跨域请求。这对于需要与其他域进行交互的应用程序非常重要。
5. 灵活的中间件链：中间件模块支持链式调用，开发者可以根据需要组合多个中间件，形成一个处理链。每个中间件可以决定是否继续调用下一个中间件或终止请求处理。

增强系统扩展性：

- 模块化设计：中间件将通用功能模块化，开发者可以根据需求灵活组合和复用，减少代码重复。
- 易于维护：通过中间件分离关注点，开发者可以在不影响其他功能的情况下独立修改或替换某个中间件。
- 快速集成：新功能可以通过添加中间件快速集成到系统中，而无需大规模修改现有代码。

通过这些设计，中间件模块显著增强了系统的扩展性，使得系统能够快速适应变化的需求和技术环境。

#### 你采取了哪些措施来优化服务器性能？

在优化服务器性能的过程中，我采取了多种措施，以确保系统在高并发场景下的高效性和稳定性。以下是具体的优化措施：

1. 多线程处理：利用多线程技术，结合 Reactor 模型，实现了高效的并发请求处理。通过线程池管理线程资源，减少线程创建和销毁的开销。
2. 连接池技术：实现数据库连接池和其他资源池，复用连接资源，减少连接建立和释放的开销，提高资源利用率。
3. 缓存机制：引入缓存机制，减少重复计算和数据库查询的次数。通过缓存静态内容和频繁访问的数据，降低服务器负载。
4. 异步处理：对于耗时的操作（如文件 I/O、数据库查询），采用异步处理方式，避免阻塞主线程，提高系统的响应速度。
5. 性能监控和调优：通过性能监控工具，持续监测系统的运行状态，识别性能瓶颈，并进行针对性的调优。
6. 内存管理优化：优化内存分配和释放策略，减少内存碎片和泄漏，确保系统的稳定性。

通过这些优化措施，我成功提升了服务器的性能，使其能够在高并发环境下稳定运行，并提供快速的响应时间。

#### 在开发五子棋在线对战游戏时，你是如何提升用户互动性的？

这里我没怎么实现，大家应对面试可以这么答，也可以自行实现

在开发五子棋在线对战游戏时，我采取了多种措施来提升用户的互动性，确保玩家能够获得流畅和有趣的游戏体验。以下是具体的措施：

1. 实时对战功能：实现了实时对战机制，允许玩家与其他在线玩家或 AI 进行实时对战。通过 WebSocket 或长轮询技术，确保游戏状态的实时更新和低延迟的用户交互。
2. AI 对手：为单人游戏模式开发了 AI 对手，玩家可以随时与 AI 进行对战。AI 的难度可以调整，满足不同水平玩家的需求。
3. 用户登录和个人化设置：支持用户登录和注册功能，玩家可以创建个人账户，保存游戏进度和历史记录。提供个性化设置选项，如棋盘主题和音效设置，增强用户的归属感。
4. 排行榜和成就系统：引入排行榜和成就系统，激励玩家通过对战提升排名和解锁成就，增加游戏的挑战性和趣味性。
5. 社交互动：提供聊天功能，允许玩家在对战过程中进行交流，增强社交互动。支持好友系统，玩家可以邀请好友进行对战。
6. 用户反馈机制：收集玩家的反馈和建议，持续改进游戏功能和用户体验，确保游戏能够满足用户的期望。

通过这些措施，我成功提升了五子棋在线对战游戏的用户互动性，使其成为一个既有趣又具有挑战性的游戏平台。

#### 你在项目中是如何应用C++11及以上特性的？

在项目中，我充分利用了C++11及以上的特性，以提高代码的可读性、性能和安全性。以下是具体的应用：

1. 智能指针：使用 std::shared_ptr 和 std::unique_ptr 管理动态内存，避免手动管理内存带来的内存泄漏和悬挂指针问题，提高代码的安全性和可维护性。
2. 线程和并发：利用 C++11 的  库和相关的并发特性（如 std::mutex、std::lock_guard、std::condition_variable）实现多线程处理，确保线程安全和高效的并发执行。
3. Lambda 表达式：使用 Lambda 表达式简化回调函数的定义，提升代码的简洁性和可读性，特别是在事件处理和异步操作中。
4. 自动类型推导：使用 auto 关键字进行类型推导，减少冗长的类型声明，提高代码的简洁性。
5. 范围循环：使用范围循环 (for-each) 遍历容器，简化循环结构，提高代码的可读性。
6. 移动语义：利用移动构造函数和移动赋值运算符，优化资源管理和性能，特别是在处理大对象或资源密集型操作时。
7. std::chrono：使用 std::chrono 库进行时间和日期的处理，提供高精度的计时和延迟操作。
8. std::function 和 std::bind：使用 std::function 和 std::bind 进行函数对象的存储和调用，增强函数的灵活性和可组合性。

通过这些 C++11 及以上特性的应用，我提高了项目的开发效率和代码质量，使得项目更具现代化和可维护性。

#### 你是如何深入理解HTTP协议并解决网络编程异常的？

在项目中，我通过以下方式深入理解HTTP协议并解决网络编程中的异常问题：

1. 协议学习与实践：深入学习HTTP协议的各个方面，包括请求方法、状态码、头信息、持久连接等。通过实现HTTP请求和响应的解析与生成，加深对协议细节的理解。
2. 抓包分析：使用工具如Wireshark对HTTP通信进行抓包分析，观察实际的请求和响应数据包，理解协议在真实网络环境中的表现。
3. 异常处理机制：在网络编程中，设计了全面的异常处理机制。对于常见的网络异常（如连接超时、断开连接、数据包丢失等），实现了自动重试、超时设置和错误日志记录，确保系统的稳定性。
4. 详细的日志记录：集成日志记录系统，实时记录HTTP请求和响应的详细信息，帮助快速定位和解决异常问题。
5. 浏览器开发者模式：每次实现一块功能模块的时候，就进行前后端测试，前端浏览器打开开发者模式实时监控后端响应报文信息。

通过这些措施，我不仅深入理解了HTTP协议，还能够有效地解决网络编程中的异常问题，确保项目的高效和稳定运行。

#### 通过实现基于Reactor模型的服务器，你对多线程编程有哪些新的理解？

通过实现基于 Reactor 模型的服务器，我对多线程编程有了更深入的理解，具体体现在以下几个方面：

1. 线程安全性：在多线程环境中，确保数据的一致性和安全性是首要任务。我学会了如何使用互斥锁 (std::mutex) 和条件变量 (std::condition_variable) 来保护共享资源，避免竞争条件和数据不一致。
2. 线程池的使用：通过实现线程池，我理解了如何高效地管理线程资源。线程池可以减少线程创建和销毁的开销，提高系统的响应速度和资源利用率。
3. 任务调度：在 Reactor 模型中，事件驱动的任务调度是关键。我学会了如何将 I/O 事件与相应的处理器绑定，并在事件触发时高效地调度任务执行。
4. 非阻塞 I/O：通过使用非阻塞 I/O 和 I/O 多路复用技术（如 epoll），我理解了如何在不阻塞主线程的情况下处理大量并发连接，提高系统的吞吐量。
5. 并发模型设计：在设计并发模型时，我学会了如何合理划分任务，避免线程间的频繁切换和锁争用，以提高并发执行的效率。
6. 调试与优化：多线程程序的调试和优化是一个挑战。我学会了使用工具和日志来监控线程的执行状态，识别性能瓶颈，并进行针对性的优化。

通过这些实践，我对多线程编程有了更全面的理解，能够更好地设计和实现高性能的并发系统。

#### 你在集成OpenSSL的过程中有哪些安全通信的实践经验？

在集成 OpenSSL 实现安全通信的过程中，我积累了一些实践经验，确保数据传输的安全性和完整性：

1. 证书管理：使用自签名证书或从受信任的证书颁发机构获取证书，确保服务器的身份验证。定期更新证书以防止过期。
2. 私钥保护：妥善保护私钥文件，限制其访问权限，确保只有授权的进程可以读取。使用加密文件系统或硬件安全模块（HSM）来存储私钥。
3. 协议版本选择：配置 OpenSSL 以支持最新的 TLS 版本（如 TLS 1.2 或 TLS 1.3），禁用已知不安全的协议版本（如 SSL 2.0 和 SSL 3.0）。
4. 加密算法配置：选择强加密算法和密钥长度，禁用弱算法（如 RC4 和 MD5）。使用现代的加密套件，如 AES-GCM 和 SHA-256。
5. 安全握手：在 SSL/TLS 握手过程中，验证客户端证书（如果需要），确保通信双方的身份验证。处理握手失败的情况，记录详细的错误日志。
6. 证书验证：在客户端和服务器之间进行证书验证，确保证书链的完整性和有效性。使用证书吊销列表（CRL）或在线证书状态协议（OCSP）检查证书的吊销状态。
7. 错误处理：实现详细的错误处理机制，捕获和处理 SSL/TLS 操作中的各种错误，确保系统的稳定性和安全性。
8. 性能优化：通过会话重用和零延迟恢复（Zero Round Trip Time Resumption）等技术，优化 SSL/TLS 的性能，减少握手延迟。

通过这些实践，我确保了在集成 OpenSSL 时的安全通信，保护了用户数据的机密性和完整性。

#### 你是如何通过缓存机制和连接池技术提高系统性能和资源利用率的？

在项目中，我通过缓存机制和连接池技术显著提高了系统性能和资源利用率，具体措施如下：

1. 缓存机制：

1. 静态内容缓存：将常用的静态资源（如 HTML、CSS、JavaScript 文件）缓存到内存中，减少磁盘 I/O 操作，提高响应速度。
2. 数据缓存：对于频繁访问的数据库查询结果，使用内存缓存（如 LRU 缓存）存储结果，减少数据库查询次数，降低数据库负载。
3. 缓存策略：设计合理的缓存失效策略，确保缓存数据的时效性和一致性。使用 TTL（Time-To-Live）和基于事件的缓存刷新机制，确保数据的准确性。

1. 连接池技术：

1. 数据库连接池：实现数据库连接池，复用数据库连接，减少连接建立和释放的开销，提高数据库访问效率。
2. 线程池：使用线程池管理工作线程，避免频繁创建和销毁线程带来的性能损耗，提高并发处理能力。
3. 资源池化：对于其他需要频繁创建和销毁的资源（如网络连接、文件句柄等），使用资源池技术进行管理，提升资源利用率。

1. 性能监控与调优：

1. 监控工具：使用性能监控工具实时监测系统的缓存命中率和连接池使用情况，识别性能瓶颈。
2. 调优策略：根据监控数据，调整缓存大小、连接池容量和其他参数，确保系统在不同负载下的高效运行。

通过这些措施，我成功提高了系统的性能和资源利用率，确保在高并发环境下的稳定性和快速响应。

#### 在开发中间件模块时，你是如何考虑系统扩展性和模块化设计的？

在开发中间件模块时，我特别注重系统的扩展性和模块化设计，以确保系统能够灵活适应未来的需求变化。以下是我采取的具体措施：

1. 模块化设计：

1. 独立功能模块：将通用功能（如身份验证、日志记录、请求解析等）抽象为独立的中间件模块。每个模块专注于单一职责，便于开发和维护。
2. 接口定义：为中间件定义统一的接口，使得不同的中间件可以无缝集成到请求处理流程中。这种设计使得添加或替换中间件变得简单。

1. 链式调用：

1. 中间件链：实现中间件的链式调用机制，允许多个中间件按顺序处理请求和响应。每个中间件可以决定是否继续调用下一个中间件或终止请求处理。
2. 灵活组合：开发者可以根据具体需求灵活组合中间件，形成一个处理链，满足不同的业务场景。

1. 可配置性：

1. 配置驱动：通过配置文件或环境变量，动态加载和配置中间件。开发者可以在不修改代码的情况下调整中间件的行为和顺序。
2. 参数化中间件：支持中间件的参数化配置，使得同一个中间件可以在不同的上下文中复用。扩展性考虑：
3. 开放封闭原则：中间件设计遵循开放封闭原则，允许在不修改现有代码的情况下扩展新功能。

通过这些设计，我确保了中间件模块的高扩展性和模块化，使得系统能够快速适应变化的需求，并保持良好的可维护性。

#### 基于框架开发五子棋在线对战游戏给了你哪些应用开发和用户交互设计的经验？

在基于框架开发五子棋在线对战游戏的过程中，我积累了丰富的应用开发和用户交互设计经验，具体包括：

1. 用户体验设计：

1. 直观的用户界面：设计简洁直观的用户界面，使玩家能够轻松导航和操作。通过用户测试和反馈，不断优化界面布局和交互元素。
2. 实时反馈：实现实时反馈机制，确保玩家的每一步操作都能立即在界面上反映出来，提升游戏的流畅性和互动性。

1. 游戏逻辑实现：

1. AI 对手设计：开发不同难度的 AI 对手，满足不同水平玩家的需求。通过调整 AI 的策略和反应速度，提供具有挑战性的游戏体验。
2. 规则引擎：实现游戏规则引擎，确保游戏逻辑的准确性和一致性，处理各种边界情况和异常输入。用户交互设计：
3. 社交功能：集成聊天和好友系统，增强玩家之间的互动。设计简单易用的交互方式，鼓励玩家之间的交流和竞争。
4. 个性化设置：提供个性化设置选项，如棋盘主题、音效和难度选择，提升用户的参与感和满意度。

1. 性能优化：

1. 响应速度：优化游戏的响应速度，确保在高并发情况下的稳定性和流畅性。通过性能监测工具，识别并解决性能瓶颈。
2. 资源管理：有效管理游戏资源，减少加载时间和内存占用，提升整体性能

通过这些经验，我不仅提高了应用开发的能力，还增强了对用户交互设计的理解，能够更好地设计和实现用户友好的应用程序。

#### 在项目中你遇到的最大技术难题是什么，你是如何克服的？

在项目开发过程中，我遇到的最大的技术难题就是程序在运行过程中的问题排查，我克服这一问题的过程是刚开始是尽可能去复现问题，分析错误可能存在的地方，在这些地方给出对应的日志输出，定位问题，但是这样仍然在排查问题的时候花费了大量时间，但同时也让我认识的日志输出和异常处理机制的重要性，所以我在接下来开发的过程中，完成功能的同时也会花时间实现完整的日志记录和异常处理机制，保证程序在出现异常情况的时候快速定位问题。

#### 你是如何测试和验证你的HttpServer框架的？

在测试和验证 HttpServer 框架的过程中，我采用了多种方法来确保其功能的正确性和性能的稳定性。以下是具体的步骤和策略：

1. 单元测试：为框架的每个模块编写单元测试，特别是核心功能如请求解析、路由管理和响应生成。每个功能模块实现之后都会在五子棋项目中得到使用测试是否可用。
2. 集成测试：进行集成测试，验证各模块之间的交互和整体功能。模拟真实的 HTTP 请求和响应场景，确保框架在实际应用中的表现，写五子棋项目队该HTTP服务框架进行实际的测试。
3. 性能测试：使用工具如 Apache Benchmark (ab) 和 Webbench 对服务器进行性能测试。测试框架在高并发场景下的响应时间、吞吐量和资源利用率，识别性能瓶颈。

通过这些测试和验证措施，我确保了 HttpServer 框架的高质量和可靠性，使其能够在实际应用中稳定运行并满足用户需求。

#### 你在项目中是如何进行错误处理和日志记录的？

在项目中，我设计了全面的错误处理和日志记录机制，以确保系统的稳定性和可维护性。以下是具体的实现策略：

1. 错误处理：

1. 统一错误接口：为不同类型的错误（如网络错误、I/O 错误、逻辑错误）设计统一的错误接口，确保错误处理的一致性。
2. 异常捕获：在关键代码段使用 try-catch 块捕获异常，防止程序崩溃。对于无法处理的异常，记录详细的错误信息并安全退出。
3. 用户友好反馈：在发生错误时，向用户返回友好的错误信息，而不是技术细节，提升用户体验。

1. 日志记录：

1. 日志框架：使用成熟的日志框架（muduo配套的日志系统），实现高效的日志记录和管理。
2. 日志级别：定义不同的日志级别（如 DEBUG、INFO、WARN、ERROR），根据事件的重要性选择合适的日志级别，确保日志的可读性和有效性。
3. 结构化日志：记录结构化日志信息，包括时间戳、日志级别、模块名称、错误描述等，便于后续分析和排查。
4. 日志持久化：将日志持久化到文件或远程日志服务器，支持日志的长期存储和集中管理。
5. 实时监控：通过日志监控工具，实时监控系统运行状态，及时发现和处理异常情况。

通过这些错误处理和日志记录策略，我确保了系统的稳定性和可维护性，能够快速定位和解决问题，提升了项目的整体质量。

#### 你认为在你的项目中还有哪些可以改进的地方？如果有机会，你会如何改进？

1. 用户体验：

1. 界面优化：通过用户反馈，进一步优化用户界面和交互设计，提升用户体验。
2. 个性化推荐：引入个性化推荐系统，根据用户行为和偏好提供定制化的内容和服务。

1. 扩展性：

1. 插件系统：开发插件系统，允许第三方开发者扩展框架功能，增强系统的灵活性和可扩展性。

1. 模板渲染：

1. 模板引擎优化：优化现有的模板引擎，提升模板渲染的性能和灵活性。
2. 动态内容生成：增强模板渲染功能，支持更复杂的动态内容生成，提高页面的响应速度和用户体验。

1. 身份验证和授权：

1. 多因素认证：引入多因素认证机制，提升用户账户的安全性。
2. 细粒度权限管理：实现细粒度的权限管理系统，确保用户只能访问其授权的资源，提升系统的安全性和灵活性。

#### GET请求和POST请求的区别是什么？

笔记地址：[https://notes.kamacoder.com/question/100004](https://notes.kamacoder.com/question/100004)

1. 用途：GET请求通常用于获取数据，而POST请求用于上传数据。在项目中GET通常用于请求静态资源，POST可以用于上传登录注册表单信息。
2. 数据传输：GET请求将参数附加在URL中，而POST将请求放在请求体中。
3. 安全性：GET请求暴露在URL中，安全性较低；POST请求不暴露在URL中，相对更安全。
4. 数据大小：GET请求收到URL长度的限制，数据量有限；POST请求理论上没有大小限制。
5. 幂等性：GET请求的幂等的，即多次执行同样的GET请求，资源的状态不会改变；POST请求不是幂等的，因为每次提交都可能改变资源状态。
6. 缓存：GET请求可以作为书签保存，可以被缓存；POST请求默认不会被缓存。

#### HTTPS和HTTP有哪些区别？

笔记地址：[https://notes.kamacoder.com/question/100010](https://notes.kamacoder.com/question/100010)

由于HTTP协议传输的数据是明文格式的，因此发送隐私信息时存在着安全风险。为确保数据传输安全性，[网景公司](https://zhida.zhihu.com/search?content_id=228373455&content_type=Article&match_order=1&q=%E7%BD%91%E6%99%AF%E5%85%AC%E5%8F%B8&zhida_source=entity)推出了SSL协议，并在其基础上创造出了HTTPS通信方式。简而言之，HTTPS是一种安全、支持加密传输和身份认证功能的网络通信方式，它是在SSL与HTTP结合后诞生的。

HTTPS和HTTP的区别主要如下：

1、https协议需要到ca申请证书，一般免费证书较少，因而需要一定费用。

2、http是[超文本传输协议](https://zhida.zhihu.com/search?content_id=228373455&content_type=Article&match_order=1&q=%E8%B6%85%E6%96%87%E6%9C%AC%E4%BC%A0%E8%BE%93%E5%8D%8F%E8%AE%AE&zhida_source=entity)，信息是明文传输，https则是具有安全性的ssl加密传输协议。

3、http和https使用的是完全不同的连接方式，用的端口也不一样，前者是80，后者是443。

4、http的连接很简单，是无状态的；HTTPS协议是由SSL+HTTP协议构建的可进行加密传输、身份认证的网络协议，比[http协议](https://zhida.zhihu.com/search?content_id=228373455&content_type=Article&match_order=1&q=http%E5%8D%8F%E8%AE%AE&zhida_source=entity)安全。

## 相关八股面试题

### 计算机网络

#### 从输入URL到页面展示发生了什么？

卡码笔记地址：[https://notes.kamacoder.com/questions/500001](https://notes.kamacoder.com/questions/500001)

#### HTTP请求报文和响应报文是怎样的？

卡码笔记地址：[https://notes.kamacoder.com/question/100002](https://notes.kamacoder.com/question/100002)

#### HTTP请求方式有哪些？

卡码笔记地址：[https://notes.kamacoder.com/question/100003](https://notes.kamacoder.com/question/100003)

#### HTTP请求中常见的状态码有哪些？它们分别代表什么含义？

卡码笔记地址：[https://notes.kamacoder.com/question/100005](https://notes.kamacoder.com/question/100005)

#### HTTP1.0和HTTP1.1的区别是什么？

笔记地址：[https://notes.kamacoder.com/question/100007](https://notes.kamacoder.com/question/100007)

#### HTTP2.0与HTTP1.1相比有哪些主要改进？

笔记地址：[https://notes.kamacoder.com/question/100008](https://notes.kamacoder.com/question/100008)

#### HTTP3.0有了解过吗？它与之前的版本有哪些主要不同？

笔记地址：[https://notes.kamacoder.com/question/100009](https://notes.kamacoder.com/question/100009)

#### TCP的Keepalive和HTTP的Keep-Alive是一个东西吗？它们之间有什么区别？

笔记地址：

#### DNS查询过程是怎样的？它是如何实现域名解析的？

笔记地址：[https://notes.kamacoder.com/question/100021](https://notes.kamacoder.com/question/100021)

#### 什么是HTTP/2的头部压缩？它是如何实现的？

笔记地址：[https://notes.kamacoder.com/question/100043](https://notes.kamacoder.com/question/100043)

#### HTTP请求中的Range头部字段有什么作用？它如何实现断点续传？

笔记地址：[https://notes.kamacoder.com/question/100045](https://notes.kamacoder.com/question/100045)

#### HTTP请求中的Referer头部字段有什么作用？它在网络安全中有什么应用？

笔记地址：[https://notes.kamacoder.com/question/100047](https://notes.kamacoder.com/question/100047)

#### HTTP/2相比HTTP/1.1在性能上有哪些提升？这些提升是如何实现的？

笔记地址：[https://notes.kamacoder.com/question/100049](https://notes.kamacoder.com/question/100049)

#### HTTPS工作原理是什么？它是如何实现数据加密的？

笔记地址：[https://notes.kamacoder.com/question/100011](https://notes.kamacoder.com/question/100011)

#### HTTP的Keep-Alive是什么？它在网络通信中有什么作用？

笔记地址：[https://notes.kamacoder.com/question/100019](https://notes.kamacoder.com/question/100019)

#### Cookie和Session是什么？它们在网络通信中扮演什么角色？有什么区别？

笔记地址：[https://notes.kamacoder.com/question/100023](https://notes.kamacoder.com/question/100023)

#### HTTP请求中的头部字段有哪些常见的类型？它们各自的作用是什么？

笔记地址：[https://notes.kamacoder.com/question/100030](https://notes.kamacoder.com/question/100030)

#### 什么是HTTP管道化？它在网络通信中有什么作用？

笔记地址：[https://notes.kamacoder.com/question/100031](https://notes.kamacoder.com/question/100031)

#### 什么是HTTP持久连接？它在网络通信中有什么作用？

笔记地址：[https://notes.kamacoder.com/question/100033](https://notes.kamacoder.com/question/100033)

#### HTTP请求中的Content-Type头部字段有什么作用？常见的取值有哪些？

笔记地址：[https://notes.kamacoder.com/question/100042](https://notes.kamacoder.com/question/100042)

### 数据库相关

#### 一条SQL查询语句是如何执行的？

笔记地址：[https://notes.kamacoder.com/question/100090](https://notes.kamacoder.com/question/100090)

#### 数据库的事务隔离级别有哪些？

笔记地址：[https://notes.kamacoder.com/question/100091](https://notes.kamacoder.com/question/100091)

#### 事务的四大特性有哪些？

笔记地址：[https://notes.kamacoder.com/question/100092](https://notes.kamacoder.com/question/100092)

#### 什么是数据库的连接池？为什么要使用连接池？

笔记地址：[https://notes.kamacoder.com/question/100118](https://notes.kamacoder.com/question/100118)

### C++语言相关

C++基础语法相关的面试问题就不给大家一一贴出了，因为几乎所有常见基础语法相关面试题都有可能被面试官问到，大家到卡码笔记上直接背就可以了。

#### 描述一下你如何使用C++中的单例模式，并讨论其潜在问题。

笔记链接：[https://notes.kamacoder.com/question/101146](https://notes.kamacoder.com/question/101146)

#### 如何使用try、catch、throw和finally关键字？

笔记链接：[https://notes.kamacoder.com/questions/500973](https://notes.kamacoder.com/questions/500973)

#### 什么是异常安全的代码，如何编写异常安全的程序？

笔记链接：[https://notes.kamacoder.com/questions/500974](https://notes.kamacoder.com/questions/500974)

#### 什么是RAII，它在C++中如何应用？

笔记链接：[https://notes.kamacoder.com/questions/500991](https://notes.kamacoder.com/questions/500991)

#### 如何在C++中通过socket发送和接收大文件？

笔记链接：[https://notes.kamacoder.com/questions/501115](https://notes.kamacoder.com/questions/501115)

#### 在C++网络编程中，如何处理粘包和拆包问题？

笔记链接：[https://notes.kamacoder.com/questions/501114](https://notes.kamacoder.com/questions/501114)`,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_16",index:16,doc_id:237095653,title:"9. AI应用服务平台(CppAIService)第一版【升级】",slug:"rbw2ktnuxhe5hv1q",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/rbw2ktnuxhe5hv1q",level:0,category:"AI服务架构",wordCount:11263,updatedAt:"2026-08-21T00:18:27.000Z",hash:"aac177fb5d2e",status:"FULL",tags:["第一版架构","单会话","多模型接入","cURL客户端","JSON序列化"],linkedModule:"mod_ai_v1",linkedModuleTitle:"AI 应用服务平台 (CppAIService) 第一版架构演进",linkedSourceFiles:["AIApps/ChatServer/src/AIUtil/AIStrategy.cpp"],linkedClasses:["AIStrategy","AIHelper"],linkedFunctions:["AIStrategy::buildRequest()","AIStrategy::parseResponse()"],interviewKeyPoints:["第一版 AI 应用平台的技术痛点是什么？为什么需要升级到第二版？","同步数据库写库在大量请求涌入时的阻塞瓶颈分析？"],content:`# 9. AI应用服务平台(CppAIService)第一版【升级】

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/rbw2ktnuxhe5hv1q](https://www.yuque.com/chengxuyuancarl/imh9xc/rbw2ktnuxhe5hv1q)  
> 更新时间: 2026-08-21T00:18:27.000Z | 字数: 11263

---

lake

​

本应用层，针对有基础经验的人可以几个小时就将该应用层看完，针对无基础也可以做到7天之内看完

建议大家在看这篇文章的时候，先去看一下框架应用之卡玛五子棋这篇文章，有了框架应用之卡玛五子棋的基础之后，再去学习这篇文章对应的AL框架应用会好很多

大家都看到这里了，应该底层的http框架已经看完了，该应用层功能不算多，但也可以学到一些东西的，而且本身应用层+底层HTTP服务框架部分其实整个项目规模也不算小了。

​

# 仓库地址与说明:

仓库地址：[https://github.com/youngyangyang04/CppAIService](https://github.com/youngyangyang04/CppAIService)

​

现在仓库中的代码已更新为第二版AI应用服务平台了，但是我们可以在拉取项目后通过git命令回退版本来查看第一版的代码。这样也方便对比第一版和第二版之间的不同逻辑。

当然第二版出了也可以直接看第二版的代码，不过还是需要结合第一版文章的说明来看，因为第二版的说明不会包含第一版的文章讲解

那么如何回退呢？

进入到项目中通过如下指令，就会切换到第一版的代码了

\`\`\`cpp
git checkout dc03a42 
\`\`\`

若要继续恢复为第二版的代码，则使用如下指令

\`\`\`cpp
git checkout 6eebccf
\`\`\`

​

​

# AIApps目录结构与文件说明:

\`\`\`cpp
AIApps     
\`-- ChatServer
    |-- include
    |   |-- AIUtil
    |   |   |-- AIHelper.h    		//内部封装curl去访问对阿里的模型
    |   |   |-- ImageRecognizer.h   //内部封装openncv等接口进行图像识别操作
    |   |   |-- MQManager.h  		//封装消息队列有关的线程池（消费者生产者相关函数)
    |   |   \`-- base64.h     		//三方库，用于解码前端传进来的图片base64数据
    |   |-- ChatServer.h     		//包装多个业务相关的映射表
    |   \`-- handlers
    |       |-- AIMenuHandler.h      		//有关菜单页面
    |       |-- AIUploadHandler.h           //有关图像识别页面
    |       |-- AIUploadSendHandler.h       //有关图像识别业务
    |       |-- ChatEntryHandler.h			//有关登录界面
    |       |-- ChatHandler.h				//有关AI聊天界面
    |       |-- ChatHistoryHandler.h		//有关AI聊天界面的同步历史数据业务
    |       |-- ChatLoginHandler.h			//有关登录界面登录业务
    |       |-- ChatLogoutHandler.h			//有关菜单界面登出业务
    |       |-- ChatRegisterHandler.h		//有关注册界面注册业务
    |       \`-- ChatSendHandler.h			//有关AI聊天界面的聊天业务
    |-- resource
    |   |-- AI.html							//AI聊天前端页面
    |   |-- NotFound.html					//鉴权失败返回的前端页面
    |   |-- entry.html						//登录前端页面
    |   |-- menu.html						//菜单前端页面	
    |   \`-- upload.html						//图像识别页面
    \`-- src
        |-- AIUtil
    |   |   |-- AIHelper.cpp    		//内部封装curl去访问对阿里的模型
    |   |   |-- ImageRecognizer.cpp   	//内部封装openncv等接口进行图像识别操作
    |   |   |-- MQManager.cpp  			//封装消息队列有关的线程池（消费者生产者相关函数)
    |   |   \`-- base64.cpp     			//三方库，用于解码前端传进来的图片base64数据
    |   |-- ChatServer.cpp     			//包装多个业务相关的映射表
        |-- handlers
    |       |-- AIMenuHandler.cpp      		//有关菜单页面
    |       |-- AIUploadHandler.cpp         //有关图像识别页面
    |       |-- AIUploadSendHandler.cpp     //有关图像识别业务
    |       |-- ChatEntryHandler.cpp		//有关登录界面
    |       |-- ChatHandler.cpp				//有关AI聊天界面
    |       |-- ChatHistoryHandler.cpp		//有关AI聊天界面的同步历史数据业务
    |       |-- ChatLoginHandler.cpp		//有关登录界面登录业务
    |       |-- ChatLogoutHandler.cpp		//有关菜单界面登出业务
    |       |-- ChatRegisterHandler.cpp		//有关注册界面注册业务
    |       \`-- ChatSendHandler.cpp			//有关AI聊天界面的聊天业务
        \`-- main.cpp 						//用于线程池、服务初始化
\`\`\`

# 0：系统设计:

## 技术架构图

![](images/yuque/img_16_01.png)

### 1. 系统整体设计

本项目基于 **自研 HTTP 服务框架**，在其之上扩展了 **AI 聊天服务** 与 **AI 图像识别服务**。整体架构分为三层：

- **客户端层**：用户通过浏览器或前端页面发起请求（如登录、聊天、上传图片）。
- **应用服务层**：由自研 HTTP 框架承载，整合了 AI 对话服务、AI 图像识别服务、用户管理服务。
- **基础支撑层**：由数据库、消息队列、推理引擎及三方 API 组成，为应用层提供持久化、异步处理和模型推理能力。

在整体流程上，用户请求经过 HTTP 服务框架调度，调用对应的 **业务 Handler**，并通过消息队列、数据库、推理引擎完成 AI 聊天、图像识别等功能，再将结果返回到前端页面。

---

### 2. 技术架构解读

1. **业务服务层**

- **AI 聊天服务**：通过 \`cURL\` 调用阿里云百炼 API，实现大语言模型对话。
- **AI 图像识别服务**：基于 OpenCV + ONNX Runtime 部署轻量级模型，实现图片分类。
- **用户服务**：负责登录、注册、登出、会话管理等功能。

1. **三方依赖库**

- \`json\`：C++ JSON 解析
- \`curl\`：HTTP 请求封装
- \`Muduo\`：高性能网络库
- \`OpenCV\`：图像预处理
- \`SimpleAmqpClient / Base64\`：用于消息队列通信与图片数据解码

1. **基础支撑模块**

- **MySQL**：存储用户信息、聊天记录、图像识别结果
- **RabbitMQ**：提供异步消息队列，解耦高并发场景下的数据库写入
- **ONNX Runtime**：执行模型推理，支持轻量化部署（如 MobileNetV2）

1. **项目构建与部署**

- **CMake**：统一构建管理
- **Docker**：提供一键化部署，集成 MySQL、RabbitMQ、OpenCV、ONNX 等环境

---

### 3. 学习与收获

通过学习本项目，你可以系统掌握以下技能：

- **AI 聊天服务集成**：在 C++ 框架中调用大模型 API，实现多轮对话与会话记忆。
- **AI 图像识别服务**：结合 OpenCV + ONNX Runtime，完成图像预处理与推理全流程。
- **高并发架构设计**：利用 Muduo + RabbitMQ + 线程池，提升系统在多用户场景下的并发处理能力。
- **工程化能力**：熟悉 Docker 部署、消息队列解耦、数据库异步写入等服务化开发经验。

## 整体流程：

初始化阶段会从MYSQL中读取内容到内存中

- 将所有用户的消息读取到内存中，即更新chatInformation哈希表

​

后续客户端请求某个接口，ChatServer中的各个Handler会做相应处理，期间会进行权限校验甚至可能会调用ONNX工具或者通过curl远程请求模型（百炼）

在Handler做处理的过程中，若是涉及到大模型对话相关业务，就会将消息表更新立刻同步到内存中，再放入到消息队列中，后续内部线程池中的工作线程会异步地读取消息队列的消息，并持久化到数据库中

![](images/yuque/img_16_02.png)

整体流程实现了 **前端请求 → 服务端调度 → 消息队列削峰 → 模型推理 → 数据持久化 → 前端响应** 的闭环。下面逐步解读技术要点：

---

### 1. 客户端请求入口

用户通过浏览器或前端页面发起请求（如 \`POST /chat/send\` 或上传图片），请求以 **JSON 格式** 封装，提交到服务端 \`ChatServer\`。

- 优点：统一使用 JSON，避免底层 form-data 兼容性问题。
- 技术点：HTTP 框架自带 **路由与会话管理**，可直接将请求分发至对应 Handler（如 \`ChatSendHandler\`、\`AIUploadSendHandler\`）。

---

### 2. ChatServer 业务调度

\`ChatServer\` 是项目的核心调度模块，内部包含多类 **Handler**：

- **ChatSendHandler**：处理 AI 对话请求
- **AIUploadSendHandler**：处理图像识别请求
- **ChatLoginHandler / ChatRegisterHandler**：处理用户认证
- **ChatHistoryHandler**：恢复并同步历史消息

技术亮点：

- Handler 设计采用 **职责分离** 思路，每个业务独立封装，增强了系统扩展性。
- 会话信息集中存放在 \`chatInformation\`，通过智能指针管理，避免了频繁加锁操作的开销。

---

### 3. AI 能力调用

根据业务类型，系统调用不同的 AI 模块：

- **AI 聊天**：\`AIHelper\` 封装了 cURL 调用逻辑，请求阿里云百炼 API，返回上下文关联的回答。
- **图像识别**：\`ImageRecognizer\` 结合 **OpenCV** 做预处理（resize、归一化），再通过 **ONNX Runtime** 执行模型推理（MobileNetV2），输出分类结果。

技术亮点：

- **上下文记忆**：\`AIHelper\` 会把历史会话加载到内存，保证对话的连续性。
- **轻量推理**：使用 ONNX Runtime 部署模型，兼顾可移植性与性能。

---

### 4. 数据持久化与消息队列

所有用户消息与 AI 回答，在写入 MySQL 前，统一通过 **RabbitMQ 消息队列** 异步处理：

1. 生产者：\`AIHelper\` 将 SQL 插入语句推送至 RabbitMQ。
2. 消费者：\`RabbitMQThreadPool\` 多线程异步执行 SQL 写入。

技术亮点：

- **异步解耦**：避免了高并发下 MySQL 插入阻塞主线程。
- **削峰填谷**：请求量过大时，消息可先缓存在队列中，保证系统稳定性。
- **可靠性**：RabbitMQ 支持消息确认与持久化，确保数据不会丢失。

---

### 5. 历史数据恢复

当用户重新登录时，系统会：

1. 初始化阶段，从 MySQL 读取历史对话。
2. 将数据恢复至对应 \`AIHelper\` 的消息数组。
3. 保证会话流转时依旧保持 **用户 → AI → 用户 → AI** 的顺序，避免上下文错乱。

技术亮点：

- **会话一致性保障**：通过时间戳排序，确保历史对话恢复正确。
- **可扩展性**：当前默认单会话，可扩展为多会话管理（类似 ChatGPT 的对话列表）。

---

### 6. 结果返回客户端

最后，服务端将 AI 响应或识别结果以 JSON 格式打包返回前端。

- 对话接口：返回 AI 回答内容。
- 图像识别接口：返回图片类别与置信度（可扩展至多标签、多任务推理）。

技术亮点：

- **低延迟响应**：前端无需等待数据库写入完成，即可快速获得推理结果。
- **标准化输出**：统一 JSON 协议，方便前后端对接。

# 

# 1：项目演示：

- 基本的登录注册以及登出功能
- **包含AI对话功能（含有记忆会话，同步数据，AI对话功能）**
- **AI图像识别功能（根据图片返回对应的结果，【注意：识别能力有限，只包含1000数据】）**

​

​

​

# 2：应用功能描述&&学习本应用你能收获什么？

该应用基于自主封装的 **HTTP 服务框架**，实现了以下功能与学习目标：

**图像识别功能**

- 封装了 ONNX Runtime 与预训练模型（MobileNetV2）的推理流程
- 具备基础的图像识别能力，能够完成 **图片 → 模型推理 → 标签结果** 的完整闭环
- 学习到了 **如何将已训练的大模型部署并在实际服务中调用**

**ChatGPT 接口功能**

- 在 C++ 服务框架中集成了调用大语言模型的能力（通过 cURL / HTTP API）
- 实现了简单的对话接口，支持前端与大模型的交互
- 学习到了 **如何部署、调用并进一步封装大模型，使其具备可复用性和扩展性**

**完善功能**

- 对已有的卡玛五子棋应用进行功能补全，修复并扩展了部分未实现逻辑
- 加深了对 **HTTP 服务框架请求处理流程、会话管理、消息分发** 的理解

# 3：项目应用技术栈：

包括但不限于

​

**后端框架与语言**

- **C++**：作为主要开发语言
- **自研 HTTP 服务框架**：用于处理请求、会话管理和接口封装
- **线程池：具体使用原因看下文**

**AI 与推理相关**

- **ONNX Runtime**：执行预训练模型推理（如 MobileNetV2）
- **OpenCV**：图像处理与数据预处理（resize、归一化、通道变换）
- **大语言模型 API (阿里云百炼等)**：通过 **cURL + HTTP** 进行调用

**工具与依赖库**

- **cURL**：HTTP 客户端请求封装（用于调用大模型 API）
- **nlohmann/json**：C++ JSON 解析与序列化
- **Muduo**：网络编程与并发支持
- **CMake**：项目构建与依赖管理

**数据存储与消息中间件**

- **MySQL****：用户会话、聊天记录与应用数据的持久化存储**
- **RabbitMQ：异步消息队列，用于任务调度和多用户并发处理**

具体的使用原因可以看下文，我们先配置环境吧？

# 4：如何启动项目？(docker配置版)

​

这边我已经将整个项目所需要的环境全部集成到一个docker镜像当中了，大家只需要在官方网站获取自己大模型的api-key在初始化容器的时候填入就可以直接将项目运行起来

**也是非常的方便，不用一个一个命令地自己去安装环境了！！！**

**注意：此docker镜像并不是第二版的，第二版和第一版的镜像隔离了，目的是方便观察差异**

## 4.0：获取api-key

​

进入此链接，获取自己本账号的api-key，后续会用到

[https://bailian.console.aliyun.com/?spm=5176.29619931.J__Z58Z6CX7MY__Ll8p1ZOR.1.1369521crCDcVM&tab=api#/api](https://bailian.console.aliyun.com/?spm=5176.29619931.J__Z58Z6CX7MY__Ll8p1ZOR.1.1369521crCDcVM&tab=api#/api)

需要点击密钥管理这个按钮进入到第二张图片这里

![](images/yuque/img_16_03.png)

![](images/yuque/img_16_04.png)

## 4.1：下载Docker

可以查看这个文章来下载对应的docker

[https://blog.csdn.net/jackeydengjun/article/details/147185455](https://blog.csdn.net/jackeydengjun/article/details/147185455)

## 4.2：从远程拉取我配置好的镜像并创建容器

\`\`\`cpp
# 将我提供的远程镜像拉取到本地
docker pull huanheart/ai-service-based-on-http-framework
\`\`\`

如果在这个过程中出现

Error response from daemon: Get "[https://registry-1.docker.io/v2/":](https://registry-1.docker.io/v2/":) context deadline exceeded

可以进行如下操作

​

\`\`\`cpp
# 生成该json
vim /etc/docker/daemon.json
\`\`\`

将下面内容复制上去

\`\`\`cpp
{
  "registry-mirrors": [
    "https://docker.registry.cyou",
    "https://docker-cf.registry.cyou",
    "https://dockercf.jsdelivr.fyi",
    "https://docker.jsdelivr.fyi",
    "https://dockertest.jsdelivr.fyi",
    "https://mirror2.aliyuncs.com",
    "https://dockerproxy.com",
    "https://mirror.baidubce.com",
    "https://docker.m.daocloud.io",
    "https://docker.nju.edu.cn",
    "https://docker.mirrors.sjtug.sjtu.edu.cn",
    "https://docker.mirrors.ustc.edu.cn",
    "https://mirror.iscas.ac.cn",
    "https://docker.rainbond.cc"
  ]
}

\`\`\`

保存之后重新启动docker，并重新拉取该镜像，应该就可以了，

如果还是不行,加上这几个

\`\`\`go
"https://docker.1ms.run",
"https://dockerproxy.com",
"https://hub.rat.dev"

\`\`\`

如果上述方式不可用了，大家可以自行网上搜索，或者在群里找

\`\`\`cpp
sudo systemctl daemon-reexec
sudo systemctl restart docker
\`\`\`

这边如果还遇到问题，请在项目群中联系@卡哥助手-焕心

接下来创建容器

![](images/yuque/img_16_05.png)

DASHSCOPE_API_KEY为第一步需要你获取的api-key

如果没有这个将不能进行聊天通信

\`\`\`cpp
docker run -dit \\
  -e DASHSCOPE_API_KEY="your_api_key_here" \\
  --name ai-httpserver \\
  -p 8006-8007:8006-8007 \\
  huanheart/ai-service-based-on-http-framework \\
  tail -f /dev/null

\`\`\`

## 4.3：进入docker

先docker ps查看是否有这个容器

![](images/yuque/img_16_06.png)

通过docker exec -it 724c8e6e5111 bash进入容器，**724c8e6e5111为你的CONTAINER ID ，看上面的截图，每个人的不一样**

进入了docker之后，跟着下面做

\`\`\`cpp
cd /root/httpserver_vsersion2/build
# 下面四步尤重要（每次启动一次docker都要执行下面四行命令）
# 用于开启服务，否则会出现错误
service mysql start 
rabbitmq-server -detached
rabbitmqctl start_app
# 不知道为什么不查看状态依旧出错，所以需要执行一次状态命令
rabbitmqctl status
\`\`\`

​

​

​

\`\`\`cpp
# 接着我们运行如下指令，拿8007端口举例

./http_server -p 8007
    
\`\`\`

访问成功！（若用wsl登录，请在浏览器上输入127.0.0.1)

![](images/yuque/img_16_07.png)

## 4.4：关于访问mysql的注意点：

这边容器的mysql的密码是123456，如果想要访问mysql的话记住这个密码即可

![](images/yuque/img_16_08.png)

## 4.5：对于项目启动的补充：

如果想要直接源代码启动的话，需要自己手动安装rabbitmq，opencv等相关库，可以查看cmake所需库来安装。但是自己手动安装肯定没有docker一键启动方便，毕竟环境已经够给你配好了，就没有必要从0继续搭建一次了。固然这里也不提供手动配置版的搭建过程了

# 5：代码调用链与相关解释(项目难点）

这边由于登录注册以及菜单卡玛五子棋都有了，像多增加的退出登入，返回页面这些逻辑也很简单，这边就不讲了

​

**项目难点的话，可以结合着这个第五点代码调用链与第六点简历写法来理解项目中的难点**

​

## 5.0：服务初始化阶段

**​**

### 调用链

- 设置muduo处理线程
- server调用initChatMessage，将数据库的信息加载到内存中，加载到指定用户的AIHelper中的messages数组中

(**注意：在插入数据库的时候，会将插入时的时间戳插入到表中，以便于服务重启的时候从数据库拿取数据**

**时可以根据时间戳将对话排序，保证恢复的对话是用户->ai->用户->ai这种形式，而非可能出现的**

**用户->用户->ai->ai 这种情况。保证数组存放的是一问一答的回答，防止上下文混乱**）

(**注意2：这边我并没有将initChatMessage这一步放到ChatServer中进行操作。原因：我一开始这么做的**

**但是发现数据库可能出现"卡死"情况**，找了一晚上没找到原因，后睡眠2s再调用就不会出现问题，大家若是

有兴趣可以重现bug，找找原因)

- **初始化RabbitMQThreadPool线程池，用于充当消费者（用于异步入库）目前不懂的看下文生产者的逻辑就知道了**。线程数默认为2，每个线程的回调函数为executeMysql

(注意：这边线程池每个线程的回调函数设计有个不方便之处，即不能做到消费者执行的回调函数是不同的，

而都是统一的executeMysql函数。但是做到这点也不难，可以参考[**星球的协程库**](https://wx.zsxq.com/group/88511825151142/topic/1525124545455242)上层维护一个任务类

将线程/协程有内容进行消费的时候，获取到对应生产者传入的任务类，将任务类里面封装的函数/协程执行，

而不是获取生产者传入的字符串并做相应处理。这样每个线程执行的函数体内容就可以是不同的了

- 开启线程池和server服务监听外部请求

### 相关代码：

\`\`\`cpp
ChatServer server(port, serverName);
    server.setThreadNum(4);
    std::this_thread::sleep_for(std::chrono::seconds(2));
    //初始化chat_message表到chatInformation中
    server.initChatMessage();    

    // 初始化消费队列的线程池，传入处理函数（这边所有线程都做统一的处理函数逻辑）
    RabbitMQThreadPool pool(RABBITMQ_HOST, QUEUE_NAME, THREAD_NUM, executeMysql);
    pool.start();

    server.start();
\`\`\`

​

## 5.1：AI对话发送流程

对应ChatSendHandler这个类

### 调用链：

- 前端发送携带了用户消息的请求
- **后端权限校验成功后，获取用户对应的AIHelperPtr**

**(这边有一个小思考点**：chatInformation是否能存放值而不存放指针/智能指针呢？

是不行的，若存放值，而不存放指针，那么我们后续对unordered_map[key]的映射之后的操作也需要加锁，

因为在c++中，stl并不是线程安全的

但是存放指针，我们后续操作的是指针指向的内容，并没有修改map中的内容，固然不需要加锁）

- 调用AIHelperPtr->addMessage(userId, username,true,userQuestion);将用户消息放入到AIHelper的messages数组中，**内部调用pushMessageToMysql，将sql构建出来放入到消息队列中**（**作为生产者，异步等待消费者将数据多线程写到mysql中，而不是当前线程同步插入到mysql中，因为考虑多用户多聊天情景，同步插入且插入的对象是mysql发送时间会很长，导致性能问题**)
- 调用AIHelperPtr->chat函数，内部构建消息将当前会话历史消息通过curl库发送给大模型，并利用WriteCallback函数回调数据给到上层AIHelper对象，**将ai回答插入数据库中以便于同步历史数据**
- 后端将ai回答响应给前端，前端渲染数据

​

### 相关代码

\`\`\`cpp
// 获取用户信息以及获取用户对应的表数据
        int userId = std::stoi(session->getValue("userId"));
        std::string username = session->getValue("username");

        std::shared_ptr<AIHelper> AIHelperPtr;
        {
            std::lock_guard<std::mutex> lock(server_->mutexForChatInformation);
            if (server_->chatInformation.find(userId) == server_->chatInformation.end()) {
                //从linux环境变量中拿取对应的api-key并初始化一个AIHelper
                const char* apiKey = std::getenv("DASHSCOPE_API_KEY");
                if (!apiKey) {
                    std::cerr << "Error: DASHSCOPE_API_KEY not found in environment!" << std::endl;
                    return;
                }
                // 插入一个新的 AIHelper
                server_->chatInformation.emplace(
                    userId,           
                    std::make_shared<AIHelper>(apiKey)
                );
            }
            AIHelperPtr= server_->chatInformation[userId];
        }

        std::string userQuestion;
        auto body = req.getBody();
        if (!body.empty()) {
            auto j = json::parse(body);
            if (j.contains("question")) userQuestion = j["question"];
        }
        //int userId, const std::string& userName, bool is_user, const std::string& userInput
        AIHelperPtr->addMessage(userId, username,true,userQuestion);

        std::string aiInformation=AIHelperPtr->chat(userId, username);
        json successResp;
        successResp["success"] = true;
        successResp["Information"] = aiInformation;
        std::string successBody = successResp.dump(4);

        resp->setStatusLine(req.getVersion(), http::HttpResponse::k200Ok, "OK");
        resp->setCloseConnection(false);
        resp->setContentType("application/json");
        resp->setContentLength(successBody.size());
        resp->setBody(successBody);
        return;
\`\`\`

## 5.2：同步历史数据：

​

对应ChatHistoryHandler这个类

### 调用链：

- 在初始化阶段，我们知道会将mysql表中的数据读取出来，加载到每一个用户对应的AIHelper中的messages中，**目的就是用于将历史信息渲染给前端**，方便在用户退出的时候，可以通过点击按钮的形式将数据恢复起来。**且通过保存数据库的形式，将用户会话保留起来**

(注意：这边可以发现每个用户只能有一个对话，而非像chatgpt那样可以创建多个会话，这个做也不难

有兴趣者可以加几个按钮，支持一个用户可以有多个AIHelper )

- 对用户的AIHelper中的messages做对应的遍历，将其所有数据返回给前端

(注意：这边是返回所有数据，若考虑到历史会话太多了，可以**使用前端懒加载和后端分页**的方式将部分数据

返回回去)

(注意2：同时这边默认是一问一答的标准，且用户总是为首先发言者，固然偶数下标为用户信息，奇数下标

为ai的信息，并没有考虑太多的特殊情形）

### 相关代码

\`\`\`cpp
// 获取用户信息以及获取用户对应的表数据
        int userId = std::stoi(session->getValue("userId"));
        std::string username = session->getValue("username");
        std::vector<std::pair<std::string, long long>> messages;
        {
            std::shared_ptr<AIHelper> AIHelperPtr;
            std::lock_guard<std::mutex> lock(server_->mutexForChatInformation);
            if (server_->chatInformation.find(userId) == server_->chatInformation.end()) {
                //从linux环境变量中拿取对应的api-key并初始化一个AIHelper
                const char* apiKey = std::getenv("DASHSCOPE_API_KEY");
                if (!apiKey) {
                    std::cerr << "Error: DASHSCOPE_API_KEY not found in environment!" << std::endl;
                    return;
                }
                // 插入一个新的 AIHelper
                server_->chatInformation.emplace(
                    userId,
                    std::make_shared<AIHelper>(apiKey)
                );
            }
            AIHelperPtr = server_->chatInformation[userId];
            messages= AIHelperPtr->GetMessages();
        }
        //start
        json successResp;
        successResp["success"] = true;
        successResp["history"] = json::array();

        for (size_t i = 0; i < messages.size(); ++i) {
            json msgJson;
            msgJson["is_user"] = (i % 2 == 0);
            msgJson["content"] = messages[i].first;
            successResp["history"].push_back(msgJson);
        }

        std::string successBody = successResp.dump(4);

        resp->setStatusLine(req.getVersion(), http::HttpResponse::k200Ok, "OK");
        resp->setCloseConnection(false);
        resp->setContentType("application/json");
        resp->setContentLength(successBody.size());
        resp->setBody(successBody);
        return;
\`\`\`

## 5.3：发送图片进行识别：

对应AIUploadSendHandler这个类

### 调用链

- 获取每个用户的ImageRecognizerPtr，将前端传过来的图像解析

(注意：选用base64数据存以json形式传入，是因为当前http服务框架底层并不支持form-data形式的数据）

- 将base64数据解码，调用ImageRecognizerPtr->PredictFromBuffer函数，从内存读取内容,内部利用 OpenCV与 ONNX Runtime 做对应的图像处理，将识别数据通过查表的形式返回

(注意: 这里有做硬编码处理，todo: 写yaml/toml等配置文件，将路径写到配置文件中)

- OpenCV(预处理)   把输入图片从任意大小 / 格式，变换成模型期望的**数值张量，像素->张量**
- ONNX Runtime(已加载好地模型)把张量喂给已经加载好的ONNX模型，运行前向传播

得到输出向量 ，最后映射到对应该模型的表中，返回表中内容）

​

### 相关代码：

\`\`\`cpp
        //处理对应流程start
        // 1. 解析 JSON 请求体
        int userId = std::stoi(session->getValue("userId"));
        std::shared_ptr<ImageRecognizer> ImageRecognizerPtr;
        {
            std::lock_guard<std::mutex> lock(server_->mutexForImageRecognizerMap);
            if (server_->ImageRecognizerMap.find(userId) == server_->ImageRecognizerMap.end()) {
                // 插入一个新的 ImageRecognizer
                server_->ImageRecognizerMap.emplace(
                    userId,
                    std::make_shared<ImageRecognizer>("/root/models/mobilenetv2/mobilenetv2-7.onnx")  //todo:需要将/path/to/model.onnx更改成真实路径
                );
            }
            ImageRecognizerPtr = server_->ImageRecognizerMap[userId];
        }

        auto body = req.getBody();
        std::string filename;
        std::string imageBase64;
        if (!body.empty()) {
            auto j = json::parse(body);
            if (j.contains("filename")) filename = j["filename"];
            if (j.contains("image")) imageBase64 = j["image"];
        }
        if (imageBase64.empty())
        {
            throw std::runtime_error("No image data provided");
        }

        std::string decodedData = base64_decode(imageBase64);
        std::vector<uchar> imgData(decodedData.begin(), decodedData.end());
        //开始进行识别
        std::string className = ImageRecognizerPtr->PredictFromBuffer(imgData);

        // 4. 构造响应
        json successResp;
        successResp["success"] = "ok";
        successResp["filename"] = filename;
        successResp["class_name"] = className;
        //模型对这个的置信度
        successResp["confidence"] = 0.95; // todo:这里写死了，后续你可以从模型里返回真实的

        //end
        std::string successBody = successResp.dump(4);

        resp->setStatusLine(req.getVersion(), http::HttpResponse::k200Ok, "OK");
        resp->setCloseConnection(false);
        resp->setContentType("application/json");
        resp->setContentLength(successBody.size());
        resp->setBody(successBody);
        return;
\`\`\`

## 5.4：AIHelper封装不足之处与改进（防sql注入）

原先的代码中是注释这种直接将用户的内容和ai的内容直接拼到字符串中，这种方式不好，因为可能导致sql注入或者其它情况

​

\`\`\`cpp
void AIHelper::pushMessageToMysql(int userId, const std::string& userName, bool is_user, const std::string& userInput,long long ms) {
    // std::string sql = "INSERT INTO chat_message (id, username, is_user, content, ts) VALUES ("
    //     + std::to_string(userId) + ", "  // 这里用 userId 作为 id，或者你自己生成
    //     + "'" + userName + "', "
    //     + std::to_string(is_user ? 1 : 0) + ", "
    //     + "'" + userInput + "', "
    //     + std::to_string(ms) + ")";
    std::string safeUserName = escapeString(userName);
    std::string safeUserInput = escapeString(userInput);

    std::string sql = "INSERT INTO chat_message (id, username, is_user, content, ts) VALUES ("
        + std::to_string(userId) + ", "
        + "'" + safeUserName + "', "
        + std::to_string(is_user ? 1 : 0) + ", "
        + "'" + safeUserInput + "', "
        + std::to_string(ms) + ")";
    //改成消息队列异步执行mysql操作，用于流量削峰与解耦逻辑
    //mysqlUtil_.executeUpdate(sql);

    MQManager::instance().publish("sql_queue", sql);
}
\`\`\`

​

### 什么是sql注入？

**​**

**SQL 注入（SQL Injection）** 是一种攻击方式，攻击者通过在用户输入中插入恶意的 SQL 代码片段，从而篡改 SQL 查询的逻辑，可能导致：

- 数据泄露（如获取管理员密码）
- 数据篡改（如修改用户权限）
- 数据库被删除（如执行 \`DROP TABLE\`）

​

举个例子：

\`\`\`cpp
'); DROP TABLE chat_message; --
\`\`\`

​

那么拼接后的语句可能变成如下（导致一个表被删除！！！）

\`\`\`cpp
INSERT INTO chat_message (id, username, is_user, content, ts) VALUES (
    123, 
    'Alice', 
    1, 
    ''); DROP TABLE chat_message; --', 
    1234567890)
\`\`\`

### 解决方案：

针对上述直接拼接的方式会导致sql注入，我们有以下两种方案可以解决（当然也可以使用上层orm框架）

- 方案一：使用参数化查询
- 方案二，对特殊字符进行转义

\`\`\`cpp
// 使用 ? 或 @param 占位符
std::string sql = "INSERT INTO chat_message (id, username, is_user, content, ts) VALUES (?, ?, ?, ?, ?)";
// 然后绑定参数（具体取决于你的数据库库）
\`\`\`

\`\`\`cpp
std::string safeUserName = escapeString(userName);
std::string safeUserInput = escapeString(userInput);
\`\`\`

​

这边选择了方案二，不过效果没有方案一好（因为仍然可能导致sql注入，后续todo：改成方案一）

### 其它情况说明:

在前面我们说这种可能会导致其它情况，举个例子：

我们知道插入的时候底层是由消费者线程池从消息队列拿取sql语句进行插入

​

如果不做相应的操作对字符进行转义字符操作，那么可能底层插入操作会失败（做一些不合法的sql语句。 里面有 \`'\`、换行、\`your-api-key\` 等特殊字符 → SQL 语法断裂 → MySQL 报错。  ）

​

那么如果消费者消费失败，此时此消息一直没被消费，导致后面的消息不被消费，从而出现接下来消息都不会被插入到数据库中。固然这边使用方案二/方案一可以解决这个问题

​

如果还是不理解的话可以尝试丢给ai，或者自己亲自恢复注释的代码，将方案二的更改删掉。

自己编译多用用项目的ai功能，多问几次可能就会出现此现象了.

​

# 6：应用层的简历写法

下面是应用层的简历写法

选择自己熟悉部分的内容加上去就行（因为我们知道完整的项目包含应用层+底层封装，此时的内容非常多，全部写上去可能导致简历过长，挑自己最熟悉的几个就行）

**AI 对话系统集成**：在自研 HTTP 框架中嵌入 AI 大模型对话接口，支持 多轮对话与会话记忆，实现用户上下文信息的持久化与同步，为用户提供个性化的智能交互体验。

**AI 图像识别功能**：基于 ONNXRuntime + OpenCV 部署轻量级分类模型，完成端到端图像识别任务，涵盖 数据预处理、推理调用、结果解析 全流程；在有限数据集（1000类）下，实现了较高的识别准确率。

**高并发 AI 推理服务**：依托 Muduo 网络库 + 线程池 实现高并发请求处理，将 AI 聊天与图像识别请求分发至 RabbitMQ 消息队列，异步执行模型推理与数据库写入，避免阻塞主线程，显著提升系统吞吐量。

**服务化与部署**：利用 Docker 构建应用环境，整合 MySQL、RabbitMQ 等组件，保证项目可快速部署和迁移。

** 用户功能实现   **实现用户登录、注册、退出及历史数据同步等功能，并基于自研 Session 机制完成用户状态校验

# 7：可能的面试问题

欢迎大家补充自己面试被问到的问题，我将会补充到第七点上

这块可以和项目同时观看，方便更好地理解。

不一定要在看项目之前就全把这部分的东西搞懂，有疑问的话可以在本项目的项目答疑群里面@卡哥助手-焕心

## 大模型方面: 为什么选择阿里云百炼?

​

很重要的一点，就是阿里云百炼是免费的，我们可以通过它方便的了解整一个大模型调用的部署过程

以下原因来源于阿里云官方

- **丰富的模型选择**：阿里云百炼提供通义千问商业版的官方API接口，同时支持主流第三方大模型，涵盖文本、图像、音视频等模态，并提供行业定制化模型。
- **便捷的开发工具**：阿里云百炼提供的Prompt自动优化、知识库管理、函数调用、流程编排、模型定制等能力，能帮助您更快地构建一个生产级别的大模型应用。
- **更低的使用成本**：相比本地部署大模型，您无需在前期投入巨额成本来购置硬件，后期也无需考虑硬件的维护和折旧。只需按实际用量付费，可显著降低成本。
- **严格的数据保护**：阿里云严格保护数据隐私，绝不会将您的数据用于模型训练。同时，您在构建应用或训练大模型过程中传输的数据都会经过加密，确保数据安全。

## 在本项目中，为什么又自己实现了一个线程池？

下层HTTP服务框架使用了muduo，且我们在使用muduo的时候设置了多个线程

内部底层会根据监听,事件等机制进行tcp连接的建立与连接后的事件的处理，而这些处理部分，是给相应的工作线程做的**(如果看过星球的协程库，muduo等项目的话对底层怎么处理的应该会很熟）**

那么如果多个人在进行chat操作，那么相当于多个线程在生产信息到消息队列中，而若不用线程池操作，而是只开一个线程读取消息队列的内容，这样消费的速度会很慢

而如果我们当消息队列中有一个消息就开辟一个线程，此时的资源消耗是非常大的，固然我们使用池化技术管理一个线程池，去进行消费消息

## 为什么项目在调用大模型的时候使用curl库？

因为c++本身不像，go这些语言，可以直接发送对应的http请求，像muduo这些都是在tcp层面的，而调用大模型需要http，固然这边使用了curl库

## 在项目中为什么使用RabbitMQ消息队列？

如果有看代码，那么可以知道消息队列相关的是在这么几处

**1：AIHelper中的pushMessageToMysql放入sql语句到消息队列中（充当生产者）**

**2：RabbitMQThreadPool中的worker将消息队列的读取进行相应操作（充当消费者）**

此时通过消息队列，就可以做到

**削峰填谷&&异步解耦**如果瞬间来了很多请求，RabbitMQ 可以先把它们缓存到队列里，后端慢慢消费，不至于直接压爆服务，因为我们知道本项目中是用于进行mysql插入语句，插入这些操作的最终导向是磁盘，是一个很耗性能的操作，固然我们使用消息队列&&线程池进行异步插入。

**可靠性**RabbitMQ 支持消息确认、持久化、重试，保证消息不会轻易丢失。

**多消费者扩展**很容易加多个消费者实例一起消费队列，而不用自己在AIHelper中主动将所有的sql语句主动**加锁**插入到工作队列中，让线程池的工作线程消费

​

​

## 你是如何保证用户会话的上下文记忆的？

系统会通过异步方式执行数据库的持久化操作

在服务初始化阶段，会预先从 MySQL 中按时间戳顺序拉取指定用户与 AI 的历史消息，并加载到内存中的映射结构中。这样，当用户登录时，系统即可基于内存数据快速恢复其上下文会话，实现持续的对话记忆。

## 在图像识别部分，为什么选择 MobileNetV2 作为模型？是否可以替换成其他模型？

**选择 MobileNetV2 的原因：**

1. **轻量级设计**：MobileNetV2 基于深度可分离卷积（Depthwise Separable Convolution），显著减少了模型参数量与计算量，非常适合在资源受限的环境（如 Docker 容器、移动端、嵌入式设备）中部署。
2. **性能均衡**：在保持较小模型体积和较低推理延迟的同时，MobileNetV2 在常见的图像分类与特征提取任务上能够提供较为稳定的准确率。

**缺点：**

- **表达能力有限**：相比 ResNet、DenseNet 等大规模模型，MobileNetV2 在复杂图像识别任务（例如高分辨率、多类别、细粒度识别）中的准确率偏低。
- **训练空间受限**：模型过于轻量化，参数量小，可能无法充分拟合复杂的数据分布。

## 如果要支持 多会话管理（像 ChatGPT 一样），该如何在现有框架上扩展？

​

（todo：这个也是目前AI升级版第二版将会做的内容）

​

在当前应用中，系统仅维护了一维的用户映射关系：   即每个用户仅对应一个 \`AIHelper\` 实例，无法支持多会话

若要扩展为 **多会话管理**（类似 ChatGPT 的对话模式），需要在用户标识的基础上增加会话维度。实现方式是为每一个会话生成唯一的 \`sessionID\`，并与 \`userID\` 共同组成复合键，作为映射的索引。

这样，数据结构将从：

- **单会话管理**：\`userID → AIHelper\`转变为：
- **多会话管理**：\`(userID, sessionID) → AIHelper\`

​

​

## 在生产环境中，AI 推理通常会带来性能瓶颈，你觉得可以采用哪些优化手段？

缓存（Cache）

相同或相似问题不必每次都跑模型，直接从缓存拿结果。

- 可以对 **输入文本做哈希**，作为 key；
- 输出结果存到 **Redis** 或本地内存；
- 设置 **TTL（有效期）**，比如 10 分钟；
- 遇到完全相同的问题时，直接返回缓存结果。

异步处理

由于当前底层 HTTP 服务框架不支持服务端主动向客户端推送结果，可扩展为支持该机制。具体方案为：

- 在服务端为 AI 推理逻辑增加线程池处理；
- 前端在请求发出后，先显示“正在处理中”的提示；
- 后端线程池完成推理后，通过扩展的推送机制将结果返回前端，实现异步交互。

## 如果阿里云百炼 API 出现延迟或不可用，你会如何保证系统的可用性？

超时控制

在 HTTP 请求调用百炼 API 时，应设置合理的超时时间（如 3s–5s），以避免请求无限阻塞。若在规定时间内未获得响应，系统可立即启用降级策略，例如：

- 返回缓存中的历史回答；
- 返回本地兜底提示（如“服务繁忙，请稍后再试”）。

​

异步处理

由于当前底层 HTTP 服务框架不支持服务端主动向客户端推送结果，可扩展为支持该机制。具体方案为：

- 在服务端为 AI 推理逻辑增加线程池处理；
- 前端在请求发出后，先显示“正在处理中”的提示；
- 后端线程池完成推理后，通过扩展的推送机制将结果返回前端，实现异步交互。

​

请求限流

为保证整体系统稳定性并避免触发百炼 API 的 QPS 限制，应实现请求限流策略：

- **全局限流**：控制系统整体调用速率；
- **细粒度限流**：针对单用户或单会话设置请求频率上限，避免个别用户消耗过多资源。

## 项目中 AI 部分采用了外部 API 调用，你会考虑 本地模型部署 吗？为什么？

在当前项目中，AI 能力通过外部 API（如阿里云百炼）调用实现。从项目推广和 Docker 部署的角度来看，**并不推荐在容器内直接集成本地大模型**，原因主要包括：

1. **镜像体积过大**本地模型通常体积在数 GB 甚至数十 GB 级别，如果随 Docker 一同部署，会导致镜像过于庞大，不利于分发和快速部署。
2. **资源消耗高**本地推理需要 GPU/CPU 大量算力和内存，对部署环境要求高，而外部 API 可以将算力压力交给云端。
3. **维护与升级成本高**本地模型需要持续更新和优化（如模型升级、权重替换、量化裁剪等），这会加重维护成本。相比之下，调用外部 API 可直接享受云厂商提供的最新模型能力。

因此，在推广阶段，更推荐采用外部 API 的方式：既能保证轻量级部署（Docker 镜像小、启动快），又能利用云端算力降低本地运维压力。

## 你觉得这个项目在 真实生产环境 中存在哪些不足？（例如性能、可靠性、安全性）

**项目在真实生产环境中的不足**

1. **健壮性不足**

- 当前消息存储采用一问一答数组结构：偶数下标存用户问题，奇数下标存 AI 回答。
- 若服务突发崩溃或异常中断，可能导致消息未按预期两两插入数据库。
- 这种情况下，后续服务恢复时可能出现用户问题与 AI 回答错位，导致上下文混乱或返回错误内容。

1. **潜在影响**

- 上下文错乱会直接影响用户体验，使 AI 回答与用户问题不匹配。
- 系统缺少容错机制和数据校验，难以保证长期稳定运行。

1. **改进方向**

- 引入事务管理或原子操作，确保消息写入的一致性。
- 增加服务恢复和校验机制，在系统重启或异常后能正确恢复用户–AI 对话上下文。

1. **底层限制**

- 系统基于自研 HTTP 服务框架，功能支持不如官方框架丰富，可能限制某些功能的开发和扩展。

## 如果要在现有框架中集成多模态（文本 + 语音 + 图像），你会如何设计？

**集成多模态说明**

- 多模态指系统能够同时处理多种类型的信息（文本、语音、图像等），并将它们融合以做判断或生成结果。
- 举例：用户上传图片并输入文字问题，系统的回答需要结合图片内容与文字问题生成。

**设计思路**

1. **扩展输入接口**支持文本、语音（转文本）、图像输入，统一封装消息结构：

\`\`\`cpp
type Message struct {
UserID    string
SessionID string
Text      string
ImageData []byte
AudioData []byte
Timestamp int64
}
\`\`\`

1. **多模态处理模块**

- **文本** → NLP 模型
- **图像** → 图像识别模型
- **语音** → ASR（语音转文本）+ NLP
- **融合层** → 整合不同模态输出，生成最终 AI 回复

1. **注意事项**

- 如果需要模型同时理解文字和图像，**需要确认所用模型是否支持多模态输入**；否则可能需要分开处理再做融合。

## 目前是单一服务架构，如果要拆分为 微服务架构，你会怎么拆？

**当前架构与微服务拆分方案**

1. **现状**

- 目前采用单体服务架构，主要包含：

- 图像识别服务
- 用户登录/登出/注册服务
- AI 聊天服务

- 功能模块尚不复杂，但正在持续扩展中。

1. **微服务拆分思路**

- 将核心模块拆分为独立服务：

- **用户服务**：负责用户认证、注册、会话管理
- **图像识别服务**：负责图像输入处理、识别、分析
- **AI 聊天服务**：负责多模态输入解析、上下文管理、AI 推理

- 每个服务可独立部署、扩展和维护，提高系统弹性与可用性

1. **分布式协调与通信**

- 使用 **Redis 或其他组件** 实现分布式锁和缓存，保证跨服务操作的一致性
- 请求入口通过 **网关** 统一接入，处理协议转换，并路由至具体微服务
- 服务间通信可采用 **RPC** 方式，例如：

- 使用 **brpc** 框架
- 或在 TCP 上层使用 **Protobuf** 做数据传输

- 通过微服务化，可实现独立伸缩、容错和异步处理，提高系统整体可用性

​`,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"},{id:"yq_17",index:17,doc_id:239459673,title:"10:AI应用服务平台(CppAIService)第二版【升级】",slug:"hzpib1xpx85xbg3n",url:"https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n",level:0,category:"AI服务架构",wordCount:20561,updatedAt:"2026-05-15T10:43:40.000Z",hash:"2b4104cff728",status:"FULL",tags:["第二版全景","轻量级MCP","两段式推理","RabbitMQ异步入库","多模型策略工厂","ONNX图像识别","百度TTS","单用户多会话"],linkedModule:"mod_ai_v2_core",linkedModuleTitle:"AI 应用服务平台 (CppAIService) 第二版核心升级 (20,561字)",linkedSourceFiles:["AIApps/ChatServer/include/AIUtil/AIStrategy.h","AIApps/ChatServer/include/AIUtil/AIFactory.h","AIApps/ChatServer/include/AIUtil/AIToolRegistry.h","AIApps/ChatServer/include/AIUtil/MQManager.h","AIApps/ChatServer/include/AIUtil/ImageRecognizer.h","AIApps/ChatServer/include/AIUtil/AISpeechProcessor.h","AIApps/ChatServer/include/ChatServer.h"],linkedClasses:["AIStrategy","AliyunStrategy","DouBaoStrategy","AliyunRAGStrategy","AliyunMcpStrategy","AIFactory","AIToolRegistry","MQManager","ImageRecognizer","AISpeechProcessor","ChatServer"],linkedFunctions:["AIToolRegistry::registerTool()","AIToolRegistry::invoke()","MQManager::publishMessage()","ImageRecognizer::recognizeImage()","ChatServer::start()"],interviewKeyPoints:["策略模式 + 注册式工厂如何实现多模型的扩展与替换？","轻量级 MCP 的核心思想是什么？如何通过两段式推理让大模型调用本地函数？","为什么引入 RabbitMQ？如何实现前台同步更新内存上下文、后台异步刷盘 MySQL？","单用户多会话隔离在 C++ 中如何设计？锁粒度与并发安全如何保证？","本地 ONNX Runtime 图像识别与 OpenCV 图像预处理链路是如何集成的？"],content:`# 10:AI应用服务平台(CppAIService)第二版【升级】

> 原始链接: [https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n](https://www.yuque.com/chengxuyuancarl/imh9xc/hzpib1xpx85xbg3n)  
> 更新时间: 2026-05-15T10:43:40.000Z | 字数: 20561

---

lake

​

仓库地址：[https://github.com/youngyangyang04/CppAIService](https://github.com/youngyangyang04/CppAIService)

## 与第一版的区别：

![](images/yuque/img_17_01.png)

# AIApps目录结构与文件说明:

\`\`\`cpp
AIApps/
    \`-- ChatServer
    |-- src
    |   |-- main.cpp							//用于线程池、服务初始化
    |   |-- handlers
    |   |   |-- ChatSpeechHandler.cpp		    //语音合成tts的业务
    |   |   |-- ChatSessionsHandler.cpp		    //获取所有会话id的业务
    |   |   |-- ChatSendHandler.cpp             //AI聊天界面的聊天业务
    |   |   |-- ChatRegisterHandler.cpp			//注册界面注册业务
    |   |   |-- ChatLogoutHandler.cpp			//菜单界面登出业务
    |   |   |-- ChatLoginHandler.cpp			//登录界面登录业务
    |   |   |-- ChatHistoryHandler.cpp			//AI聊天界面的同步历史数据业务
    |   |   |-- ChatHandler.cpp					//AI聊天界面	
    |   |   |-- ChatEntryHandler.cpp			//登录界面
    |   |   |-- ChatCreateAndSendHandler.cpp	//第一次会话处理
    |   |   |-- AIUploadSendHandler.cpp			//图像识别业务
    |   |   |-- AIUploadHandler.cpp				//有关图像识别页面
    |   |   \`-- AIMenuHandler.cpp				//有关菜单页面
    |   |-- ChatServer.cpp						//包装多个业务相关的映射表
    |   \`-- AIUtil
    |       |-- base64.cpp						//三方库，用于解码前端传进来的图片base64数据
    |       |-- MQManager.cpp					//封装消息队列有关的线程池（消费者生产者相关函数)
    |       |-- ImageRecognizer.cpp				//内部封装openncv等接口进行图像识别操作
    |       |-- AIToolRegistry.cpp				//用于注册MCP相关的工具
    |       |-- AIStrategy.cpp					//策略模式封装多模型对象
    |       |-- AISpeechProcessor.cpp			//包含asr与tts服务
    |       |-- AISessionIdGenerator.cpp		//生成唯一会话id，区分不同会话
    |       |-- AIHelper.cpp					//内部封装curl访问各个模型
    |       |-- AIFactory.cpp					//注册式工厂模式封装多模型对象
    |       \`-- AIConfig.cpp					//用于解析MCP相关的Json文件
    |-- resource
    |   |-- upload.html							//图像识别页面
    |   |-- menu.html							//菜单前端页面
    |   |-- entry.html							//登录前端页面
    |   |-- config.json							//用于MCP的配置文件
    |   |-- NotFound.html						//鉴权失败返回的前端页面
    |   \`-- AI.html								//AI聊天前端页面
    \`-- include
    |-- handlers
    |   |   |-- ChatSpeechHandler.h				//语音合成tts的业务
    |   |   |-- ChatSessionsHandler.h			//获取所有会话id的业务
    |   |   |-- ChatSendHandler.h           	//AI聊天界面的聊天业务
    |   |   |-- ChatRegisterHandler.h			//注册界面注册业务
    |   |   |-- ChatLogoutHandler.h				//菜单界面登出业务
    |   |   |-- ChatLoginHandler.h				//登录界面登录业务
    |   |   |-- ChatHistoryHandler.h			//AI聊天界面的同步历史数据业务
    |   |   |-- ChatHandler.h					//AI聊天界面	
    |   |   |-- ChatEntryHandler.h				//登录界面
    |   |   |-- ChatCreateAndSendHandler.h		//第一次会话处理
    |   |   |-- AIUploadSendHandler.h			//图像识别业务
    |   |   |-- AIUploadHandler.h				//有关图像识别页面
    |   |   \`-- AIMenuHandler.h					//有关菜单页面
    |   |-- ChatServer.h						//包装多个业务相关的映射表
    \`-- AIUtil
    |       |-- base64.h						//三方库，用于解码前端传进来的图片base64数据
    |       |-- MQManager.h						//封装消息队列有关的线程池（消费者生产者相关函数)
    |       |-- ImageRecognizer.h				//内部封装openncv等接口进行图像识别操作
    |       |-- AIToolRegistry.h				//用于注册MCP相关的工具
    |       |-- AIStrategy.h					//策略模式封装多模型对象
    |       |-- AISpeechProcessor.h				//包含asr与tts服务
    |       |-- AISessionIdGenerator.h			//生成唯一会话id，区分不同会话
    |       |-- AIHelper.h						//内部封装curl访问各个模型
    |       |-- AIFactory.h						//注册式工厂模式封装多模型对象
    |       \`-- AIConfig.h						//用于解析MCP相关的Json文件
\`\`\`

- \`handlers/\`：对话、登录、历史同步、图像识别、TTS、会话管理…**业务入口全在这里**
- \`AIUtil/\`：

- \`AIStrategy\` / \`AIFactory\`：**多模型抽象与创建**
- \`AIHelper\`：**对话主控**（模型选择、上下文管理、入库调度）
- \`AIToolRegistry\` / \`AIConfig\`：**工具注册 + Prompt 模板化**
- \`MQManager\`：**生产/消费**（与 MySQL 解耦）
- \`ImageRecognizer\` / \`AISpeechProcessor\`：**多模态能力**
- \`AISessionIdGenerator\`：**唯一会话 ID**

- \`resource/\`：**前端页面 & MCP 配置**（\`config.json\`）

# 主要更新内容说明

1. **重构与优化**

- 重构了第一版中的部分代码，提升可维护性与可读性。
- 更改所有前端 HTML 文件，优化对应界面，改善交互与视觉体验。

1. **Docker 更新**

- 更新Docker，将第一版的Docker和第二版分离，方便观察二者版本区别

1. **语音功能**

- 增加语音能力，包括语音识别与语音合成。
- 当前业务逻辑主要使用语音合成功能。

1. **实现AI调用服务内部函数 & MCP 设计**

- 实现内部 MCP 服务，使 AI 具备访问外部工具的能力，例如查询指定城市天气、获取当前时间等（后续若想加入更多AI所不具备的能力可通过配置&代码来做到）。

1. **RAG 功能**

- 构建基于知识库的 AI（Retrieval-Augmented Generation），支持通过知识检索增强回答质量。

1. **多会话支持**

- 系统从「单用户单会话」升级为「单用户多会话」模式，支持同时管理多个对话上下文。

1. **多模型选择**

- 新增多模型支持，用户可自由切换不同模型（如豆包、阿里百炼等）。

# 系统设计

## 技术架构图

相对第一版，第二版做了不少的重构和新增内容，但是总体的技术架构图是基本不变的

![](images/yuque/img_17_02.png)

架构图展示了 **自研 C++ HTTP 服务框架** 如何将 AI 模型调用、图像识别、消息队列、数据库存储与多厂商模型 API 进行解耦，实现了**高性能、可扩展、可私有化部署**的 AI 应用平台。

---

## 一、总体结构概览

整个系统从上到下可分为四层：

| 层级 | 主要功能 |
| --- | --- |
| **1️⃣**** 客户端层** | 用户通过 Web / 命令行 / 其他 SDK 发起请求（例如 AI 聊天、文档问答、图像识别等） |
| **2️⃣**** 业务服务层（C++ 框架核心）** | 提供对话服务、图像识别服务、用户管理服务，是整个平台的核心逻辑层 |
| **3️⃣**** 数据与消息层** | 负责业务数据的存储、异步任务的转发与缓冲，提升系统稳定性与并发性能 |
| **4️⃣**** 推理与第三方平台层** | 对接多家 AI 大模型（阿里云、百度智能云、火山引擎等）以及本地推理引擎（ONNXRuntime） |

---

## 二、核心模块解析

### ​业务服务层（核心逻辑层）

这是平台的心脏部分，全部基于 C++ 自研框架实现，支持多线程、高并发和异步 I/O。

包括三个核心服务：

1. **AI 聊天服务**

- 封装各大模型的 API 调用（GPT、通义、百炼、火山、智谱等）。
- 负责多轮上下文管理、函数调用、工具注册（MCP 思想）。
- 内部使用 \`json\`、\`curl\` 等库实现 HTTP 通信与 JSON 解析。

1. **AI 图像识别服务**

- 基于 \`OpenCV\` + \`ONNXRuntime\` 实现图像分类、OCR、目标检测等任务。
- 可以调用外部模型（百度智能云视觉、火山引擎）或使用本地 ONNX 模型部署。

1. **用户服务**

- 提供登录、用户信息管理、配额限制、访问日志等功能。
- 与 MySQL / RabbitMQ 打通，实现异步入库和高可靠消息处理。

🔧 用到的关键第三方库：

- \`Muduo\`：C++ 网络库，实现 Reactor 模型和高并发网络通信
- \`SimpleAmqpClient\`：RabbitMQ 的 C++ 封装
- \`OpenCV\`：图像识别与处理
- \`Base64\`：图像与数据编码传输

---

### ​数据与消息层

- **MySQL**存储业务数据、用户记录、会话历史、日志等，配合 \`DbException\` 实现稳定的数据库访问。

数据库中有两张表

**chat_message表:**

\`\`\`sql
CREATE TABLE chat_message (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  session_id VARCHAR(32) NOT NULL COMMENT '会话ID',
  username VARCHAR(255) NOT NULL COMMENT '用户名',
  is_user TINYINT(1) NOT NULL COMMENT '是否为用户消息(1=用户, 0=系统/AI)',
  content TEXT NOT NULL COMMENT '消息内容',
  ts BIGINT NOT NULL COMMENT '时间戳(毫秒)',

  PRIMARY KEY (id),

  INDEX idx_session_id (session_id),
  INDEX idx_username (username),
  INDEX idx_ts (ts),
  INDEX idx_session_id_ts (session_id, ts)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='聊天消息表';
\`\`\`

**users表:**

\`\`\`sql
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  username VARCHAR(255) NOT NULL COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码(加密存储)',

  PRIMARY KEY (id),
  UNIQUE KEY uk_username (username)

) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
\`\`\`

- **RabbitMQ**负责异步消息传递，例如：

- AI 聊天日志异步落库；
- 图像识别任务异步执行；
- 提升系统并发度与响应速度。

✅ 这部分是系统的“解耦层”，让前台 HTTP 请求和后台任务异步化执行，提升整体吞吐。

---

### ​推理引擎层

- 使用 **ONNXRuntime (x64-1.20.0)** 实现本地模型推理。
- 支持多种部署方式（Docker / 本地 / GPU）。
- 可加载本地量化模型（如 GGUF）进行离线 AI 计算。

在私有化部署场景下，可以直接通过本地 ONNXRuntime 完成推理，不依赖外部 API，大幅降低成本。

---

### ​第三方平台层

- 对接阿里云、百度智能云、火山引擎等主流 LLM API。
- 通过配置 API-Key 即可动态选择服务商。
- 既能支持通用大模型（如 GPT / 通义），也能支持图像、语音识别类接口。

✅ 支持“云端 + 本地”双模架构：云端负责通用模型推理，本地负责高性能推理与缓存。

---

### 🧩 项目支撑与部署层

- **CMake**：跨平台构建系统，统一管理依赖与编译配置；
- **Docker**：容器化部署，快速一键启动完整 AI 服务平台；
- **GitHub**：项目仓库托管与版本管理。

🧱 支撑体系保证平台具备“可移植、可维护、可复现”的工程特性。

## 流程图

​

![](images/yuque/img_17_03.png)

上图展示了整个系统从 **客户端请求 → ChatServer 业务调度 → 多模型调用 → 异步消息入库** 的全链路流程：

## ​ 一、总体架构思路

该系统基于自研的 **C++ HTTP 服务框架** 构建，是一个支持：

- 多模型接入（GPT / 通义 / 豆包 / 百炼 / 百川）
- 图像识别（ONNX + OpenCV）
- 语音识别与合成（ASR/TTS）
- 异步消息入库（RabbitMQ）
- 多会话管理
- MCP 工具协议化

的完整 AI 应用服务平台。

系统核心是 \`ChatServer\`，它负责：

- 接收客户端请求；
- 调用对应业务 \`Handler\`；
- 根据类型分发到不同 AI 模块（聊天、图像识别、语音）；
- 将结果异步入库或交由队列处理。

## ​二、整体流程解读

### 1️⃣ 客户端请求

用户通过网页前端（如 \`AI.html\`、\`upload.html\`）发起请求，例如：

\`\`\`plain
POST /chat/send
\`\`\`

请求体中包含用户输入、上传图像、会话 ID 等数据。C++ 服务器接收请求后交由 \`ChatServer\` 处理。

### 2️⃣ ChatServer 主控模块

文件：\`src/ChatServer.cpp\`职责：统一路由分发、上下文维护、异步写库。

内部核心数据结构：

- \`ImageRecognizerMap\`：缓存图像识别器对象；
- \`sessionsIdsMap\`：管理所有活跃会话；
- \`chatInformation\`：缓存每个 AI 对话上下文（AIHelper 实例）。

当请求进入时：

1. \`ChatServer\` 根据 URL 分发到对应 \`Handler\`；
2. 初始化/复用 \`AIHelper\`（按用户 session）；
3. 将请求转发至模型策略层或图像识别层；
4. 结果通过 JSON 返回客户端；
5. 同时异步写入 MySQL 或发送至 RabbitMQ。

---

### 3️⃣ 各种业务 Handler（业务层）

位于：\`src/handlers/\`这些文件实现了不同功能模块，对应 HTTP 路由。

| 业务类型 | 对应文件 | 功能说明 |
| --- | --- | --- |
| 登录 / 注册 / 登出 | \`ChatLoginHandler.cpp\`    、\`ChatRegisterHandler.cpp\`    、\`ChatLogoutHandler.cpp\` | 用户登录鉴权、注册、退出 |
| 聊天接口 | \`ChatSendHandler.cpp\`    、\`ChatCreateAndSendHandler.cpp\` | 接收用户输入，调用 AI 模型 |
| 会话管理 | \`ChatSessionsHandler.cpp\`    、\`ChatHistoryHandler.cpp\` | 获取、恢复聊天记录 |
| 图像识别 | \`AIUploadHandler.cpp\`    、\`AIUploadSendHandler.cpp\` | 前端上传图像，执行识别并返回结果 |
| 语音功能 | \`ChatSpeechHandler.cpp\` | 文本转语音（TTS） |
| 页面跳转 | \`ChatEntryHandler.cpp\`    、\`AIMenuHandler.cpp\` | 控制前端界面逻辑（登录、菜单） |

---

### 4️⃣ AI 功能模块（AIUtil 工具层）

目录：\`src/AIUtil/\`这是整个 AI 平台的“核心引擎层”，负责和外部模型、工具交互。

| 模块 | 说明 |
| --- | --- |
| **AIHelper.cpp** | 封装 HTTP 调用逻辑（curl），可连接 GPT、通义、百炼等；处理上下文拼接。 |
| **AIStrategy.cpp / AIFactory.cpp** | 工厂 + 策略模式实现多模型抽象，统一接口层：\`LLMProvider::chat(prompt)\`    。 |
| **ImageRecognizer.cpp** | 调用 OpenCV + ONNX 模型执行图像识别。 |
| **AISpeechProcessor.cpp** | 接入百度智能云 ASR（语音识别）与 TTS（语音合成）API。 |
| **MQManager.cpp** | 基于 \`SimpleAmqpClient\`    实现 RabbitMQ 生产者 / 消费者，异步消息入库。 |
| **AISessionIdGenerator.cpp** | 为每个新会话生成唯一 ID。 |
| **AIToolRegistry.cpp** | MCP 工具注册中心，支持模型调用外部工具。 |
| **AIConfig.cpp** | 解析 \`config.json\`    （MCP 工具/Prompt 模板配置）。 |

## 基本调用链：

这里的只讲基本的调用链，方便大家理清是怎么一个处理流程。重点的调用链查看第三点（右侧目录找第三点）

![](images/yuque/img_17_04.png)

### 初始化阶段：

初始化ChatServer以及线程池（具体看注释）

\`\`\`cpp
//工作线程绑定的函数
void executeMysql(const std::string sql) {
    http::MysqlUtil mysqlUtil_;
    mysqlUtil_.executeUpdate(sql);
}
    //初始化ChatServer
    ChatServer server(port, serverName);
    server.setThreadNum(4);
    std::this_thread::sleep_for(std::chrono::seconds(2));
    server.initChatMessage();    
    //初始化线程池，将参数绑定
    RabbitMQThreadPool pool(RABBITMQ_HOST, QUEUE_NAME, THREAD_NUM, executeMysql);
    //启动线程池，处理MQ的消息，作为消费者
    pool.start();
    //开启服务监听外来请求
    server.start();
\`\`\`

其中ChatServer初始化会做以下操作:

\`\`\`cpp
void ChatServer::initialize() {
    //初始化MysqlUtil（用于和mysql对接的，封装了mysql相关句柄）
	http::MysqlUtil::init("tcp://127.0.0.1:3306", "root", "123456", "ChatHttpServer", 5);
    //初始化Session，属于http服务框架底层的内容，和上层AI应用层没有关联
    initializeSession();
    //初始化中间件，属于http服务框架底层的内容，和上层AI应用层没有关联
    initializeMiddleware();
    //初始化路由接口，后续来请求，会通过具体路由的地址通过具体的Handler做相应业务处理
    //如httpServer_.Get("/chat", std::make_shared<ChatHandler>(this));
    initializeRouter();
}
\`\`\`

ChatServer也会做initChatMessage函数操作（会将chatInformation和sessionsIdsMap做初始化操作）

用于将消息和会话信息绑定

\`\`\`cpp
    while (res->next()) {
        long long user_id = 0;
        std::string session_id ;  
        std::string username, content;
        long long ts = 0;
        int is_user = 1;

        try {
            user_id    = res->getInt64("id");       
            session_id = res->getString("session_id");  
            username   = res->getString("username");
            content    = res->getString("content");
            ts         = res->getInt64("ts");
            is_user    = res->getInt("is_user");
        }
        catch (const std::exception& e) {
            std::cerr << "Failed to read row: " << e.what() << std::endl;
            continue; 
        }

        auto& userSessions = chatInformation[user_id];

        std::shared_ptr<AIHelper> helper;
        auto itSession = userSessions.find(session_id);
        if (itSession == userSessions.end()) {
            helper = std::make_shared<AIHelper>();
            userSessions[session_id] = helper;
			sessionsIdsMap[user_id].push_back(session_id);
        } else {
            helper = itSession->second;
        }

        helper->restoreMessage(content, ts);
    }
\`\`\`

### 请求->响应阶段：

​

以/chat/send接口举例，当有请求过来的时候，底层http服务框架会做相应处理，根据封装的映射表映射到ChatSendHandler对象去做处理

（这边http服务框架具体做的事情，详情看前几章，本篇侧重应用层就不细讲了）

后续将会执行以下核心代码，获取一些信息（如userID，用户提问的信息，每个Handler获取的信息不一定完全相同）

获取完信息后,执行指定相关业务，如AIHelperPtr->chat，执行内部封装好了的逻辑，最终响应给用户执行结果的相应信息

\`\`\`cpp
        auto session = server_->getSessionManager()->getSession(req, resp);
        LOG_INFO << "session->getValue(\\"isLoggedIn\\") = " << session->getValue("isLoggedIn");
        if (session->getValue("isLoggedIn") != "true")
        {

            json errorResp;
            errorResp["status"] = "error";
            errorResp["message"] = "Unauthorized";
            std::string errorBody = errorResp.dump(4);

            server_->packageResp(req.getVersion(), http::HttpResponse::k401Unauthorized,
                "Unauthorized", true, "application/json", errorBody.size(),
                errorBody, resp);
            return;
        }

        int userId = std::stoi(session->getValue("userId"));
        std::string username = session->getValue("username");

        std::string userQuestion;
        std::string modelType;
        std::string sessionId;

        auto body = req.getBody();
        if (!body.empty()) {
            auto j = json::parse(body);
            if (j.contains("question")) userQuestion = j["question"];
            if (j.contains("sessionId")) sessionId = j["sessionId"];

            modelType = j.contains("modelType") ? j["modelType"].get<std::string>() : "1";
        }
        //执行相应逻辑信息，如AIHelperPtr->chat函数

        resp->setStatusLine(req.getVersion(), http::HttpResponse::k200Ok, "OK");
        resp->setCloseConnection(false);
        resp->setContentType("application/json");
        resp->setContentLength(successBody.size());
        resp->setBody(successBody);
        return;
\`\`\`

# 0：前置知识

## 什么是RAG？

​什么是 RAG？——让AI更聪明地“看资料”

AI为什么需要RAG？

我们都知道，现在的AI（比如ChatGPT、文心一言、通义千问）能回答很多问题，但它们其实**不是真的“联网搜索”**，而是根据**训练时学到的内容**来回答。

问题是：

- 如果问AI一些**最新的信息**（比如“2025年苹果发布了什么手机？”），它可能不知道；
- 或者问一些**公司内部文档、产品资料**，AI也没法直接访问。

​这时候，就需要一种“外挂大脑”的技术 —— **RAG**。

---

RAG 是什么？

**RAG** 的全称是 **Retrieval-Augmented Generation**，中文翻译是 **“检索增强生成”**。

简单来说：

RAG 就是让 AI 在回答问题前，**先去资料库里找相关内容（检索）**，再结合这些资料**生成回答（生成）**。

也就是：

“先查资料，再回答。”

---

RAG 的工作流程（通俗版）

可以想象一个场景：

你问AI：“我们公司退款政策是怎样的？”

AI的内部流程是这样的 ​

1. **检索（Retrieval）**AI 先在一个知识库（比如公司内部文档、产品FAQ、数据库）中搜索和“退款政策”有关的内容。
2. **增强（Augmentation）**把找到的资料作为“参考信息”，附加到模型的上下文里。
3. **生成（Generation）**AI 再根据用户提问 + 找到的资料，一起生成最终回答。这样，它就不会“瞎编”，而是引用到了真实的数据。

---

一个例子 ​

假设你问AI：

“你能告诉我我们产品A的售后流程吗？”

如果没有RAG：AI 可能回答得模糊不清：“一般来说，售后流程包括联系客服、维修、退换货等步骤……”

如果有RAG：AI 会去你公司知识库里检索到真实文件，比如：

「产品A售后流程」：用户需登录官网 → 填写售后申请 → 等待审核 → 邮寄产品 → 收到检测结果。

然后AI会回答：

“根据公司售后文档，产品A的售后流程如下：登录官网填写申请表 → 审核通过后邮寄产品 → 检测后通知结果。”

---

RAG 的组成部分

一个典型的RAG系统包含三个核心部分：

| 模块 | 作用 | 举例 |
| --- | --- | --- |
| **文档存储** | 保存知识内容 | 公司文档、PDF、产品资料 |
| **检索引擎** | 负责快速查找相关内容 | 向量数据库（如 Milvus、FAISS、Pinecone） |
| **大语言模型** | 根据资料生成回答 | GPT、Claude、通义千问等 |

---

RAG 的好处

✅ **让AI“知道最新的事”**：不受训练时间限制✅ **减少AI胡说八道（幻觉）**✅ **可用作企业内部知识助手**✅ **灵活扩展**：更新资料库就能“更新知识”

---

总结一句话

**RAG 就是给AI加上了“搜索引擎的脑子”。**它不再死记硬背，而是会“先查再答”，让AI更可靠、更聪明。

## 什么是MCP？

​什么是 MCP？——让 AI 学会“自己用工具”的新协议

AI 为什么需要 MCP？

你可能发现现在的 AI 聊天模型（比如 ChatGPT、Claude、通义千问）越来越聪明了，它们不仅能聊天，还能：

- 调用计算器帮你算账；
- 查天气；
- 查询数据库；
- 写代码、执行命令、甚至控制外部程序。

但是——不同的开发者、公司、框架，**接入 AI 工具的方式都不一样**，比如：

- 有的用 OpenAI 的 “function calling”；
- 有的用 LangChain 的 “tools”；
- 有的自建 HTTP 接口；
- 有的要写插件。

结果就像每个 AI 都在说自己的“方言”，**互不兼容**。

​所以，AI 世界需要一种“通用语言”，来告诉模型：

“外部有哪些工具可以用、它们怎么用、怎么返回结果。”

于是，这个标准就诞生了 —— **MCP**。

---

MCP 是什么？

**MCP** 全称是 **Model Context Protocol（模型上下文协议）**。

一句话解释：

**MCP 是一种让AI模型和外部工具之间能通用交互的标准协议。**

它的目标是：

让模型像人一样，可以“发现工具”“调用工具”“获取结果”，而不需要每家都重新发明一套接口。

---

MCP 的核心思想

可以这么理解：

以前：每个 AI 应用都要告诉模型“我有这些接口，你得这样调用”。

现在有了 MCP：模型只要遵守 MCP 协议，就能自动“发现”有哪些工具，并按照统一格式使用它们。

就像：

- USB 协议让各种键盘、鼠标都能插电脑；
- MCP 协议让各种 AI 工具都能接到模型上。

MCP 的工作流程

当 AI 模型和 MCP 服务打交道时，大致会经历以下几个步骤 ​

1. **发现（Discover）**模型先问 MCP 服务：“你这边有哪些工具可以用？”服务返回工具列表和它们的描述。
2. **调用（Call）**模型根据任务决定要用哪个工具，并发送调用请求（带参数）。
3. **执行（Execute）**MCP 服务执行对应的操作，比如访问数据库、获取接口数据等。
4. **返回（Respond）**MCP 把结果返回给模型，模型再把结果融入回答中。

---

一个例子 ​

假设你问AI：

“帮我查一下东京今天的天气。”

模型通过 MCP 交互的过程是：

1. 模型问 MCP 服务：“你有天气查询的工具吗？”
2. MCP 回复：“有一个 \`get_weather\` 工具，参数是城市名称。”
3. 模型调用：

\`\`\`plain
{
  "tool": "get_weather",
  "args": { "city": "Tokyo" }
}
\`\`\`

1. MCP 执行 API 请求 → 获取天气信息；
2. MCP 返回结果 → 模型生成回答：“东京今天晴，气温24°C。”

整个过程是自动协作完成的，模型不需要提前硬编码接口。

---

MCP 的好处

✅ **通用标准化**：不论是本地工具、HTTP接口、数据库、AI插件，都能统一接入✅ **可扩展**：新增工具不用改模型，只要注册到 MCP 即可✅ **安全可控**：模型不能随便访问外部，只能用注册的 MCP 工具✅ **多语言支持**：C++、Go、Python、Java等语言都可以实现自己的 MCP 服务端✅ **结合RAG更强大**：模型可以通过 MCP 调用“知识库检索工具”，实现动态问答

​

## RAG和MCP的区别：

RAG 是让 AI “查资料”，MCP 是让 AI “动手干活”。

| 对比点 | RAG | MCP |
| --- | --- | --- |
| **核心目标** | 让模型“知道”更多内容 | 让模型“会用”外部工具 |
| **工作方式** | 查知识库 → 提供上下文 | 注册工具 → 执行操作 |
| **典型用途** | 文档问答、企业知识助手 | 数据查询、操作执行、自动化任务 |
| **能否结合** | ✅ 可以结合使用：模型通过 MCP 调用 RAG 检索模块 |  |

## 什么是TTS?什么是ASR?

**​**

**TTS（Text-to-Speech）——文本转语音**

**全称：** Text To Speech**作用：** 把「文字」转换成「语音」。

​

✅ 举例：

你输入一句话：

“你好，今天天气真不错。”

TTS 系统会输出一段语音（mp3、wav等格式），听起来就像一个人说出这句话。

​

🎧 **ASR（Automatic Speech Recognition）——自动语音识别**

**全称：** Automatic Speech Recognition**作用：** 把「语音」转换成「文字」。

✅ 举例：

你说了一句话：

“今天天气真不错。”

ASR 系统会识别并输出文字：

“今天天气真不错。”

# 1：第二版项目演示：

# 2：如何启动项目？(docker配置版)

相较于第一版，第二版需要获取的api-key倒是会多一些

包含

- 1：第一版所需要的阿里云百炼大模型的api-key（用于多模型调用中的阿里百炼大模型调用功能）
- 2：字节火山引擎中豆包大模型的api-key(用于多模型调用中的豆包大模型调用功能）
- 3：百度相关的client_id还有client_secret（用于语音合成tts相关功能）
- 4：阿里知识库的知识库ID（需要自己创建一个知识库，打造自己的RAG服务）

## 2.1：获取阿里云百炼大模型的api-key

进入此链接，获取自己本账号的api-key，后续会用到

[https://bailian.console.aliyun.com/?spm=5176.29619931.J__Z58Z6CX7MY__Ll8p1ZOR.1.1369521crCDcVM&tab=api#/api](https://bailian.console.aliyun.com/?spm=5176.29619931.J__Z58Z6CX7MY__Ll8p1ZOR.1.1369521crCDcVM&tab=api#/api)

需要点击密钥管理这个按钮进入到第二张图片这里

![](images/yuque/img_17_05.png)

创建完之后记住它方便后续创建docker使用

![](images/yuque/img_17_06.png)

## 2.2: 获取字节火山引擎中豆包大模型的api-key

登录进入火山引擎界面

搜索豆包大模型

![](images/yuque/img_17_07.png)

![](images/yuque/img_17_08.png)

![](images/yuque/img_17_09.png)

![](images/yuque/img_17_10.png)

创建对应API-Key，记住他方便后续创建docker使用，

**注意：这边创建API KEY完后，进入step 2阶段，会出现开通模型的内容，选择开启所有服务(这边开启250715的服务也行，但是一键开启所有服务就不用专门去找250715服务了。如果没有开通，即便有api-key，后续访问大模型的时候会返回空数据，调用不成功!!!）**

![](images/yuque/img_17_11.png)

​

​

## 2.3：获取百度相关的client_id还有client_secret

登录进入百度智能云，搜索语音合成

![](images/yuque/img_17_12.png)

点击立即使用（注意：中途可能会让你注册服务什么的，直接开通服务即可）

![](images/yuque/img_17_13.png)

点击下面的API在线调试

![](images/yuque/img_17_14.png)

从这里可以查看对应client_id还有client_secret

![](images/yuque/img_17_15.png)

## 2.4：构造阿里知识库&&获取知识库ID

进入该地点，点击右侧的创建知识库：[https://bailian.console.aliyun.com/?tab=app#/knowledge-base](https://bailian.console.aliyun.com/?tab=app#/knowledge-base)

![](images/yuque/img_17_16.png)

知识库一般从pdf，word文档中读入，按照我这么选择即可，点击下一步

![](images/yuque/img_17_17.png)

这边我将一份简历放入进去，后续搭建好了之后，AI会知道我当前知识库的信息，后续基于知识库中的内容做出相应回答。点击下一步

![](images/yuque/img_17_18.png)

直接点导入完成即可，不需要弄太复杂的操作

![](images/yuque/img_17_19.png)

创建完成

![](images/yuque/img_17_20.png)

再进入此，创建一个新应用 [https://bailian.console.aliyun.com/?tab=app#/app-center](https://bailian.console.aliyun.com/?tab=app#/app-center)

![](images/yuque/img_17_21.png)

创建智能体应用，输入应用名称，点击立即创建

![](images/yuque/img_17_22.png)

​

模型选择：通义千问-Plus-Latest

由于我刚刚创建的知识库是有关简历的，所以这边提示词写成如下了

大家可以自行根据不同的知识库，来告诉AI不同的提示词，打造特有的AI

​

![](images/yuque/img_17_23.png)

点击知识，将刚刚创建的知识库导入进来

![](images/yuque/img_17_24.png)

选择刚刚创建的知识库

![](images/yuque/img_17_25.png)

点击发布

![](images/yuque/img_17_26.png)

进入发布渠道

![](images/yuque/img_17_27.png)

获取知识库ID，这边可以进行复制

![](images/yuque/img_17_28.png)

## 2.5：下载Docker

可以查看这个文章来下载对应的docker

[https://blog.csdn.net/jackeydengjun/article/details/147185455](https://blog.csdn.net/jackeydengjun/article/details/147185455)

## 2.6：从远程拉取我配置好的镜像并创建容器（注意，第一版和第二版的docker并不一样，若考虑镜像太大，可以删除第一版镜像和容器再拉取第二版的镜像)

\`\`\`plain
# 将我提供的远程镜像拉取到本地
docker pull huanheart/ai-service-based-on-http-framework-2
\`\`\`

如果在这个过程中出现

Error response from daemon: Get "[https://registry-1.docker.io/v2/":](https://registry-1.docker.io/v2/":) context deadline exceeded

可以进行如下操作

这边如果还遇到问题，请在项目群中联系@卡哥助手-焕心

​

\`\`\`plain
# 生成该json
vim /etc/docker/daemon.json
\`\`\`

​

将下面内容复制上去

​

\`\`\`json
{
  "registry-mirrors": [
    "https://docker.registry.cyou",
    "https://docker-cf.registry.cyou",
    "https://dockercf.jsdelivr.fyi",
    "https://docker.jsdelivr.fyi",
    "https://dockertest.jsdelivr.fyi",
    "https://mirror2.aliyuncs.com",
    "https://dockerproxy.com",
    "https://mirror.baidubce.com",
    "https://docker.m.daocloud.io",
    "https://docker.nju.edu.cn",
    "https://docker.mirrors.sjtug.sjtu.edu.cn",
    "https://docker.mirrors.ustc.edu.cn",
    "https://mirror.iscas.ac.cn",
    "https://docker.rainbond.cc"
  ]
}
\`\`\`

​

保存之后重新启动docker，并重新拉取该镜像，应该就可以了，如果上述方式不可用了，大家可以自行网上搜索，或者在本项目群里找@卡哥助手-焕心

​

\`\`\`cpp
sudo systemctl daemon-reexec
sudo systemctl restart docker
\`\`\`

​

如果还是不行,增加下面几个镜像源

\`\`\`go
"https://docker.1ms.run",
"https://dockerproxy.com",
"https://hub.rat.dev"

\`\`\`

​

接下来创建容器

- DASHSCOPE_API_KEY为第一步需要你获取的api-key（如果没有这个将不能进行阿里云百炼聊天、阿里云百炼MCP，阿里云百炼RAG通信）
- DOUBAO_API_KEY是第二步中获取的api-key，没有这个用不了豆包功能
- BAIDU_CLIENT_ID和BAIDU_CLIENT_SECRET是第三步中获取的（没有这个不能使用语音合成功能)
- Knowledge_Base_ID为刚刚复制的知识库应用的ID（没有这个不能使用阿里云RAG）

\`\`\`cpp
docker run -dit \\
    -e DASHSCOPE_API_KEY="your_api_key_here" \\
    -e Knowledge_Base_ID="Knowledge_Base_ID" \\
    -e BAIDU_CLIENT_ID="BAIDU_CLIENT_ID" \\
    -e BAIDU_CLIENT_SECRET="BAIDU_CLIENT_SECRET" \\
    -e DOUBAO_API_KEY="DOUBAO_API_KEY" \\
    --name ai-httpserver-2 \\
    -p 8116-8117:8116-8117 \\
    huanheart/ai-service-based-on-http-framework-2 \\
    tail -f /dev/null
\`\`\`

## 2.7：进入docker

先docker ps查看是否有这个容器

![](images/yuque/img_17_29.png)

通过docker exec -it 724c8e6e5111 bash进入容器，**724c8e6e5111为你的CONTAINER ID ，看上面的截图，每个人的不一样**

进入了docker之后，跟着下面做

​

\`\`\`plain
cd /root/httpserver_vsersion2/build
# 下面四步尤重要（每次启动一次docker都要执行下面四行命令）
# 用于开启服务，否则会出现错误
service mysql start 
rabbitmq-server -detached
rabbitmqctl start_app
# 不知道为什么不查看状态依旧出错，所以需要执行一次状态命令
rabbitmqctl status
\`\`\`

​

\`\`\`plain
# 接着我们运行如下指令，拿8117端口举例

./http_server -p 8117
\`\`\`

访问成功！（若用wsl登录，请在浏览器上输入127.0.0.1)

![](images/yuque/img_17_30.png)

## 2.8：关于访问mysql的注意点：

这边容器的mysql的密码是123456，如果想要访问mysql的话记住这个密码即可

![](images/yuque/img_17_31.png)

## 2.9：对于项目启动的补充：

如果想要直接源代码启动的话，需要自己手动安装rabbitmq，opencv等相关库，可以查看cmake所需库来安装。但是自己手动安装肯定没有docker一键启动方便，毕竟环境已经够给你配好了，就没有必要从0继续搭建一次了。固然这里也不提供手动配置版的搭建过程了

# 3：第二版代码重点调用链与相关解释(项目难点）

​

针对一些第一版说过了的东西，第二版这边就不再重复提及了（像服务初始化这些代码逻辑都是没有变的，直接看第一版的描述即可了）

针对一些不是很重点的内容，这边也没有提及，大家可以看代码来理解

​

**在看项目难点之前，强烈建议大家先把MCP和RAG看明白了再看下文**

​

## 3.0：单用户单会话模式->单用户多会话模式的重构与相关调用链说明

​

在这之前，我先说明一下现在进入AI.html界面的逻辑：

- 首先会请求**当前用户所有的会话ID**，存到前端中。
- 当如视频所示每次点击指定会话的时候，若是进入AI.html界面以来第一次点击某一个会话，会**自动触发**第一版已经做好了的**同步历史数据功能。**自动将对应会话消息填充到界面上
- 若需要**创建新会话需要点击新会话**，后续会请求/chat/send-new-session相关接口。走到ChatCreateAndSendHandler逻辑中去(和第一版ChatSendHandler不一样地方在于会先创建一个唯一会话)
- 后续在此会话基础上都会请求/chat/send接口，走到第一版就维护好了的ChatSendHandler逻辑中去

​

上述是重构后浏览器端和服务端的一个交互逻辑，接下来说明一下有哪些地方重构了

​

我们知道，之前是单用户单会话模式，那么维护的其实是一个一维映射表

\`\`\`cpp
std::unordered_map<int, std::shared_ptr<AIHelper>> chatInformation;
\`\`\`

第二版重构成了单用户多会话。

先是通过userid映射到指定的会话当中，后续通过唯一会话ID再映射到指定的AIHelper中，如下所示

\`\`\`cpp
std::unordered_map<int, std::unordered_map<std::string,std::shared_ptr<AIHelper> > > chatInformation;
\`\`\`

​

因为对应的表变成二维的了，引入了SessionID。那么自然ChatServer初始化的逻辑与MYSQL中的表结构也变化了

从代码中可以看出，相对于第一版，chat_message这张表中多加了一个session_id字段，后续在插入信息的时候，会将session_id也插入到对应的表中。其它的逻辑其实是和第一版差不多的

这边在初始化读取数据库的信息的时候，会将所有用户对应的所会话id加入到sessionsIdsMap中，**这边的目的就是在用户进入AI.html界面的时候，前端调用接口获取所有会话ID，后续才能根据会话ID恢复指定的历史数据**

\`\`\`cpp
void ChatServer::readDataFromMySQL() {
    std::string sql = "SELECT id, username,session_id, is_user, content, ts FROM chat_message ORDER BY ts ASC, id ASC";

    sql::ResultSet* res;
    try {
        res = mysqlUtil_.executeQuery(sql);
    }
    catch (const std::exception& e) {
        std::cerr << "MySQL query failed: " << e.what() << std::endl;
        return;
    }

    while (res->next()) {
        long long user_id = 0;
        std::string session_id ;  
        std::string username, content;
        long long ts = 0;
        int is_user = 1;

        try {
            user_id    = res->getInt64("id");       
            session_id = res->getString("session_id");  
            username   = res->getString("username");
            content    = res->getString("content");
            ts         = res->getInt64("ts");
            is_user    = res->getInt("is_user");
        }
        catch (const std::exception& e) {
            std::cerr << "Failed to read row: " << e.what() << std::endl;
            continue; 
        }

        auto& userSessions = chatInformation[user_id];

        std::shared_ptr<AIHelper> helper;
        auto itSession = userSessions.find(session_id);
        if (itSession == userSessions.end()) {
            helper = std::make_shared<AIHelper>();
            userSessions[session_id] = helper;
            //在这边做的原因：防止重复放入session_id到vector中
            //也可以采用双重map操作
            sessionsIdsMap[user_id].push_back(session_id);
        } else {
            helper = itSession->second;
        }
        
        helper->restoreMessage(content, ts);
    }

    std::cout << "readDataFromMySQL finished" << std::endl;
}
\`\`\`

​

## 3.1：多模型切换&设计模式的应用(策略模式&工厂模式）

**策略模式的核心思想：**将一类算法或行为抽象出来，通过统一的接口进行调用，让不同的策略可以自由替换，而不影响上层业务逻辑。

​

**工厂模式的核心思想：**将对象的创建过程封装起来，让上层代码只需关心“要什么”，而无需关心“怎么创建”，从而降低耦合度。

​

**为什么要使用设计模式：**在版本一中，系统只能调用阿里百炼的大模型；但在版本二中，新增了多模型切换的需求。通过调研发现，不同厂商（如阿里百炼、字节豆包）的接口请求格式并不完全一致，甚至同一厂商下（如阿里百炼普通模型与RAG模型）也存在差异。因此，需要将这些“模型调用逻辑”抽象出来，上层使用者只需统一调用接口即可，无需关心具体的请求实现。当后续需要接入新的大模型时，只需新增一个对应的策略类，并在工厂中注册即可，无需修改原有逻辑。这种方式符合 **“开闭原则”** —— 对扩展开放、对修改封闭，使系统在扩展性与可维护性方面得到显著提升。

​

**注意：很多人在学习设计模式的时候容易将策略模式和工厂模式搞混，分不清这两个有什么不同**

**​**

**区别：工厂模式侧重于对象创建的不同的逻辑，而策略模式侧重于行为的不同的逻辑**

可以查看如下文章来加深理解：[设计模式：策略模式和工厂模式混合使用原创](https://blog.csdn.net/qq_27586963/article/details/133045626)

更多设计模式的学习可以进入**卡码网**[设计模式编程课](https://kamacoder.com/course.php?course_id=14)进行学习（**设计模式的讲解 配套 23道编程题目，通过代码实战学会设计模式！**）

​

\`\`\`cpp
//阿里百炼调用模型的curl请求体封装如下
json AliyunStrategy::buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const {
    json payload;
    payload["model"] = getModel();
    json msgArray = json::array();

    for (size_t i = 0; i < messages.size(); ++i) {
        json msg;
        if (i % 2 == 0) {
            msg["role"] = "user";
        }
        else {
            msg["role"] = "assistant";
        }
        msg["content"] = messages[i].first;
        msgArray.push_back(msg);
    }
    payload["messages"] = msgArray;
    return payload;
}
//阿里百炼RAG调用模型的curl请求体封装如下
json AliyunRAGStrategy::buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const {
    json payload;
    json msgArray = json::array();
    for (size_t i = 0; i < messages.size(); ++i) {
        json msg;
        msg["role"] = (i % 2 == 0 ? "user" : "assistant");
        msg["content"] = messages[i].first;
        msgArray.push_back(msg);
    }
    payload["input"]["messages"] = msgArray;
    payload["parameters"] = json::object(); 
    return payload;
}
\`\`\`

和刚刚csdn文章那篇封装思路其实是一样的，都是采用了多种接口+注册式工厂来做的

下面是策略相关类的.h文件

\`\`\`cpp
#pragma once
#include <string>
#include <vector>
#include <utility>
#include <iostream>
#include <sstream>
#include <memory>

#include "../../../../HttpServer/include/utils/JsonUtil.h"

class AIStrategy {
public:
    virtual ~AIStrategy() = default;

    // APIַ
    virtual std::string getApiUrl() const = 0;

    // API Key
    virtual std::string getApiKey() const = 0;

    virtual std::string getModel() const = 0;

    virtual json buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const = 0;

    virtual std::string parseResponse(const json& response) const = 0;

    bool isMCPModel = false;

};

class AliyunStrategy : public AIStrategy {

public:
    AliyunStrategy() {
        const char* key = std::getenv("DASHSCOPE_API_KEY");
        if (!key) throw std::runtime_error("Aliyun API Key not found!");
        apiKey_ = key;
        isMCPModel = false;
    }

    std::string getApiUrl() const override;
    std::string getApiKey() const override;
    std::string getModel() const override;

    json buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const override;
    std::string parseResponse(const json& response) const override;

private:
    std::string apiKey_;
};

class DouBaoStrategy : public AIStrategy {

public:
    DouBaoStrategy() {
        const char* key = std::getenv("DOUBAO_API_KEY");
        if (!key) throw std::runtime_error("DOUBAO API Key not found!");
        apiKey_ = key;
        isMCPModel = false;
    }
    std::string getApiUrl() const override;
    std::string getApiKey() const override;
    std::string getModel() const override;

    json buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const override;
    std::string parseResponse(const json& response) const override;

private:
    std::string apiKey_;
};

class AliyunRAGStrategy : public AIStrategy {

public:
    AliyunRAGStrategy() {
        const char* key = std::getenv("DASHSCOPE_API_KEY");
        if (!key) throw std::runtime_error("Aliyun API Key not found!");
        apiKey_ = key;
        isMCPModel = false;
    }

    std::string getApiUrl() const override;
    std::string getApiKey() const override;
    std::string getModel() const override;

    json buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const override;
    std::string parseResponse(const json& response) const override;

private:
    std::string apiKey_;
};

class AliyunMcpStrategy : public AIStrategy {

public:
    AliyunMcpStrategy() {
        const char* key = std::getenv("DASHSCOPE_API_KEY");
        if (!key) throw std::runtime_error("Aliyun API Key not found!");
        apiKey_ = key;
        isMCPModel = true;
    }

    std::string getApiUrl() const override;
    std::string getApiKey() const override;
    std::string getModel() const override;

    json buildRequest(const std::vector<std::pair<std::string, long long>>& messages) const override;
    std::string parseResponse(const json& response) const override;

private:
    std::string apiKey_;
};

\`\`\`

​

下面是注册式工厂的实现：

\`\`\`cpp
#pragma once
#include <string>
#include <vector>
#include <utility>
#include <iostream>
#include <sstream>
#include <memory>
#include <functional>
#include <unordered_map>
#include <string>

#include"AIStrategy.h"

class StrategyFactory {

public:
    using Creator = std::function<std::shared_ptr<AIStrategy>()>;

    static StrategyFactory& instance();

    void registerStrategy(const std::string& name, Creator creator);

    std::shared_ptr<AIStrategy> create(const std::string& name);

private:
    StrategyFactory() = default;
    std::unordered_map<std::string, Creator> creators;
};

template<typename T>
struct StrategyRegister {
    StrategyRegister(const std::string& name) {
        StrategyFactory::instance().registerStrategy(name, [] {
            std::shared_ptr<AIStrategy> instance = std::make_shared<T>();
            return instance;
            });
    }
};

\`\`\`

\`\`\`cpp
#include"../include/AIUtil/AIFactory.h"

StrategyFactory& StrategyFactory::instance() {
    static StrategyFactory factory;
    return factory;
}

void StrategyFactory::registerStrategy(const std::string& name, Creator creator) {
    creators[name] = std::move(creator);
}

std::shared_ptr<AIStrategy> StrategyFactory::create(const std::string& name) {
    auto it = creators.find(name);
    if (it == creators.end()) {
        throw std::runtime_error("Unknown strategy: " + name);
    }
    return it->second();
}

\`\`\`

​

在AIStrategy.cpp的最下面，有这么将几个策略类注册到工厂中，会在服务刚开始的时候，就调用AIFactory.h中定义的StrategyRegister函数，将一个匿名表达式注册到工厂中，后续当使用std::shared_ptr<AIStrategy> StrategyFactory::create(std::name)函数的时候，他会自动调用该匿名表达式，创建一个新的智能指针，返回给用户。【**注意：这边是创建一个新的智能指针，而不是将原先服务初始化static的对象的引用计数+1并返回给使用者，让每一个使用者得到的对象都不是同一个，防止后续扩展的时候需要考虑锁问题**】

\`\`\`cpp
static StrategyRegister<AliyunStrategy> regAliyun("1");
static StrategyRegister<DouBaoStrategy> regDoubao("2");
static StrategyRegister<AliyunRAGStrategy> regAliyunRag("3");
static StrategyRegister<AliyunMcpStrategy> regAliyunMcp("4");
\`\`\`

​

​

## 3.2：语音合成：AISpeechProcessor.h/cpp

体现相关业务的handler是**ChatSpeechHandler**

**这里只有语音合成(TTS)的相关服务**，虽然AISpeechProcessor类中也有封装语音识别，但是经多轮测试，发现识别出来的效果并不是很准确，所以就没有用到相关的这个功能了

**原先目的是想做一个和AI语音通信的服务**（但是由于考虑到**语音识别不准确**，会导致后续都不准确，所以更改成了如今的功能：点击对话文字，可将语音进行输出）

**用户通过浏览器输入语音->通过ASR语音识别技术将其转化文字->发送给AI->AI文字通过TTS技术转化成语音->前端将语音输出**

​

具体AISpeechProcessor封装是根据文档这边2.4图中对应链接的示例进行curl封装的

![](images/yuque/img_17_32.png)

​

语音合成器中的语音合成（TTS）逻辑如下：

语音合成（创建任务 -> 轮询 -> 返回 speech_url）

这么做的原因：**百度相关API只有调用TTS接口和查询任务是否做完这两个接口**

**且由于AI项目基于自研HTTP服务框架（只支持单向通信）并不能做到拥有sse/websocket这种服务端主动发送数据给客户端的功能**，固然只能占用当前线程去做一个拥有**超时机制的轮询检测**，当查询到语音合成服务完成了之后再返回给客户端相关地址，后浏览器会播放指定地址的音频内容

​

如果有websocket/sse这种主动推送的功能，那么可以将查询的服务放入到后台线程，做到select/poll甚至epoll的封装，达到对应io多路复用的效果，最后当查询成功之后，再**主动通信**给到客户端

​

\`\`\`cpp
// 语音合成（创建任务 -> 轮询 -> 返回 speech_url）
std::string AISpeechProcessor::synthesize(const std::string& text,
                                          const std::string& format,
                                          const std::string& lang,
                                          int speed,
                                          int pitch,
                                          int volume) 
{
    CURL* curl = nullptr;
    CURLcode res;
    std::string response;

    // ----------- 第一步：创建合成任务 -----------
    curl = curl_easy_init();
    if (!curl) return "";

    std::string create_url = "https://aip.baidubce.com/rpc/2.0/tts/v1/create?access_token=" + token_;

    curl_easy_setopt(curl, CURLOPT_URL, create_url.c_str());
    curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "POST");
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
    curl_easy_setopt(curl, CURLOPT_DEFAULT_PROTOCOL, "undefined");

    struct curl_slist* headers = NULL;
    headers = curl_slist_append(headers, "Content-Type: application/json");
    headers = curl_slist_append(headers, "Accept: application/json");
    curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

    json body = {
        {"text", text},
        {"format", format},
        {"lang", lang},
        {"speed", speed},
        {"pitch", pitch},
        {"volume", volume},
        {"enable_subtitle", 0}
    };

    std::string data = body.dump();

    response.clear();
    curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, onWriteData);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

    res = curl_easy_perform(curl);
    if (res != CURLE_OK) {
        curl_easy_cleanup(curl);
        if (headers) curl_slist_free_all(headers);
        return "";
    }

    curl_easy_cleanup(curl);
    if (headers) curl_slist_free_all(headers);

    // 解析 task_id
    std::string task_id;
    try {
        json result_json = json::parse(response);
        // 有些示例中 task_id 在根节点或者在 tasks_info[0] 中都可能出现，优先取根 task_id，再尝试 tasks_info
        if (result_json.contains("task_id") && result_json["task_id"].is_string()) {
            task_id = result_json["task_id"].get<std::string>();
        } else if (result_json.contains("tasks_info") && result_json["tasks_info"].is_array()
                   && !result_json["tasks_info"].empty() && result_json["tasks_info"][0].contains("task_id")) {
            task_id = result_json["tasks_info"][0]["task_id"].get<std::string>();
        }
    } catch (...) {
        return "";
    }

    if (task_id.empty()) return "";

    // ----------- 第二步：轮询查询任务状态 -----------
    std::string speech_url;
    json query;
    query["task_ids"] = json::array({task_id});

    // 轮询，上限可按需调整（例如超时 30 次）
    const int max_loops = 60; // 最多等 60 秒（sleep 1s）
    int loops = 0;
    while (loops++ < max_loops) {
        std::this_thread::sleep_for(std::chrono::seconds(1));

        curl = curl_easy_init();
        if (!curl) break;

        std::string query_url = "https://aip.baidubce.com/rpc/2.0/tts/v1/query?access_token=" + token_;
        curl_easy_setopt(curl, CURLOPT_URL, query_url.c_str());
        curl_easy_setopt(curl, CURLOPT_CUSTOMREQUEST, "POST");
        curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);
        curl_easy_setopt(curl, CURLOPT_DEFAULT_PROTOCOL, "undefined");

        headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        headers = curl_slist_append(headers, "Accept: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        data = query.dump();
        response.clear();
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, data.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, onWriteData);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

        res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
        if (headers) curl_slist_free_all(headers);
        if (res != CURLE_OK) break;

        // 解析轮询结果
        try {
            json queryResult = json::parse(response);
            if (queryResult.contains("tasks_info") && queryResult["tasks_info"].is_array()
                && !queryResult["tasks_info"].empty()) {
                json task = queryResult["tasks_info"][0];
                if (task.contains("task_status") && task["task_status"].is_string()) {
                    std::string status = task["task_status"].get<std::string>();
                    if (status == "Success" && task.contains("task_result") && task["task_result"].contains("speech_url")) {
                        speech_url = task["task_result"]["speech_url"].get<std::string>();
                        break;
                    }
                }
            }
        } catch (...) {
            break;
        }
    }

    return speech_url;
}
\`\`\`

应用层业务逻辑如下：

\`\`\`cpp
    try
    {
        //获取唯一会话id
        auto session = server_->getSessionManager()->getSession(req, resp);
        LOG_INFO << "session->getValue(\\"isLoggedIn\\") = " << session->getValue("isLoggedIn");
        if (session->getValue("isLoggedIn") != "true")
        {

            json errorResp;
            errorResp["status"] = "error";
            errorResp["message"] = "Unauthorized";
            std::string errorBody = errorResp.dump(4);

            server_->packageResp(req.getVersion(), http::HttpResponse::k401Unauthorized,
                "Unauthorized", true, "application/json", errorBody.size(),
                errorBody, resp);
            return;
        }

        int userId = std::stoi(session->getValue("userId"));
        std::string username = session->getValue("username");

        std::string text;

        auto body = req.getBody();
        if (!body.empty()) {
            auto j = json::parse(body);
            if (j.contains("text")) text = j["text"];
        }

        const char* secretEnv = std::getenv("BAIDU_CLIENT_SECRET");
        const char* idEnv = std::getenv("BAIDU_CLIENT_ID");

        if (!secretEnv) throw std::runtime_error("BAIDU_CLIENT_SECRET not found!");
        if (!idEnv) throw std::runtime_error("BAIDU_CLIENT_ID not found!");

        std::string clientSecret(secretEnv);
        std::string clientId(idEnv);
        //创建语音处理器
        AISpeechProcessor speechProcessor(clientId, clientSecret);
        
        //获取语音合成后的文件地址&转发给用户
        std::string speechUrl = speechProcessor.synthesize(text,
                                                           "mp3-16k", 
                                                           "zh",  
                                                            5, 
                                                            5, 
                                                            5 );  

        json successResp;
        successResp["success"] = true;
        successResp["url"] = speechUrl;
        std::string successBody = successResp.dump(4);
        resp->setStatusLine(req.getVersion(), http::HttpResponse::k200Ok, "OK");
        resp->setCloseConnection(false);
        resp->setContentType("application/json");
        resp->setContentLength(successBody.size());
        resp->setBody(successBody);
        return;
    }
\`\`\`

​

​

## 3.3：重构大模型调用逻辑(重构AIHelper类逻辑)

​

在第一版中，我们知道ChatSendHandler是调用大模型请求的处理类

这边第二版有将它的处理逻辑重构了，我们来对比一下可以发现，原先在ChatSendHandler中需要使用者手动调用AIHelperPtr->addMessage将用户消息插入，这样设计的不好，固然我将模型切换，用户/AI消息插入这些逻辑都封在了AIHelper中

**这样使用者就可以一步到位做到Chat了，无需关注其它逻辑，具体里面做了什么，看3.4轻量级MCP应用设计**

​

第一版ChatSendHandler核心处理代码逻辑如下：

\`\`\`cpp
        std::string userQuestion;
        auto body = req.getBody();
        if (!body.empty()) {
            auto j = json::parse(body);
            if (j.contains("question")) userQuestion = j["question"];
        }
        //int userId, const std::string& userName, bool is_user, const std::string& userInput
        AIHelperPtr->addMessage(userId, username,true,userQuestion);

        std::string aiInformation=AIHelperPtr->chat(userId, username);
\`\`\`

第二版ChatSendHandler核心代码逻辑如下

\`\`\`cpp
        std::string userQuestion;
        std::string modelType;
        std::string sessionId;

        auto body = req.getBody();
        if (!body.empty()) {
            auto j = json::parse(body);
            if (j.contains("question")) userQuestion = j["question"];
            if (j.contains("sessionId")) sessionId = j["sessionId"];

            modelType = j.contains("modelType") ? j["modelType"].get<std::string>() : "1";
        }

        std::shared_ptr<AIHelper> AIHelperPtr;
        {
            std::lock_guard<std::mutex> lock(server_->mutexForChatInformation);

            auto& userSessions = server_->chatInformation[userId];

            if (userSessions.find(sessionId) == userSessions.end()) {

                userSessions.emplace( 
                    sessionId,
                    std::make_shared<AIHelper>()
                );
            }
            AIHelperPtr= userSessions[sessionId];
        }
        

        std::string aiInformation=AIHelperPtr->chat(userId, username,sessionId, userQuestion, modelType);
\`\`\`

​

​

​

## 3.4：（重点）轻量级MCP应用设计

​

我们来看AIHelper里面的chat成员函数重构成什么样子了

可以看到

- 先是**设置了"策略"**，通过前端传入的模型类型，创建了后台内部的策略类（阿里百炼，阿里RAG，豆包这种）
- 判断是否是MCP模型，这边**只有阿里MCP的isMCPModel设置为了true**，其它都是false

- **若为false**，那么和第一版的逻辑其实差不多，将消息**同步插入到内存中**，**异步通过RabbitMQ插入到数据库MYSQL中**
- **若为true,  **说明是支持MCP的，会做MCP相应的操作

在讲MCP具体操作之前，先讲一下我设计MCP的想法。MCP操作的时候用到了哪些具体的类以及工具

​

\`\`\`cpp
// 发送聊天消息
std::string AIHelper::chat(int userId,std::string userName, std::string sessionId, std::string userQuestion, std::string modelType) {

    //设置策略
    setStrategy(StrategyFactory::instance().create(modelType));

    
    if (false == strategy->isMCPModel) {

        addMessage(userId, userName, true, userQuestion, sessionId);
        json payload = strategy->buildRequest(this->messages);

        //执行请求
        json response = executeCurl(payload);
        std::string answer = strategy->parseResponse(response);
        addMessage(userId, userName, false, answer, sessionId);
        return answer.empty() ? "[Error] 无法解析响应" : answer;
    }
    //说明是MCP模型 
    //...做相应操作
}

\`\`\`

​

### MCP设计思想：

相比于 Java 或 Python，**C++ 在 AI 应用开发生态上仍然相对薄弱**。以 Java 为例，它拥有像 **Spring AI** 这样的框架，可以帮助开发者快速集成大模型接口并实现工具调用；**而在 C++ 中，这些功能往往需要我们自行设计和实现。**

**以第一版中构建的AI 聊天系统为例，我们需要自己维护消息表、管理消息的时间顺序（例如通过时间戳），这些在 Java/Python 框架中通常已经被封装好。但在 C++ 中，我们必须手动去实现**。

MCP（Model Context Protocol）同样如此。它的目标是让模型可以“调用外部工具”并通过统一协议交互。那么在 C++ 中，如何实现这种“AI 调用自定义工具”的效果呢？

在查阅资料后我发现，C++ 生态中还没有像某些 RAG 框架那样的三方现成方案可以通过curl进行调用，**于是无奈之下我想到一种替代方案**：

1. **服务端首先将用户输入与提示词合并，询问 AI 是否需要调用某个工具；**
2. **如果模型返回需要调用某个工具，服务端根据返回内容执行该工具逻辑；**
3. **然后将工具结果与上下文合并，再次发送给 AI，获得最终回答。**

通过这种方式，就可以模拟出“**AI 主动调用服务端工具**”的**效果**。

后来我查阅文章，研究 Spring AI 的底层实现，**发现它的设计理念与我的思路非常相似**：**模型同样是通过输出控制是否调用工具，而框架负责执行具体调用并将结果再反馈给模型。这说明即便没有现成框架，C++ 依然可以通过合理的设计达到同样的效果**。

在实现自定义 MCP 协议的过程中，我设计了一个 \`config.json\` 文件，用于集中管理工具列表、提示词模板等配置。这样做的好处是：**工具定义与业务逻辑解耦**，后续如果修改某个工具，只需要调整 JSON 配置，而不需要改动太多服务端代码。  （若是新增工具，在服务端这边相关工具对象的接口注册到指定的接口中即可）

这里的 **prompt_template** 起到了核心作用。因为当前的 AI 模型并不会「真正调用函数」，而是根据提示词判断是否应该返回一个结构化的 JSON。服务端再根据这个 JSON 决定是否调用对应工具。

需要特别注意的是，**提示词的设计必须足够精准**。如果提示不够明确，模型可能依然返回普通文本而不是 JSON，这会让服务端误以为模型不需要调用工具，导致逻辑错误。因此，在实际使用中我通过不断测试与微调，让模型始终能稳定地按约定格式返回结果。

\`\`\`json
{
  "prompt_template": "我是一个第三方中间人，帮客户端传达信息的，你帮我查看用户所说的话是否需要调用工具。特别注意：若需要调用工具，只需要输出json，其它任何内容不需要输出!!!如果只是回答用户的问题或者用户所有参数并没有完全对应的上，请直接输出文本回答。以下是用户所说的话：{user_input}\\n你可以使用以下工具:\\n{tool_list}\\n如果需要调用，请输出JSON格式: {\\"tool\\":\\"工具名\\",\\"args\\":{\\"key\\":\\"value\\"}}\\n",
  "tools": [
    {
      "name": "get_weather",
      "params": {
        "city": "北京"
      },
      "desc": "获取天气"
    },
    {
      "name": "get_time",
      "params": {},
      "desc": "获取当前时间"
    }
  ]
}

\`\`\`

​

那么在代码中它是如何解析这个json并运用到MCP中的呢？看接下来的部分：

​

### AIConfig.h/cpp与AIToolRegistry.h/cpp文件讲解

观看代码可以知道

- AIConfig是用来读取json文件进行解析 & 合并用户消息和json中的提示词 & 合并用户消息和二次请求AI的提示词
- AIToolRegistry是一个注册器，后续AI告诉服务端应该调用哪个函数，参数是什么。

\`\`\`cpp
#pragma once
#include <string>
#include <unordered_map>
#include <vector>
#include <regex>
#include <fstream>
#include <sstream>
#include <iostream>
#include "../../../../HttpServer/include/utils/JsonUtil.h"  //封装了 nlohmann::json

// 结构体：单个工具信息
struct AITool {
std::string name;
std::unordered_map<std::string, std::string> params;
std::string desc;
};

// 结构体：AI 响应中工具调用结果
struct AIToolCall {
std::string toolName;
json args;
bool isToolCall = false;
};

// 配置管理类
class AIConfig {
public:
bool loadFromFile(const std::string& path);
std::string buildPrompt(const std::string& userInput) const;
AIToolCall parseAIResponse(const std::string& response) const;
std::string buildToolResultPrompt(const std::string& userInput,const std::string& toolName,const json& toolArgs,const json& toolResult) const;

private:
std::string promptTemplate_;
std::vector<AITool> tools_;

std::string buildToolList() const;
};

\`\`\`

\`\`\`cpp
#include"../include/AIUtil/AIConfig.h"

bool AIConfig::loadFromFile(const std::string& path) {
    std::ifstream file(path);
    if (!file.is_open()) {
        std::cerr << "[AIConfig] Unable to open configuration file: " << path << std::endl;
        return false;
    }

    json j;
    file >> j;

    // Parsing templates
    if (!j.contains("prompt_template") || !j["prompt_template"].is_string()) {
        std::cerr << "[AIConfig] prompt_template is missing" << std::endl;
        return false;
    }
    promptTemplate_ = j["prompt_template"].get<std::string>();

    // List of parsing tools
    if (j.contains("tools") && j["tools"].is_array()) {
        for (auto& tool : j["tools"]) {
            AITool t;
            t.name = tool.value("name", "");
            t.desc = tool.value("desc", "");
            if (tool.contains("params") && tool["params"].is_object()) {
                for (auto& [key, val] : tool["params"].items()) {
                    t.params[key] = val.get<std::string>();
                }
            }
            tools_.push_back(std::move(t));
        }
    }
    return true;
}

std::string AIConfig::buildToolList() const {
    std::ostringstream oss;
    for (const auto& t : tools_) {
        oss << t.name << "(";
        bool first = true;
        for (const auto& [key, val] : t.params) {
            if (!first) oss << ", ";
            oss << key;
            first = false;
        }
        oss << ") → " << t.desc << "\\n";
    }
    return oss.str();
}

std::string AIConfig::buildPrompt(const std::string& userInput) const {
    std::string result = promptTemplate_;
    std::cout << "promptTemplate_ is " << promptTemplate_ << std::endl;
    result = std::regex_replace(result, std::regex("\\\\{user_input\\\\}"), userInput);
    result = std::regex_replace(result, std::regex("\\\\{tool_list\\\\}"), buildToolList());
    return result;
}

AIToolCall AIConfig::parseAIResponse(const std::string& response) const {
    AIToolCall result;
    try {
        // Try parsing as JSON
        json j = json::parse(response);

        if (j.contains("tool") && j["tool"].is_string()) {
            result.toolName = j["tool"].get<std::string>();
            if (j.contains("args") && j["args"].is_object()) {
                result.args = j["args"];
            }
            result.isToolCall = true;
        }
    }
    catch (...) {
        // Not JSON, directly return text response
        result.isToolCall = false;
    }
    return result;
}

std::string AIConfig::buildToolResultPrompt(
    const std::string& userInput,
    const std::string& toolName,
    const json& toolArgs,
    const json& toolResult) const
{
    std::ostringstream oss;
    oss << "下面是用户说的话：" << userInput << "\\n"
        << "我刚才调用了工具 [" << toolName << "] ，参数为："
        << toolArgs.dump() << "\\n"
        << "工具返回的结果如下：\\n" << toolResult.dump(4) << "\\n"
        << "请根据以上信息，用自然语言回答用户。";
    return oss.str();
}

\`\`\`

\`\`\`cpp
#pragma once
#include <string>
#include <unordered_map>
#include <functional>
#include <stdexcept>
#include <iostream>
#include <ctime>
#include <curl/curl.h>
#include "../../../../HttpServer/include/utils/JsonUtil.h"

class AIToolRegistry {
public:
    using ToolFunc = std::function<json(const json&)>;

    AIToolRegistry();

    void registerTool(const std::string& name, ToolFunc func);
    json invoke(const std::string& name, const json& args) const;
    bool hasTool(const std::string& name) const;

private:
    std::unordered_map<std::string, ToolFunc> tools_;

    // 工具函数
    static size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* output);
    static json getWeather(const json& args);
    static json getTime(const json& args);
};

\`\`\`

\`\`\`cpp
#include "../include/AIUtil/AIToolRegistry.h"
#include <sstream>

// ---------------- 构造函数 ----------------
AIToolRegistry::AIToolRegistry() {
    registerTool("get_weather", getWeather);
    registerTool("get_time", getTime);
}

// ---------------- 注册工具 ----------------
void AIToolRegistry::registerTool(const std::string& name, ToolFunc func) {
    tools_[name] = func;
}

// ---------------- 调用工具 ----------------
json AIToolRegistry::invoke(const std::string& name, const json& args) const {
    auto it = tools_.find(name);
    if (it == tools_.end()) {
        throw std::runtime_error("Tool not found: " + name);
    }
    return it->second(args);
}

// ---------------- 判断是否存在 ----------------
bool AIToolRegistry::hasTool(const std::string& name) const {
    return tools_.count(name) > 0;
}

// ---------------- CURL 回调 ----------------
size_t AIToolRegistry::WriteCallback(void* contents, size_t size, size_t nmemb, std::string* output) {
    size_t totalSize = size * nmemb;
    output->append((char*)contents, totalSize);
    return totalSize;
}

// ---------------- 获取天气 ----------------
json AIToolRegistry::getWeather(const json& args) {
    if (!args.contains("city")) {
        return json{ {"error", "Missing parameter: city"} };
    }

    std::string city = args["city"].get<std::string>();
    std::string encodedCity;

    // URL 编码中文城市
    char* encoded = curl_easy_escape(nullptr, city.c_str(), city.length());
    if (encoded) {
        encodedCity = encoded;
        curl_free(encoded);
    }
    else {
        return json{ {"error", "URL encode failed"} };
    }

    std::string url = "https://wttr.in/" + encodedCity + "?format=3&lang=zh";

    CURL* curl = curl_easy_init();
    std::string response;

    if (!curl) {
        return json{ {"error", "Failed to init CURL"} };
    }

    curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
    curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
    curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);
    curl_easy_setopt(curl, CURLOPT_TIMEOUT, 5L);
    curl_easy_setopt(curl, CURLOPT_FOLLOWLOCATION, 1L);

    CURLcode res = curl_easy_perform(curl);
    curl_easy_cleanup(curl);

    if (res != CURLE_OK) {
        return json{ {"error", "CURL request failed"} };
    }

    // 返回简洁格式的天气字符串
    return json{ {"city", city}, {"weather", response} };
}

// ---------------- 获取时间 ----------------
json AIToolRegistry::getTime(const json& args) {
    (void)args;
    std::time_t t = std::time(nullptr);
    std::tm* now = std::localtime(&t);
    char buffer[64];
    std::strftime(buffer, sizeof(buffer), "%Y-%m-%d %H:%M:%S", now);
    return json{ {"time", buffer} };
}

\`\`\`

### 再回头看AIHelper.chat函数

1： 读取配置文件（config.json）[ 这样做的好处是可以**动态扩展工具**，无需改动代码，只需修改配置即可 ]

首先，程序会通过 \`AIConfig\` 类加载配置文件 \`config.json\`，其中包含：

- 工具列表（供模型选择）
- 提示词模板（用于指导模型返回 JSON 格式）

​

2：生成临时提示词（Prompt）

接着，根据用户的输入问题（\`userQuestion\`），利用配置文件中的提示模板生成一个“临时提示词”字符串：

这个提示词会告诉 AI：

- 当前有哪些工具可用；
- 如果需要调用工具，请严格按照 JSON 格式输出。

这个提示词非常关键。如果提示设计不够准确，模型可能仍然返回普通文本，而不是 JSON，从而导致服务端误判。

​

3：临时加入消息数组（不持久化）

生成的提示词接下来会被**临时加入到消息数组中**：

这么做的目的，是在请求 AI 时，能让这条提示词参与上下文，使模型理解“自己可以调用工具”。**但这条消息只是“服务端内部行为”，它不属于真正的用户消息（message和数据库中需要保留真实的用户信息，并不能保留任何三方自行加入的信息）。**

因此，我们只让它**在内存中短暂存在**。在请求发送完毕并得到模型响应后，就会立即移除：

​

4：后续就会利用到刚刚所涉及到的类进行操作了。最终将用户信息和AI响应都同步内存中和异步插入到数据库

​

\`\`\`cpp
    //说明支持MCP
    AIConfig config;
    config.loadFromFile("../AIApps/ChatServer/resource/config.json");
    std::string tempUserQuestion =config.buildPrompt(userQuestion);
    std::cout << "tempUserQuestion is " << tempUserQuestion << std::endl;
    messages.push_back({ tempUserQuestion, 0 });

    json firstReq = strategy->buildRequest(this->messages);
    json firstResp = executeCurl(firstReq);
    std::string aiResult = strategy->parseResponse(firstResp);
    // 用完立即移除提示词
    messages.pop_back();

    std::cout << "aiResult is " << aiResult << std::endl;
    // 解析AI响应（是否工具调用）
    AIToolCall call = config.parseAIResponse(aiResult);

    // 情况1：AI 不调用工具
    if (!call.isToolCall) {
        addMessage(userId, userName, true, userQuestion, sessionId);
        addMessage(userId, userName, false, aiResult, sessionId);

        std::cout << "No tools required" << std::endl;
        return aiResult;
    }

    // 情况 2：AI 要调用工具
    json toolResult;
    AIToolRegistry registry;

    try {
        toolResult = registry.invoke(call.toolName, call.args);
        std::cout << "Tool call success" << std::endl;
    }
    catch (const std::exception& e) {
        //大多数情况都不会走这里
        std::string err = "[工具调用失败] " + std::string(e.what());
        addMessage(userId, userName, true, userQuestion, sessionId);
        addMessage(userId, userName, false, err, sessionId);

        std::cout << "Tool call failed" << std::endl << std::string(e.what());
        return err;
    }

    // 第二次调用AI
    // 说明工具执行过
    std::string secondPrompt = config.buildToolResultPrompt(userQuestion, call.toolName, call.args, toolResult);
    
    std::cout << "secondPrompt is " << secondPrompt << std::endl;
    messages.push_back({ secondPrompt, 0 });

    json secondReq = strategy->buildRequest(messages);
    json secondResp = executeCurl(secondReq);
    std::string finalAnswer = strategy->parseResponse(secondResp);
    //删除包含提示词的信息
    messages.pop_back();

    std::cout << "finalAnswer is " << finalAnswer << std::endl;

    addMessage(userId, userName, true, userQuestion, sessionId);
    addMessage(userId, userName, false, finalAnswer, sessionId);
    return finalAnswer;
\`\`\`

# 4：应用层的简历写法(第一版&第二版综合）

选择自己熟悉部分的内容加上去就行（因为我们知道完整的项目包含应用层+底层封装，此时的内容非常多，全部写上去可能导致简历过长，挑自己最熟悉的几个就行）

​

**AI 对话系统集成**：在自研 HTTP 框架中嵌入多模型对话接口，支持多轮对话与会话记忆，实现用户上下文信息的持久化与同步，为用户提供个性化的智能交互体验。

**AI 图像识别功能**：基于 ONNXRuntime + OpenCV 部署轻量级分类模型，完成端到端图像识别流程（数据预处理 → 推理调用 → 结果解析），在 1000 类有限数据集下实现高精度识别效果。

**高并发 AI 推理服务**：依托 Muduo 网络库与线程池实现高并发请求处理，将 AI 聊天与图像识别任务分发至 RabbitMQ 消息队列，异步执行数据库写入，避免主线程阻塞，显著提升系统吞吐量与响应性能。

**服务化与部署**：利用 Docker 构建统一运行环境，整合 MySQL、RabbitMQ 等组件，实现一键部署与快速迁移，提升系统可维护性与扩展性。

**用户功能实现**：实现用户登录、注册、退出及历史记录同步功能，基于自研 Session 机制完成用户状态校验与持久化管理。

**策略模式 + 工厂模式设计**：支持多模型动态切换（RAG、百炼、豆包等），通过策略模式抽象不同模型的对话行为，提升模块解耦性与扩展性；结合工厂模式实现模型动态实例化，使新增模型无需修改主逻辑，增强系统的可维护性与可插拔性。

**轻量级 MCP 服务设计**：参考 Model Context Protocol 思想，封装自定义工具调用机制，实现服务端工具注册、提示词构建与调用流程，为语音识别等新功能扩展预留接口能力。

**语音识别与合成（ASR + TTS）**：集成百度语音识别与合成 API，实现语音输入转文本、文本转语音输出，支持异步任务轮询与结果回传，为系统提供完整语音交互能力。

# 5：可能的面试问题

## 1、 你们的 HTTP 路由是如何映射到 \`handlers/\` 下各个业务 Handler 的？\`ChatServer.cpp\` 的映射表如何避免重复注册和顺序依赖？

在代码中我们知道各个handler是在ChatServer.cpp中进行注册的

\`\`\`cpp
httpServer_.Post("/upload/send", std::make_shared<AIUploadSendHandler>(this));
\`\`\`

点进底层可以看见，内部维护了一个映射表，后续在底层HTTP服务框架解析http请求的时候，通过解析请求行，可以知道具体的路径，后续从map中找到指定路径的handler。不过观察代码可以发现，并没有做太多健壮性的操作。如在代码中若是注册了相同路径（如/upload/send）的不同handler，可能就会出现问题。

但是这个也不难改，直接加一个判断，如果出错抛出一个异常即可，这边面试的时候如果被问到这个问题直接说就行

\`\`\`cpp
void Router::registerHandler(HttpRequest::Method method, const std::string &path, HandlerPtr handler)
{
    RouteKey key{method, path};
    handlers_[key] = std::move(handler);
}
\`\`\`

​

规范答法：

在我们的 HTTP 框架中，所有业务 Handler 都通过 \`ChatServer.cpp\` 进行集中注册 。

框架内部维护了一张映射表（通常是 \`std::unordered_map<RouteKey, HandlerPtr>\`），每个路由的唯一键由请求方法和路径组成。当 HTTP 服务解析请求行后，会从映射表中找到对应的 Handler 并执行。

且框架层已经加了**重复注册检测机制**，如果注册相同路径的不同 Handler，会直接抛出异常，避免被后注册的逻辑覆盖。这确保了路由表的一致性和可维护性

此外，我们的注册逻辑是**集中式执行**的——所有 Handler 都在服务器初始化阶段统一注册，而不是依赖静态对象或全局构造函数。这样可以完全规避 **顺序依赖问题**（即不同编译单元初始化顺序不确定导致的注册顺序异常）。

​

​

​

## 2、为何把 \`chatInformation\` 从一维 \`unordered_map<int, shared_ptr<AIHelper>>\` 升级为二维 \`unordered_map<int, vector<string, shared_ptr<AIHelper>>>\`？带来了哪些并发与一致性问题？

主要是为了支持从 **单用户单会话** 模式扩展到 **单用户多会话** 模式。

在旧设计中，一个用户 ID 只能对应一个会话上下文，不便于同一用户同时进行多轮独立对话。而升级后的结构通过两级映射实现了清晰的层级关系：

- **第一层 key：用户 ID**（\`userId\`） → 对应该用户的所有会话表；
- **第二层 key：会话 ID**（\`sessionId\`） → 对应某一具体会话的上下文（\`AIHelper\` 实例）。

这样可以保证：

- 每个用户的多会话数据彼此独立；
- 能快速通过 \`(userId, sessionId)\` 精确定位唯一的会话上下文；
- 为后续的上下文切换、历史记录管理提供扩展性。

并发与一致性问题

由于底层基于 **muduo** 网络库实现多线程 I/O，每个连接可能由不同的工作线程处理，多个线程可能会同时访问或修改 \`chatInformation\`。而 C++ STL 容器（包括 \`unordered_map\`）**默认并非线程安全**，为此，我们在访问 \`chatInformation\` 的时候加入了锁机制

​

​

## 3、\`readDataFromMySQL()\` 如何保证顺序一致 ?

​

在放入消息的时候，会一并放入时间戳以便于下次启动服务器的时候通过如下sql

根据时间戳升序排序消息，而保证所有用户的消息是顺序的

\`\`\`cpp
SELECT id, username, session_id, is_user, content, ts 
FROM chat_message ORDER BY ts ASC, id ASC;
\`\`\`

​

​

## 4、你为什么同时用 策略模式 和 注册式工厂？如果后续再接一个“需要流式输出”的 GPT 家族模型，怎么在不改调用方的前提下扩展？

​

- 同时使用了策略模式和注册式工厂，主要是为了从**行为层**和**创建层**两个方向实现解耦。

- **策略模式**负责抽象不同模型的**行为逻辑**，比如请求构造、响应解析等 调用方只依赖统一接口\`AIStrategy\`，不关心具体模型的内部实现，从而实现行为层的可替换性。
- **注册式工厂**负责抽象策略对象的**创建逻辑**。通过自动注册机制，新增模型时只需实现子类并注册一次，就可以在运行时动态选择实例，无需修改原有调用代码。
- 两者结合后，调用方既不需要知道“怎么创建对象”，也不需要知道“对象内部怎么执行”，整个架构实现了：1：**创建与行为的双层解耦 2：对扩展开放，对修改封闭（OCP）3：调用方零侵入扩展**

- 后续如果要扩展流式模型，我只需要在策略接口中新增一个流式行为方法，并注册一个新策略类，就能在不改调用方代码的情况下完成接入。

​

​

## 5、阿里百炼普通模型、RAG 模型、豆包模型的请求体差异如何在 \`AIStrategy\` 层屏蔽？返回内容怎样统一到“一个标准结构”？

​

​

不同模型的请求体结构不一致，通常需要分别实现各自的 \`buildRequest()\`。为了在 AIStrategy 层屏蔽这种差异，我会设计一个**模板化配置机制**：

- 将请求体结构定义在配置文件中，由一个**配置类负责读取和解析**；
- 策略父类中持有该配置对象，通过统一的 \`buildRequest()\` 实现动态构造请求。

这样既能屏蔽模型差异，又符合**开闭原则**，新增模型只需补一份配置，无需改动代码。

​

## 6、你实现的“类 MCP”两段式调用（是否需要工具 → 调工具 → 二次回答）里，如何保证模型稳定地产生 JSON？如果模型输出了“半结构化文本”，你怎么兜底？

​

我们知道像 **SpringAI** 这类框架其实也是基于相同思路去封装的，但这种方式并不能完全避免误判。想要保证模型在需要调用工具时稳定输出 JSON，核心还是**依赖模型本身的理解能力**以及**提示词（Prompt）设计的精度与约束性**。我经过多轮测试，逐步优化并构造了相对稳定的提示词模板，以提高输出一致性。即便出现半结构化文本，也会通过 **正则提取结构化片段**、**健壮性校验与容错解析**等机制来兜底，确保流程稳定可控。

​

​

## 7、用户发消息后，你们是同步写内存、异步写 MySQL（RabbitMQ）。如何保证最终一致且不会丢消息？

​

为了保证最终一致性和不丢消息，可以做三层保障：

1. **消息持久化**：生产消息前开启 RabbitMQ 的持久化（\`delivery_mode=2\`），确保即使服务或 Broker 异常重启，消息不会丢失。
2. **消费确认机制**：消费端使用 \`manual ack\` 模式，只有业务逻辑执行成功才 ack，否则进入重试或死信队列（DLX），保证消费可靠性。
3. **监控与补偿机制**：通过定期巡检或监控 RabbitMQ 的队列堆积情况，检测是否存在消费失败的消息；若出现异常，会触发**人工或自动补偿任务**，重新拉取和恢复消息，确保最终数据一致。

这样可以做到：即使异步链路暂时失败，消息也不会丢失，系统能在最终状态下保持一致性。

​

​

## 8、目前采用“创建任务→轮询查询→返回 \`speech_url\`”。你如何控制轮询成本与并发？如果未来有 WebSocket/SSE，你的设计如何无缝迁移？

​

当前的语音合成逻辑采用“创建任务 → 轮询查询 → 返回 speech_url”的同步模式。由于系统暂时不具备服务端主动推送能力，因此只能在严格的请求-响应模型下工作。

在这种情况下，我通过**超时控制与轮询频率控制**来降低系统轮询成本。例如为每个请求设置最大轮询次数和超时时间，避免线程长时间阻塞；同时可以配合**线程池或任务队列**实现有限并发，确保高并发场景下系统仍可稳定运行。

如果未来支持 **WebSocket 或 SSE**，整个架构可以**无缝迁移**为异步推送模型：

- 将任务创建请求提交至后台线程池进行异步处理；
- 建立持久连接，由服务端在任务完成时主动向客户端推送结果（speech_url）；
- 不再需要轮询或阻塞线程，从同步转为**事件驱动**的非阻塞模式。

这样既能显著降低系统的轮询成本，又能在未来具备流式、实时推送的扩展能力，实现同步到异步的平滑演进。

​

## 9、\`mutexForChatInformation\` 的加锁范围如何控制到细粒度，避免“全局大锁”降吞吐？如果允许并发写同一会话，如何避免消息乱序？

目前 \`mutexForChatInformation\` 是一个全局锁，用于保护整个 \`chatInformation\` 结构。

但可能对于大并发的情况下，做以下方面的优化

**采用读写锁（shared_mutex）**（因为本质上使用到锁的情形几乎都是在读内容）对消息读取操作使用共享锁，对写入使用独占锁，适合读多写少的典型聊天场景。

针对并发写同一个会话，目前代码中是不允许的。（原因：代码中只允许同一个用户登录账号进去操作，若此时有其它方想要登录进去，此时会被拦截，大家可以试一下）

​

若真想做多端允许登录同一个账户去访问AI的话，那么可以考虑以下情况

- **单调序列号**每个会话维护一个原子递增的 \`seqId\`，每条消息在写入时分配唯一序列号，后续在广播或存储阶段按序处理。
- **时间戳排序 / 延迟合并**：在高并发场景下，也可以根据消息时间戳或序列号对消息流进行排序与批量提交，保证逻辑顺序正确。

​

​

​

## 10、如果要支持“ChatGPT 式逐 token 流式输出”，在 协议（SSE/WS）、后端线程模型、客户端播放 上如何改造？

​

要实现类似 ChatGPT 的逐 token 流式输出，需要在三个层面改造：* 改造成长连接协议，例如 **SSE（Server-Sent Events）** 或 **WebSocket**，让服务端可以在生成内容的过程中实时推送 token 给客户端。* 服务端采用**线程池 + 事件驱动模型**。每个生成任务投递到线程池中异步执行，生成到新 token 时触发事件，将数据写入连接通道（如 SSE 流或 WebSocket 会话）。这样既能并发多用户，又能避免阻塞主线程。* 客户端从长连接中**持续接收流式数据**，边接收边渲染，实现“打字机”式输出体验。

整体改造后，系统从“请求-等待-返回”模式升级为“请求-实时推送”模式，实现真正的低延迟交互。

​

## 11、你如何实现一条“从用户请求 → RAG 检索 → LLM 推理 → 工具调用 → TTS 回传”的分布式追踪？

​

什么是分布式追踪？可以查看这篇文章：[什么是分布式追踪？](https://aws.amazon.com/cn/what-is/distributed-tracing/)

一句话总结给你记：分布式追踪就是“跨服务的结构化日志系统”，它通过统一的 **TraceId + SpanId** 把不同服务器的调用日志关联起来，让你能在一个界面看到一次请求从入口到模型、到TTS的所有耗时与错误。

下面摘取该文章的两个截图

![](images/yuque/img_17_33.png)

![](images/yuque/img_17_34.png)

### 答法：

- **在请求的最开始阶段生成一个“追踪上下文”（Trace Context）**，
- 然后 **沿着整个调用链条跨服务传递下去**，每个服务接收到这个"上下文"之后对它进行"赋值"或其它相关操作，记录当前服务的信息（如服务耗时等信息）
- 最后所有服务把自己的追踪数据上报到一个集中平台（比如 Jaeger、Tempo、Zipkin），平台再把这些数据拼成一条完整的“调用链路图”。

​

​

## 12、在多租户情况下，如何做到：API Key 隔离、RAG 数据域隔离、会话越权防护？上传文件如何清洗以防 PDF/HTML 注入？

在解决这个疑问之前，我们首先要知道它在问什么：

我们知道服务端是通过唯一的API-KEY去访问指定模型，即不会出现两个API-KEY都去访问阿里百炼这**一个相同的模型**

那么什么时候需要通过不同的API-KEY去访问相同模型呢？

假设：

- 你的服务为 10 家公司提供 AI 问答；
- 你后端统一用一个大模型的 API Key 去访问 OpenAI / 自建模型；
- 那么所有客户的调用都混在同一个 Key 下。

但是这样会有问题：

- **无法区分计费/统计** — 不知道哪个客户消耗了多少 token；
- **无法限制滥用** — 某客户疯狂请求会拖垮整个服务；
- **数据安全隔离弱** — 不同租户间的请求上下文可能混淆；
- **日志与审计困难** — trace 不到具体用户是谁触发的。

​

### 答法：

针对API Key隔离：颁发一个API-KEY给每个用户，存在数据库中；请求时带上 \`Authorization: Bearer <key>\`服务端解析 key → 查到租户 ID → 做权限和数据隔离

如果要清洗以防 PDF/HTML 注入，我们可以进行**上传文件清洗**：对 PDF/HTML 上传前做内容提取 + 标签过滤，去除脚本、链接、样式等潜在注入风险，防止 XSS / 注入攻击。

### 补充：

在看完之后，可以查阅以下文章，讲的挺不错的：

[吊打面试官！全网最全多租户系统设计方案](https://blog.csdn.net/vincent1007/article/details/143949268)

​

## 13、面对“多模型 + RAG + 语音”的综合成本，如何做成本可观测与弹性伸缩？在成本飙升时，系统的降级路径是什么？

​

在调用层统一封装各模型（阿里百炼、豆包、TTS/ASR）接口，埋点记录模型类型、token 数量、响应时长、调用成本等指标。数据上报到 Prometheus，并用 Grafana 做可视化统计，实现不同模型、功能模块的成本透明化。  当成本飙升的时候，统一使用降级策略， 优先关闭 RAG 检索，仅走基础对话 如使用本地模型（若有）/低成本模型

## 14、你在项目中如何统一不同厂商（阿里百炼、豆包、LLaMA 本地）的 请求/响应协议？为什么用策略模式而不是简单的 \`if-else\`？

​

我在项目中需要同时兼容多个大模型厂商，而它们的 **请求格式（buildRequest）** 和 **响应解析方式（parseResponse）** 都存在差异。为了统一接口层调用、减少上层逻辑的复杂度，我采用了 **策略模式（Strategy Pattern）** 来封装这些差异：如果用 if-else 判断模型类型（例如 \`if(type == "aliyun") ... else if(type == "doubao") ...\`），会导致：

- 代码高度耦合、可扩展性差；
- 每次新增厂商都要改动主流程，违背 **开闭原则（OCP）**；
- 不利于单元测试和独立演化。

而策略模式的优点在于：

- 每个厂商独立封装，互不影响；
- 可以通过注册机制（\`StrategyRegister\`）动态扩展；

​

## 15、当 不同模型的上下文窗口、工具调用能力、函数格式不一致时，如何在抽象层屏蔽差异？

​

不同模型的上下文窗口、函数调用格式和工具能力确实不一样。我的做法是保持上层接口统一，在 **AIStrategy 抽象层** 只定义标准接口，比如 \`buildRequest()\`、\`parseResponse()\`。

每个模型（阿里百炼、豆包）各自实现这些接口，去处理自身的差异，比如：

- 有的模型支持函数调用，就在 \`buildRequest()\` 里加上函数字段；
- 不支持的就直接忽略；
- 上下文窗口差异也由各模型自己控制。

上层调用只依赖基类指针执行，不需要知道是哪家厂商，从而**屏蔽了底层差异**。

相比 if-else，这种方式结构更清晰、扩展性更强，新增模型只需新增一个策略类并注册即可，不影响原有逻辑。

## 16、你如何处理 长文档（100MB+）的解析与入库：异步流水线、批量嵌入、失败重试、断点续传分别怎么做？

（这个就跟一些八股扯上关联了，大数据量/长文本这种场景）

这些操作在服务端没有太过于考虑，项目核心点不在这里，但是我们可以做如下操作

- 异步流水线：

- 解析任务
- 放入线程池，交给工作线程做事情
- 后台非阻塞执行完成，交给客户端结果

- 流式解析 / 切块（避免一次性 OOM）

- 不把整个 100MB 文件载入内存。用流式解析
- 文本切块策略：

- 切块长度以 **token 或字符** 为单位，约 2–8 KB 文本。并保留重叠（overlap）比如 50–200 tokens，保证检索上下文连续性。
- 对于语义分段优先使用句子/段落边界，再按最大 token 限制拆分。

- 每生成一个 chunk 就推送到消息队列（chunk metadata 包括 documentId、chunkIndex、checksum、offset、seq）。

- 批量嵌入：

- 批量发送给 embedding 服务以提高吞吐：
- 选择合适的 batch size（例如 16–128），取决于模型的吞吐/内存。实际值需基于模型和硬件调优。
- 组 batch 前尽量按相似长度聚合以减少 padding waste。
- 对模型调用要注意并发与速率限制（rate limits）——用并发窗口（concurrency limiter）+令牌桶（token bucket）。
- 每个 batch 的请求应带上 **batchId + per-chunk seqId** 以保证幂等与追踪。

​

## 17 、你的“类 MCP”两段式流程（判断是否需要工具→调用工具→二次回答）如何 保证模型稳定输出 JSON？如果输出半结构化文本怎么兜底？

我们知道像 **SpringAI** 这类框架其实也是基于相同思路去封装的，但这种方式并不能完全避免误判。想要保证模型在需要调用工具时稳定输出 JSON，核心还是**依赖模型本身的理解能力**以及**提示词（Prompt）设计的精度与约束性**。我经过多轮测试，逐步优化并构造了相对稳定的提示词模板，以提高输出一致性。即便出现半结构化文本，也会通过 **正则提取结构化片段**、**健壮性校验与容错解析**等机制来兜底，确保流程稳定可控。`,bookId:"http-server",bookTitle:"HTTP服务框架与AI服务平台",bookBadge:"HTTP & CppAIService"}];typeof window<"u"&&(window.YUQUE_DATASET=N,window.YUQUE_ARTICLES_DATASET=N);const X=[{id:"algo_704",num:704,title:"704. 二分查找",difficulty:"Easy",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/binary-search/",pattern:"二分查找",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/array/0704-binary-search.html"},{id:"algo_27",num:27,title:"27. 移除元素",difficulty:"Easy",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/remove-element/",pattern:"双指针",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/array/0027-remove-element.html"},{id:"algo_977",num:977,title:"977. 有序数组的平方",difficulty:"Easy",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/squares-of-a-sorted-array/",pattern:"双指针",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/array/0977-squares-of-a-sorted-array.html"},{id:"algo_209",num:209,title:"209. 长度最小的子数组",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/minimum-size-subarray-sum/",pattern:"滑动窗口",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/array/0209-minimum-size-subarray-sum.html"},{id:"algo_58",num:58,title:"58. 区间和",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1058",pattern:"前缀和",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/array/kamacoder-0058-range-sum.html"},{id:"algo_44",num:44,title:"44. 开发商购买土地",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1044",pattern:"前缀和",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/array/kamacoder-0044-land-purchase.html"},{id:"algo_54",num:54,title:"54. 螺旋矩阵",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/spiral-matrix/",pattern:"顺时针模拟 / 边界收缩",timeComp:"O(m*n)",spaceComp:"O(1)",independent:!0,mistakes:"循环边界定义统一，转圈边界严格左闭右开或边界收缩。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"矩阵",hot100Order:19,carlUrl:"https://programmercarl.com/algo/other/0054-spiral-matrix.html"},{id:"algo_203",num:203,title:"203. 移除链表元素",difficulty:"Easy",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/remove-linked-list-elements/",pattern:"虚拟头节点",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/linked-list/0203-remove-linked-list-elements.html"},{id:"algo_707",num:707,title:"707. 设计链表",difficulty:"Medium",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/design-linked-list/",pattern:"虚拟头节点",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/linked-list/0707-design-linked-list.html"},{id:"algo_206",num:206,title:"206. 翻转链表",difficulty:"Easy",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/reverse-linked-list/",pattern:"虚拟头节点",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"链表",hot100Order:23,carlUrl:"https://programmercarl.com/algo/linked-list/0206-reverse-linked-list.html"},{id:"algo_24",num:24,title:"24. 两两交换链表中的节点",difficulty:"Medium",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/swap-nodes-in-pairs/",pattern:"指针翻转",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"链表",hot100Order:30,carlUrl:"https://programmercarl.com/algo/other/0024-swap-nodes-in-pairs.html"},{id:"algo_19",num:19,title:"19. 删除链表的倒数第N个节点",difficulty:"Medium",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/remove-nth-node-from-end-of-list/",pattern:"快慢双指针",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"链表",hot100Order:29,carlUrl:"https://programmercarl.com/algo/linked-list/0019-remove-nth-node-from-end-of-list.html"},{id:"algo_02.07",num:"02.07",title:"02.07. 链表相交",difficulty:"Easy",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/intersection-of-two-linked-lists-lcci/",pattern:"快慢双指针",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/linked-list/interview-02-07-linked-list-intersection.html"},{id:"algo_142",num:142,title:"142. 环形链表II",difficulty:"Medium",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/linked-list-cycle-ii/",pattern:"快慢双指针",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"链表",hot100Order:26,carlUrl:"https://programmercarl.com/algo/linked-list/0142-linked-list-cycle-ii.html"},{id:"algo_242",num:242,title:"242. 有效的字母异位词",difficulty:"Easy",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/valid-anagram/",pattern:"数组哈希映射",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/hash-table/0242-valid-anagram.html"},{id:"algo_1002",num:1002,title:"1002. 查找常用字符",difficulty:"Easy",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/find-common-characters/",pattern:"数组哈希映射",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/other/1002-find-common-characters.html"},{id:"algo_349",num:349,title:"349. 两个数组的交集",difficulty:"Easy",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/intersection-of-two-arrays/",pattern:"unordered_set / map 查找",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/hash-table/0349-intersection-of-two-arrays.html"},{id:"algo_202",num:202,title:"202. 快乐数",difficulty:"Easy",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/happy-number/",pattern:"数组哈希映射",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/hash-table/0202-happy-number.html"},{id:"algo_1",num:1,title:"1. 两数之和",difficulty:"Easy",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/two-sum/",pattern:"unordered_set / map 查找",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"哈希",hot100Order:1,carlUrl:"https://programmercarl.com/algo/hash-table/0001-two-sum.html"},{id:"algo_454",num:454,title:"454. 四数相加II",difficulty:"Medium",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/4sum-ii/",pattern:"数组哈希映射",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/hash-table/0454-4sum-ii.html"},{id:"algo_383",num:383,title:"383. 赎金信",difficulty:"Easy",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/ransom-note/",pattern:"数组哈希映射",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/hash-table/0383-ransom-note.html"},{id:"algo_15",num:15,title:"15. 三数之和",difficulty:"Medium",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/3sum/",pattern:"unordered_set / map 查找",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/hash-table/0015-3sum.html"},{id:"algo_18",num:18,title:"18. 四数之和",difficulty:"Medium",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/4sum/",pattern:"unordered_set / map 查找",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/hash-table/0018-4sum.html"},{id:"algo_146",num:146,title:"146. LRU 缓存机制 (LRU Cache)",difficulty:"Medium",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/lru-cache/",pattern:"std::unordered_map 映射 key 到双向链表迭代器/指针，O(1) 访问与淘汰",timeComp:"O(1)",spaceComp:"O(capacity)",independent:!0,mistakes:"在双向链表头插或尾删时指针更新顺序错误；更新值时忘记将节点移动到头部。",projectLink:"对应 CppAIService 中 Session 管理与上下文 Token 缓存淘汰机制。",isCarl:!0,isHot100:!0,hot100Chapter:"链表",hot100Order:35},{id:"algo_344",num:344,title:"344. 反转字符串",difficulty:"Easy",category:"字符串",topic:"字符串",leetcodeUrl:"https://leetcode.cn/problems/reverse-string/",pattern:"双指针反转/位移",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/string/0344-reverse-string.html"},{id:"algo_541",num:541,title:"541. 反转字符串II",difficulty:"Easy",category:"字符串",topic:"字符串",leetcodeUrl:"https://leetcode.cn/problems/reverse-string-ii/",pattern:"双指针反转/位移",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/string/0541-reverse-string-ii.html"},{id:"algo_kc_54",num:54,title:"54. 替换数字",difficulty:"Easy",category:"字符串",topic:"字符串",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1054",pattern:"双指针从后向前 / 空间预扩充",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"从后向前遍历填充，避免每次插入导致的 O(n^2) 元素整体搬移。",projectLink:"对应服务端协议解析中 URL 解码、转义字符扩充与字节流重组。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/string/kamacoder-0054-replace-digits.html"},{id:"algo_151",num:151,title:"151. 翻转字符串里的单词",difficulty:"Medium",category:"字符串",topic:"字符串",leetcodeUrl:"https://leetcode.cn/problems/reverse-words-in-a-string/",pattern:"双指针反转/位移",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/string/0151-reverse-words-in-a-string.html"},{id:"algo_kc_55",num:55,title:"55. 右旋字符串",difficulty:"Medium",category:"字符串",topic:"字符串",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1055",pattern:"双指针反转/位移",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/string/kamacoder-0055-right-rotate-string.html"},{id:"algo_28",num:28,title:"28. 实现strStr",difficulty:"Easy",category:"字符串",topic:"字符串",leetcodeUrl:"https://leetcode.cn/problems/find-the-index-of-the-first-occurrence-in-a-string/",pattern:"KMP 前缀表 next 数组",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/string/0028-find-the-index-of-the-first-occurrence-in-a-string.html"},{id:"algo_459",num:459,title:"459. 重复的子字符串",difficulty:"Easy",category:"字符串",topic:"字符串",leetcodeUrl:"https://leetcode.cn/problems/repeated-substring-pattern/",pattern:"双指针反转/位移",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/string/0459-repeated-substring-pattern.html"},{id:"algo_dptr_27",num:27,title:"27. 移除元素",difficulty:"Easy",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/remove-element/",pattern:"快慢指针 / 对撞指针",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/array/0027-remove-element.html"},{id:"algo_dptr_344",num:344,title:"344. 反转字符串",difficulty:"Easy",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/reverse-string/",pattern:"快慢指针 / 对撞指针",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/string/0344-reverse-string.html"},{id:"algo_dptr_54",num:54,title:"54. 替换数字",difficulty:"Medium",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1054",pattern:"快慢指针 / 对撞指针",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/string/kamacoder-0054-replace-digits.html"},{id:"algo_dptr_151",num:151,title:"151. 翻转字符串里的单词",difficulty:"Medium",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/reverse-words-in-a-string/",pattern:"快慢指针 / 对撞指针",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/string/0151-reverse-words-in-a-string.html"},{id:"algo_dptr_206",num:206,title:"206. 翻转链表",difficulty:"Easy",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/reverse-linked-list/",pattern:"快慢指针 / 对撞指针",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/linked-list/0206-reverse-linked-list.html"},{id:"algo_dptr_19",num:19,title:"19. 删除链表的倒数第N个节点",difficulty:"Medium",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/remove-nth-node-from-end-of-list/",pattern:"快慢指针 / 对撞指针",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/linked-list/0019-remove-nth-node-from-end-of-list.html"},{id:"algo_dptr_02_07",num:"02.07",title:"02.07. 链表相交",difficulty:"Easy",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/intersection-of-two-linked-lists-lcci/",pattern:"快慢指针 / 对撞指针",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/linked-list/interview-02-07-linked-list-intersection.html"},{id:"algo_dptr_142",num:142,title:"142. 环形链表II",difficulty:"Medium",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/linked-list-cycle-ii/",pattern:"快慢指针 / 对撞指针",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/linked-list/0142-linked-list-cycle-ii.html"},{id:"algo_dptr_15",num:15,title:"15. 三数之和",difficulty:"Medium",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/3sum/",pattern:"快慢指针 / 对撞指针",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"双指针",hot100Order:6,carlUrl:"https://programmercarl.com/algo/hash-table/0015-3sum.html"},{id:"algo_dptr_18",num:18,title:"18. 四数之和",difficulty:"Medium",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/4sum/",pattern:"快慢指针 / 对撞指针",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/hash-table/0018-4sum.html"},{id:"algo_232",num:232,title:"232. 用栈实现队列",difficulty:"Easy",category:"栈与队列",topic:"栈与队列",leetcodeUrl:"https://leetcode.cn/problems/implement-queue-using-stacks/",pattern:"括号匹配 / 逆波兰表达式计算",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/stack-queue/0232-implement-queue-using-stacks.html"},{id:"algo_225",num:225,title:"225. 用队列实现栈",difficulty:"Easy",category:"栈与队列",topic:"栈与队列",leetcodeUrl:"https://leetcode.cn/problems/implement-stack-using-queues/",pattern:"括号匹配 / 逆波兰表达式计算",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/stack-queue/0225-implement-stack-using-queues.html"},{id:"algo_20",num:20,title:"20. 有效的括号",difficulty:"Easy",category:"栈与队列",topic:"栈与队列",leetcodeUrl:"https://leetcode.cn/problems/valid-parentheses/",pattern:"括号匹配 / 逆波兰表达式计算",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"栈",hot100Order:69,carlUrl:"https://programmercarl.com/algo/stack-queue/0020-valid-parentheses.html"},{id:"algo_1047",num:1047,title:"1047. 删除字符串中的所有相邻重复项",difficulty:"Easy",category:"栈与队列",topic:"栈与队列",leetcodeUrl:"https://leetcode.cn/problems/remove-all-adjacent-duplicates-in-string/",pattern:"括号匹配 / 逆波兰表达式计算",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/stack-queue/1047-remove-all-adjacent-duplicates-in-string.html"},{id:"algo_150",num:150,title:"150. 逆波兰表达式求值",difficulty:"Medium",category:"栈与队列",topic:"栈与队列",leetcodeUrl:"https://leetcode.cn/problems/evaluate-reverse-polish-notation/",pattern:"括号匹配 / 逆波兰表达式计算",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/stack-queue/0150-evaluate-reverse-polish-notation.html"},{id:"algo_239",num:239,title:"239. 滑动窗口最大值",difficulty:"Hard",category:"栈与队列",topic:"栈与队列",leetcodeUrl:"https://leetcode.cn/problems/sliding-window-maximum/",pattern:"单调队列 / 小顶堆 priority_queue",timeComp:"O(n log n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"子串",hot100Order:11,carlUrl:"https://programmercarl.com/algo/stack-queue/0239-sliding-window-maximum.html"},{id:"algo_347",num:347,title:"347. 前K个高频元素",difficulty:"Medium",category:"栈与队列",topic:"栈与队列",leetcodeUrl:"https://leetcode.cn/problems/top-k-frequent-elements/",pattern:"括号匹配 / 逆波兰表达式计算",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"堆",hot100Order:75,carlUrl:"https://programmercarl.com/algo/stack-queue/0347-top-k-frequent-elements.html"},{id:"algo_94",num:94,title:"94. 二叉树的中序遍历",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/binary-tree-inorder-traversal/",pattern:"二叉树中序遍历 / 递归与迭代",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意左子树为空时的回溯逻辑，迭代法使用显式调用栈防死循环。",projectLink:"对应语法树/AST 中序展开与有序事件分发管道遍历。",isCarl:!0,isHot100:!0,hot100Chapter:"二叉树",hot100Order:36,carlUrl:"https://programmercarl.com/algo/binary-tree/recursive-binary-tree-traversal.html"},{id:"algo_105",num:105,title:"105. 从前序与中序遍历序列构造二叉树",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/construct-binary-tree-from-preorder-and-inorder-traversal/",pattern:"分治递归 / 哈希加速定位",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意子区间切分索引边界计算，中序哈希表预存加速根节点查询。",projectLink:"对应网络协议序列化帧解析反序列化还原拓扑树结构。",isCarl:!0,isHot100:!0,hot100Chapter:"二叉树",hot100Order:47,carlUrl:"https://programmercarl.com/algo/binary-tree/0106-construct-binary-tree-from-inorder-and-postorder-traversal.html"},{id:"algo_50",num:null,title:"二叉树的统一迭代法",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problemset/?search=%E4%BA%8C%E5%8F%89%E6%A0%91%E7%9A%84%E7%BB%9F%E4%B8%80%E8%BF%AD%E4%BB%A3%E6%B3%95",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/unified-iterative-binary-tree-traversal.html"},{id:"algo_102",num:102,title:"102. 二叉树的层序遍历",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/binary-tree-level-order-traversal/",pattern:"DFS 递归 / BFS 队列层序",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"二叉树",hot100Order:41,carlUrl:"https://programmercarl.com/algo/binary-tree/0102-binary-tree-level-order-traversal.html"},{id:"algo_226",num:226,title:"226. 翻转二叉树",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/invert-binary-tree/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"二叉树",hot100Order:38,carlUrl:"https://programmercarl.com/algo/binary-tree/0226-invert-binary-tree.html"},{id:"algo_101",num:101,title:"101. 对称二叉树",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/symmetric-tree/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"二叉树",hot100Order:39,carlUrl:"https://programmercarl.com/algo/binary-tree/0101-symmetric-tree.html"},{id:"algo_104",num:104,title:"104. 二叉树的最大深度",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/maximum-depth-of-binary-tree/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"二叉树",hot100Order:37,carlUrl:"https://programmercarl.com/algo/binary-tree/0104-maximum-depth-of-binary-tree.html"},{id:"algo_111",num:111,title:"111. 二叉树的最小深度",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/minimum-depth-of-binary-tree/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0111-minimum-depth-of-binary-tree.html"},{id:"algo_222",num:222,title:"222. 完全二叉树的节点个数",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/count-complete-tree-nodes/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0222-count-complete-tree-nodes.html"},{id:"algo_110",num:110,title:"110. 平衡二叉树",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/balanced-binary-tree/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0110-balanced-binary-tree.html"},{id:"algo_257",num:257,title:"257. 二叉树的所有路径",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/binary-tree-paths/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0257-binary-tree-paths.html"},{id:"algo_404",num:404,title:"404. 左叶子之和",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/sum-of-left-leaves/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0404-sum-of-left-leaves.html"},{id:"algo_513",num:513,title:"513. 找树左下角的值",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/find-bottom-left-tree-value/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0513-find-bottom-left-tree-value.html"},{id:"algo_112",num:112,title:"112. 路径总和",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/path-sum/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0112-path-sum.html"},{id:"algo_106",num:106,title:"106. 从中序与后序遍历序列构造二叉树",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/construct-binary-tree-from-inorder-and-postorder-traversal/",pattern:"DFS 递归 / BFS 队列层序",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0106-construct-binary-tree-from-inorder-and-postorder-traversal.html"},{id:"algo_654",num:654,title:"654. 最大二叉树",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/maximum-binary-tree/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0654-maximum-binary-tree.html"},{id:"algo_617",num:617,title:"617. 合并二叉树",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/merge-two-binary-trees/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0617-merge-two-binary-trees.html"},{id:"algo_700",num:700,title:"700. 二叉搜索树中的搜索",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/search-in-a-binary-search-tree/",pattern:"BST 性质与中序有序性",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0700-search-in-a-binary-search-tree.html"},{id:"algo_98",num:98,title:"98. 验证二叉搜索树",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/validate-binary-search-tree/",pattern:"BST 性质与中序有序性",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"二叉树",hot100Order:43,carlUrl:"https://programmercarl.com/algo/binary-tree/0098-validate-binary-search-tree.html"},{id:"algo_530",num:530,title:"530. 二叉搜索树的最小绝对差",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/minimum-absolute-difference-in-bst/",pattern:"BST 性质与中序有序性",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0530-minimum-absolute-difference-in-bst.html"},{id:"algo_501",num:501,title:"501. 二叉搜索树中的众数",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/find-mode-in-binary-search-tree/",pattern:"BST 性质与中序有序性",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0501-find-mode-in-binary-search-tree.html"},{id:"algo_236",num:236,title:"236. 二叉树的最近公共祖先",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-tree/",pattern:"树形递归回溯",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"二叉树",hot100Order:49,carlUrl:"https://programmercarl.com/algo/binary-tree/0236-lowest-common-ancestor-of-a-binary-tree.html"},{id:"algo_235",num:235,title:"235. 二叉搜索树的最近公共祖先",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/lowest-common-ancestor-of-a-binary-search-tree/",pattern:"BST 性质与中序有序性",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0235-lowest-common-ancestor-of-a-binary-search-tree.html"},{id:"algo_701",num:701,title:"701. 二叉搜索树中的插入操作",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/insert-into-a-binary-search-tree/",pattern:"BST 性质与中序有序性",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0701-insert-into-a-binary-search-tree.html"},{id:"algo_450",num:450,title:"450. 删除二叉搜索树中的节点",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/delete-node-in-a-bst/",pattern:"BST 性质与中序有序性",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0450-delete-node-in-a-bst.html"},{id:"algo_669",num:669,title:"669. 修剪二叉搜索树",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/trim-a-binary-search-tree/",pattern:"BST 性质与中序有序性",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0669-trim-a-binary-search-tree.html"},{id:"algo_108",num:108,title:"108. 将有序数组转换为二叉搜索树",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/convert-sorted-array-to-binary-search-tree/",pattern:"BST 性质与中序有序性",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"二叉树",hot100Order:42,carlUrl:"https://programmercarl.com/algo/binary-tree/0108-convert-sorted-array-to-binary-search-tree.html"},{id:"algo_538",num:538,title:"538. 把二叉搜索树转换为累加树",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/convert-bst-to-greater-tree/",pattern:"BST 性质与中序有序性",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/binary-tree/0538-convert-bst-to-greater-tree.html"},{id:"algo_77",num:77,title:"77. 组合",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/combinations/",pattern:"组合问题 (剪枝优化)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/backtracking/0077-combinations.html"},{id:"algo_77_opt",num:77,title:"77. 组合优化",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/combinations/",pattern:"组合问题 (剪枝优化)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/backtracking/0077-combinations-optimized.html"},{id:"algo_216",num:216,title:"216. 组合总和III",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/combination-sum-iii/",pattern:"组合问题 (剪枝优化)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/backtracking/0216-combination-sum-iii.html"},{id:"algo_17",num:17,title:"17. 电话号码的字母组合",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/letter-combinations-of-a-phone-number/",pattern:"组合问题 (剪枝优化)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"回溯",hot100Order:57,carlUrl:"https://programmercarl.com/algo/backtracking/0017-letter-combinations-of-a-phone-number.html"},{id:"algo_39",num:39,title:"39. 组合总和",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/combination-sum/",pattern:"组合问题 (剪枝优化)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"回溯",hot100Order:58,carlUrl:"https://programmercarl.com/algo/backtracking/0039-combination-sum.html"},{id:"algo_40",num:40,title:"40. 组合总和II",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/combination-sum-ii/",pattern:"组合问题 (剪枝优化)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/backtracking/0040-combination-sum-ii.html"},{id:"algo_131",num:131,title:"131. 分割回文串",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/palindrome-partitioning/",pattern:"子集与分割",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"回溯",hot100Order:61,carlUrl:"https://programmercarl.com/algo/backtracking/0131-palindrome-partitioning.html"},{id:"algo_93",num:93,title:"93. 复原IP地址",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/restore-ip-addresses/",pattern:"棋盘搜索 (N皇后/数独)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/backtracking/0093-restore-ip-addresses.html"},{id:"algo_78",num:78,title:"78. 子集",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/subsets/",pattern:"子集与分割",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"回溯",hot100Order:56,carlUrl:"https://programmercarl.com/algo/backtracking/0078-subsets.html"},{id:"algo_90",num:90,title:"90. 子集II",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/subsets-ii/",pattern:"子集与分割",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/backtracking/0090-subsets-ii.html"},{id:"algo_491",num:491,title:"491. 递增子序列",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/non-decreasing-subsequences/",pattern:"棋盘搜索 (N皇后/数独)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/backtracking/0491-non-decreasing-subsequences.html"},{id:"algo_46",num:46,title:"46. 全排列",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/permutations/",pattern:"排列问题 (used 数组去重)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"回溯",hot100Order:55,carlUrl:"https://programmercarl.com/algo/backtracking/0046-permutations.html"},{id:"algo_47",num:47,title:"47. 全排列II",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/permutations-ii/",pattern:"排列问题 (used 数组去重)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/backtracking/0047-permutations-ii.html"},{id:"algo_89",num:null,title:"回溯算法去重问题的另一种写法",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problemset/?search=%E5%9B%9E%E6%BA%AF%E7%AE%97%E6%B3%95%E5%8E%BB%E9%87%8D%E9%97%AE%E9%A2%98%E7%9A%84%E5%8F%A6%E4%B8%80%E7%A7%8D%E5%86%99%E6%B3%95",pattern:"棋盘搜索 (N皇后/数独)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/backtracking/alternative-backtracking-deduplication.html"},{id:"algo_332",num:332,title:"332. 重新安排行程",difficulty:"Hard",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/reconstruct-itinerary/",pattern:"棋盘搜索 (N皇后/数独)",timeComp:"O(n log n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/other/0332-reconstruct-itinerary.html"},{id:"algo_51",num:51,title:"51. N皇后",difficulty:"Hard",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/n-queens/",pattern:"棋盘搜索 (N皇后/数独)",timeComp:"O(n log n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"回溯",hot100Order:62,carlUrl:"https://programmercarl.com/algo/backtracking/0051-n-queens.html"},{id:"algo_37",num:37,title:"37. 解数独",difficulty:"Hard",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/sudoku-solver/",pattern:"棋盘搜索 (N皇后/数独)",timeComp:"O(n log n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/backtracking/0037-sudoku-solver.html"},{id:"algo_455",num:455,title:"455. 分发饼干",difficulty:"Easy",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/assign-cookies/",pattern:"贪心选择策略",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/0455-assign-cookies.html"},{id:"algo_376",num:376,title:"376. 摆动序列",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/wiggle-subsequence/",pattern:"贪心选择策略",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/0376-wiggle-subsequence.html"},{id:"algo_53",num:53,title:"53. 最大子序和",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/maximum-subarray/",pattern:"贪心选择策略",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"普通数组",hot100Order:13,carlUrl:"https://programmercarl.com/algo/greedy/0053-maximum-subarray.html"},{id:"algo_122",num:122,title:"122. 买卖股票的最佳时机II",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/",pattern:"局部最优正收益",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/0122-best-time-to-buy-and-sell-stock-ii.html"},{id:"algo_55",num:55,title:"55. 跳跃游戏",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/jump-game/",pattern:"贪心选择策略",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"贪心算法",hot100Order:78,carlUrl:"https://programmercarl.com/algo/greedy/0055-jump-game.html"},{id:"algo_45",num:45,title:"45. 跳跃游戏II",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/jump-game-ii/",pattern:"贪心选择策略",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"贪心算法",hot100Order:79,carlUrl:"https://programmercarl.com/algo/greedy/0045-jump-game-ii.html"},{id:"algo_1005",num:1005,title:"1005. K次取反后最大化的数组和",difficulty:"Easy",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/maximize-sum-of-array-after-k-negations/",pattern:"贪心选择策略",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/1005-maximize-sum-of-array-after-k-negations.html"},{id:"algo_134",num:134,title:"134. 加油站",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/gas-station/",pattern:"贪心选择策略",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/0134-gas-station.html"},{id:"algo_135",num:135,title:"135. 分发糖果",difficulty:"Hard",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/candy/",pattern:"贪心选择策略",timeComp:"O(n log n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/0135-candy.html"},{id:"algo_860",num:860,title:"860. 柠檬水找零",difficulty:"Easy",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/lemonade-change/",pattern:"贪心选择策略",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/0860-lemonade-change.html"},{id:"algo_406",num:406,title:"406. 根据身高重建队列",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/queue-reconstruction-by-height/",pattern:"贪心选择策略",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/0406-queue-reconstruction-by-height.html"},{id:"algo_406_seq",num:null,title:"406.根据身高重建队列（续集）",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problemset/?search=406.%E6%A0%B9%E6%8D%AE%E8%BA%AB%E9%AB%98%E9%87%8D%E5%BB%BA%E9%98%9F%E5%88%97%EF%BC%88%E7%BB%AD%E9%9B%86%EF%BC%89",pattern:"贪心选择策略",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/0406-queue-reconstruction-by-height.html"},{id:"algo_452",num:452,title:"452. 用最少数量的箭引爆气球",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/minimum-number-of-arrows-to-burst-balloons/",pattern:"贪心选择策略",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/0452-minimum-number-of-arrows-to-burst-balloons.html"},{id:"algo_435",num:435,title:"435. 无重叠区间",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/non-overlapping-intervals/",pattern:"区间重叠与排序",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/0435-non-overlapping-intervals.html"},{id:"algo_763",num:763,title:"763. 划分字母区间",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/partition-labels/",pattern:"区间重叠与排序",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"贪心算法",hot100Order:80,carlUrl:"https://programmercarl.com/algo/greedy/0763-partition-labels.html"},{id:"algo_56",num:56,title:"56. 合并区间",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/merge-intervals/",pattern:"区间重叠与排序",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"普通数组",hot100Order:14,carlUrl:"https://programmercarl.com/algo/greedy/0056-merge-intervals.html"},{id:"algo_738",num:738,title:"738. 单调递增的数字",difficulty:"Medium",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/monotone-increasing-digits/",pattern:"贪心选择策略",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/0738-monotone-increasing-digits.html"},{id:"algo_968",num:968,title:"968. 监控二叉树",difficulty:"Hard",category:"贪心算法",topic:"贪心算法",leetcodeUrl:"https://leetcode.cn/problems/binary-tree-cameras/",pattern:"贪心选择策略",timeComp:"O(n log n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/greedy/0968-binary-tree-cameras.html"},{id:"algo_509",num:509,title:"509. 斐波那契数",difficulty:"Easy",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/fibonacci-number/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0509-fibonacci-number.html"},{id:"algo_70",num:70,title:"70. 爬楼梯",difficulty:"Easy",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/climbing-stairs/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"动态规划",hot100Order:81,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0070-climbing-stairs.html"},{id:"algo_746",num:746,title:"746. 使用最小花费爬楼梯",difficulty:"Easy",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/min-cost-climbing-stairs/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0746-min-cost-climbing-stairs.html"},{id:"algo_62",num:62,title:"62. 不同路径",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/unique-paths/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"多维动态规划",hot100Order:91,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0062-unique-paths.html"},{id:"algo_63",num:63,title:"63. 不同路径II",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/unique-paths-ii/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0063-unique-paths-ii.html"},{id:"algo_343",num:343,title:"343. 整数拆分",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/integer-break/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0343-integer-break.html"},{id:"algo_96",num:96,title:"96. 不同的二叉搜索树",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/unique-binary-search-trees/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0096-unique-binary-search-trees.html"},{id:"algo_416",num:416,title:"416. 分割等和子集",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/partition-equal-subset-sum/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"动态规划",hot100Order:89,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0416-partition-equal-subset-sum.html"},{id:"algo_1049",num:1049,title:"1049. 最后一块石头的重量II",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/last-stone-weight-ii/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/1049-last-stone-weight-ii.html"},{id:"algo_494",num:494,title:"494. 目标和",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/target-sum/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0494-target-sum.html"},{id:"algo_474",num:474,title:"474. 一和零",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/ones-and-zeroes/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0474-ones-and-zeroes.html"},{id:"algo_518",num:518,title:"518. 零钱兑换II",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/coin-change-ii/",pattern:"01背包 / 完全背包 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0518-coin-change-ii.html"},{id:"algo_377",num:377,title:"377. 组合总和Ⅳ",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/combination-sum-iv/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0377-combination-sum-iv.html"},{id:"algo_70_knapsack",num:70,title:"70. 爬楼梯完全背包版本",difficulty:"Easy",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/climbing-stairs/",pattern:"01背包 / 完全背包 DP",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0070-climbing-stairs-complete-knapsack.html"},{id:"algo_322",num:322,title:"322. 零钱兑换",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/coin-change/",pattern:"01背包 / 完全背包 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"动态规划",hot100Order:85,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0322-coin-change.html"},{id:"algo_279",num:279,title:"279. 完全平方数",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/perfect-squares/",pattern:"01背包 / 完全背包 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"动态规划",hot100Order:84,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0279-perfect-squares.html"},{id:"algo_139",num:139,title:"139. 单词拆分",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/word-break/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"动态规划",hot100Order:86,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0139-word-break.html"},{id:"algo_198",num:198,title:"198. 打家劫舍",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/house-robber/",pattern:"状态转移递推",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"动态规划",hot100Order:83,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0198-house-robber.html"},{id:"algo_213",num:213,title:"213. 打家劫舍II",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/house-robber-ii/",pattern:"状态转移递推",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0213-house-robber-ii.html"},{id:"algo_337",num:337,title:"337. 打家劫舍III",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/house-robber-iii/",pattern:"状态转移递推",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0337-house-robber-iii.html"},{id:"algo_121",num:121,title:"121. 买卖股票的最佳时机",difficulty:"Easy",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/best-time-to-buy-and-sell-stock/",pattern:"状态机 DP (持有/不持有)",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"贪心算法",hot100Order:77,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0121-best-time-to-buy-and-sell-stock.html"},{id:"algo_122_dp",num:122,title:"122. 买卖股票的最佳时机II",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-ii/",pattern:"状态机 DP (持有/不持有)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0122-best-time-to-buy-and-sell-stock-ii-dynamic-programming.html"},{id:"algo_123",num:123,title:"123. 买卖股票的最佳时机III",difficulty:"Hard",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iii/",pattern:"状态机 DP (持有/不持有)",timeComp:"O(n log n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0123-best-time-to-buy-and-sell-stock-iii.html"},{id:"algo_188",num:188,title:"188. 买卖股票的最佳时机IV",difficulty:"Hard",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-iv/",pattern:"状态机 DP (持有/不持有)",timeComp:"O(n log n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0188-best-time-to-buy-and-sell-stock-iv.html"},{id:"algo_309",num:309,title:"309. 最佳买卖股票时机含冷冻期",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-cooldown/",pattern:"状态机 DP (持有/不持有)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0309-best-time-to-buy-and-sell-stock-with-cooldown.html"},{id:"algo_714",num:714,title:"714. 买卖股票的最佳时机含手续费",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/",pattern:"状态机 DP (持有/不持有)",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0714-best-time-to-buy-and-sell-stock-with-transaction-fee-dynamic-programming.html"},{id:"algo_300",num:300,title:"300. 最长上升子序列",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/longest-increasing-subsequence/",pattern:"双串子序列与编辑距离 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"动态规划",hot100Order:87,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0300-longest-increasing-subsequence.html"},{id:"algo_674",num:674,title:"674. 最长连续递增序列",difficulty:"Easy",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/longest-continuous-increasing-subsequence/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0674-longest-continuous-increasing-subsequence.html"},{id:"algo_718",num:718,title:"718. 最长重复子数组",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/maximum-length-of-repeated-subarray/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0718-maximum-length-of-repeated-subarray.html"},{id:"algo_1143",num:1143,title:"1143. 最长公共子序列",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/longest-common-subsequence/",pattern:"双串子序列与编辑距离 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"多维动态规划",hot100Order:94,carlUrl:"https://programmercarl.com/algo/dynamic-programming/1143-longest-common-subsequence.html"},{id:"algo_1035",num:1035,title:"1035. 不相交的线",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/uncrossed-lines/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/1035-uncrossed-lines.html"},{id:"algo_53_dp",num:53,title:"53. 最大子序和",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/maximum-subarray/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0053-maximum-subarray-dynamic-programming.html"},{id:"algo_392",num:392,title:"392. 判断子序列",difficulty:"Easy",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/is-subsequence/",pattern:"双串子序列与编辑距离 DP",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0392-is-subsequence.html"},{id:"algo_115",num:115,title:"115. 不同的子序列",difficulty:"Hard",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/distinct-subsequences/",pattern:"双串子序列与编辑距离 DP",timeComp:"O(n log n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0115-distinct-subsequences.html"},{id:"algo_583",num:583,title:"583. 两个字符串的删除操作",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/delete-operation-for-two-strings/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0583-delete-operation-for-two-strings.html"},{id:"algo_72",num:72,title:"72. 编辑距离",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/edit-distance/",pattern:"双串子序列与编辑距离 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"多维动态规划",hot100Order:95,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0072-edit-distance.html"},{id:"algo_647",num:647,title:"647. 回文子串",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/palindromic-substrings/",pattern:"基础递推 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0647-palindromic-substrings.html"},{id:"algo_516",num:516,title:"516. 最长回文子序列",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/longest-palindromic-subsequence/",pattern:"双串子序列与编辑距离 DP",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/dynamic-programming/0516-longest-palindromic-subsequence.html"},{id:"algo_739",num:739,title:"739. 每日温度",difficulty:"Medium",category:"单调栈",topic:"单调栈",leetcodeUrl:"https://leetcode.cn/problems/daily-temperatures/",pattern:"递增/递减单调栈寻找下一个更大元素",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"栈",hot100Order:72,carlUrl:"https://programmercarl.com/algo/monotonic-stack/0739-daily-temperatures.html"},{id:"algo_496",num:496,title:"496. 下一个更大元素I",difficulty:"Easy",category:"单调栈",topic:"单调栈",leetcodeUrl:"https://leetcode.cn/problems/next-greater-element-i/",pattern:"递增/递减单调栈寻找下一个更大元素",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/monotonic-stack/0496-next-greater-element-i.html"},{id:"algo_503",num:503,title:"503. 下一个更大元素II",difficulty:"Medium",category:"单调栈",topic:"单调栈",leetcodeUrl:"https://leetcode.cn/problems/next-greater-element-ii/",pattern:"递增/递减单调栈寻找下一个更大元素",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/monotonic-stack/0503-next-greater-element-ii.html"},{id:"algo_42",num:42,title:"42. 接雨水",difficulty:"Hard",category:"单调栈",topic:"单调栈",leetcodeUrl:"https://leetcode.cn/problems/trapping-rain-water/",pattern:"递增/递减单调栈寻找下一个更大元素",timeComp:"O(n log n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"双指针",hot100Order:7,carlUrl:"https://programmercarl.com/algo/monotonic-stack/0042-trapping-rain-water.html"},{id:"algo_84",num:84,title:"84. 柱状图中最大的矩形",difficulty:"Hard",category:"单调栈",topic:"单调栈",leetcodeUrl:"https://leetcode.cn/problems/largest-rectangle-in-histogram/",pattern:"递增/递减单调栈寻找下一个更大元素",timeComp:"O(n log n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!0,hot100Chapter:"栈",hot100Order:73,carlUrl:"https://programmercarl.com/algo/monotonic-stack/0084-largest-rectangle-in-histogram.html"},{id:"algo_kama_98",num:98,title:"98. 所有可达路径",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1170",pattern:"DFS / BFS 网格与遍历",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0098-all-paths.html"},{id:"algo_kama_99_dfs",num:99,title:"99. 岛屿的数量深搜",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1171",pattern:"DFS / BFS 网格与遍历",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0099-number-of-islands-dfs.html"},{id:"algo_kama_99_bfs",num:99,title:"99. 岛屿的数量广搜",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1171",pattern:"DFS / BFS 网格与遍历",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0099-number-of-islands-bfs.html"},{id:"algo_kama_100",num:100,title:"100. 岛屿的最大面积",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1172",pattern:"DFS / BFS 网格与遍历",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0100-maximum-island-area.html"},{id:"algo_kama_101",num:101,title:"101. 孤岛的总面积",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1173",pattern:"DFS / BFS 网格与遍历",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0101-isolated-island-area.html"},{id:"algo_kama_102",num:102,title:"102. 沉没孤岛",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1174",pattern:"DFS / BFS 网格与遍历",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0102-sink-isolated-islands.html"},{id:"algo_kama_103",num:103,title:"103. 水流问题",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1175",pattern:"拓扑排序 / A* 启发式",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0103-water-flow.html"},{id:"algo_kama_104",num:104,title:"104. 建造最大岛屿",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1176",pattern:"DFS / BFS 网格与遍历",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0104-make-largest-island.html"},{id:"algo_kama_106",num:106,title:"106. 岛屿的周长",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1178",pattern:"DFS / BFS 网格与遍历",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0106-island-perimeter.html"},{id:"algo_kama_110",num:110,title:"110. 字符串接龙",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1182",pattern:"拓扑排序 / A* 启发式",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0110-word-ladder.html"},{id:"algo_kama_105",num:105,title:"105. 有向图的完全可达性",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1177",pattern:"有向图可达性搜索 / DFS / BFS",timeComp:"O(V + E)",spaceComp:"O(V)",independent:!0,mistakes:"注意有向边的单向性，从节点 1 开始遍历并使用 visited 数组统计遍历节点数。",projectLink:"对应分布式微服务拓扑可达性检测与强连通分支健康检查。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0105-directed-graph-reachability.html"},{id:"algo_kama_107",num:107,title:"107. 寻找存在的路径",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1179",pattern:"DFS / BFS 网格与遍历",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0107-path-existence.html"},{id:"algo_kama_108",num:108,title:"108. 冗余连接",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1180",pattern:"并查集 Disjoint Set",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0108-redundant-connection.html"},{id:"algo_kama_109",num:109,title:"109. 冗余连接II",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1181",pattern:"并查集 Disjoint Set",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0109-redundant-connection-ii.html"},{id:"algo_kama_53_prim",num:53,title:"53. 寻宝-prim",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1053",pattern:"最小生成树 MST",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0053-treasure-prim.html"},{id:"algo_kama_53_kruskal",num:53,title:"53. 寻宝-Kruskal",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1053",pattern:"拓扑排序 / A* 启发式",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0053-treasure-kruskal.html"},{id:"algo_kama_117",num:117,title:"117. 软件构建",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1189",pattern:"拓扑排序 / A* 启发式",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0117-software-build.html"},{id:"algo_kama_47_naive",num:47,title:"47. 参会dijkstra朴素",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1047",pattern:"最短路径算法",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0047-meeting-dijkstra-naive.html"},{id:"algo_kama_47_heap",num:47,title:"47. 参会dijkstra堆",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1047",pattern:"最短路径算法",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0047-meeting-dijkstra-heap.html"},{id:"algo_kama_94",num:94,title:"94. 城市间货物运输I",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1166",pattern:"单源最短路 / Bellman-Ford 算法",timeComp:"O(V * E)",spaceComp:"O(V)",independent:!0,mistakes:"每轮对所有边松弛时必须使用上一轮 minDist 数组的副本，防止单轮多次松弛发生级联串通。",projectLink:"对应带负权指标的网络链路时延计算与动态路由协议收敛。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0094-city-goods-transportation-i.html"},{id:"algo_kama_94_spfa",num:94,title:"94. 城市间货物运输I-SPFA",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1166",pattern:"拓扑排序 / A* 启发式",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0094-city-goods-transportation-i-spfa.html"},{id:"algo_kama_95",num:95,title:"95. 城市间货物运输II",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1167",pattern:"拓扑排序 / A* 启发式",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0095-city-goods-transportation-ii.html"},{id:"algo_kama_96",num:96,title:"96. 城市间货物运输III",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1168",pattern:"拓扑排序 / A* 启发式",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0096-city-goods-transportation-iii.html"},{id:"algo_kama_97",num:97,title:"97. 小明逛公园",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1169",pattern:"拓扑排序 / A* 启发式",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0097-xiaoming-visits-park.html"},{id:"algo_kama_126",num:126,title:"126. 骑士的攻击astar",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://kamacoder.com/problempage.php?pid=1198",pattern:"拓扑排序 / A* 启发式",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!0,isHot100:!1,carlUrl:"https://programmercarl.com/algo/graph/kamacoder-0126-knight-attack-a-star.html"},{id:"algo_hot_49",num:49,title:"49. 字母异位词分组",difficulty:"Medium",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/group-anagrams/",pattern:"哈希表计数",timeComp:"O(n * k log k)",spaceComp:"O(nk)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"哈希",hot100Order:2,carlUrl:"https://programmercarl.com/hot100/0049.group-anagrams.html"},{id:"algo_hot_128",num:128,title:"128. 最长连续序列",difficulty:"Medium",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/longest-consecutive-sequence/",pattern:"哈希集合边界跳跃",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"哈希",hot100Order:3,carlUrl:"https://programmercarl.com/hot100/0128.longest-consecutive-sequence.html"},{id:"algo_hot_283",num:283,title:"283. 移动零",difficulty:"Easy",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/move-zeroes/",pattern:"快慢指针原地覆盖",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"双指针",hot100Order:4,carlUrl:"https://programmercarl.com/algo/other/0283-move-zeroes.html"},{id:"algo_hot_11",num:11,title:"11. 盛最多水的容器",difficulty:"Medium",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/container-with-most-water/",pattern:"对撞双指针",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"双指针",hot100Order:5,carlUrl:"https://programmercarl.com/hot100/0011.container-with-most-water.html"},{id:"algo_hot_3",num:3,title:"3. 无重复字符的最长子串",difficulty:"Medium",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/longest-substring-without-repeating-characters/",pattern:"滑动窗口",timeComp:"O(n)",spaceComp:"O(min(m,n))",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"滑动窗口",hot100Order:8,carlUrl:"https://programmercarl.com/hot100/0003.longest-substring-without-repeating-characters.html"},{id:"algo_hot_438",num:438,title:"438. 找到字符串中所有字母异位词",difficulty:"Medium",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/find-all-anagrams-in-a-string/",pattern:"定长滑动窗口",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"滑动窗口",hot100Order:9,carlUrl:"https://programmercarl.com/hot100/0438.find-all-anagrams-in-a-string.html"},{id:"algo_hot_560",num:560,title:"560. 和为 K 的子数组",difficulty:"Medium",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/subarray-sum-equals-k/",pattern:"前缀和+哈希表计数",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"子串",hot100Order:10,carlUrl:"https://programmercarl.com/hot100/0560.subarray-sum-equals-k.html"},{id:"algo_hot_76",num:76,title:"76. 最小覆盖子串",difficulty:"Hard",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/minimum-window-substring/",pattern:"滑动窗口+哈希计数",timeComp:"O(n)",spaceComp:"O(C)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"子串",hot100Order:12,carlUrl:"https://programmercarl.com/hot100/0076.minimum-window-substring.html"},{id:"algo_hot_189",num:189,title:"189. 轮转数组",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/rotate-array/",pattern:"三次翻转数组",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"普通数组",hot100Order:15,carlUrl:"https://programmercarl.com/algo/other/0189-rotate-array.html"},{id:"algo_hot_238",num:238,title:"238. 除自身以外数组的乘积",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/product-of-array-except-self/",pattern:"前缀积乘以后缀积",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"普通数组",hot100Order:16,carlUrl:"https://programmercarl.com/hot100/0238.product-of-array-except-self.html"},{id:"algo_hot_41",num:41,title:"41. 缺失的第一个正数",difficulty:"Hard",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/first-missing-positive/",pattern:"原地哈希",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"普通数组",hot100Order:17},{id:"algo_hot_73",num:73,title:"73. 矩阵置零",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/set-matrix-zeroes/",pattern:"原地标记",timeComp:"O(mn)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"矩阵",hot100Order:18,carlUrl:"https://programmercarl.com/hot100/0073.set-matrix-zeroes.html"},{id:"algo_hot_48",num:48,title:"48. 旋转图像",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/rotate-image/",pattern:"矩阵对称翻转",timeComp:"O(n^2)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"矩阵",hot100Order:20,carlUrl:"https://programmercarl.com/hot100/0048.rotate-image.html"},{id:"algo_hot_240",num:240,title:"240. 搜索二维矩阵 II",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/search-a-2d-matrix-ii/",pattern:"右上角对撞二分搜索",timeComp:"O(m+n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"矩阵",hot100Order:21},{id:"algo_hot_160",num:160,title:"160. 相交链表",difficulty:"Easy",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/intersection-of-two-linked-lists/",pattern:"双指针走过彼此的路",timeComp:"O(m+n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"链表",hot100Order:22,carlUrl:"https://programmercarl.com/algo/other/0160-intersection-of-two-linked-lists.html"},{id:"algo_hot_234",num:234,title:"234. 回文链表",difficulty:"Easy",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/palindrome-linked-list/",pattern:"快慢指针切半翻转",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"链表",hot100Order:24,carlUrl:"https://programmercarl.com/algo/other/0234-palindrome-linked-list.html"},{id:"algo_hot_141",num:141,title:"141. 环形链表",difficulty:"Easy",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/linked-list-cycle/",pattern:"快慢双指针判定",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"链表",hot100Order:25,carlUrl:"https://programmercarl.com/algo/other/0141-linked-list-cycle.html"},{id:"algo_hot_21",num:21,title:"21. 合并两个有序链表",difficulty:"Easy",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/merge-two-sorted-lists/",pattern:"双指针归并",timeComp:"O(n+m)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"链表",hot100Order:27,carlUrl:"https://programmercarl.com/hot100/0021.merge-two-sorted-lists.html"},{id:"algo_hot_2",num:2,title:"2. 两数相加",difficulty:"Medium",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/add-two-numbers/",pattern:"链表模拟",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"链表",hot100Order:28,carlUrl:"https://programmercarl.com/hot100/0002.add-two-numbers.html"},{id:"algo_hot_25",num:25,title:"25. K 个一组翻转链表",difficulty:"Hard",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/reverse-nodes-in-k-group/",pattern:"链表遍历 / 局部反转",timeComp:"O(n)",spaceComp:"O(1)",mistakes:"注意处理不足 k 个节点的分支，以及翻转后的前驱和后继指针连接。",projectLink:"对应高性能网络库中分块报文聚合重排与链表缓冲区反向重构。",isCarl:!1,isHot100:!0,hot100Chapter:"链表",hot100Order:31},{id:"algo_hot_138",num:138,title:"138. 随机链表的复制",difficulty:"Medium",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/copy-list-with-random-pointer/",pattern:"哈希表或原地拆分复制",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"链表",hot100Order:32},{id:"algo_hot_148",num:148,title:"148. 排序链表",difficulty:"Medium",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/sort-list/",pattern:"自顶向下/自底向上归并",timeComp:"O(n log n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"链表",hot100Order:33},{id:"algo_hot_23",num:23,title:"23. 合并 K 个升序链表",difficulty:"Hard",category:"链表",topic:"链表",leetcodeUrl:"https://leetcode.cn/problems/merge-k-sorted-lists/",pattern:"优先队列/分治",timeComp:"O(N log k)",spaceComp:"O(k)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"链表",hot100Order:34},{id:"algo_hot_543",num:543,title:"543. 二叉树的直径",difficulty:"Easy",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/diameter-of-binary-tree/",pattern:"后序遍历求最大路径跨度",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"二叉树",hot100Order:40,carlUrl:"https://programmercarl.com/hot100/0543.diameter-of-binary-tree.html"},{id:"algo_hot_230",num:230,title:"230. 二叉搜索树中第 K 小的元素",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/kth-smallest-element-in-a-bst/",pattern:"中序遍历提前退出",timeComp:"O(H + k)",spaceComp:"O(H)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"二叉树",hot100Order:44},{id:"algo_hot_199",num:199,title:"199. 二叉树的右视图",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/binary-tree-right-side-view/",pattern:"广度优先层序遍历",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"二叉树",hot100Order:45,carlUrl:"https://programmercarl.com/hot100/0199.binary-tree-right-side-view.html"},{id:"algo_hot_114",num:114,title:"114. 二叉树展开为链表",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/flatten-binary-tree-to-linked-list/",pattern:"后序递归原地修改",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"二叉树",hot100Order:46,carlUrl:"https://programmercarl.com/hot100/0114.flatten-binary-tree-to-linked-list.html"},{id:"algo_hot_437",num:437,title:"437. 路径总和 III",difficulty:"Medium",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/path-sum-iii/",pattern:"二叉树前缀和哈希",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"二叉树",hot100Order:48},{id:"algo_hot_124",num:124,title:"124. 二叉树中的最大路径和",difficulty:"Hard",category:"二叉树",topic:"二叉树",leetcodeUrl:"https://leetcode.cn/problems/binary-tree-maximum-path-sum/",pattern:"后序遍历贡献计算",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"二叉树",hot100Order:50},{id:"algo_hot_200",num:200,title:"200. 岛屿数量",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://leetcode.cn/problems/number-of-islands/",pattern:"网格深度优先沉没",timeComp:"O(mn)",spaceComp:"O(mn)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"图论",hot100Order:51,carlUrl:"https://programmercarl.com/algo/other/0200-number-of-islands-bfs.html"},{id:"algo_hot_994",num:994,title:"994. 腐烂的橘子",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://leetcode.cn/problems/rotting-oranges/",pattern:"多源广度优先搜索",timeComp:"O(mn)",spaceComp:"O(mn)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"图论",hot100Order:52,carlUrl:"https://programmercarl.com/hot100/0994.rotting-oranges.html"},{id:"algo_hot_207",num:207,title:"207. 课程表",difficulty:"Medium",category:"图论",topic:"图论",leetcodeUrl:"https://leetcode.cn/problems/course-schedule/",pattern:"拓扑排序检测有向环",timeComp:"O(V+E)",spaceComp:"O(V+E)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"图论",hot100Order:53,carlUrl:"https://programmercarl.com/algo/other/0207-course-schedule.html"},{id:"algo_hot_208",num:208,title:"208. 实现 Trie",difficulty:"Medium",category:"字符串",topic:"字符串",leetcodeUrl:"https://leetcode.cn/problems/implement-trie-prefix-tree/",pattern:"前缀树多叉节点",timeComp:"O(L)",spaceComp:"O(Sigma * L)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"图论",hot100Order:54},{id:"algo_hot_22",num:22,title:"22. 括号生成",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/generate-parentheses/",pattern:"剪枝回溯",timeComp:"O(4^n / sqrt(n))",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"回溯",hot100Order:59,carlUrl:"https://programmercarl.com/hot100/0022.generate-parentheses.html"},{id:"algo_hot_79",num:79,title:"79. 单词搜索",difficulty:"Medium",category:"回溯算法",topic:"回溯算法",leetcodeUrl:"https://leetcode.cn/problems/word-search/",pattern:"网格深度优先回溯",timeComp:"O(mn * 3^L)",spaceComp:"O(L)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"回溯",hot100Order:60,carlUrl:"https://programmercarl.com/hot100/0079.word-search.html"},{id:"algo_hot_35",num:35,title:"35. 搜索插入位置",difficulty:"Easy",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/search-insert-position/",pattern:"二分查找",timeComp:"O(log n)",spaceComp:"O(1)",mistakes:"注意开闭区间的一致性（[left, right] 或 [left, right)）与循环终止时返回值处理。",projectLink:"对应高并发连接池与有序事件轮中快速插入定位。",isCarl:!1,isHot100:!0,hot100Chapter:"二分查找",hot100Order:63,carlUrl:"https://programmercarl.com/algo/other/0035-search-insert-position.html"},{id:"algo_hot_74",num:74,title:"74. 搜索二维矩阵",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/search-a-2d-matrix/",pattern:"二维展开二分查找",timeComp:"O(log(mn))",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"二分查找",hot100Order:64,carlUrl:"https://programmercarl.com/hot100/0074.search-a-2d-matrix.html"},{id:"algo_hot_34",num:34,title:"34. 在排序数组中查找元素的第一个和最后一个位置",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/find-first-and-last-position-of-element-in-sorted-array/",pattern:"两次二分查找",timeComp:"O(log n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"二分查找",hot100Order:65,carlUrl:"https://programmercarl.com/algo/other/0034-find-first-and-last-position-of-element-in-sorted-array.html"},{id:"algo_hot_33",num:33,title:"33. 搜索旋转排序数组",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/search-in-rotated-sorted-array/",pattern:"分类二分查找",timeComp:"O(log n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"二分查找",hot100Order:66,carlUrl:"https://programmercarl.com/hot100/0033.search-in-rotated-sorted-array.html"},{id:"algo_hot_153",num:153,title:"153. 寻找旋转排序数组中的最小值",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/find-minimum-in-rotated-sorted-array/",pattern:"二分查找极值点",timeComp:"O(log n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"二分查找",hot100Order:67,carlUrl:"https://programmercarl.com/hot100/0153.find-minimum-in-rotated-sorted-array.html"},{id:"algo_hot_4",num:4,title:"4. 寻找两个正序数组的中位数",difficulty:"Hard",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/median-of-two-sorted-arrays/",pattern:"二分查找",timeComp:"O(log(min(m,n)))",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"二分查找",hot100Order:68},{id:"algo_hot_155",num:155,title:"155. 最小栈",difficulty:"Medium",category:"栈与队列",topic:"栈与队列",leetcodeUrl:"https://leetcode.cn/problems/min-stack/",pattern:"辅助双栈同步",timeComp:"O(1)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"栈",hot100Order:70,carlUrl:"https://programmercarl.com/hot100/0155.min-stack.html"},{id:"algo_hot_394",num:394,title:"394. 字符串解码",difficulty:"Medium",category:"栈与队列",topic:"栈与队列",leetcodeUrl:"https://leetcode.cn/problems/decode-string/",pattern:"双栈模拟辅助解嵌套",timeComp:"O(S)",spaceComp:"O(S)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"栈",hot100Order:71,carlUrl:"https://programmercarl.com/hot100/0394.decode-string.html"},{id:"algo_hot_215",num:215,title:"215. 数组中的第K个最大元素",difficulty:"Medium",category:"栈与队列",topic:"栈与队列",leetcodeUrl:"https://leetcode.cn/problems/kth-largest-element-in-an-array/",pattern:"快速选择/小顶堆",timeComp:"O(n)",spaceComp:"O(log n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"堆",hot100Order:74,carlUrl:"https://programmercarl.com/hot100/0215.kth-largest-element-in-an-array.html"},{id:"algo_hot_295",num:295,title:"295. 数据流的中位数",difficulty:"Hard",category:"栈与队列",topic:"栈与队列",leetcodeUrl:"https://leetcode.cn/problems/find-median-from-data-stream/",pattern:"大顶堆+小顶堆平衡",timeComp:"O(log n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"堆",hot100Order:76},{id:"algo_hot_118",num:118,title:"118. 杨辉三角",difficulty:"Easy",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/pascals-triangle/",pattern:"二维递推",timeComp:"O(n^2)",spaceComp:"O(1)",mistakes:"注意每行首尾为 1，内部元素由上一行相邻两数相加得出。",projectLink:"对应多级队列层级权重分配与状态组合递推。",isCarl:!1,isHot100:!0,hot100Chapter:"动态规划",hot100Order:82,carlUrl:"https://programmercarl.com/hot100/0118.pascals-triangle.html"},{id:"algo_hot_152",num:152,title:"152. 乘积最大子数组",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/maximum-product-subarray/",pattern:"正负极值双状态DP",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"动态规划",hot100Order:88,carlUrl:"https://programmercarl.com/hot100/0152.maximum-product-subarray.html"},{id:"algo_hot_32",num:32,title:"32. 最长有效括号",difficulty:"Hard",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/longest-valid-parentheses/",pattern:"动态规划/栈",timeComp:"O(n)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"动态规划",hot100Order:90},{id:"algo_hot_64",num:64,title:"64. 最小路径和",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/minimum-path-sum/",pattern:"网格动态规划",timeComp:"O(mn)",spaceComp:"O(n)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"多维动态规划",hot100Order:92,carlUrl:"https://programmercarl.com/hot100/0064.minimum-path-sum.html"},{id:"algo_hot_5",num:5,title:"5. 最长回文子串",difficulty:"Medium",category:"动态规划",topic:"动态规划",leetcodeUrl:"https://leetcode.cn/problems/longest-palindromic-substring/",pattern:"中心扩展/动态规划",timeComp:"O(n^2)",spaceComp:"O(n^2)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"多维动态规划",hot100Order:93,carlUrl:"https://programmercarl.com/algo/other/0005-longest-palindromic-substring.html"},{id:"algo_hot_136",num:136,title:"136. 只出现一次的数字",difficulty:"Easy",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/single-number/",pattern:"异或运算消除重复",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"技巧",hot100Order:96,carlUrl:"https://programmercarl.com/hot100/0136.single-number.html"},{id:"algo_hot_169",num:169,title:"169. 多数元素",difficulty:"Easy",category:"哈希表",topic:"哈希表",leetcodeUrl:"https://leetcode.cn/problems/majority-element/",pattern:"摩尔投票计数",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"技巧",hot100Order:97,carlUrl:"https://programmercarl.com/hot100/0169.majority-element.html"},{id:"algo_hot_75",num:75,title:"75. 颜色分类",difficulty:"Medium",category:"双指针法",topic:"双指针法",leetcodeUrl:"https://leetcode.cn/problems/sort-colors/",pattern:"三指针荷兰国旗",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"技巧",hot100Order:98,carlUrl:"https://programmercarl.com/hot100/0075.sort-colors.html"},{id:"algo_hot_31",num:31,title:"31. 下一个排列",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/next-permutation/",pattern:"数组遍历与交换",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"技巧",hot100Order:99,carlUrl:"https://programmercarl.com/algo/other/0031-next-permutation.html"},{id:"algo_hot_287",num:287,title:"287. 寻找重复数",difficulty:"Medium",category:"数组",topic:"数组",leetcodeUrl:"https://leetcode.cn/problems/find-the-duplicate-number/",pattern:"数组下标快慢指针找环",timeComp:"O(n)",spaceComp:"O(1)",independent:!0,mistakes:"注意边界条件校验、防空指针或下标越界、特判特殊输入。",projectLink:"对应高性能服务端中缓冲区切片、状态转移或连接路由树索引。",isCarl:!1,isHot100:!0,hot100Chapter:"技巧",hot100Order:100}];typeof window<"u"&&(window.ALGORITHM_LAB_CATALOG=X);const Xe=[{id:"mod_net_eventloop",projectId:"proj_muduo",name:"EventLoop 事件循环主控",category:"Network",layer:"L4 传输网络层",sourceFiles:["muduo/net/EventLoop.h","muduo/net/EventLoop.cc"],classes:["EventLoop"],functions:["loop()","quit()","runInLoop()","queueInLoop()","wakeup()","handleRead()"],desc:"One Loop Per Thread 机制实现。每个线程最多拥有一个 EventLoop，通过 eventfd 实现跨线程安全唤醒，调用 Poller 派发就绪 Channel。",threadModel:"单线程独占，通过 pendingFunctors_ 跨线程转移计算任务",keyConcepts:["One Loop Per Thread","eventfd 唤醒","pendingFunctors 双缓冲防死锁"],yuqueDocIds:["yq_muduo_04","yq_muduo_05","yq_muduo_06","yq_muduo_10"]},{id:"mod_net_channel",projectId:"proj_muduo",name:"Channel 事件分发通道",category:"Network",layer:"L4 传输网络层",sourceFiles:["muduo/net/Channel.h","muduo/net/Channel.cc"],classes:["Channel"],functions:["setReadCallback()","setWriteCallback()","enableReading()","handleEventWithGuard()","tie()"],desc:"单个文件描述符 (fd) 的事件生命周期包装器。不拥有 fd，负责挂载读写/错误/关闭回调，并使用 weak_ptr 绑定生命周期杜绝空指针悬挂。",threadModel:"严格从属于所属 EventLoop 所在线程",keyConcepts:["fd 关注事件掩码 (POLLIN/POLLOUT)","tie_ 弱引用生命周期防撕裂"],yuqueDocIds:["yq_muduo_05","yq_muduo_06","yq_muduo_10"]},{id:"mod_net_poller",projectId:"proj_muduo",name:"Poller / EPollPoller I/O 复用器",category:"Network",layer:"L4 传输网络层",sourceFiles:["muduo/net/Poller.h","muduo/net/poller/EPollPoller.h","muduo/net/poller/EPollPoller.cc"],classes:["Poller","EPollPoller"],functions:["poll()","updateChannel()","removeChannel()","fillActiveChannels()"],desc:"底层 I/O 多路复用解耦层。封装 Linux epoll_create1 / epoll_ctl / epoll_wait，实现 Channel 从关注树到就绪列表的高效映射。",threadModel:"被 EventLoop 线程独占调用",keyConcepts:["epoll 水平/边缘触发","ChannelMap 维护","操作系统的就绪事件队列转存"],yuqueDocIds:["yq_muduo_05","yq_muduo_06","yq_muduo_08","yq_muduo_10"]},{id:"mod_net_tcpconnection",projectId:"proj_muduo",name:"TcpConnection 客户端全双工连接",category:"Network",layer:"L4 传输网络层",sourceFiles:["muduo/net/TcpConnection.h","muduo/net/TcpConnection.cc"],classes:["TcpConnection"],functions:["send()","shutdown()","handleRead()","handleWrite()","handleClose()"],desc:"已建立的客户端 TCP 物理连接抽象。纯粹操作裸字节流，通过 MessageCallback (void onMessage(const TcpConnectionPtr&, Buffer*, Timestamp)) 与上层协议完全解耦。",threadModel:"运行在所属 SubReactor (I/O) 线程",keyConcepts:["应用层发送缓冲区管理","shutdownWrite 半关闭","enable_shared_from_this 跨线程生命期安全","MessageCallback 协议分界"],yuqueDocIds:["yq_muduo_05","yq_muduo_06","yq_muduo_10"]},{id:"mod_net_buffer",projectId:"proj_muduo",name:"Buffer 应用层缓冲区",category:"Memory",layer:"L4 传输网络层",sourceFiles:["muduo/net/Buffer.h","muduo/net/Buffer.cc"],classes:["Buffer"],functions:["readFd()","append()","retrieve()","peek()","makeSpace()"],desc:"基于 std::vector<char> 实现的应用层缓冲区。包含 prependable / readable / writable 三段式设计，利用 readv 与栈上临时 64KB 空间兼顾空间利用率与系统调用开销。",threadModel:"每个连接独占，无锁并发",keyConcepts:["readv 分散读","动态扩容","内存紧凑 moveReadable"],yuqueDocIds:["yq_muduo_06","yq_muduo_10"]},{id:"mod_net_tcpserver",projectId:"proj_muduo",name:"TcpServer 多线程 TCP 服务端",category:"Network",layer:"L4 传输网络层",sourceFiles:["muduo/net/TcpServer.h","muduo/net/TcpServer.cc","muduo/net/EventLoopThreadPool.h"],classes:["TcpServer","EventLoopThreadPool","Acceptor"],functions:["setThreadNum()","start()","newConnection()","removeConnection()"],desc:"主从 Reactor 模型实现。主线程 Acceptor 监听连接并通过轮询分发给工作线程的 EventLoop，处理后续数据 I/O。",threadModel:"单 MainReactor 监听 + N 个 SubReactor 工作线程",keyConcepts:["主从 Reactor 模型","轮询分发负载均衡","退出清理机制"],yuqueDocIds:["yq_muduo_03","yq_muduo_05","yq_muduo_06","yq_muduo_09"]},{id:"mod_net_timerqueue",projectId:"proj_muduo",name:"TimerQueue 高精度定时器调度队列",category:"Network",layer:"L4 传输网络层",sourceFiles:["muduo/net/TimerQueue.h","muduo/net/TimerQueue.cc","muduo/net/Timer.h"],classes:["TimerQueue","Timer","TimerId"],functions:["addTimer()","cancel()","handleRead()","getExpired()","reset()"],desc:"基于 Linux timerfd 的非阻塞高精度定时器队列。将超时事件抽象为文件描述符并纳入 Poller 监听，使用 std::set<std::pair<Timestamp, Timer*>> 红黑树实现按时间戳快速二分切分到期定时器。",threadModel:"专属 EventLoop 线程独占调度",keyConcepts:["timerfd_create / timerfd_settime 内核机制","std::set 红黑树按键排序","lower_bound 二分查找到期任务"]},{id:"mod_base_threadpool",projectId:"proj_muduo",name:"ThreadPool 任务计算线程池",category:"Concurrency",layer:"L4 传输网络层",sourceFiles:["muduo/base/ThreadPool.h","muduo/base/ThreadPool.cc"],classes:["ThreadPool"],functions:["start()","stop()","run()","take()"],desc:"固定大小工作线程池。基于条件变量与互斥锁实现生产者-消费者安全任务队列，避免计算密集型任务阻塞事件循环。",threadModel:"多生产者多消费者线程安全模型",keyConcepts:["条件变量 pthread_cond_wait","虚假唤醒防范","队列满拒绝策略"]},{id:"mod_base_logging",projectId:"proj_muduo",name:"AsyncLogging 异步日志系统",category:"Infrastructure",layer:"L4 传输网络层",sourceFiles:["muduo/base/AsyncLogging.h","muduo/base/AsyncLogging.cc","muduo/base/LogStream.h"],classes:["AsyncLogging","LogStream","LogFile"],functions:["append()","threadFunc()"],desc:"双缓冲 (Double Buffering) 异步日志。前端线程将日志写入 Buffer，后台专用线程定期将数据批量写入磁盘文件，避免磁盘 I/O 阻塞网络主循环。",threadModel:"多前台工作线程写入 + 单后台落盘线程",keyConcepts:["双缓冲内存轮转机制","std::unique_ptr 指针交换","极端情况丢弃策略"]},{id:"mod_net_client",projectId:"proj_muduo",name:"Client 客户端连接与请求",category:"Network",layer:"L4 传输网络层",sourceFiles:["examples/chat/client.cc","HttpServer/resource/AI.html"],classes:["TcpClient","HttpClient"],functions:["connect()","send()","onMessage()","disconnect()"],desc:"外部接入终端。向服务端发起 TCP 连接与数据收发。",threadModel:"客户端独立进程，服务端通过 Socket fd 与非阻塞 I/O 并发承载",keyConcepts:["非阻塞 Socket","Keep-Alive 长连接复用","连接生命周期管理"]},{id:"mod_kernel_epoll",projectId:"proj_muduo",name:"Linux 内核 epoll 事件多路复用",category:"Network",layer:"L4 传输网络层",sourceFiles:["muduo/net/poller/EPollPoller.cc","<sys/epoll.h>"],classes:["EPollPoller","struct epoll_event"],functions:["epoll_create1()","epoll_ctl()","epoll_wait()"],desc:"Linux I/O 多路复用系统调用。使用红黑树管理监听的文件描述符，通过 epoll_wait 获取就绪事件链表。",threadModel:"内核系统调用，由 Poller 线程阻塞监听并唤醒",keyConcepts:["LT 水平触发与 ET 边缘触发","epoll 红黑树与就绪链表","非阻塞 I/O 配合机制"]},{id:"mod_http_server",projectId:"proj_http_component",name:"HttpServer HTTP 服务装配",category:"Network",layer:"L7 应用协议层",sourceFiles:["HttpServer/src/http/HttpServer.cpp","HttpServer/include/http/HttpServer.h"],classes:["http::HttpServer"],functions:["start()","onConnection()","onMessage()","onRequest()","Get()","Post()"],desc:"基于 muduo TcpServer 扩展构建的 HTTP/HTTPS 服务。挂载于 onMessage 回调之上，维护路由映射表、会话管理、中间件链与 SSL 上下文。",threadModel:"复用底层 muduo 主从 Reactor 线程池",keyConcepts:["muduo 网络库封装","HTTP/1.1 长连接支持","协议与服务分层解耦"]},{id:"mod_http_codec",projectId:"proj_http_component",name:"HttpCodec 报文解析与状态机编解码",category:"Protocol",layer:"L7 协议解析状态机",sourceFiles:["HttpServer/src/http/HttpContext.cpp","HttpServer/include/http/HttpRequest.h","HttpServer/include/http/HttpResponse.h"],classes:["http::HttpContext","http::HttpRequest","http::HttpResponse"],functions:["parseRequest()","processRequestLine()","appendToBuffer()"],desc:"基于有限状态机 (FSM) 的流式解析器。逐行解析 Request-Line / Headers / Chunked-Body，减少内存拷贝。",threadModel:"连接内部状态机，独占执行",keyConcepts:["有限状态机 FSM","流式报文解析","Chunked 编码与 SSE 准备"]},{id:"mod_http_router",projectId:"proj_http_component",name:"HttpRouter 路由分发与动态映射",category:"Architecture",layer:"L7 路由分发层",sourceFiles:["AIApps/ChatServer/src/ChatServer.cpp","HttpServer/include/http/HttpServer.h"],classes:["ChatServer","HttpHandler"],functions:["initializeRouter()","packageResp()","routeHandler()"],desc:"RESTful URL 映射。将 HTTP 请求方法 (GET/POST) 与路径绑定至对应业务 Handler，支持参数提取与异常处理。",threadModel:"只读哈希路由表，线程安全并发查阅",keyConcepts:["映射表路由","动态 Handler 挂载","统一错误状态包装"]},{id:"mod_http_session",projectId:"proj_http_component",name:"SessionManager 用户会话与生命周期",category:"Security",layer:"L7 会话管理层",sourceFiles:["HttpServer/src/session/SessionManager.cpp","HttpServer/include/session/Session.h"],classes:["http::SessionManager","http::Session"],functions:["getSession()","createSession()","cleanExpiredSessions()"],desc:"基于 Cookie (session_id) 的客户端身份管理。内存维护会话生命周期，支持单用户多会话隔离树。",threadModel:"内部加锁互斥保护会话表，定时器安全巡检",keyConcepts:["Cookie 校验","单用户多会话 (sessionsIdsMap)","超时清理机制"]},{id:"mod_http_middleware",projectId:"proj_http_component",name:"MiddlewareChain 中间件链式处理",category:"Architecture",layer:"L7 中间件拦截层",sourceFiles:["HttpServer/src/middleware/MiddlewareChain.cpp","HttpServer/include/middleware/CorsMiddleware.h"],classes:["http::MiddlewareChain","http::CorsMiddleware","http::AuthMiddleware"],functions:["use()","handle()","execute()"],desc:"HTTP 请求处理拦截链。处理跨域支持 (CORS)、请求鉴权与执行耗时记录。",threadModel:"顺序流转于当前工作线程",keyConcepts:["链式拦截","CORS 预检处理 (OPTIONS)","鉴权拦截"]},{id:"mod_ai_model_manager",projectId:"proj_cppai",name:"ModelManager 运行时封装与模型生命周期",category:"AI",layer:"AI 服务端架构层",sourceFiles:["src/inference/ModelManager.h","src/inference/ModelManager.cpp"],classes:["ModelManager","OrtSessionWrapper"],functions:["loadModel()","createSession()","warmup()","getTensorShape()"],desc:"封装 ONNX Runtime / TensorRT C++ 原生推理会话。实现模型权重的预热、多卡实例加载、动态输入/输出张量形状自适应计算与线程安全推理上下文分配。",threadModel:"多推理工作线程共享 Session，独占独立 RunOptions/IoBinding",keyConcepts:["ONNX Runtime C++ API","TensorRT ExecutionContext","模型热加载与显存预热"]},{id:"mod_ai_dynamic_batcher",projectId:"proj_cppai",name:"DynamicBatcher 动态批处理引擎",category:"AI",layer:"AI 服务端架构层",sourceFiles:["src/batching/DynamicBatcher.h","src/batching/DynamicBatcher.cpp"],classes:["DynamicBatcher","BatchTaskQueue"],functions:["enqueueRequest()","dispatchBatch()","batchTimeoutLoop()"],desc:"高性能动态批处理调度引擎。将多个独立的并发推理请求按照最大等待延迟（如 5ms~10ms）或最大 BatchSize 聚合为一个连续的 Batch Tensor，最大化榨干 GPU 算力并显著降低单位吞吐延迟。",threadModel:"无锁并发请求队列入队 + 专用定时/定量触发调度线程",keyConcepts:["动态 Batch 聚合","延迟上界调度 (Timeout Bound)","请求与响应拆包映射"]},{id:"mod_ai_worker_pool",projectId:"proj_cppai",name:"InferenceWorkerPool 异步推理工作线程池",category:"AI",layer:"AI 服务端架构层",sourceFiles:["src/concurrency/InferenceWorkerPool.h","src/concurrency/InferenceWorkerPool.cpp"],classes:["InferenceWorkerPool","CudaStreamContext"],functions:["submit()","workerLoop()","syncStream()"],desc:"多工作线程推理执行池。配合 CUDA Stream 实现 GPU 计算与 CPU 数据预处理/后处理的异步流水线重叠，防止推理计算阻塞 HTTP 网络主循环。",threadModel:"N 个推理 Worker 线程绑核执行，独占专属 CUDA Stream",keyConcepts:["异步流 (CUDA Stream) 重叠","计算与 I/O 隔离","Future/Promise 结果回传"]},{id:"mod_ai_token_streamer",projectId:"proj_cppai",name:"TokenStreamer 流式 Token 输出组件",category:"AI",layer:"AI 服务端架构层",sourceFiles:["src/streaming/TokenStreamer.h","src/streaming/TokenStreamer.cpp"],classes:["TokenStreamer","SseEmitter"],functions:["emitToken()","sendChunk()","endStream()"],desc:"基于 Server-Sent Events (SSE) 协议的实时流式生成传输器。模型自回归解码每产生一个 Token 即格式化为 data: {...}\\n\\n 帧并调用底层的分块传输接口发送给客户端，保持端到端低首字延迟。",threadModel:"工作线程生成 Token，投递至所属 I/O 线程异步分块下发",keyConcepts:["Server-Sent Events (SSE)","HTTP 分块传输编码 (Chunked)","首字延迟 (TTFT) 优化"]},{id:"mod_ai_memory_pool",projectId:"proj_cppai",name:"MemoryPool KV-Cache 管理与张量内存复用池",category:"AI",layer:"AI 服务端架构层",sourceFiles:["src/memory/MemoryPool.h","src/memory/MemoryPool.cpp"],classes:["MemoryPool","KvCacheManager"],functions:["allocateBlock()","freeBlock()","compactMemory()"],desc:"大模型自回归解码阶段的 KV-Cache 显存块管理器与固定大小张量内存复用池。消除频繁 cudaMalloc/cudaFree 造成的显存碎片与高延迟，实现跨请求共享与分块分页调度。",threadModel:"无锁环形或位图标记内存块分配，极低临界区开销",keyConcepts:["PagedAttention 思想分页管理","显存复用池","内存碎片消除"]},{id:"mod_ai_strategy",projectId:"proj_cppai",name:"AIStrategy 多大模型策略与工厂",category:"AI",layer:"AI 服务端架构层",sourceFiles:["AIApps/ChatServer/src/AIUtil/AIStrategy.cpp","AIApps/ChatServer/src/AIUtil/AIFactory.cpp","AIApps/ChatServer/include/AIUtil/AIStrategy.h"],classes:["AIStrategy","AliyunStrategy","AliyunRAGStrategy","DoubaoStrategy","AIFactory"],functions:["buildRequest()","parseResponse()","createStrategy()","registerStrategy()"],desc:"使用策略模式与工厂模式，封装阿里百炼、火山豆包等多厂商模型的请求协议与参数格式差异。",threadModel:"无状态策略对象，多线程共享",keyConcepts:["策略模式 (Strategy)","注册式工厂 (Factory)","多模型适配"]},{id:"mod_ai_mcp_registry",projectId:"proj_cppai",name:"AIToolRegistry 轻量 MCP 工具协议",category:"AI",layer:"AI 服务端架构层",sourceFiles:["AIApps/ChatServer/src/AIUtil/AIToolRegistry.cpp","AIApps/ChatServer/src/AIUtil/AIConfig.cpp","AIApps/ChatServer/resource/config.json"],classes:["AIToolRegistry","AIConfig"],functions:["registerTool()","executeTool()","parseConfig()","handleTwoStageInference()"],desc:"两段式推理与工具函数注册管理。向大模型提供工具元数据，接收并执行本地函数（如查询、计算），将结果回传给模型。",threadModel:"工具注册表启动加载，执行期线程隔离调用",keyConcepts:["两段式推理 (Two-Stage Inference)","MCP 协议规范","动态函数派发"]},{id:"mod_ai_onnx_vision",projectId:"proj_cppai",name:"ImageRecognizer 本地 ONNX 图像推理",category:"AI",layer:"AI 服务端架构层",sourceFiles:["AIApps/ChatServer/src/AIUtil/ImageRecognizer.cpp","AIApps/ChatServer/src/AIUtil/base64.cpp"],classes:["ImageRecognizer","Base64Util"],functions:["initModel()","preprocess()","infer()","decodeBase64()"],desc:"OpenCV 预处理与 ONNX Runtime 本地推理。支持 Base64 解码、张量归一化与模型推理。",threadModel:"独立会话实例，单次推理串行执行",keyConcepts:["OpenCV 图像格式转换","ONNX Tensor 处理","本地模型推理"]},{id:"mod_ai_tts_speech",projectId:"proj_cppai",name:"AISpeechProcessor 智能语音 ASR/TTS",category:"AI",layer:"AI 服务端架构层",sourceFiles:["AIApps/ChatServer/src/AIUtil/AISpeechProcessor.cpp","AIApps/ChatServer/src/handlers/ChatSpeechHandler.cpp"],classes:["AISpeechProcessor","ChatSpeechHandler"],functions:["textToSpeech()","speechToText()","fetchToken()"],desc:"语音服务模块。负责调用百度语音 API，完成 Token 缓存、文本分片语音合成与语音识别。",threadModel:"异步 HTTP 客户端非阻塞请求",keyConcepts:["Token 缓存与刷新","音频数据分帧","语音合成与识别"]},{id:"mod_storage_mysql_pool",projectId:"proj_cppai",name:"DbConnectionPool MySQL 连接池",category:"Storage",layer:"AI 服务端架构层",sourceFiles:["HttpServer/src/db/MysqlUtil.cpp","HttpServer/include/db/MysqlUtil.h"],classes:["http::MysqlUtil","DbConnectionPool"],functions:["init()","getConnection()","releaseConnection()","executeUpdate()","executeQuery()"],desc:"基于 RAII 的 MySQL 连接池实现。复用 TCP 连接以减少频繁建连断连开销，支持连接借还、超时检查与重连。",threadModel:"互斥锁 + 条件变量管理可用连接双向链表",keyConcepts:["连接复用","RAII 资源自动归还","心跳保活机制"]},{id:"mod_mq_rabbitmq_manager",projectId:"proj_cppai",name:"MQManager RabbitMQ 异步任务管理",category:"Middleware",layer:"AI 服务端架构层",sourceFiles:["AIApps/ChatServer/src/AIUtil/MQManager.cpp","AIApps/ChatServer/include/AIUtil/MQManager.h"],classes:["MQManager","RabbitMQThreadPool"],functions:["publish()","startConsumer()","executeMysql()"],desc:"通过 RabbitMQ 实现异步数据持久化。HTTP 线程将聊天记录与事件投递至消息队列后即可继续处理后续网络请求，由后台消费者线程从队列拉取消息并写入 MySQL。",threadModel:"独立消费者线程池执行，网络线程避免数据库 I/O 阻塞",keyConcepts:["消息异步投递","生产者与消费者解耦","后台批量写库"]},{id:"mod_ai_chatserver",projectId:"proj_cppai",name:"ChatServer 业务主控与多会话调度",category:"AI",layer:"AI 服务端架构层",sourceFiles:["AIApps/ChatServer/src/ChatServer.cpp","AIApps/ChatServer/include/ChatServer.h"],classes:["ChatServer","ChatSendHandler","ChatSessionsHandler"],functions:["initialize()","initChatMessage()","readDataFromMySQL()","packageResp()"],desc:"CppAIService 业务处理核心。负责 HTTP 请求分发、管理单用户多会话结构 (chatInformation[userId][sessionId])、调用大模型策略、执行 MCP 工具及投递 RabbitMQ 异步任务。",threadModel:"多线程并发处理业务请求，按 session_id 隔离 AIHelper 实例",keyConcepts:["单用户多会话结构 (chatInformation)","业务分发与 Handler 路由","异步任务分离"]},{id:"mod_ai_rag",projectId:"proj_cppai",name:"RAG 检索增强生成与知识库模块",category:"AI",layer:"AI 服务端架构层",sourceFiles:["AIApps/ChatServer/src/AIUtil/AIStrategy.cpp","AIApps/ChatServer/include/AIUtil/AIStrategy.h"],classes:["AliyunRAGStrategy","AIStrategy"],functions:["buildRequest()","parseResponse()","retrieveKnowledge()"],desc:"RAG 检索增强生成模块。将文档切片并做向量召回，在模型推理时作为上下文补充，减少模型生成错误。",threadModel:"无状态检索策略，多线程共享",keyConcepts:["向量语义检索 (Embedding)","上下文提示词组装","知识库检索"]}],ae=()=>{const{isRunning:n,formattedTime:r,todayMins:i,toggle:u,reset:l}=he();return e.jsxs("div",{className:"space-y-4 select-none",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 px-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 rounded-xl flex items-center justify-center bg-amber-100/90 dark:bg-amber-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-600 dark:text-amber-400",children:e.jsx(de,{size:14,className:n?"animate-pulse":""})}),e.jsx("span",{className:"font-bold",children:"专注计时"})]}),e.jsxs("div",{className:"px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-600 dark:text-slate-400 font-normal",children:["今日 ",e.jsx("strong",{className:"text-amber-600 dark:text-amber-400 font-bold",children:i})," 分钟"]})]}),e.jsxs("div",{className:"p-5 rounded-2xl bg-gradient-to-b from-slate-100 via-[#eef2f7] to-slate-50 dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-900/90 shadow-[inset_4px_4px_8px_rgba(0,0,0,0.09),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] dark:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.4),inset_-2px_-2px_4px_rgba(255,255,255,0.06)] space-y-4 text-center",children:[e.jsx("div",{className:"font-mono text-4xl sm:text-4xl font-black tracking-wider text-slate-800 dark:text-slate-100 py-1 tabular-nums drop-shadow-xs",children:r}),e.jsxs("div",{className:"flex items-center gap-2.5 pt-1",children:[e.jsx("button",{onClick:u,type:"button",className:`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-2xl text-xs font-bold text-white transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 whitespace-nowrap shadow-[6px_6px_12px_rgba(0,0,0,0.1),inset_2px_2px_4px_rgba(255,255,255,0.5),inset_-2px_-2px_4px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 ${n?"bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600":"bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"}`,children:n?e.jsxs(e.Fragment,{children:[e.jsx(Ae,{size:14,className:"fill-current"}),e.jsx("span",{children:"暂停计时"})]}):e.jsxs(e.Fragment,{children:[e.jsx(Oe,{size:14,className:"fill-current ml-0.5"}),e.jsx("span",{children:"开始专注"})]})}),e.jsxs("button",{onClick:l,type:"button",className:"flex items-center justify-center gap-1 py-2.5 px-3.5 rounded-2xl text-xs font-semibold bg-gradient-to-r from-white via-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 text-slate-700 dark:text-slate-200 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_12px_rgba(0,0,0,0.09)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 shrink-0 whitespace-nowrap",title:"结算并归档时间至今日学时",children:[e.jsx(ue,{size:13}),e.jsx("span",{children:"结算归档"})]})]})]})]})},Ye=[{id:"task_algo",title:"算法练习",category:"算法",estimatedMinutes:180,priority:"S",completed:!1,focusPoint:"LeetCode Hot 100 / 代码随想录手写练习，15 分钟无思路查卡，手写 AC",linkTab:"algo"},{id:"task_ai_inference",title:"AI 推理服务架构",category:"项目",estimatedMinutes:180,priority:"S",completed:!1,focusPoint:"ONNX Runtime / TensorRT C++ 运行时封装、模型加载与输入张量自适应",linkTab:"practice"},{id:"task_dynamic_batching",title:"动态批处理引擎",category:"架构",estimatedMinutes:60,priority:"S",completed:!1,focusPoint:"Dynamic Batching 请求队列设计、超时调度机制与并发请求张量聚合",linkTab:"practice"},{id:"task_stream_eval",title:"流式输出与并发评测",category:"网络",estimatedMinutes:45,priority:"A",completed:!1,focusPoint:"SSE 长连接实时分块 Token 推送、首字延迟 (TTFT) 优化与并发压测",linkTab:"practice"}],ie=({onNavigateTab:n})=>{const[r,i]=T("routine_tasks",Ye);g.useEffect(()=>{let s=!1;const h=r.map(o=>o.id==="task_algo"&&o.estimatedMinutes!==180?(s=!0,{...o,estimatedMinutes:180}):(o.id==="task_ai_inference"||o.id==="task_project")&&o.estimatedMinutes!==180?(s=!0,{...o,estimatedMinutes:180}):o);s&&i(h)},[r,i]);const u=s=>{i(h=>h.map(o=>o.id===s?{...o,completed:!o.completed}:o))},l=s=>{if(s>=60){const h=s/60;if(Number.isInteger(h))return`${h}h (${s} 分钟)`;const o=Math.floor(s/60),y=s%60;return`${o}h ${y}m (${s} 分钟)`}return`${s} 分钟`},a=r.filter(s=>s.completed).length;return e.jsxs("div",{className:"space-y-4 select-none",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 px-1",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 rounded-xl flex items-center justify-center bg-sky-100/90 dark:bg-sky-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-sky-600 dark:text-sky-400",children:e.jsx(He,{size:14})}),e.jsx("span",{className:"font-bold",children:"今日清单"})]}),e.jsxs("div",{className:"px-2.5 py-1 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-600 dark:text-slate-400 font-normal",children:[a," / ",r.length]})]}),e.jsx("div",{className:"space-y-2.5",children:r.map(s=>e.jsxs("div",{className:`p-3 rounded-2xl transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-between gap-3 ${s.completed?"bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-emerald-50/80 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-emerald-950/30 shadow-[inset_2px_2px_5px_rgba(0,0,0,0.06),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]":"bg-gradient-to-r from-white via-[#f8fafc] to-[#edf1f7] dark:from-slate-800/80 dark:via-slate-800/70 dark:to-slate-800/60 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:-translate-y-0.5 hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)]"}`,children:[e.jsxs("div",{className:"flex items-center gap-2.5 min-w-0",children:[e.jsx("button",{onClick:()=>u(s.id),type:"button",className:`w-6 h-6 rounded-xl flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] active:scale-x-110 active:scale-y-85 cursor-pointer shrink-0 ${s.completed?"bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[2px_2px_5px_rgba(16,185,129,0.3),inset_1px_1px_2px_rgba(255,255,255,0.8)]":"bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-transparent hover:text-emerald-400/50"}`,title:s.completed?"标记为未完成":"标记为已完成",children:e.jsx(J,{size:13,strokeWidth:3,className:s.completed?"block":"opacity-0"})}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("div",{className:`text-xs font-bold truncate transition-colors duration-200 ${s.completed?"text-teal-900/50 dark:text-teal-200/40 line-through":"text-slate-800 dark:text-slate-200"}`,children:s.title}),e.jsx("div",{className:"text-[10px] text-slate-500 dark:text-slate-400 font-mono",children:l(s.estimatedMinutes)})]})]}),s.linkTab&&e.jsxs("button",{onClick:()=>n(s.linkTab),type:"button",className:"px-2.5 py-1 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 dark:from-sky-950/60 dark:to-blue-950/60 text-sky-700 dark:text-sky-300 shadow-[2px_2px_4px_rgba(0,0,0,0.05),inset_1.5px_1.5px_2px_rgba(255,255,255,0.8)] hover:shadow-[3px_3px_6px_rgba(0,0,0,0.08)] active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center gap-1 text-[11px] font-bold cursor-pointer shrink-0",children:[e.jsx("span",{children:"直达"}),e.jsx(Re,{size:11})]})]},s.id))})]})},Je=({onNavigateTab:n,onNavigateToDay:r,onSelectTopologyModule:i})=>{const[u]=T("knowledgeMastery",{}),[l]=T("completedAlgos",{}),[a]=T("muduo_day_mastery",{}),[s,h]=T("sidebar_collapsed_dashboard",!1),o=N.length,y=N.filter(t=>(u[t.id]||0)>=4).length,d=X.length,f=X.filter(t=>t.num!==null&&t.num!==void 0?!!l[t.num]||!!l[String(t.num)]:t.id?!!l[t.id]:!1).length,c=g.useMemo(()=>Object.values(a).filter(t=>t>=4).length,[a]),x=[{id:"mod_ai_model_manager",name:"ModelManager",layer:"运行时底座",desc:"ONNX/TensorRT C++ 原生会话封装"},{id:"mod_ai_worker_pool",name:"WorkerPool",layer:"并发计算流池",desc:"CUDA Stream 异步流水线重叠"},{id:"mod_ai_dynamic_batcher",name:"DynamicBatcher",layer:"批处理核心",desc:"自适应动态 Batch 聚合调度"},{id:"mod_ai_token_streamer",name:"TokenStreamer",layer:"流式输出",desc:"SSE 分块实时 Token 生成推送"},{id:"mod_ai_memory_pool",name:"MemoryPool",layer:"显存复用",desc:"KV-Cache 分页管理与碎片消除"}],m=g.useMemo(()=>[{week:1,label:"第 1 周",days:O.slice(0,7)},{week:2,label:"第 2 周",days:O.slice(7,14)},{week:3,label:"第 3 周",days:O.slice(14,21)},{week:4,label:"第 4 周",days:O.slice(21,28)}],[]);return e.jsxs("div",{className:"flex items-start w-full min-h-[calc(100vh-4rem)] bg-[#eef2f7] dark:bg-[#11141a] transition-colors duration-300 p-3 sm:p-4 gap-4",children:[s?e.jsxs("aside",{className:"w-16 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/90 dark:bg-[#151922]/90 shadow-[6px_6px_14px_rgba(0,0,0,0.06),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[6px_6px_14px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] py-4 flex flex-col items-center space-y-4 sticky top-18 h-[calc(100vh-5.5rem)] hidden md:flex select-none transition-all duration-300",children:[e.jsx("button",{onClick:()=>h(!1),className:"p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-sky-600 shadow-[3px_3px_6px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",title:"展开仪表盘导航",children:e.jsx(Pe,{size:18})}),e.jsx("div",{className:"w-8 h-1 rounded-full bg-slate-200/80 dark:bg-slate-800/80 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]"}),e.jsxs("div",{className:"flex flex-col items-center space-y-2.5 text-slate-600 dark:text-slate-400",children:[e.jsx("button",{onClick:()=>n("daily"),className:"p-2.5 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-950/60 dark:to-teal-900/60 text-teal-700 dark:text-teal-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",title:`任务 (${c}/28)`,children:e.jsx(A,{size:18})}),e.jsx("button",{onClick:()=>n("reader"),className:"p-2.5 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/60 dark:to-orange-900/60 text-amber-700 dark:text-amber-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",title:`项目 (${y}/${o})`,children:e.jsx(P,{size:18})}),e.jsx("button",{onClick:()=>n("algo"),className:"p-2.5 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-950/60 dark:to-pink-900/60 text-purple-700 dark:text-purple-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",title:`算法 (${f}/${d})`,children:e.jsx(E,{size:18})}),e.jsx("button",{onClick:()=>n("learning"),className:"p-2.5 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-950/60 dark:to-blue-900/60 text-indigo-700 dark:text-indigo-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",title:"学习系统",children:e.jsx(Q,{size:18})}),e.jsx("button",{onClick:()=>n("source"),className:"p-2.5 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-950/60 dark:to-yellow-900/60 text-amber-700 dark:text-amber-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",title:"源码路线",children:e.jsx(H,{size:18})}),e.jsx("button",{onClick:()=>n("practice"),className:"p-2.5 rounded-2xl bg-gradient-to-br from-cyan-100 to-teal-100 dark:from-cyan-950/60 dark:to-teal-900/60 text-cyan-700 dark:text-cyan-300 shadow-[4px_4px_8px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",title:"其他 / 归档",children:e.jsx(W,{size:18})})]})]}):e.jsxs("aside",{className:"w-80 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 space-y-5 overflow-y-auto sticky top-18 h-[calc(100vh-5.5rem)] hidden md:block transition-all duration-300 select-none",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("h2",{className:"text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2",children:[e.jsx("div",{className:"w-6 h-6 rounded-xl flex items-center justify-center bg-sky-100/90 dark:bg-sky-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-sky-600 dark:text-sky-400",children:e.jsx(te,{size:14})}),e.jsx("span",{children:"仪表盘导航"})]}),e.jsx("button",{onClick:()=>h(!0),className:"p-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 shadow-[2px_2px_4px_rgba(0,0,0,0.06),inset_1.5px_1.5px_3px_rgba(255,255,255,0.8)] active:scale-x-105 active:scale-y-90 hover:-translate-y-0.5 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer",title:"收起仪表盘导航",children:e.jsx(Ee,{size:16})})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1",children:"核心入口"}),e.jsxs("button",{onClick:()=>n("daily"),type:"button",className:"w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left group",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:"w-7 h-7 rounded-xl flex items-center justify-center bg-teal-100/80 dark:bg-teal-950/50 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-teal-600 dark:text-teal-400",children:e.jsx(A,{size:14})}),e.jsx("span",{className:"text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors",children:"任务"})]}),e.jsxs("span",{className:"px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium",children:[c,"/28"]})]}),e.jsxs("button",{onClick:()=>n("reader"),type:"button",className:"w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left group",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:"w-7 h-7 rounded-xl flex items-center justify-center bg-amber-100/80 dark:bg-amber-950/50 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-600 dark:text-amber-400",children:e.jsx(P,{size:14})}),e.jsx("span",{className:"text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors",children:"项目"})]}),e.jsxs("span",{className:"px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium",children:[y,"/",o]})]}),e.jsxs("button",{onClick:()=>n("algo"),type:"button",className:"w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left group",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:"w-7 h-7 rounded-xl flex items-center justify-center bg-purple-100/80 dark:bg-purple-950/50 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-purple-600 dark:text-purple-400",children:e.jsx(E,{size:14})}),e.jsx("span",{className:"text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors",children:"算法"})]}),e.jsxs("span",{className:"px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium",children:[f,"/",d]})]}),e.jsxs("button",{onClick:()=>n("learning"),type:"button",className:"w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left group",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:"w-7 h-7 rounded-xl flex items-center justify-center bg-indigo-100/80 dark:bg-indigo-950/50 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-indigo-600 dark:text-indigo-400",children:e.jsx(Q,{size:14})}),e.jsx("span",{className:"text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors",children:"学习系统"})]}),e.jsx("span",{className:"px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium",children:"6 模块"})]}),e.jsxs("button",{onClick:()=>n("source"),type:"button",className:"w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left group",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:"w-7 h-7 rounded-xl flex items-center justify-center bg-amber-100/80 dark:bg-amber-950/50 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-600 dark:text-amber-400",children:e.jsx(H,{size:14})}),e.jsx("span",{className:"text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors",children:"源码路线"})]}),e.jsx("span",{className:"px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium",children:"28 节点"})]}),e.jsxs("button",{onClick:()=>n("practice"),type:"button",className:"w-full flex items-center justify-between px-3 py-2.5 rounded-2xl bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-800/90 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] hover:shadow-[6px_6px_14px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer text-left group",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:"w-7 h-7 rounded-xl flex items-center justify-center bg-cyan-100/80 dark:bg-cyan-950/50 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-cyan-600 dark:text-cyan-400",children:e.jsx(W,{size:14})}),e.jsx("span",{className:"text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors",children:"其他"})]}),e.jsx("span",{className:"px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[11px] font-mono text-slate-500 dark:text-slate-400 font-medium",children:"4 专项"})]})]}),e.jsxs("div",{className:"space-y-2.5 pt-3 border-t border-slate-200/60 dark:border-slate-800/60",children:[e.jsx("div",{className:"text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1",children:"阶段进度"}),m.map(t=>{const p=t.days.filter(_=>(a[_.day]||0)>=4).length,b=Math.round(p/7*100);return e.jsxs("div",{className:"p-3 rounded-2xl bg-white/70 dark:bg-slate-800/50 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200",children:[e.jsx("span",{children:t.label}),e.jsxs("span",{className:"px-2 py-0.5 rounded-full bg-slate-100/90 dark:bg-slate-900/60 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.7)] text-[10px] font-mono text-slate-500 shrink-0",children:[p,"/7"]})]}),e.jsx("div",{className:"w-full h-2 rounded-full bg-slate-200/70 dark:bg-slate-900/70 shadow-[inset_2px_2px_4px_rgba(0,0,0,0.1),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] overflow-hidden p-0.5",children:e.jsx("div",{className:"h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 shadow-xs transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",style:{width:`${b}%`}})})]},t.week)})]}),e.jsxs("div",{className:"p-3 rounded-2xl bg-gradient-to-br from-amber-100/50 via-amber-50 to-orange-100/40 dark:from-amber-950/30 dark:to-orange-950/20 shadow-[4px_4px_10px_rgba(0,0,0,0.05),inset_2px_2px_4px_rgba(255,255,255,0.7),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] text-xs flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300",children:[e.jsx("div",{className:"w-6 h-6 rounded-xl flex items-center justify-center bg-amber-200/70 dark:bg-amber-900/50 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-amber-700 dark:text-amber-300",children:e.jsx(qe,{size:13})}),e.jsx("span",{children:"Muduo 网络库 (已归档)"})]}),e.jsx("span",{className:"px-2 py-0.5 rounded-full bg-amber-200/50 dark:bg-amber-900/40 text-[10px] text-amber-800 dark:text-amber-300 font-bold font-mono",children:"8 阶段"})]})]}),e.jsxs("main",{className:"flex-1 min-w-0 space-y-8 overflow-y-auto w-full",children:[e.jsx("div",{className:"flex items-center justify-between pb-2",children:e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("div",{className:"w-10 h-10 rounded-2xl flex items-center justify-center bg-white/80 dark:bg-slate-800/80 shadow-[4px_4px_10px_rgba(0,0,0,0.06),inset_2px_2px_4px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(0,0,0,0.04)] text-sky-600 dark:text-sky-400",children:e.jsx(te,{size:20})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-black text-slate-900 dark:text-white tracking-tight",children:"仪表盘"}),e.jsx("p",{className:"text-xs text-slate-500 dark:text-slate-400",children:"高性能 C++ 网络与 AI 推理服务学习控制台"})]})]})}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6",children:[e.jsxs("div",{onClick:()=>n("daily"),role:"button",tabIndex:0,onKeyDown:t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),n("daily"))},className:"bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 dark:from-emerald-950/40 dark:via-teal-900/30 dark:to-green-900/40 rounded-3xl p-6 flex flex-col justify-between border-0 border-transparent shadow-[8px_8px_16px_rgba(0,0,0,0.08),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.06)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[12px_12px_24px_rgba(0,0,0,0.12),inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.08)] active:scale-x-105 active:scale-y-90 active:shadow-[2px_2px_4px_rgba(0,0,0,0.05),inset_8px_8px_16px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer select-none group",title:"点击进入任务体系",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-bold text-teal-800 dark:text-teal-200 uppercase tracking-wider",children:"任务体系"}),e.jsx("div",{className:"w-9 h-9 rounded-2xl flex items-center justify-center bg-white/70 dark:bg-emerald-900/40 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] text-teal-700 dark:text-teal-300",children:e.jsx(A,{size:17})})]}),e.jsx("div",{className:"my-4",children:e.jsxs("div",{className:"text-3xl sm:text-4xl font-black font-mono tracking-tight text-teal-900 dark:text-teal-100 tabular-nums",children:[c,e.jsx("span",{className:"text-sm font-semibold font-mono text-teal-700/80 dark:text-teal-300/80 ml-1.5",children:"/ 28 天"})]})}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs",children:[e.jsx("span",{className:"text-teal-700 dark:text-teal-300 font-medium",children:"吃透进度"}),e.jsxs("span",{className:"font-mono font-bold text-teal-900 dark:text-teal-100",children:[Math.round(c/28*100),"%"]})]}),e.jsx("div",{className:"w-full h-2.5 rounded-full bg-emerald-200/50 dark:bg-emerald-950/60 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] overflow-hidden p-0.5",title:`任务吃透率: ${Math.round(c/28*100)}%`,children:e.jsx("div",{className:"h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-xs transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",style:{width:`${Math.round(c/28*100)}%`}})})]})]}),e.jsxs("div",{onClick:()=>n("reader"),role:"button",tabIndex:0,onKeyDown:t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),n("reader"))},className:"bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-100 dark:from-amber-950/40 dark:via-orange-900/30 dark:to-yellow-900/40 rounded-3xl p-6 flex flex-col justify-between border-0 border-transparent shadow-[8px_8px_16px_rgba(0,0,0,0.08),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.06)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[12px_12px_24px_rgba(0,0,0,0.12),inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.08)] active:scale-x-105 active:scale-y-90 active:shadow-[2px_2px_4px_rgba(0,0,0,0.05),inset_8px_8px_16px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer select-none group",title:"点击进入项目专栏",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wider",children:"项目剖析"}),e.jsx("div",{className:"w-9 h-9 rounded-2xl flex items-center justify-center bg-white/70 dark:bg-amber-900/40 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] text-amber-700 dark:text-amber-300",children:e.jsx(P,{size:17})})]}),e.jsx("div",{className:"my-4",children:e.jsxs("div",{className:"text-3xl sm:text-4xl font-black font-mono tracking-tight text-amber-900 dark:text-amber-100 tabular-nums",children:[y,e.jsxs("span",{className:"text-sm font-semibold font-mono text-amber-700/80 dark:text-amber-300/80 ml-1.5",children:["/ ",o," 篇"]})]})}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs",children:[e.jsx("span",{className:"text-amber-700 dark:text-amber-300 font-medium",children:"专栏精读"}),e.jsxs("span",{className:"font-mono font-bold text-amber-900 dark:text-amber-100",children:[Math.round(y/o*100),"%"]})]}),e.jsx("div",{className:"w-full h-2.5 rounded-full bg-amber-200/50 dark:bg-amber-950/60 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] overflow-hidden p-0.5",title:`项目专栏精读进度: ${Math.round(y/o*100)}%`,children:e.jsx("div",{className:"h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-xs transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",style:{width:`${Math.round(y/o*100)}%`}})})]})]}),e.jsxs("div",{onClick:()=>n("algo"),role:"button",tabIndex:0,onKeyDown:t=>{(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),n("algo"))},className:"bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 dark:from-purple-950/40 dark:via-pink-900/30 dark:to-indigo-900/40 rounded-3xl p-6 flex flex-col justify-between border-0 border-transparent shadow-[8px_8px_16px_rgba(0,0,0,0.08),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.06)] dark:shadow-[8px_8px_16px_rgba(0,0,0,0.3),inset_4px_4px_8px_rgba(255,255,255,0.1),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] hover:-translate-y-1 hover:shadow-[12px_12px_24px_rgba(0,0,0,0.12),inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.08)] active:scale-x-105 active:scale-y-90 active:shadow-[2px_2px_4px_rgba(0,0,0,0.05),inset_8px_8px_16px_rgba(0,0,0,0.15),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer select-none group",title:"点击进入算法题库",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-bold text-purple-800 dark:text-purple-200 uppercase tracking-wider",children:"算法题库"}),e.jsx("div",{className:"w-9 h-9 rounded-2xl flex items-center justify-center bg-white/70 dark:bg-purple-900/40 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.9)] text-purple-700 dark:text-purple-300",children:e.jsx(E,{size:17})})]}),e.jsx("div",{className:"my-4",children:e.jsxs("div",{className:"text-3xl sm:text-4xl font-black font-mono tracking-tight text-purple-900 dark:text-purple-100 tabular-nums",children:[f,e.jsxs("span",{className:"text-sm font-semibold font-mono text-purple-700/80 dark:text-purple-300/80 ml-1.5",children:["/ ",d," 题"]})]})}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between text-xs",children:[e.jsx("span",{className:"text-purple-700 dark:text-purple-300 font-medium",children:"Hot 100 & 随想录"}),e.jsxs("span",{className:"font-mono font-bold text-purple-900 dark:text-purple-100",children:[Math.round(f/d*100),"%"]})]}),e.jsx("div",{className:"w-full h-2.5 rounded-full bg-purple-200/50 dark:bg-purple-950/60 shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] overflow-hidden p-0.5",title:`算法题库完成率: ${Math.round(f/d*100)}%`,children:e.jsx("div",{className:"h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-xs transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",style:{width:`${Math.round(f/d*100)}%`}})})]})]})]}),e.jsxs("section",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between pb-1",children:[e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:"w-8 h-8 rounded-xl flex items-center justify-center bg-teal-100/90 dark:bg-teal-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-teal-600 dark:text-teal-400",children:e.jsx(A,{size:16})}),e.jsx("h2",{className:"text-base font-bold text-slate-900 dark:text-white",children:"任务日历"})]}),e.jsxs("div",{className:"flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400",children:[e.jsxs("span",{className:"flex items-center gap-1.5 font-medium",children:[e.jsx("span",{className:"w-3 h-3 rounded-full bg-emerald-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.1)]"}),"已吃透"]}),e.jsxs("span",{className:"flex items-center gap-1.5 font-medium",children:[e.jsx("span",{className:"w-3 h-3 rounded-full bg-sky-400 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.1)]"}),"学习中"]}),e.jsxs("span",{className:"flex items-center gap-1.5 font-medium",children:[e.jsx("span",{className:"w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.8),inset_-1px_-1px_2px_rgba(0,0,0,0.1)]"}),"未开始"]})]})]}),e.jsx("div",{className:"space-y-4",children:m.map(t=>e.jsxs("div",{className:"space-y-2",children:[e.jsx("div",{className:"text-xs font-bold text-slate-500 dark:text-slate-400 px-1",children:t.label}),e.jsx("div",{className:"grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3",children:t.days.map(p=>{const b=a[p.day]||0,_=b>=4,C=b>=1&&b<4,R=Qe[p.day]||p.title;return e.jsxs("button",{onClick:()=>r(p.day),type:"button",className:`p-3 rounded-2xl text-left transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] cursor-pointer flex flex-col justify-between min-h-[5.25rem] active:scale-x-105 active:scale-y-90 hover:-translate-y-1 select-none group ${_?"bg-gradient-to-br from-emerald-100 via-teal-50 to-green-100 dark:from-emerald-950/60 dark:via-teal-900/50 dark:to-green-900/60 text-teal-950 dark:text-teal-100 shadow-[6px_6px_14px_rgba(16,185,129,0.12),inset_3px_3px_6px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.06)] hover:shadow-[8px_8px_18px_rgba(16,185,129,0.2),inset_3px_3px_6px_rgba(255,255,255,0.9)] active:shadow-[2px_2px_4px_rgba(0,0,0,0.08),inset_6px_6px_12px_rgba(0,0,0,0.15)]":C?"bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 dark:from-sky-950/60 dark:via-blue-900/50 dark:to-cyan-900/60 text-sky-950 dark:text-sky-100 shadow-[6px_6px_14px_rgba(14,165,233,0.12),inset_3px_3px_6px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.06)] hover:shadow-[8px_8px_18px_rgba(14,165,233,0.2),inset_3px_3px_6px_rgba(255,255,255,0.9)] active:shadow-[2px_2px_4px_rgba(0,0,0,0.08),inset_6px_6px_12px_rgba(0,0,0,0.15)]":"bg-gradient-to-br from-white via-[#f8fafc] to-[#edf1f7] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-900/90 text-slate-800 dark:text-slate-200 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.85),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] hover:shadow-[8px_8px_18px_rgba(0,0,0,0.08),inset_3px_3px_6px_rgba(255,255,255,0.95)] active:shadow-[2px_2px_4px_rgba(0,0,0,0.08),inset_6px_6px_12px_rgba(0,0,0,0.1)]"}`,title:`Day ${p.day}: ${p.title} (点击直达攻坚)`,children:[e.jsxs("div",{className:"flex items-center justify-between w-full",children:[e.jsxs("span",{className:`px-2 py-0.5 rounded-xl text-[10px] font-mono font-bold ${_?"bg-white/80 dark:bg-emerald-900/60 text-teal-800 dark:text-teal-200 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]":C?"bg-white/80 dark:bg-sky-900/60 text-sky-800 dark:text-sky-200 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.8)]":"bg-slate-100/90 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.06),inset_-1px_-1px_2px_rgba(255,255,255,0.7)]"}`,children:["D",p.day<10?`0${p.day}`:p.day]}),_?e.jsxs("span",{className:"text-[10px] font-bold text-teal-700 dark:text-teal-300 flex items-center gap-0.5",children:[e.jsx(J,{size:11,strokeWidth:3}),e.jsx("span",{children:"已吃透"})]}):C?e.jsx("span",{className:"text-[10px] font-bold text-sky-700 dark:text-sky-300",children:"学习中"}):e.jsx(re,{size:12,className:"text-slate-300 dark:text-slate-600 group-hover:text-sky-500 transition-colors"})]}),e.jsx("div",{className:`text-xs font-bold truncate mt-2 ${_?"text-teal-950 dark:text-teal-100":C?"text-sky-950 dark:text-sky-100":"text-slate-700 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400"}`,children:R})]},p.day)})})]},t.week))})]}),e.jsxs("section",{className:"space-y-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/60",children:[e.jsx("div",{className:"flex items-center justify-between pb-1",children:e.jsxs("div",{className:"flex items-center gap-2.5",children:[e.jsx("div",{className:"w-8 h-8 rounded-xl flex items-center justify-center bg-indigo-100/90 dark:bg-indigo-950/60 shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.08),inset_-1px_-1px_2px_rgba(255,255,255,0.8)] text-indigo-600 dark:text-indigo-400",children:e.jsx(H,{size:16})}),e.jsx("h2",{className:"text-base font-bold text-slate-900 dark:text-white",children:"CppAIService 核心架构"})]})}),e.jsx("div",{className:"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 font-mono text-xs",children:x.map(t=>{const p=Xe.find(b=>{var _;return b.id===t.id||((_=b.classes)==null?void 0:_.includes(t.name))||b.name.toLowerCase().startsWith(t.name.toLowerCase())})||{id:t.id,projectId:"proj_cppai",name:t.name,layer:t.layer,responsibility:t.desc,desc:t.desc,classes:[t.name],functions:["init()","process()"],keyConcepts:["高并发","异步计算"],threadModel:"多工作线程独占/共享"};return e.jsxs("button",{onClick:()=>i(p),type:"button",className:"p-3.5 rounded-2xl bg-gradient-to-br from-white via-[#f8fafc] to-[#edf1f7] dark:from-slate-800/90 dark:via-slate-800/70 dark:to-slate-900/90 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.85),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] hover:shadow-[8px_8px_18px_rgba(0,0,0,0.08)] hover:-translate-y-1 active:scale-x-105 active:scale-y-90 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] text-left cursor-pointer group select-none",children:[e.jsxs("div",{className:"font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 flex items-center justify-between",children:[e.jsx("span",{className:"truncate",children:t.name}),e.jsx(re,{size:12,className:"opacity-0 group-hover:opacity-100 transition shrink-0 text-sky-500"})]}),e.jsx("div",{className:"text-[10px] text-sky-600 dark:text-sky-400 font-bold mt-1",children:t.layer}),e.jsx("div",{className:"text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5 font-sans",children:t.desc})]},t.id)})})]}),e.jsxs("div",{className:"xl:hidden grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60",children:[e.jsx("div",{id:"dashboard-focus-timer-mobile",className:"rounded-3xl p-5 bg-[#f8fafc]/90 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.25),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]",children:e.jsx(ae,{})}),e.jsx("div",{className:"rounded-3xl p-5 bg-[#f8fafc]/90 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.8),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.25),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]",children:e.jsx(ie,{onNavigateTab:n})})]})]}),e.jsxs("aside",{className:"w-80 shrink-0 self-start rounded-3xl bg-[#f4f7fb]/95 dark:bg-[#151922]/95 shadow-[8px_8px_18px_rgba(0,0,0,0.06),inset_4px_4px_8px_rgba(255,255,255,0.7),inset_-2px_-2px_4px_rgba(0,0,0,0.04)] dark:shadow-[8px_8px_18px_rgba(0,0,0,0.3),inset_2px_2px_4px_rgba(255,255,255,0.08),inset_-2px_-2px_4px_rgba(0,0,0,0.3)] p-4 space-y-5 overflow-y-auto sticky top-18 h-[calc(100vh-5.5rem)] hidden xl:block select-none transition-all duration-300",children:[e.jsx("div",{id:"dashboard-focus-timer",className:"rounded-3xl p-4 bg-white/70 dark:bg-slate-800/50 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.04)] transition-all duration-300",children:e.jsx(ae,{})}),e.jsx("div",{className:"rounded-3xl p-4 bg-white/70 dark:bg-slate-800/50 shadow-[6px_6px_14px_rgba(0,0,0,0.05),inset_3px_3px_6px_rgba(255,255,255,0.7),inset_-1.5px_-1.5px_3px_rgba(0,0,0,0.04)] transition-all duration-300",children:e.jsx(ie,{onNavigateTab:n})})]})]})},Ze=g.lazy(()=>w(()=>import("./DailyCurriculumView-DwYWn8T4.js"),__vite__mapDeps([0,1,2,3]),import.meta.url).then(n=>({default:n.DailyCurriculumView}))),$e=g.lazy(()=>w(()=>import("./KnowledgeReader-Llgr50JZ.js"),__vite__mapDeps([4,1,2,3]),import.meta.url).then(n=>({default:n.KnowledgeReader}))),en=g.lazy(()=>w(()=>import("./AlgoCatalog-BIUu7oTN.js"),__vite__mapDeps([5,1,2,3]),import.meta.url).then(n=>({default:n.AlgoCatalog}))),nn=g.lazy(()=>w(()=>import("./LearningSystemView-aof-BRu5.js"),__vite__mapDeps([6,1,2,3]),import.meta.url).then(n=>({default:n.LearningSystemView}))),tn=g.lazy(()=>w(()=>import("./SourceRoadmapView-i2kd1DQU.js"),__vite__mapDeps([7,1,2,3]),import.meta.url).then(n=>({default:n.SourceRoadmapView}))),rn=g.lazy(()=>w(()=>import("./PracticeCenterView-DXVkzDta.js"),__vite__mapDeps([8,1,2,3]),import.meta.url).then(n=>({default:n.PracticeCenterView}))),sn=()=>e.jsx("div",{className:"flex-1 w-full min-h-[calc(100vh-4rem)] flex items-center justify-center p-8",children:e.jsxs("div",{className:"flex flex-col items-center gap-3 text-slate-500 dark:text-slate-400 animate-pulse",children:[e.jsx("div",{className:"w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"}),e.jsx("span",{className:"text-xs font-semibold tracking-wide",children:"模块加载中 · 请稍候..."})]})}),on=()=>{const[n,r]=T("activeTab","dashboard"),[i,u]=T("isDarkMode",!1),[l,a]=g.useState(!1),[s,h]=g.useState(null),[o,y]=g.useState(null),[d,f]=g.useState(1),[c,x]=g.useState("mapping");g.useEffect(()=>{const p={mapping:"mapping",career:"career",pitfalls:"pitfalls",quiz:"quiz"};n in p&&(x(p[n]),r("practice"))},[n,r]),g.useEffect(()=>{i?document.documentElement.classList.add("dark"):document.documentElement.classList.remove("dark")},[i]);const m=p=>{y(p),r("daily"),setTimeout(()=>{const b=document.getElementById(`day-card-${p}`);b&&b.scrollIntoView({behavior:"smooth",block:"center"})},100)},t=p=>{f(p),x("quiz"),r("practice"),window.scrollTo({top:0,behavior:"smooth"})};return e.jsxs("div",{className:"min-h-screen bg-[#eef2f7] dark:bg-[#11141a] text-slate-900 dark:text-slate-100 flex flex-col font-sans antialiased w-full transition-colors duration-300",children:[e.jsx(Ge,{}),e.jsx(Fe,{activeTab:n,onSelectTab:r,isDark:i,onToggleTheme:()=>u(p=>!p),onOpenEnvGuide:()=>a(!0)}),e.jsx("main",{className:"flex-1 w-full min-w-0",children:e.jsxs(g.Suspense,{fallback:e.jsx(sn,{}),children:[n==="dashboard"&&e.jsx(Je,{onNavigateTab:r,onNavigateToDay:m,onSelectTopologyModule:h}),n==="daily"&&e.jsx(Ze,{onJumpToQuiz:t,selectedDayHighlight:o,onClearHighlight:()=>y(null)}),n==="reader"&&e.jsx($e,{}),n==="algo"&&e.jsx(en,{}),n==="learning"&&e.jsx(nn,{}),n==="source"&&e.jsx(tn,{}),n==="practice"&&e.jsx(rn,{activeSubTab:c,onSelectSubTab:x,quizDay:d})]})}),e.jsx(Ke,{isOpen:l,onClose:()=>a(!1)}),e.jsx(Ve,{module:s,isOpen:!!s,onClose:()=>h(null)}),e.jsx(Be,{}),e.jsx(We,{})]})},le=document.getElementById("root");le&&(Me.createRoot(le).render(e.jsx(je.StrictMode,{children:e.jsx(on,{})})),window.__MUDUO_APP_MOUNTED__=!0);export{X as A,oe as C,O as D,Qe as S,N as Y,v as s,T as u};
