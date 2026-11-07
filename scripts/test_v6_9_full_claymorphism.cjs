const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('[TEST] Starting v6.9.0 Full Claymorphism Style & Logic Verification...');

const projectRoot = path.resolve(__dirname, '..');

// 1. Check DashboardView.tsx
const dashboardPath = path.join(projectRoot, 'src', 'components', 'dashboard', 'DashboardView.tsx');
assert(fs.existsSync(dashboardPath), 'DashboardView.tsx must exist');
const dashboardCode = fs.readFileSync(dashboardPath, 'utf-8');

// StyleKit Claymorphism checks on DashboardView
console.log('-> Verifying DashboardView Claymorphism constraints...');
assert(!dashboardCode.includes('rounded-none'), 'Must NOT contain rounded-none (sharp corners are strictly forbidden)');
assert(!dashboardCode.includes('border-2 '), 'Must NOT contain heavy borders border-2');
assert(!dashboardCode.includes('shadow-[0px_0px_0px') && !dashboardCode.includes('shadow-[2px_2px_0px'), 'Must NOT contain hard-edge shadows');

// Required tokens
assert(dashboardCode.includes('rounded-3xl'), 'Must use ultra-large rounded-3xl for major containers');
assert(dashboardCode.includes('rounded-2xl'), 'Must use rounded-2xl for tiles and buttons');
assert(dashboardCode.includes('active:scale-x-105 active:scale-y-90'), 'Must include Squash & Stretch physical deformation');
assert(dashboardCode.includes('ease-[cubic-bezier(0.34,1.56,0.64,1)]') && dashboardCode.includes('duration-300'), 'Must use bouncy spring easing');
assert(dashboardCode.includes('hover:-translate-y-1'), 'Must use floating hover effect');

// Check 28-day calendar brick states
assert(dashboardCode.includes('isMastered'), 'Calendar must handle isMastered state');
assert(dashboardCode.includes('isLearning'), 'Calendar must handle isLearning state');
assert(dashboardCode.includes('SHORT_DAY_TITLES'), 'Calendar must use concise titles within 5 chars');

// 2. Check FocusTimer.tsx
console.log('-> Verifying FocusTimer Claymorphism constraints...');
const timerPath = path.join(projectRoot, 'src', 'components', 'dashboard', 'FocusTimer.tsx');
assert(fs.existsSync(timerPath), 'FocusTimer.tsx must exist');
const timerCode = fs.readFileSync(timerPath, 'utf-8');

assert(timerCode.includes('shadow-[inset_4px_4px_8px'), 'FocusTimer screen must use deep inset clay shadow');
assert(timerCode.includes('active:scale-x-105 active:scale-y-90'), 'FocusTimer buttons must include Squash & Stretch deformation');
assert(timerCode.includes('ease-[cubic-bezier(0.34,1.56,0.64,1)]'), 'FocusTimer buttons must use spring easing');

// 3. Check TaskRoutineList.tsx
console.log('-> Verifying TaskRoutineList Claymorphism constraints...');
const routinePath = path.join(projectRoot, 'src', 'components', 'dashboard', 'TaskRoutineList.tsx');
assert(fs.existsSync(routinePath), 'TaskRoutineList.tsx must exist');
const routineCode = fs.readFileSync(routinePath, 'utf-8');

assert(routineCode.includes('rounded-2xl'), 'Routine list items must use rounded-2xl clay strips');
assert(routineCode.includes('active:scale-x-110 active:scale-y-85') || routineCode.includes('active:scale-x-105 active:scale-y-90'), 'Routine check button must have bouncy spring interaction');
assert(routineCode.includes('ease-[cubic-bezier(0.34,1.56,0.64,1)]'), 'Routine list must use spring easing');

// 4. Verify Built bundle dist/index.html & dist/assets/
console.log('-> Verifying production build files...');
const distHtml = path.join(projectRoot, 'dist', 'index.html');
assert(fs.existsSync(distHtml), 'dist/index.html must exist');
const htmlContent = fs.readFileSync(distHtml, 'utf-8');
assert(htmlContent.includes('<!DOCTYPE html>') || htmlContent.includes('<html'), 'dist/index.html must be valid HTML');

console.log('[TEST SUCCESS] All v6.9.0 Full Claymorphism StyleKit assertions PASSED!');
