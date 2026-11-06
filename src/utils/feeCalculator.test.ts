import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePlatformFee, compareAllPlatforms } from './feeCalculator';

test('BHIM UPI maintains strictly zero convenience fee and zero GST', () => {
  const result = calculatePlatformFee('bhim', 'mobile', 499);
  assert.equal(result.convenienceFee, 0);
  assert.equal(result.gstAmount, 0);
});

test('PhonePe levies platform fee on mobile recharges over 500', () => {
  const result = calculatePlatformFee('phonepe', 'mobile', 666);
  assert.equal(result.convenienceFee, 3);
  assert.equal(result.gstAmount, 0.54); // 18% of 3 is 0.54
});

test('PhonePe levies 2 rupees on 101-500 recharges', () => {
  const result = calculatePlatformFee('phonepe', 'mobile', 299);
  assert.equal(result.convenienceFee, 2);
  assert.equal(result.gstAmount, 0.36);
});

test('compareAllPlatforms correctly identifies cheapest option and non-negative savings', () => {
  const summary = compareAllPlatforms('mobile', 299);
  assert.ok(summary.results.length >= 7);
  assert.ok(summary.cheapestOption);
  assert.ok(summary.cheapestOption.netPayable <= summary.results[summary.results.length - 1].netPayable);
  assert.ok(summary.maxPotentialSavings >= 0);
  assert.equal(summary.baseAmount, 299);
});

test('Credit card bill comparison handles high amounts correctly', () => {
  const summary = compareAllPlatforms('creditcard', 15000);
  assert.ok(summary.results.length >= 7);
  // Net payable must be positive and bounded
  summary.results.forEach((r) => {
    assert.ok(r.netPayable > 14000);
    assert.ok(r.grossExtraFee >= 0);
  });
});

