#include <math.h>
#include <stdio.h>

int main() {
  #ifdef FP_FAST_FMA
    printf("Hardware FMA is used!\n");
  #else
    printf("Software FMA is used!\n");
  #endif

  printf("%.16e \n", fma(1.7976931348623157e+308, 2., -1.7976931348623157e+308));
  //nextUp function better to try in online java compiler

  return 0;
}