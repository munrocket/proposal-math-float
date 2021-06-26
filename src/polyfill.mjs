// we can't use bitwise operations because it's based on int32 implementation
function ldexp(x, exp) {
  return x = x * Math.pow(2, exp);
}

// based on [4]
function next(x, sign) {
  var a = Math.abs(x);
  if (x === -sign * Infinity) {
    return -sign * Number.MAX_VALUE;
  } else if (a >= 2.004168360008973e-292) { //2**−969
    return x + sign * a * 1.1102230246251568e-16; //2**-53 + 2**-105
  } else if (a < 4.450147717014403e-308) { //2**-1021
    return x + sign * Number.MIN_VALUE;
  } else {
    var c = x * 9007199254740992; //2**53
    var e = Math.abs(c) * 1.1102230246251568e-16; //2**-53 + 2**-105
    return (c + sign * e) * 1.1102230246251565e-16; //2**-53
  }
}

export function nextUp(x) {
  return next(x, 1);
}

export function nextDown(x) {
  return next(x, -1);
}

// works if there is no overflow
export function fma(a, b, c) {
  let LO;

  function twoSum(a, b) {
    let s = a + b;
    let a1  = s - b;
    LO = (a - a1) + (b - (s - a1));
    return s;
  }

  function twoProd(a, b) {
    let t = 134217729 * a;
    let ah = t + (a - t), al = a - ah;
    t = 134217729 * b;
    let bh = t + (b - t), bl = b - bh;
    t = a * b;
    LO = (((ah * bh - t) + ah * bl) + al * bh) + al * bl;
    return t;
  }

  if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
    return a * b + c;
  }

  if (a === 0 || b === 0 || c === 0) {
    return a * b + c;
  }

  let mhi = twoProd(a, b);
  let mlo = LO;

  let shi = twoSum(mhi, c);
  let slo = LO;

  slo += mlo;
  return shi + slo;
}

// new version not finished
export function fma_correct(x, y, z) {
  var LO;

  function twoSum(a, b) {
    var s = a + b;
    var a1  = s - b;
    LO = (a - a1) + (b - (s - a1));
    return s;
  }

  function twoProd(a, b) {
    var t = a * 134217729; //2**27+1
    var ah = t + (a - t), al = a - ah;
    t = b * 134217729; //2**27+1
    var bh = t + (b - t), bl = b - bh;
    t = a * b;
    LO = (((ah * bh - t) + ah * bl) + al * bh) + al * bl;
    return t;
  }

  function oddRoundSum(a, b) {
    var hi = twoSum(a, b);
    if (LO !== 0) {
      var t = hi * 134217729; //2**27+1
      var hh = t + (hi - t), hl = hi - hh;
      if (!(hl & 1)) {
        if ((LO > 0) ^ (hi < 0)) {
          hi = next(hi, 1);
        } else {
          hi = next(hi, -1);
        }
      }
    }
    return hi;
  }

  if (!isFinite(x) || !isFinite(y) || !isFinite(z) || x === 0 || y === 0 || z === 0) {
    return x * y + z;
  }

  var xe = Math.floor(Math.log(Math.abs(x)) * Math.LOG2E) - 52;
  var ye = Math.floor(Math.log(Math.abs(y)) * Math.LOG2E) - 52;
  var ze = Math.floor(Math.log(Math.abs(z)) * Math.LOG2E) - 52;
  var spread = xe + ye - ze;
  var xm = ldexp(x, xe);
  var ym = ldexp(y, ye);
  var zm = ldexp(z, ze);

  if (spread < -53) {
    return z;
  }

  if (spread <= 106) {
    zm = ldexp(zm, spread);
  } else {
    zm = (zm > 0) ? Number.MIN_VALUE : -Number.MIN_VALUE;
  }

  var mulhi = twoProd(x, y);
  var mullo = LO;
  var sumhi = twoSum(mulhi, z);
  var sumlo = LO;

  // spread = xe + ye;
  // if (sumhi === 0) {
  //   return (mulhi + zm + ldexp(mullo, spread));
  // }

  var adj = oddRoundSum(mullo, sumlo);
  return sumhi + adj;
  // if (spread + Math.floor(Math.log(Math.abs(sumhi)) * Math.LOG2E) > -1023) {
  //   return ldexp(sumhi + adj, spread);
  // } else {
  //   return ldexp(sumhi + adj, spread);
  // }
}