#include <math.h>
#include <stdio.h>

int main() {

  printf("%.16e \n", ldexp(3.141592653589793, 20));
  printf("%.16e \n", ldexp(3.141592653589793, 0));
  printf("%.16e \n", ldexp(3.141592653589793, -20));

  #ifdef FP_FAST_FMA
    printf("\nHardware FMA is used!\n");
  #else
    printf("\nSoftware FMA is used!\n");
  #endif
  printf("%.16e \n", fma(1.7976931348623157e+308, 2., -1.7976931348623157e+308));

  return 0;
}