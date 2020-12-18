# proposal-fma

JavaScript arithmetic is implemented in a non-standard way, compared to other languages.
Over time, there was a demand for precision and performance but the language itself does not
give an opportunity for some effective algorithms. This proposal offers to add scalar
FMA instruction that performs multiplication-addition in one step, with single rounding.

### Proposed syntax
```js
let fma = Math.fma(a, b, c);
let succ = Math.nextUp(a);
let pred = Math.nextDown(a);
```

### Key algorithms
1. Sylvie Boldo, Guillaume Melquiond. _Emulation of a FMA and correctly-rounded sums: proved algorithms using rounding to odd._
2. Mioara Joldes, Jean-Michel Muller, Valentina Popescu. _Tight and rigourous error bounds for basic building blocks of double-word arithmetic._
3. Siegfried Rump, Paul Zimmermann, Sylvie Boldo, Guillaume Melquiond _Computing predecessor and successor in rounding to nearest_
4. Masahide Kashiwagi _Emulation of Rounded Arithmetic in Rounding to Nearest_