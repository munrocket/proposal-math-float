function next(x, sign) {
  let a = Math.abs(x);
  if (x === -sign * Infinity) {
    return -sign * 1.7976931348623157E308;
  } else if (a >= 2.004168360008973e-292) { //2**−969
    return x + sign * a * 1.1102230246251568e-16; //2**-53 + 2**-105
  } else if (a < 4.450147717014403e-308) { //2**-1021
    return x + sign * 5e-324; //2**-1074
  } else {
    let c = x * 9007199254740992; //2**53
    let e = Math.abs(c) * 1.1102230246251568e-16; //2**-53 + 2**-105
    return (c + sign * e) * 1.1102230246251565e-16; //2**-53
  }
}

export function fma(a, b, c) {
  let LO;
  let VIEW = new DataView(new ArrayBuffer(8));

  function twoSum(a, b) {
    let s = a + b;
    let a1  = s - b;
    LO = (a - a1) + (b - (s - a1));
    return s;
  }

  function twoProd(a, b) {
    let t = 134217729 * a; //2**27+1
    let ah = t + (a - t), al = a - ah;
    t = 134217729 * b; //2**27+1
    let bh = t + (b - t), bl = b - bh;
    t = a * b;
    LO = (((ah * bh - t) + ah * bl) + al * bh) + al * bl;
    return t;
  }

  function oddRoundSum(a, b) {
    let hi = twoSum(a, b);
    if (LO !== 0) {
      VIEW.setFloat64(0, hi);
      if (!(VIEW.getInt8(7) & 1)) {
        if ((LO > 0) ^ (hi < 0)) {
          hi = next(hi, 1);
        } else {
          hi = next(hi, -1);
        }
      }
    }
    return hi;
  }

  if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
    return a * b + c;
  }

  if (a === 0 || b === 0 || c === 0){
    return a * b + c;
  }

  let mhi = twoProd(a, b);
  let mlo = LO;

  let shi = twoSum(mhi, c);
  let slo = LO;

  return shi + oddRoundSum(mlo, slo);
}

export function nextUp(x) {
  return next(x, 1);
}

export function nextDown(x) {
  return next(x, -1);
}