const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

// Exercise the actual browser calculator, without introducing build dependencies.
const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const script = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)]
  .find(match => match[1].includes('const DEFAULT_MODELS ='))[1];

function calculate(id, inputTokens, { outputTokens = 1000, cache = 0, volume = 1, offPeak = false } = {}) {
  const context = vm.createContext({
    localStorage: { getItem: () => null },
    window: { addEventListener: () => {} },
    Intl,
  });
  vm.runInContext(script, context);
  context.input = { id, inputTokens, outputTokens, cache, volume, offPeak };
  return vm.runInContext(`
    Object.assign(appState, {
      inputTokens: input.inputTokens, outputTokens: input.outputTokens,
      cacheDiscountRate: input.cache, volumeMultiplier: input.volume,
      isDeepSeekOffPeak: input.offPeak
    });
    calculateModelCost(DEFAULT_MODELS.find(model => model.id === input.id));
  `, context);
}

function near(actual, expected) {
  assert.ok(Math.abs(actual - expected) < 1e-10, `${actual} != ${expected}`);
}

// Official Standard USD/1M rates, checked 2026-10-09:
// https://developers.openai.com/api/docs/models/gpt-6-astra
// https://developers.openai.com/api/docs/models/gpt-6.1-sol
// https://developers.openai.com/api/docs/models/gpt-6-luna
for (const [id, short, long] of [
  ['gpt-6-astra', [10, 1, 50], [20, 2, 75]],
  ['gpt-6-1-sol', [2, 0.1, 10], [4, 0.2, 15]],
  ['gpt-6-luna', [0.1, 0.01, 0.5], [0.2, 0.02, 0.75]],
]) {
  for (const tokens of [271999, 272000, 272001, 300000]) {
    test(`${id}: ${tokens} input tokens uses the correct whole-request rates`, () => {
      const result = calculate(id, tokens);
      const rates = tokens > 272000 ? long : short;
      assert.equal(result.isTierActive, tokens > 272000);
      assert.equal(result.displayInputPerM, rates[0]);
      assert.equal(result.displayOutputPerM, rates[2]);
      near(result.singleInputCost, tokens * rates[0] / 1e6);
      near(result.singleOutputCost, 1000 * rates[2] / 1e6);
    });
  }
  test(`${id}: 80% cache hits and call scaling keep the long-context tier`, () => {
    const result = calculate(id, 300000, { cache: 0.8, volume: 1000 });
    assert.equal(result.isTierActive, true);
    near(result.totalCost, (300000 * (long[0] * 0.2 + long[1] * 0.8) + 1000 * long[2]) / 1000);
    assert.match(result.activeBillingNote, /including cache hits/);
    assert.match(result.activeBillingNote, /entire request/);
  });
  test(`${id}: output and call volume do not trigger the input tier`, () => {
    const result = calculate(id, 1000, { outputTokens: 300000, volume: 1000 });
    assert.equal(result.isTierActive, false);
    near(result.totalCost, (1000 * short[0] + 300000 * short[2]) / 1000);
  });
}

test('Sol: 300K input + 1K output costs $1.215 without caching', () => {
  near(calculate('gpt-6-1-sol', 300000).totalCost, 1.215);
});

test('Small dollar totals retain enough precision to display $1.215', () => {
  const context = vm.createContext({
    localStorage: { getItem: () => null },
    window: { addEventListener: () => {} },
    Intl,
  });
  vm.runInContext(script, context);
  assert.equal(vm.runInContext('formatCurrency(1.215)', context), '1.2150');
});

for (const [id, threshold, expected] of [
  ['claude-haiku-5-5', 100000, [0.5, 0.05, 2.5]],
  ['gemini-3-1-pro', 200000, [4, 0.4, 18]],
]) {
  test(`${id}: existing threshold and cached tier remain correct`, () => {
    assert.equal(calculate(id, threshold).isTierActive, false);
    const result = calculate(id, threshold + 1, { cache: 0.5 });
    assert.equal(result.isTierActive, true);
    near(result.singleInputCost, (threshold + 1) * (expected[0] + expected[1]) / 2e6);
    near(result.singleOutputCost, expected[2] / 1000);
  });
}

test('DeepSeek off-peak pricing remains correct for long prompts', () => {
  const result = calculate('deepseek-v4-1-flash', 300000, { cache: 0.5, offPeak: true });
  assert.equal(result.isTierActive, false);
  near(result.totalCost, 0.3 * (0.15 + 0.003) / 2 + 0.0006);
});
