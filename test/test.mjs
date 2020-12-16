import { fma } from '../src/polyfill.mjs';
import { test } from 'zora';

Math.fma = fma;
let actual, expected;
let eps = Number.EPSILON;

test(`Accuracy tests`, t => {
  actual = Math.fma(10.20, 20.91, 30.12);
  expected = 243.402;
  t.ok(actual === expected, `${actual - expected}, some value`);

  actual = Math.fma(0.1, 10, -1);
  expected = 5.5511151231257827e-17
  t.ok(actual === expected, `${actual - expected}, non zero`);

  actual = Math.fma(1.0 + eps, 1.0 + eps, -1.0 - 2.0 * eps);
  expected = eps * eps;
  t.ok(actual === expected, `${actual - expected}, Nelson H. F. Beebe's test`);

  actual = Math.fma(1 + Math.pow(2, -30), 1 + Math.pow(2, -23), -(1 + Math.pow(2, -23) + Math.pow(2, -30)));
  expected = Math.pow(2, -53);
  t.ok(actual === expected, `${actual - expected}, Accurate Algorithms test1`);

  actual = Math.fma(1 + Math.pow(2, -30), 1 + Math.pow(2, -52), -(1 + Math.pow(2, -30)));
  expected = Math.pow(2, -52) + Math.pow(2, -82);
  t.ok(actual === expected, `${actual - expected}, Accurate Algorithms test2`);
});

test('Overflow tests', t => {
  t.ok(isNaN(Math.fma(+Infinity, 10, -Infinity)), 'is NAN');

  actual = Math.fma(Number.MAX_VALUE, 2., -Number.MAX_VALUE);
  expected = Number.MAX_VALUE;
  t.ok(actual === expected, `${actual - expected}, not overflow`);
});