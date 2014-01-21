// Library of Galois field functions, see http://www.samiam.org/galois.html

var gmul = function (a, b) {
    // Galois multiplication of 2 8-bit numbers a and b
    var p = 0, // resulting product
        i, high;

    if (a < 0 || a > 256) {
        console.log("Cannot multiply. Value of a incorrect.");
        return 0;
    }
    if (b < 0 || b > 256) {
        console.log("Cannot multiply. Value of b incorrect.");
        return 0;
    }

    for (i = 0; i < 8; i++) {
        // If the low bit of b is set, XOR the product by the value of a
        if ((b & 1) == 1) {
            p ^= a;
        }

        // Keep track of whether the high bit of a is set
        high = ((a & 0x80) == 1);

        // Rotate a one bit to the left, discarding the high bit and make low bit 0
        a <<= 1;

        // If the high bit was set, XOR a with the hex number 0x1b
        if (high) {
            a ^= 0x1b;
        }

        // Rotate b one bit to the right, discarding the low bit and make high bit 0
        b >>>= 1;
    }

    return p;
};

