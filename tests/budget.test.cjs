const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .find(match => match[1].includes('const DEFAULT_MODELS ='))[1];

function runtime(hash = '') {
  const nodes = new Map();
  const element = id => {
    if (!nodes.has(id)) nodes.set(id, {
      value: '', style: {}, classList: { add() {}, remove() {}, toggle() {} },
      options: ['cost-asc', 'cost-desc', 'input-asc'].map(value => ({ value })),
    });
    return nodes.get(id);
  };
  const context = vm.createContext({
    localStorage: { getItem: () => null }, Intl, URLSearchParams,
    window: { addEventListener() {}, location: { hash, origin: 'https://tokens.yayaagent.com', pathname: '/' } },
    document: { getElementById: element, querySelectorAll: () => [], querySelector: () => element('workspace') },
  });
  vm.runInContext(script, context);
  return context;
}

function run(code, context = runtime()) { return vm.runInContext(code, context); }
function near(actual, expected) { assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`); }

test('Monthly agent budget integrates real cached usage, task volume, and extra calls', () => {
  const result = run(`
    Object.assign(appState, { uncachedTokens: 2000, cachedTokens: 8000, outputTokens: 1000 });
    syncDerivedUsage();
    calculateModelCost(DEFAULT_MODELS.find(model => model.id === 'gpt-6-1-sol'));
  `);
  near(result.singleTotalCost, 0.0148);
  near(result.totalInputCost, 47.52);
  near(result.totalOutputCost, 99);
  near(result.totalCost, 146.52);
});

test('Cached input is included once in the total and can trigger a long-context tier', () => {
  const result = run(`
    Object.assign(appState, { uncachedTokens: 0, cachedTokens: 300000, outputTokens: 1000, budgetPeriod: 'single' });
    syncDerivedUsage();
    calculateModelCost(DEFAULT_MODELS.find(model => model.id === 'gpt-6-1-sol'));
  `);
  assert.equal(result.isTierActive, true);
  near(result.totalCost, 0.075);
});

test('Zero traffic keeps the per-call price and makes the monthly total zero', () => {
  const result = run(`
    Object.assign(appState, { uncachedTokens: 2000, outputTokens: 1000, tasksPerDay: 0 });
    syncDerivedUsage();
    calculateModelCost(DEFAULT_MODELS.find(model => model.id === 'gpt-6-1-sol'));
  `);
  near(result.singleTotalCost, 0.014);
  assert.equal(result.totalCost, 0);
});

test('Monthly volumes round a fractional extra-call allowance up to a whole call', () => {
  assert.equal(run(`getBudgetVolume({ budgetPeriod: 'monthly', tasksPerDay: 1, callsPerTask: 1, activeDays: 1, retryPercent: 10 })`), 2);
});

test('Switching budget periods uses the correct volume without changing usage', () => {
  const context = runtime();
  assert.equal(run(`getBudgetVolume({ ...appState, budgetPeriod: 'single' })`, context), 1);
  assert.equal(run(`getBudgetVolume({ ...appState, budgetPeriod: 'calls', totalCalls: 4321 })`, context), 4321);
  assert.equal(run(`getBudgetVolume(appState)`, context), 9900);
});

test('Sharing a long text estimate preserves its full count and excludes prompt content', () => {
  const context = runtime();
  const url = run(`
    Object.assign(appState, { inputMode: 'text', inputText: 'PRIVATE_PROMPT'.repeat(1000),
      estimatedTokens: 300000, estimatedCacheRate: 0.8, outputTokens: 1000 });
    buildShareableUrl().fullUrl;
  `, context);
  assert.ok(!url.includes('PRIVATE_PROMPT'));
  const params = new URL(url).hash;
  assert.ok(!new URLSearchParams(params.slice(1)).has('text'));
  const restored = runtime(params);
  assert.equal(run('initFromUrlState()', restored), true);
  run('syncDerivedUsage()', restored);
  assert.equal(run('appState.inputTokens', restored), 300000);
  assert.equal(run('appState.estimateSnapshot', restored), true);
  assert.equal(run('appState.volumeMultiplier', restored), 9900);
  near(run(`calculateModelCost(DEFAULT_MODELS.find(model => model.id === 'gpt-6-1-sol')).singleTotalCost`, restored), 0.303);
});

test('Real-usage share links restore cached counts and selected model', () => {
  const url = run(`
    Object.assign(appState, { uncachedTokens: 10000, cachedTokens: 30000, outputTokens: 2000,
      budgetPeriod: 'calls', totalCalls: 500, referenceModel: 'deepseek-v4-1-flash', isDeepSeekOffPeak: true });
    buildShareableUrl().fullUrl;
  `);
  const context = runtime(new URL(url).hash);
  run('initFromUrlState(); syncDerivedUsage()', context);
  assert.equal(run('appState.inputTokens', context), 40000);
  assert.equal(run('appState.volumeMultiplier', context), 500);
  assert.equal(run('appState.referenceModel', context), 'deepseek-v4-1-flash');
  near(run(`calculateModelCost(DEFAULT_MODELS.find(model => model.id === appState.referenceModel)).totalCost`, context), 1.395);
});

test('Older text share links still restore token estimation and total-call volume', () => {
  const context = runtime('#text=Hello+world&out=1000&vol=1000&cache=0.5');
  run('initFromUrlState(); syncDerivedUsage()', context);
  assert.equal(run('appState.inputTokens', context), 3);
  assert.equal(run('appState.volumeMultiplier', context), 1000);
  assert.equal(run('appState.inputMode', context), 'text');
});

test('Invalid shared inputs are bounded instead of producing negative or infinite charges', () => {
  const context = runtime('#mode=usage&in=-10&cached=NaN&out=Infinity&period=monthly&tasks=-1&calls=0&days=999&retry=-5');
  run('initFromUrlState(); syncDerivedUsage()', context);
  assert.equal(run('appState.inputTokens + appState.outputTokens', context), 0);
  assert.equal(run('appState.callsPerTask', context), 1);
  assert.equal(run('appState.activeDays', context), 31);
  assert.equal(run('appState.volumeMultiplier', context), 0);
});

test('A custom free cache-read rate is not replaced by an assumed discount', () => {
  near(run(`
    Object.assign(appState, { inputTokens: 1000, outputTokens: 0, cacheDiscountRate: 1, volumeMultiplier: 1 });
    calculateModelCost({ inputPerM: 2, cachedInputPerM: 0, outputPerM: 10 }).totalCost;
  `), 0);
});

test('Sharing a custom model preserves its rates without storing them on the recipient device', () => {
  const url = run(`
    customModels.push({ id: 'custom-test', name: 'Private model', provider: 'Custom', context: '128k',
      inputPerM: 2, cachedInputPerM: 0.25, outputPerM: 8, isCustom: true });
    Object.assign(appState, { uncachedTokens: 2000, cachedTokens: 8000, outputTokens: 1000,
      budgetPeriod: 'single', referenceModel: 'custom-test' });
    buildShareableUrl().fullUrl;
  `);
  const context = runtime(new URL(url).hash);
  run('initFromUrlState(); syncDerivedUsage()', context);
  assert.equal(run('appState.referenceModel', context), 'shared-custom');
  near(run(`calculateModelCost(customModels.find(model => model.id === 'shared-custom')).singleTotalCost`, context), 0.014);
});
