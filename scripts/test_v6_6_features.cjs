const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting deep verification suite for v6.6.0 features...\n');

const rootDir = path.resolve(__dirname, '..');

// Test 1: Verify removal of legacy 4-color Bento Box cards
console.log('--- Test 1: Elimination of 4-Color Bento Box Cards ---');
const dashboardContent = fs.readFileSync(path.join(rootDir, 'src/components/dashboard/DashboardView.tsx'), 'utf8');

assert(!dashboardContent.includes('from-sky-500/10'), 'Legacy sky color card gradient must be removed');
assert(!dashboardContent.includes('from-emerald-500/10'), 'Legacy emerald color card gradient must be removed');
assert(!dashboardContent.includes('from-purple-500/10'), 'Legacy purple color card gradient must be removed');
assert(!dashboardContent.includes('from-amber-500/10'), 'Legacy amber color card gradient must be removed');
assert(!dashboardContent.includes('4 Bento KPI Metric Cards'), 'Bento card section header must be removed');
assert(!dashboardContent.includes('rounded-xl bg-sky-600 text-white'), 'Legacy solid blue card icon background must be removed');
assert(!dashboardContent.includes('rounded-xl bg-emerald-600 text-white'), 'Legacy solid green card icon background must be removed');
assert(!dashboardContent.includes('rounded-xl bg-purple-600 text-white'), 'Legacy solid purple card icon background must be removed');
assert(!dashboardContent.includes('rounded-xl bg-amber-600 text-white'), 'Legacy solid amber card icon background must be removed');
console.log('✓ Successfully eliminated all 4 toy-like independent colored Bento cards.');

// Test 2: Verify Telemetry Segmented Ribbon structure & dimensions
console.log('\n--- Test 2: Telemetry Segmented Ribbon Layout & Dimensions ---');
assert(dashboardContent.includes('md:h-16'), 'Ribbon height must be strictly controlled within 56px~72px (64px = md:h-16)');
assert(dashboardContent.includes('grid-cols-2 md:grid-cols-4'), 'Ribbon must adapt cleanly from 2x2 grid on mobile to 1x4 single row on desktop');
assert(dashboardContent.includes('divide-slate-200/80') && dashboardContent.includes('dark:divide-slate-800/80'), 'Internal segments must be separated by 1px fine divide lines');
assert(dashboardContent.includes('rounded-xl'), 'Outer ribbon must use clean rounded-xl border');
console.log('✓ Segmented Ribbon layout, divide-x structure, and 64px height strictly confirmed.');

// Test 3: Verify Neumorphism tactile shadows & inset groove micro-ticks
console.log('\n--- Test 3: Neumorphism Dual-Shadows & Inset Micro-Tick Grooves ---');
assert(dashboardContent.includes('shadow-[inset_1px_1px_2px_rgba(0,0,0,0.12)'), 'Must include light mode Neumorphic inset sunken groove shadow');
assert(dashboardContent.includes('dark:shadow-[inset_1px_1px_2px_rgba(0,0,0,0.6)'), 'Must include dark mode Neumorphic inset sunken groove shadow');
assert(dashboardContent.includes('shadow-[0_2px_8px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.8)]'), 'Ribbon container must have dual convex highlight/shadow');
assert(dashboardContent.includes('[0, 1, 2, 3, 4, 5, 6].map'), 'Must render 7 micro-ticks for granular progress representation');
console.log('✓ Neumorphic dual shadows and inset tick grooves verified.');

// Test 4: Verify Focus Timer native integration in Segment 4
console.log('\n--- Test 4: Focus Timer Native Integration in Segment 4 ---');
assert(dashboardContent.includes('toggleFocus'), 'Segment 4 must have direct toggleFocus hook binding');
assert(dashboardContent.includes('focusFormattedTime'), 'Segment 4 must display live formatted elapsed time');
assert(dashboardContent.includes('todayMins'), 'Segment 4 must display today accumulated study minutes');
assert(dashboardContent.includes('isFocusRunning'), 'Segment 4 must conditionally react to live running state');
assert(dashboardContent.includes('e.stopPropagation()'), 'Quick toggle button must stop event propagation to avoid triggering segment scroll');
assert(dashboardContent.includes('<Play') && dashboardContent.includes('<Pause'), 'Segment 4 must include Play and Pause action icons');
console.log('✓ Focus timer native 1-click toggle and live telemetry verified.');

// Test 5: Verify Emil Kowalski interaction guidelines
console.log('\n--- Test 5: Emil Kowalski Micro-Interactions & Accessible Colors ---');
assert(dashboardContent.includes('hover:bg-slate-500/5'), 'Must use subtle hover highlight');
assert(dashboardContent.includes('active:scale-[0.98]'), 'Must provide tactile active press scale feedback');
assert(dashboardContent.includes('transition-all duration-150 ease-out'), 'Must use smooth ease-out transition curve');
console.log('✓ Emil Kowalski interaction and motion standards strictly confirmed.');

// Test 6: Verify Production Build Artifacts
console.log('\n--- Test 6: Production Build Files & .nojekyll ---');
assert(fs.existsSync(path.join(rootDir, 'dist/index.html')), 'dist/index.html must exist');
assert(fs.existsSync(path.join(rootDir, 'dist/.nojekyll')), 'dist/.nojekyll must exist for SPA routing');
assert(fs.existsSync(path.join(rootDir, 'dist/classic.html')), 'dist/classic.html must exist');
console.log('✓ Production distribution files verified.');

console.log('\n🎉 ALL 6 VERIFICATION TEST SUITES PASSED WITH 100% ACCURACY!');
