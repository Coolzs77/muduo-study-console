const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting deep verification suite for v6.7.0 StyleKit Neumorphism features...\n');

const rootDir = path.resolve(__dirname, '..');
const dashboardPath = path.join(rootDir, 'src/components/dashboard/DashboardView.tsx');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

// -------------------------------------------------------------
// Test 1: Separation into 4 Distinct Cards (Non-Joined Layout)
// -------------------------------------------------------------
console.log('--- Test 1: Separation into 4 Distinct Cards ---');
assert(!dashboardContent.includes('一体化分段遥测条带'), 'Old unified telemetry ribbon header must be eliminated');
assert(!dashboardContent.includes('md:h-16'), 'Old unified fixed-height ribbon container must be eliminated');
assert(!dashboardContent.includes('divide-x'), 'Old ribbon divide-x container must be removed');
assert(dashboardContent.includes('grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'), 'Must adopt 4 independent card grid layout');
console.log('✓ 4 distinct separated cards confirmed (no unified ribbon / no divide-x).');

// -------------------------------------------------------------
// Test 2: Neumorphism Hard Prompt Absolute Prohibitions
// -------------------------------------------------------------
console.log('\n--- Test 2: StyleKit Neumorphism Absolute Prohibitions ---');
// Extract the metric cards section
const cardsSectionMatch = dashboardContent.match(/\{\/\* StyleKit Neumorphic 4 Distinct Metric Cards[\s\S]*?(?=\{\/\* 28-Day Task Calendar)/);
assert(cardsSectionMatch, 'Must find StyleKit Neumorphic cards section in DashboardView');
const cardsSection = cardsSectionMatch[0];

// 1. No pure black / pure white background on cards
assert(!cardsSection.includes('bg-white'), 'Neumorphic cards must NOT use pure white background');
assert(!cardsSection.includes('bg-black'), 'Neumorphic cards must NOT use pure black background');
// 2. No gradient backgrounds
assert(!cardsSection.includes('bg-gradient-'), 'Neumorphic cards must NOT use bg-gradient-*');
// 3. No thick borders
assert(!cardsSection.includes('border-2') && !cardsSection.includes('border-4'), 'Neumorphic cards must NOT use thick borders');
// 4. No sharp corners
assert(!cardsSection.includes('rounded-none'), 'Neumorphic cards must NOT use rounded-none');
// 5. No translate movement on cards or buttons (elements grow from surface, no floating)
assert(!cardsSection.includes('translate-y') && !cardsSection.includes('translate-x') && !cardsSection.includes('-translate-y'), 'Cards and buttons must NOT use translate displacement');
console.log('✓ Hard Prompt Prohibitions: No pure white/black, no gradients, no thick borders, no rounded-none, no translate displacement verified.');

// -------------------------------------------------------------
// Test 3: Dual-Light Physics & Fixed Illuminant Direction
// -------------------------------------------------------------
console.log('\n--- Test 3: Dual-Light Physics & Fixed Illuminant Direction ---');
// Base background color
assert(cardsSection.includes('bg-[#e0e5ec]'), 'Light mode must use canonical clay-like Neumorphic base #e0e5ec');
assert(cardsSection.includes('dark:bg-[#1e2024]'), 'Dark mode must use compatible dark clay base #1e2024');

// Dual shadows: -X/-Y for white highlight, +X/+Y for dark shadow
assert(cardsSection.includes('shadow-[6px_6px_14px_#b8bcc2,-6px_-6px_14px_#ffffff]') || cardsSection.includes('shadow-[8px_8px_18px_#b8bcc2,-8px_-8px_18px_#ffffff]'), 'Must implement canonical dual-light outer shadow (light top-left, dark bottom-right)');
assert(cardsSection.includes('dark:shadow-[6px_6px_14px_#141618,-6px_-6px_14px_#282c30]') || cardsSection.includes('dark:shadow-[8px_8px_18px_#141618,-8px_-8px_18px_#282c30]'), 'Dark mode dual shadow must follow matching illuminant');

// Rounded curvature (16px~24px)
assert(cardsSection.includes('rounded-2xl'), 'Cards must use soft rounded-2xl curvature');
console.log('✓ Canonical dual light source (top-left highlight #ffffff, bottom-right shadow #b8bcc2) verified.');

// -------------------------------------------------------------
// Test 4: Hover Shadowing & Active Extrude-to-Intrude
// -------------------------------------------------------------
console.log('\n--- Test 4: Hover Shadowing & Active Extrude-to-Intrude ---');
// Hover Shadowing: Shadow shrinks as finger/cursor approaches
assert(cardsSection.includes('hover:shadow-[3px_3px_6px_#b8bcc2,-3px_-3px_6px_#ffffff]'), 'Hover shadow must shrink to simulate finger blocking light');
// Active: Extrude to intrude
assert(cardsSection.includes('active:shadow-[inset_4px_4px_8px_#b8bcc2,inset_-4px_-4px_8px_#ffffff]'), 'Card active state must transition from convex to concave (inset)');
// Smooth molding transition
assert(cardsSection.includes('transition-all duration-300 ease-in-out'), 'All cards must use transition-all duration-300 ease-in-out');
console.log('✓ Hover Shadowing (shrinking shadow) & Active Extrude-to-Intrude confirmed.');

// -------------------------------------------------------------
// Test 5: Inset Grooves & Progress Slots
// -------------------------------------------------------------
console.log('\n--- Test 5: Recessed Inset Grooves & Progress Slots ---');
assert(cardsSection.includes('shadow-[inset_2px_2px_4px_#b8bcc2,inset_-2px_-2px_4px_#ffffff]'), 'Icon slots and progress bars must use recessed inset groove shadows');
assert(cardsSection.includes('bg-[#6d5dfc]'), 'Must use StyleKit accent color #6d5dfc for active indicators');
console.log('✓ Recessed inset micro-groove shadows and #6d5dfc accent verified.');

// -------------------------------------------------------------
// Test 6: Focus Card Integrated Neumorphic Soft Button
// -------------------------------------------------------------
console.log('\n--- Test 6: Card 4 Focus Timer & Neumorphic Soft Button ---');
assert(cardsSection.includes('toggleFocus'), 'Focus card must bind toggleFocus');
assert(cardsSection.includes('e.stopPropagation()'), 'Button click must prevent card click handler');
assert(cardsSection.includes('focusFormattedTime'), 'Must render live elapsed time');
assert(cardsSection.includes('todayMins'), 'Must render today accumulated minutes');
assert(cardsSection.includes('shadow-[inset_3px_3px_6px_#b8bcc2,inset_-3px_-3px_6px_#ffffff]'), 'Active running button must maintain sunken concave state');
console.log('✓ Card 4 Focus timer integration & Neumorphic soft button verified.');

// -------------------------------------------------------------
// Test 7: Semantic Titles & Information Hierarchy
// -------------------------------------------------------------
console.log('\n--- Test 7: Semantic Titles & Information Hierarchy ---');
assert(cardsSection.includes('任务体系'), 'Card 1 title must be 任务体系');
assert(cardsSection.includes('项目剖析'), 'Card 2 title must be 项目剖析');
assert(cardsSection.includes('算法题库'), 'Card 3 title must be 算法题库');
assert(cardsSection.includes('专注沉浸'), 'Card 4 title must be 专注沉浸');
console.log('✓ All 4 card semantic titles and clean hierarchy confirmed.');

console.log('\n🎉 ALL 7 ADVANCED STYLEKIT NEUMORPHISM TEST SUITES PASSED WITH 100% SUCCESS!');
