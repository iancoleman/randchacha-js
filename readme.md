# randChaCha

The ChaCha random number generator.

Inspired by and compatible with rust crate
[rand_chacha](https://rust-random.github.io/rand/rand_chacha/)

# Usage

## Node

```
npm install --save randchacha
```

```
rcc = require("randchacha")

// seed must be 32 bytes
seed0 = new Uint8Array(32)

// create a new rng from the seed
rng1 = new rcc.ChaChaRng(seed0)

// nextU32 returns a number
randNumber = rng1.nextU32()

// nextU64 returns a BigInt
randBigint = rng1.nextU64()

// fillBytes will update the input (like crypto.getRandomValues)
randBytes = new Uint832Array(100)
rng1.fillBytes(randBytes);

// can create multiple generators
rng2 = new rcc.ChaChaRng(seed0)

// the same seed produces the same sequence of numbers
randNumber2 = rng2.nextU32()

// a different seed produces a different sequence of numbers
seed55 = new Uint8Array(32)
seed55[0] = 55
rng3 = new rcc.ChaChaRng(seed55)

rng3.nextU32() // not equal to randNumber
```

## Browser

Use randchacha_browser.js

```
<script src="randchacha_browser.js"></script>
```

```
let seed = new Uint8Array(32);
let rng = new randchacha.ChaChaRng(seed);
rng.nextU32();
// see nodejs usage for full details
```

# Tests

To run tests

```
cd /path/to/randchacha
npm install --include=dev
npm run test
```
