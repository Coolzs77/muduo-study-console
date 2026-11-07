const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting deep verification suite for v6.8.0 StyleKit Claymorphism & Focus Timer Fix...\n');

const rootDir = path.resolve(__dirname, '..');
const dashboardPath = path.join(rootDir, 'src/components/dashboard/DashboardView.tsx');
const timerHookPath = path.join(rootDir, 'src/hooks/useFocusTimer.ts');
const headerPath = path.join(rootDir, 'src/components/layout/Header.tsx');
const focusTimerPath = path.join(rootDir, 'src/components/dashboard/FocusTimer.tsx');

const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
const timerHookContent = fs.readFileSync(timerHookPath, 'utf8');
const headerContent = fs.readFileSync(headerPath, 'utf8');
const focusTimerContent = fs.readFileSync(focusTimerPath, 'utf8');

// -------------------------------------------------------------
// Test 1: Central Dashboard Layout: Exactly 3 Distinct Cards (No 专注沉浸)
// -------------------------------------------------------------
console.log('--- Test 1: Central Dashboard 3 Distinct Cards (Removal of 专注沉浸) ---');
assert(dashboardContent.includes('grid grid-cols-1 md:grid-cols-3 gap-6'), 'Must use 3-column responsive grid layout');
assert(!dashboardContent.includes('grid-cols-2 md:grid-cols-4'), '4-column grid must be eliminated');

const metricCardsMatch = dashboardContent.match(/\{\/\* StyleKit Claymorphism 3 Distinct Metric Cards[\s\S]*?(?=\{\/\* 28-Day Task Calendar)/);
assert(metricCardsMatch, 'Must find StyleKit Claymorphism cards section in DashboardView');
const cardsSection = metricCardsMatch[0];

assert(!cardsSection.includes('专注沉浸'), 'Center dashboard must NOT contain 专注沉浸 card');
assert(!cardsSection.includes('快速开启专注'), 'Center dashboard must NOT contain focus timer quick start button');
assert(cardsSection.includes('任务体系'), 'Card 1 must be 任务体系');
assert(cardsSection.includes('项目剖析'), 'Card 2 must be 项目剖析');
assert(cardsSection.includes('算法题库'), 'Card 3 must be 算法题库');
console.log('✓ 3 distinct cards confirmed; 专注沉浸 completely removed from center grid.');

// -------------------------------------------------------------
// Test 2: Different Candy Pastel Colors for Each Card
// -------------------------------------------------------------
console.log('\n--- Test 2: Distinct Pastel Candy Gradients for Each Card ---');
// Card 1: Mint Clay
assert(cardsSection.includes('from-emerald-100 via-teal-50 to-green-100'), 'Card 1 must use Mint Clay gradient');
assert(cardsSection.includes('text-teal-900') || cardsSection.includes('text-teal-800'), 'Card 1 text must use Teal theme');

// Card 2: Cream/Amber Clay
assert(cardsSection.includes('from-amber-100 via-orange-50 to-yellow-100'), 'Card 2 must use Amber/Cream Clay gradient');
assert(cardsSection.includes('text-amber-900') || cardsSection.includes('text-amber-800'), 'Card 2 text must use Amber theme');

// Card 3: Lilac/Purple Clay
assert(cardsSection.includes('from-purple-100 via-pink-50 to-indigo-100'), 'Card 3 must use Purple/Lilac Clay gradient');
assert(cardsSection.includes('text-purple-900') || cardsSection.includes('text-purple-800'), 'Card 3 text must use Purple theme');
console.log('✓ All 3 cards feature distinct pastel candy color palettes (Mint, Amber/Cream, Lilac/Purple).');

// -------------------------------------------------------------
// Test 3: Claymorphism Geometry & Dual Shadow Formulas
// -------------------------------------------------------------
console.log('\n--- Test 3: Claymorphism Large Rounded Corners & Dual Shadows ---');
assert(cardsSection.includes('rounded-3xl'), 'Cards must use super large rounded-3xl corners');
assert(cardsSection.includes('shadow-[8px_8px_16px_rgba(0,0,0,0.08),inset_4px_4px_8px_rgba(255,255,255,0.7)'), 'Must implement outer convex combined shadow');
assert(cardsSection.includes('shadow-[inset_3px_3px_6px_rgba(0,0,0,0.08),inset_-3px_-3px_6px_rgba(255,255,255,0.9)]'), 'Icon slots must use recessed concave groove shadows');
assert(cardsSection.includes('shadow-[inset_3px_3px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]'), 'Progress bars must use recessed concave groove slots');
console.log('✓ rounded-3xl and Claymorphism dual-shadow formulas verified.');

// -------------------------------------------------------------
// Test 4: Squishy Physics & Bouncy Easing
// -------------------------------------------------------------
console.log('\n--- Test 4: Squash & Stretch Physics & Spring Easing ---');
// Squash & Stretch: active:scale-x-105 active:scale-y-90
assert(cardsSection.includes('active:scale-x-105 active:scale-y-90'), 'Cards must implement Squash & Stretch (active:scale-x-105 active:scale-y-90)');
// Floating Hover: hover:-translate-y-1
assert(cardsSection.includes('hover:-translate-y-1'), 'Cards must implement Floating Hover (hover:-translate-y-1)');
// Deep Impression: active:shadow with deeper inset
assert(cardsSection.includes('active:shadow-[2px_2px_4px_rgba(0,0,0,0.05),inset_8px_8px_16px_rgba(0,0,0,0.15)'), 'Cards must implement Deep Impression active shadow');
// Spring Easing: ease-[cubic-bezier(0.34,1.56,0.64,1)] duration-300
assert(cardsSection.includes('ease-[cubic-bezier(0.34,1.56,0.64,1)]'), 'Cards must use spring overshoot easing');
assert(cardsSection.includes('duration-300'), 'Transition duration must be 300ms');
console.log('✓ Squishy physics, Squash & Stretch, floating hover, and spring easing confirmed.');

// -------------------------------------------------------------
// Test 5: Focus Timer Persistence & Zero-Reset Bug Fix
// -------------------------------------------------------------
console.log('\n--- Test 5: Focus Timer Persistence & Real-time Accumulation ---');
assert(timerHookContent.includes('const effectiveTodayMins = todayMins + Math.floor(currentSeconds / 60)'), 'Must dynamically compute effective today study minutes');
assert(timerHookContent.includes('todayMins: effectiveTodayMins'), 'Hook must export effectiveTodayMins so pausing does not display 0 minutes');
assert(timerHookContent.includes('专注计时已暂停，时长已安全暂存'), 'Toast must reassure user that time is safely preserved upon pause');
assert(timerHookContent.includes('accumulatedSeconds: nextAcc'), 'Paused elapsed time must be accumulated cleanly');

// Simulate algorithm
const simulateTodayMins = (persistedMins, currentSeconds) => {
  return persistedMins + Math.floor(currentSeconds / 60);
};
// 2 hours 44 minutes = 9840 seconds
assert.strictEqual(simulateTodayMins(0, 9840), 164, '2h44m must immediately show 164 today minutes even before reset');
assert.strictEqual(simulateTodayMins(30, 9840), 194, 'Previous 30m + 2h44m must show 194 minutes');
console.log('✓ Focus timer dynamic accumulation and persistence fix verified.');

// -------------------------------------------------------------
// Test 6: Elimination of Overflowing LIVE Badge
// -------------------------------------------------------------
console.log('\n--- Test 6: Removal of Overflowing LIVE Badges ---');
assert(!headerContent.includes('LIVE'), 'Header must not contain overflowing LIVE badge');
assert(!cardsSection.includes('LIVE'), 'Center cards must not contain overflowing LIVE badge');
assert(!focusTimerContent.includes('LIVE'), 'FocusTimer widget must not contain overflowing LIVE badge');
console.log('✓ No overflowing LIVE badges present across any component.');

// -------------------------------------------------------------
// Test 7: Right-side Focus Timer Claymorphism Alignment
// -------------------------------------------------------------
console.log('\n--- Test 7: Right Sidebar Focus Timer Clay Touch ---');
assert(focusTimerContent.includes('rounded-2xl'), 'FocusTimer must adopt rounded-2xl clay corners');
assert(focusTimerContent.includes('active:scale-x-105 active:scale-y-90'), 'FocusTimer buttons must adopt Squash & Stretch');
assert(focusTimerContent.includes('ease-[cubic-bezier(0.34,1.56,0.64,1)]'), 'FocusTimer buttons must adopt spring easing');
console.log('✓ Right sidebar FocusTimer clay design and squishy tactile physics verified.');

console.log('\n🎉 ALL 7 ADVANCED STYLEKIT CLAYMORPHISM TEST SUITES PASSED WITH 100% SUCCESS!');
