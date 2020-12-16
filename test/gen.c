#include <math.h>
#include <stdio.h>

int main() {
  #ifdef FP_FAST_FMA
    printf("Hardware FMA is used!\n");
  #else
    printf("Software FMA is used!\n");
  #endif

  printf("%.16e \n", fma(0.1, 10, -1));

  return 0;
}