import { fma, nextUp, nextDown } from '../src/polyfill.mjs';
import { test } from 'zora';

Math.fma = fma;
let actual, expected;
let eps = Number.EPSILON;

test('nextUp', t => {
  t.ok(nextUp(1) === 1.0 + Math.pow(2, -52), '1 up');
  t.ok(nextUp(-1) === -1.0 + Math.pow(2, -53), '1 down');
  t.ok(nextUp(1 - Math.pow(2, -53)) === 1, 'pre1');
});

test('nextDown', t => {
  t.ok(nextDown(1) === 1.0 - Math.pow(2, -53), '1 down');
  t.ok(nextDown(-1) === -(1.0 + Math.pow(2, -52)), '-1 down');
});

test(`FMA accuracy tests`, t => {
  actual = Math.fma(10.20, 20.91, 30.12);
  expected = 243.402;
  t.ok(actual === expected, `${actual - expected}, some value`);

  actual = Math.fma(0.1, 10, -1);
  expected = 5.5511151231257827e-17;
  t.ok(actual === expected, `${actual - expected}, non zero`);

  actual = Math.fma(1 + eps, 1 + eps, -1 - 2 * eps);
  expected = eps * eps;
  t.ok(actual === expected, `${actual - expected}, Nelson H. F. Beebe's test`);

  actual = Math.fma(1 + Math.pow(2, -30), 1 + Math.pow(2, -23), -(1 + Math.pow(2, -23) + Math.pow(2, -30)));
  expected = Math.pow(2, -53);
  t.ok(actual === expected, `${actual - expected}, Accurate Algorithms test1`);

  actual = Math.fma(1 + Math.pow(2, -30), 1 + Math.pow(2, -52), -(1 + Math.pow(2, -30)));
  expected = Math.pow(2, -52) + Math.pow(2, -82);
  t.ok(actual === expected, `${actual - expected}, Accurate Algorithms test2`);
});

test('FMA infinity tests', t => {
  t.ok(Math.fma(Infinity, 1, 1) === Infinity, 'is Infinity');
  t.ok(Math.fma(1, Infinity, 1) === Infinity, 'is Infinity');
  t.ok(Math.fma(1, 1, Infinity) === Infinity, 'is Infinity');

  t.ok(Math.fma(Infinity, 1, 0) === Infinity, 'is Infinity');
  t.ok(Math.fma(1, Infinity, 0) === Infinity, 'is Infinity');
  t.ok(Math.fma(0, 1, Infinity) === Infinity, 'is Infinity');

  t.ok(Math.fma(1, Infinity, Infinity) === Infinity, 'is Infinity');
  t.ok(Math.fma(Infinity, 1, Infinity) === Infinity, 'is Infinity');
  t.ok(Math.fma(Infinity, Infinity, 1) === Infinity, 'is Infinity');

  t.ok(Math.fma(-Infinity, 1, 1) === -Infinity, 'is Infinity');
  t.ok(Math.fma(1, -Infinity, 1) === -Infinity, 'is Infinity');
  t.ok(Math.fma(1, 1, -Infinity) === -Infinity, 'is Infinity');

  t.ok(Math.fma(-Infinity, 1, 0) === -Infinity, 'is Infinity');
  t.ok(Math.fma(1, -Infinity, 0) === -Infinity, 'is Infinity');
  t.ok(Math.fma(0, 1, -Infinity) === -Infinity, 'is Infinity');

  t.ok(Math.fma(1, -Infinity, -Infinity) === -Infinity, 'is Infinity');
  t.ok(Math.fma(-Infinity, 1, -Infinity) === -Infinity, 'is Infinity');
  t.ok(Math.fma(-Infinity, -Infinity, 1) === Infinity, 'is Infinity');
});

test('FMA NaN tests', t => {
  t.ok(isNaN(Math.fma(NaN, 1, 1)), 'is NaN');
  t.ok(isNaN(Math.fma(1, NaN, 1)), 'is NaN');
  t.ok(isNaN(Math.fma(1, 1, NaN)), 'is NaN');

  t.ok(isNaN(Math.fma(Infinity, 0, 1)), 'is NaN');
  t.ok(isNaN(Math.fma(0, Infinity, 1)), 'is NaN');
  t.ok(isNaN(Math.fma(Infinity, 0, NaN)), 'is NaN');
  t.ok(isNaN(Math.fma(0, Infinity, NaN)), 'is NaN');

  t.ok(isNaN(Math.fma(-Infinity, 0, 1)), 'is NaN');
  t.ok(isNaN(Math.fma(0, -Infinity, 1)), 'is NaN');
  t.ok(isNaN(Math.fma(-Infinity, 0, NaN)), 'is NaN');
  t.ok(isNaN(Math.fma(0, -Infinity, NaN)), 'is NaN');

  t.ok(isNaN(Math.fma(Infinity, 0, -Infinity)), 'is NaN');
  t.ok(isNaN(Math.fma(0, -Infinity, Infinity)), 'is NaN');
  t.ok(isNaN(Math.fma(Infinity, 1, -Infinity)), 'is NaN');
  t.ok(isNaN(Math.fma(1, -Infinity, Infinity)), 'is NaN');

  t.ok(isNaN(Math.fma(-Infinity, 0, Infinity)), 'is NaN');
  t.ok(isNaN(Math.fma(0, Infinity, -Infinity)), 'is NaN');
  t.ok(isNaN(Math.fma(-Infinity, 1, Infinity)), 'is NaN');
  t.ok(isNaN(Math.fma(1, Infinity, -Infinity)), 'is NaN');

  t.ok(isNaN(Math.fma(Infinity, Infinity, -Infinity)), 'is NaN');
  t.ok(isNaN(Math.fma(-Infinity, Infinity, Infinity)), 'is NaN');
  t.ok(isNaN(Math.fma(Infinity, -Infinity, Infinity)), 'is NaN');
  t.ok(isNaN(Math.fma(-Infinity, -Infinity, -Infinity)), 'is NaN');
});

test('FMA overflow tests', t => {
  actual = Math.fma(Number.MAX_VALUE, 2., -Number.MAX_VALUE);
  expected = Number.MAX_VALUE;
  t.ok(actual === expected, `${actual - expected}, overflow test`);
});