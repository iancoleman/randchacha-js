require('buffer');
chacha = require("chacha");

class ChaChaRng{

    constructor(seedBytes) {
        if (seedBytes instanceof Array || seedBytes instanceof Uint8Array) {
            seedBytes = new Buffer.from(seedBytes);
        }
        if (!(seedBytes instanceof Buffer)) {
            throw new Error("Seed is not an array");
            return;
        }
        if (seedBytes.length != 32) {
            throw new Error("Seed is not 32 bytes long");
            return;
        }
        let nonce = new Buffer.from(new Uint8Array(12));
        this.cipher = chacha.chacha20(seedBytes, nonce);
    }

    // Array is an array or Uint8Array of the desired size
    // that will be filled with random bytes.
    // The array is modified in place.
    fillBytes(array) {
        let size = array.length;
        let output = new Uint8Array(size);
        output = this.cipher.update(output);
        output.reverse();
        for (let i=0; i<output.length; i++) {
            array[i] = output[output.length - i - 1];
        }
    }

    // Returns a number in range 0 <= n < 4294967296
    nextU32() {
        let n = nextFromBytes(4, this.cipher);
        return n;
    }

    // Returns a BigInt in range 0 <= n < 18446744073709551616
    nextU64() {
        let n = nextFromBytes(8, this.cipher);
        return n;
    }
}

function nextFromBytes(n, cipher) {
    let bytes = new Uint8Array(n);
    bytes = cipher.update(bytes);
    let v = 0n;
    // fetch 4 bytes for a u32
    for (let i=0; i<n; i++) {
        let b = bytes[i];
        let bi = BigInt(b);
        let e = 8n * BigInt(i);
        v = v + (bi * (2n ** e));
    }
    if (n == 4) {
        // u32 is not BigInt, so convert it to a number
        v = parseInt(v.toString());
    }
    return v;
}

exports.ChaChaRng = ChaChaRng;
