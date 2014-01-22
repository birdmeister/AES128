// Library of Galois field functions, see http://www.samiam.org/galois.html
// Verified on 22-jan-2014

var gmul = function (a, b) {
    // Galois multiplication of two 8-bit numbers a and b
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
        if ((b & 0x01) == 1) {
            p ^= a;
        }

        // Keep track of whether the high bit of a is set
        high = a & 0x80;

        // Rotate a one bit to the left, discarding the high bit and make low bit 0.
        // Make sure it never ever get bigger then 8 bits
        a = (a << 1) % 256;

        // If the high bit was set, XOR a with the hex number 0x1b
        if (high != 0) {
            a  = a ^ 0x1b; // 0x1b = 0001 1011
        }

        // Rotate b one bit to the right, discarding the low bit and make high bit 0
        b >>>= 1;
    }

    if (p < 0 || p > 256) {
        console.log("Error in multiplication. Value of p incorrect: " + p);
        return 0;
    }
    return p;
};

