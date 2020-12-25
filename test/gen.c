#include <math.h>
#include <stdio.h>

int main() {
  #ifdef FP_FAST_FMA
    printf("Hardware FMA is used!\n");
  #else
    printf("Software FMA is used!\n");
  #endif

  //printf("%.16e \n", fma(1.7976931348623157e+308, 2., -1.7976931348623157e+308));
  //printf("%i \n", ilogb(16.4));
  printf("%.16e \n", ldexp(3.141592653589793, 20));
  printf("%.16e \n", ldexp(3.141592653589793, 0));
  printf("%.16e \n", ldexp(3.141592653589793, -20));

  return 0;
}