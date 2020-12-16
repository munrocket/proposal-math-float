// Emulation of a FMA and correctly-rounded sums: proved algorithms using rounding to odd Sylvie Boldo, Guillaume Melquiond
// https://hal-ens-lyon.archives-ouvertes.fr/inria-00080427v2/document

#include <math.h> //fma, FP_FAST_FMA

static inline double two_prod(const double a, const double b, double &err) {
  double splitter = 0x8000001p0; //2^27+1
  //float splitter = 0x2001p0; //2^13+1

  double t = splitter * a;
  double ah = t + (a - t);
  double al = a - ah;

  t = splitter * b;
  double bh = t + (b - t);
  double bl = b - bh;
  t = a * b;
  
  err = ((ah * bh - t) + ah * bl + al * bh) + al * bl;
  return t;
}

static inline double two_sum(const double a, const double b, double &err){
  double s = a + b;
  double a1  = s - b;

  err = (a - a1) + (b - (s - a1));
  return s;
}

static inline double fma_correct_fallback(const double a, const double b, const double c) {
  // Check overflows
  // Veltkamp-Dekker multiplication: a * b -> (mul, err)
  // Moller-Knuth summation: mul + c -> (muladd, err2)
  // Boldo-Melquiond ternary summation: muladd + err2 + err -> fma
}

static inline double f64_fma(const double a, const double b, const double c) {
  #ifdef FP_FAST_FMA
    return fma(a, b, c);
  #else
    return fma_correct_fallback(a, b, c);
  #endif
}