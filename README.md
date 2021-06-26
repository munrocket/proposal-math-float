# proposal-math-float

JavaScript arithmetic is implemented in a non-standard way, compared to other languages.
Over time, there was a demand for performance and precision but the language itself does not
give an opportunity for some effective algorithms. This proposal offers to add inverse square,
ldexp that multiplying by 2 raised to the exp power, frexp that decomposes given floating point
value arg into a normalized fraction and an integral power of two, scalar FMA instruction that
performs multiplication-addition in one step with single rounding, successor/predecessor of
floating point number

### Proposed syntax
```js
let invsqrt = Math.invSqrt(x);
let ldexp = Math.ldexp(x);
let frexp = Math.frexp(x);
let fma = Math.fma(x, y, z);
let successor = Math.nextUp(x);
let predecessor = Math.nextDown(x);
```

### Motivation to add this functions
- invSqrt() is used in computer graphics, we have Math.hypot(x, y) in JS but it's not inverted
- ldexp() currently have worst polyfill ever because it's based on slowest float operation (pow)
- frexp() could be useful for bit analysis inside float number and correct rounding
- fma() very useful for optimizing multiplication in arbitrary precision floating point libraries
- nextUp()/nextDown() basic blocks for floating-point computations with correct rounding

### Pollyfills status
| Function | Implementation                                              |
|----------|-------------------------------------------------------------|
| invSqrt  | done                                                        |
| ldexp    | done                                                        |
| frexp    | [in npm?](https://www.npmjs.com/package/math-float64-frexp) |
| fma      | without overflow for now                                    |
| nextUp   | done                                                        |
| nextDown | done                                                        |

### Disclaimer
This proposal based on my R&D projects ([1](https://github.com/munrocket/double.js),
[2](https://github.com/munrocket/jampary)) with floating point numbers and created as alternative to
[decimal-proposal](https://github.com/tc39/proposal-decimal). I feel frustrated that JS not added this
basic blocks 5 years ago and we at that point when something hardcore is computed not as fast as it could be.
There are two type of arbitrary precision floating point libraries: based on integers and based on floats.
Since javascript don't have integers historically I found that solution based on floats much easier
in implementation and equally good as solutions based on integer arithmetic, when it properly cooked.
invSqrt() / frexp() was added after inspiration with new WGSL specification, nextUp() / nextDown()
exist in Java with same syntax, scalar fma() is the reason why this proposal was created.

### Key algorithms for polyfill implementation
1. Chris Lomont. _Fast inverse square root_
2. Sylvie Boldo, Guillaume Melquiond. _Emulation of a FMA and correctly-rounded sums: proved algorithms using rounding to odd._
3. Siegfried Rump, Paul Zimmermann, Sylvie Boldo, Guillaume Melquiond _Computing predecessor and successor in rounding to nearest_
4. Masahide Kashiwagi _Emulation of Rounded Arithmetic in Rounding to Nearest_
