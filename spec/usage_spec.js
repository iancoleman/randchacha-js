var rcc = require('../index.js');

describe("ChaChaRng", function() {

    it("generates random numbers", function() {
        let seed = new Uint8Array(32);
        let rng = new rcc.ChaChaRng(seed);

        // u32 generates number
        let u32 = rng.nextU32();
        expect(typeof u32).toBe("number");
        // nextU32 generates numbers other than 0
        let u32NotZero = u32 != 0;
        for (let i=0; i<10; i++) {
            if (u32NotZero) {
                break;
            }
            u32 = rng.nextU32();
            u32NotZero = u32 != 0;
            // this is a 32 bit number
            let bits = Math.log2(u32);
            expect(bits).toBeGreaterThan(0);
            expect(bits).toBeLessThan(32);
        }
        expect(u32NotZero).toBe(true);

        // nextU64 generates BigInt
        let u64 = rng.nextU64();
        expect(typeof u64).toBe("bigint");
        // nextU64 generates numbers other than 0
        let u64NotZero = u64 != 0;
        for (let i=0; i<10; i++) {
            if (u64NotZero) {
                break;
            }
            u64 = rng.nextU64();
            u64NotZero = u64 != 0;
            // this is a 64 bit number
            let bits = Math.log2(u64);
            expect(bits).toBeGreaterThan(0);
            expect(bits).toBeLessThan(64);
        }
        expect(u64NotZero).toBe(true);

        // fillBytes replaces bytes with random values
        let bytes = new Uint8Array(100);
        rng.fillBytes(bytes);
        let isAllZeros = true;
        for (let i=0; i<bytes.length; i++) {
            if (bytes[i] != 0) {
                isAllZeros = false;
                break;
            }
        }
        expect(isAllZeros).toBe(false);
    });

    it("can create mulitple rngs", function() {
        let seed = new Uint8Array(32);
        let seed2 = new Uint8Array(32);
        seed2[0] = 1;

        let rng1 = new rcc.ChaChaRng(seed);
        let rng2 = new rcc.ChaChaRng(seed);
        let rng3 = new rcc.ChaChaRng(seed2);

        let n1 = rng1.nextU32();
        let n2 = rng2.nextU32();
        expect(n1).toEqual(n2);

        let n3 = rng3.nextU32();
        expect(n1).not.toEqual(n3);
    });

});
