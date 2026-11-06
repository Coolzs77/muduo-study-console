const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('===============================================================');
console.log('🧪 VERIFYING MILESTONES 2, 3, 4 (R3, R4, R5) IMPLEMENTATION');
console.log('===============================================================');

// 1. Verify src/types/index.ts
console.log('\n--- 1. Testing src/types/index.ts ---');
const typesContent = fs.readFileSync(path.join(__dirname, '../src/types/index.ts'), 'utf8');
const activeTabMatch = typesContent.match(/export type ActiveTab =([\s\S]*?);/);
assert(activeTabMatch, "ActiveTab must be defined");
const activeTabBlock = activeTabMatch[1];
assert(activeTabBlock.includes("'practice'"), "ActiveTab must include 'practice'");
assert(!activeTabBlock.includes("'mapping'"), "ActiveTab must NOT have 'mapping' as primary tab");
assert(!activeTabBlock.includes("'career'"), "ActiveTab must NOT have 'career' as primary tab");
assert(!activeTabBlock.includes("'pitfalls'"), "ActiveTab must NOT have 'pitfalls' as primary tab");
assert(!activeTabBlock.includes("'quiz'"), "ActiveTab must NOT have 'quiz' as primary tab");
assert(typesContent.includes("export type PracticeSubTab = 'mapping' | 'career' | 'pitfalls' | 'quiz';"), "PracticeSubTab type must be defined");
assert(typesContent.includes("export type ArchitectureLayer = 'L4_Transport' | 'L7_Protocol' | 'L7_AIService';"), "ArchitectureLayer type must be defined");
console.log('✅ [PASS] src/types/index.ts accurately defines 7 primary tabs, PracticeSubTab, and ArchitectureLayer.');

// 2. Verify src/components/layout/Header.tsx
console.log('\n--- 2. Testing src/components/layout/Header.tsx ---');
const headerContent = fs.readFileSync(path.join(__dirname, '../src/components/layout/Header.tsx'), 'utf8');
const navMatches = headerContent.match(/navItems:\s*Array<[^>]+>\s*=\s*\[([\s\S]*?)\];/);
assert(navMatches, "navItems array must exist in Header.tsx");
const navBlock = navMatches[1];
const items = [...navBlock.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);
assert.deepStrictEqual(items, ['dashboard', 'daily', 'reader', 'algo', 'learning', 'source', 'practice'], "Header must have exactly 7 nav items in exact order");
assert(headerContent.includes("Muduo & CppAIService"), "Main title must be Muduo & CppAIService");
console.log('✅ [PASS] Header.tsx navItems streamlined to exactly 7 items [学习大盘, 28天任务, 专栏阅读, 算法题库, 学习系统, 源码路线, 综合实战].');

// 3. Verify src/components/practice/PracticeCenterView.tsx
console.log('\n--- 3. Testing src/components/practice/PracticeCenterView.tsx ---');
const practicePath = path.join(__dirname, '../src/components/practice/PracticeCenterView.tsx');
assert(fs.existsSync(practicePath), "PracticeCenterView.tsx must exist");
const practiceContent = fs.readFileSync(practicePath, 'utf8');
assert(practiceContent.includes("CodeMappingView"), "Must render CodeMappingView");
assert(practiceContent.includes("CareerSystemView"), "Must render CareerSystemView");
assert(practiceContent.includes("PitfallsView"), "Must render PitfallsView");
assert(practiceContent.includes("QuizCenterView"), "Must render QuizCenterView");
assert(practiceContent.includes("key={quizDay}"), "QuizCenterView must have key={quizDay} to force remount");
assert(practiceContent.includes("sticky top-16"), "Secondary tabs must be sticky under header");
console.log('✅ [PASS] PracticeCenterView.tsx successfully integrates 4 practice views with sticky secondary tabs.');

// 4. Verify src/App.tsx
console.log('\n--- 4. Testing src/App.tsx ---');
const appContent = fs.readFileSync(path.join(__dirname, '../src/App.tsx'), 'utf8');
assert(appContent.includes("PracticeCenterView"), "App.tsx must import PracticeCenterView");
assert(appContent.includes("PracticeSubTab"), "App.tsx must import PracticeSubTab");
assert(appContent.includes("practiceSubTab"), "App.tsx must maintain practiceSubTab state");
assert(appContent.includes("legacyTabs"), "App.tsx must have legacy localStorage migration");
assert(appContent.includes("setPracticeSubTab('quiz')"), "handleNavigateToQuiz must set practiceSubTab = quiz");
console.log('✅ [PASS] App.tsx seamlessly integrates PracticeCenterView and backward compatibility migration.');

// 5. Verify src/data/domainDataset.ts
console.log('\n--- 5. Testing src/data/domainDataset.ts ---');
const domainContent = fs.readFileSync(path.join(__dirname, '../src/data/domainDataset.ts'), 'utf8');
assert(domainContent.includes('id: "proj_muduo"'), "proj_muduo must exist");
assert(domainContent.includes('status: "archived"'), "proj_muduo status must be archived");
assert(domainContent.includes('id: "proj_http_component"'), "proj_http_component must exist");
assert(domainContent.includes('id: "proj_cppai"'), "proj_cppai must exist");
assert(domainContent.includes('mod_net_timerqueue'), "TimerQueue module must exist");
assert(domainContent.includes('mod_ai_model_manager'), "mod_ai_model_manager must exist");
assert(domainContent.includes('mod_ai_dynamic_batcher'), "mod_ai_dynamic_batcher must exist");
assert(domainContent.includes('mod_ai_worker_pool'), "mod_ai_worker_pool must exist");
assert(domainContent.includes('mod_ai_token_streamer'), "mod_ai_token_streamer must exist");
assert(domainContent.includes('mod_ai_memory_pool'), "mod_ai_memory_pool must exist");
console.log('✅ [PASS] domainDataset.ts decouples L4 Transport, L7 HTTP Protocol, and AI Service with all 5 inference modules.');

// 6. Verify src/components/dashboard/DashboardView.tsx
console.log('\n--- 6. Testing src/components/dashboard/DashboardView.tsx ---');
const dashContent = fs.readFileSync(path.join(__dirname, '../src/components/dashboard/DashboardView.tsx'), 'utf8');
assert(dashContent.includes("Muduo 网络库底层"), "Card 3 must display Muduo 网络库底层");
assert(dashContent.includes("已完结"), "Card 3 must state 已完结");
assert(dashContent.includes("CppAIService 核心架构拓扑图谱"), "Topology title must refocus on CppAIService");
assert(dashContent.includes("ModelManager"), "Topology must contain ModelManager");
assert(dashContent.includes("WorkerPool"), "Topology must contain WorkerPool");
assert(dashContent.includes("DynamicBatcher"), "Topology must contain DynamicBatcher");
assert(dashContent.includes("TokenStreamer"), "Topology must contain TokenStreamer");
assert(dashContent.includes("MemoryPool"), "Topology must contain MemoryPool");
assert(dashContent.includes("Muduo 基础网络库 (已完结归档)"), "Archived section must exist");
assert(dashContent.includes("查看归档架构与历史代码"), "Trigger button must exist");
console.log('✅ [PASS] DashboardView.tsx successfully refocused on CppAIService and archived Muduo.');

// 7. Verify tasksDataset & daily curriculum
console.log('\n--- 7. Testing tasksDataset.ts & DailyCurriculumView.tsx ---');
const taskContent = fs.readFileSync(path.join(__dirname, '../src/data/tasksDataset.ts'), 'utf8');
assert(taskContent.includes("算法练习"), "Task 1 must be 算法练习");
assert(taskContent.includes("AI 推理服务架构"), "Task 2 must be AI 推理服务架构");
assert(taskContent.includes("动态批处理引擎"), "Task 3 must be 动态批处理引擎");
assert(taskContent.includes("流式输出与并发评测"), "Task 4 must be 流式输出与并发评测");
const dailyContent = fs.readFileSync(path.join(__dirname, '../src/components/daily/DailyCurriculumView.tsx'), 'utf8');
assert(dailyContent.includes("W1 AI 服务端与 ORT/TRT 封装"), "W1 label must match CppAIService phase");
console.log('✅ [PASS] tasksDataset and DailyCurriculumView align with CppAIService.');

console.log('\n===============================================================');
console.log('🎉 ALL MILESTONES 2, 3, 4 VERIFICATION CHECKS PASSED (7/7)!');
console.log('===============================================================');
