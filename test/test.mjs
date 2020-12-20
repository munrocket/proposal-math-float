import { fma, nextUp, nextDown } from '../src/polyfill.mjs';
import { test } from 'zora';

Math.fma = fma;
let actual, expected;
let eps = Number.EPSILON;

test('nextUp', t => {
  t.ok(nextUp(1) === 1.0 + Math.pow(2, -52), '1');
  t.ok(nextUp(123e120) === 1.2300000000000001E122, '123e120');
  t.ok(nextUp(-1) === -0.9999999999999999, '-1');
  t.ok(isNaN(nextUp(NaN)), 'NaN');
  t.ok(nextUp(0) === 4.9E-324, '0');
  t.ok(nextUp(Infinity) === Infinity, 'Infinity');
  t.ok(nextUp(-Infinity) === -1.7976931348623157E308, '-Infinity');
  t.ok(nextUp(1.7976931348623157E308) === Infinity, 'max val');
  t.ok(nextUp(2e-300) === 2.0000000000000004E-300, '2e300');
  t.ok(nextUp(2.1341341234e-310) === 2.13413412340004E-310, '2e-310');
  t.ok(nextUp(4.322345837456233E100) === 4.322345837456234E100, '4e100');
  t.ok(nextUp(4.322345837456234E-100) === 4.3223458374562346E-100, '4e-100');
});

test('nextDown', t => {
  t.ok(nextDown(1) === 1.0 - Math.pow(2, -53), '1');
  t.ok(nextDown(1.2300000000000001E122) === 123e120, '123e120');
  t.ok(nextDown(-0.9999999999999999) === -1, '-0.99');
  t.ok(isNaN(nextDown(NaN)), 'NaN');
  t.ok(nextDown(0) === -4.9E-324, '0');
  t.ok(nextDown(-1.7976931348623157E308) === -Infinity, '0');
  t.ok(nextDown(-Infinity) === -Infinity, 'Infinity');
  t.ok(nextDown(Infinity) === 1.7976931348623157E308, '-Infinity');
  t.ok(nextDown(-1.7976931348623157E308) === -Infinity, 'max val');
  t.ok(nextDown(2.0000000000000004E-300) === 2e-300, '2e300');
  t.ok(nextDown(2.13413412340004E-310) === 2.1341341234e-310, '2e-310');
  t.ok(nextDown(4.322345837456234E100) === 4.322345837456233E100, '4e100');
  t.ok(nextDown(4.3223458374562346E-100) === 4.322345837456234E-100, '4e-100');
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