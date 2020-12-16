import { fma } from '../src/polyfill.mjs';
import { test } from 'zora';

Math.fma = fma;
let actual, expected;
let eps = Number.EPSILON;

test(`Accuracy test`, t => {
  actual = Math.fma(10.20, 20.91, 30.12);
  expected = 243.402;
  t.ok(actual === expected, `${actual - expected}, simple example`);

  actual = Math.fma(0.1, 10, -1);
  expected = 5.5511151231257827e-17
  t.ok(actual === expected, `${actual - expected}, cppreference`);

  actual = Math.fma(1.0 + eps, 1.0 + eps, -1.0 - 2.0 * eps);
  expected = eps * eps;
  t.ok(actual === expected, `${actual - expected}, Nelson H. F. Beebe's test`);
});

test('Overflow test', t => {
  t.ok(isNaN(Math.fma(+Infinity, 10, -Infinity)), 'cppreference');

  // actual = Math.fma(Number.MAX_VALUE, 2., -Number.MAX_VALUE);
  // expected = Number.MAX_VALUE;
  // t.ok(actual === expected, `${actual - expected}, overflow`);
});