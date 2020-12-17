// 1. Sylvie Boldo, Guillaume Melquiond
//    "Emulation of a FMA and correctly-rounded sums: proved algorithms using rounding to odd"
//
// 2. Mioara Joldes, Jean-Michel Muller, Valentina Popescu
//    "Tight and rigourous error bounds for basic building blocks of double-word arithmetic"

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
    let t = 134217729 * a;
    let ah = t + (a - t), al = a - ah;
    t = 134217729 * b;
    let bh = t + (b - t), bl = b - bh;
    t = a * b;
    LO = (((ah * bh - t) + ah * bl) + al * bh) + al * bl;
    return t;
  }

  function oddRoundSum(a, b) {
    let hi = twoSum(a, b);
    if (LO !== 0) {
      VIEW.setFloat64(0, hi);
      if (!(VIEW.getUint8(7) & 1)) {
        let i32 = VIEW.getInt32(1);
        if ((LO > 0) ^ (hi < 0)) {
          VIEW.setInt32(1, ++i32);
          if (i32 === 0) {
            i32 = VIEW.getInt32(0);
            VIEW.setInt32(0, ++i32);
          }
        } else {
          VIEW.setInt32(1, --i32);
          if (i32 === 65535) {
            i32 = VIEW.getInt32(0);
            VIEW.setInt32(0, --i32);
          }
        }
      }
      hi = VIEW.getFloat64(0);
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