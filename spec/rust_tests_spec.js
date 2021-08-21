var rcc = require('../index.js');

describe("rust rand_chacha tests", function() {

    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L357
    // This library does not expose serialization directly
    //it("test_chacha_serde_roundtrip", function() {
    //});

    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L395
    // This library does not expose serialization directly
    //it("test_chacha_serde_format_stability", function() {
    //});

    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L403
    it("test_chacha_construction", function() {
        let seed = new Uint8Array([
            0, 0, 0, 0, 0, 0, 0, 0,
            1, 0, 0, 0, 0, 0, 0, 0,
            2, 0, 0, 0, 0, 0, 0, 0,
            3, 0, 0, 0, 0, 0, 0, 0,
        ]);
        let rng = new rcc.ChaChaRng(seed);
        expect(rng.nextU32()).toEqual(137206642);
    });

    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L416
    it("test_chacha_true_values_a", function() {
        let seed = new Uint8Array(32);
        let rng = new rcc.ChaChaRng(seed);
        let expected = [
            0xade0b876, 0x903df1a0, 0xe56a5d40, 0x28bd8653, 0xb819d2bd, 0x1aed8da0, 0xccef36a8,
            0xc70d778b, 0x7c5941da, 0x8d485751, 0x3fe02477, 0x374ad8b8, 0xf4b8436a, 0x1ca11815,
            0x69b687c3, 0x8665eeb2,
        ];
        for (let i=0; i<expected.length; i++) {
            expect(rng.nextU32()).toEqual(expected[i]);
        }
        expected = [
            0xbee7079f, 0x7a385155, 0x7c97ba98, 0x0d082d73, 0xa0290fcb, 0x6965e348, 0x3e53c612,
            0xed7aee32, 0x7621b729, 0x434ee69c, 0xb03371d5, 0xd539d874, 0x281fed31, 0x45fb0a51,
            0x1f0ae1ac, 0x6f4d794b,
        ];
        for (let i=0; i<expected.length; i++) {
            expect(rng.nextU32()).toEqual(expected[i]);
        }
    });

    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L445
    it("test_chacha_true_values_b", function() {
        let seed = new Uint8Array(32);
        seed[31] = 1;
        let rng = new rcc.ChaChaRng(seed);
        // skip block 0
        for (let i=0; i<16; i++) {
            rng.nextU32();
        }
        let expected = [
            0x2452eb3a, 0x9249f8ec, 0x8d829d9b, 0xddd4ceb1, 0xe8252083, 0x60818b01, 0xf38422b8,
            0x5aaa49c9, 0xbb00ca8e, 0xda3ba7b4, 0xc4b592d1, 0xfdf2732f, 0x4436274e, 0x2561b3c8,
            0xebdd4aa6, 0xa0136c00,
        ];
        for (let i=0; i<expected.length; i++) {
            expect(rng.nextU32()).toEqual(expected[i]);
        }
    });

    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L472
    it("test_chacha_true_values_c", function() {
        let seed = new Uint8Array(32);
        seed[1] = 0xff;
        let rng1 = new rcc.ChaChaRng(seed);
        let expected = [
            0xfb4dd572, 0x4bc42ef1, 0xdf922636, 0x327f1394, 0xa78dea8f, 0x5e269039, 0xa1bebbc1,
            0xcaf09aae, 0xa25ab213, 0x48a6b46c, 0x1b9d9bcb, 0x092c5be6, 0x546ca624, 0x1bec45d5,
            0x87f47473, 0x96f0992e,
        ];
        // Test block 2 by skipping block 0 and 1
        for (let i=0; i<32; i++) {
            rng1.nextU32();
        }
        for (let i=0; i<expected.length; i++) {
            expect(rng1.nextU32()).toEqual(expected[i]);
        }
        // Not testing get_word_pos because it's not exposed in this api
        // TODO consider implementing get_word_pos for this test?
    });

    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L523
    it("test_chacha_multiple_blocks", function() {
        let seed = [
            0, 0, 0, 0, 1, 0, 0, 0,
            2, 0, 0, 0, 3, 0, 0, 0,
            4, 0, 0, 0, 5, 0, 0, 0,
            6, 0, 0, 0, 7, 0, 0, 0,
        ];
        let rng = new rcc.ChaChaRng(seed);
        let expected = [
            0xf225c81a, 0x6ab1be57, 0x04d42951, 0x70858036, 0x49884684, 0x64efec72, 0x4be2d186,
            0x3615b384, 0x11cfa18e, 0xd3c50049, 0x75c775f6, 0x434c6530, 0x2c5bad8f, 0x898881dc,
            0x5f1c86d9, 0xc1f8e7f4,
        ];
        for (let i=0; i<expected.length; i++) {
            expect(rng.nextU32()).toEqual(expected[i]);
            for (let ignore=0; ignore<16; ignore++) {
                rng.nextU32();
            }
        }
    });

    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L548
    it("test_chacha_true_bytes", function() {
        let seed = new Uint8Array(32);
        let rng = new rcc.ChaChaRng(seed);
        let bytes = new Uint8Array(32);
        rng.fillBytes(bytes);
        let expected = [
            118, 184, 224, 173, 160, 241, 61, 144, 64, 93, 106, 229, 83, 134, 189, 40, 189, 210,
            25, 184, 160, 141, 237, 26, 168, 54, 239, 204, 139, 119, 13, 199,
        ];
        for (let i=0; i<bytes.length; i++) {
            expect(bytes[i]).toEqual(expected[i]);
        }
    });

    // no set_stream method implemented here
    // TODO consider implementing set_stream for these tests?
    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L548
    //it("test_chacha_nonce", function() {
    //});

    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L584
    //it("test_chacha_clone_streams", function() {
    //});

    // no set_word_pos method implemented here
    // TODO consider implementing set_word_pos for these tests?
    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L606
    //it("test_chacha_word_pos_wrap_exact", function() {
    //});

    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L616
    //it("test_chacha_word_pos_wrap_excess", function() {
    //});

    // https://github.com/rust-random/rand/blob/067238f05753d18c7cc032717bef03a7f5244a8c/rand_chacha/src/chacha.rs#L626
    //it("test_chacha_word_pos_zero", function() {
    //});

});
