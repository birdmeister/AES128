var scheduleCore = function (input, i) {
    // Core expansion. Given a 4-byte value do some scrambling
    var a;

    // Rotate input 8 bits to the left
    input = circularRotate(input);

    // Apply the S-Box on all 4 bytes
    for (a = 0; a < 4; a++) {
        // forwardSBox expects a hex number, so first convert
        input[a] = forwardSBox(input[a]);
    }

    // On just the first byte, add 2^i to the byte
    input[0] ^= rcon(i);
};

var rcon = function (input) {
    // Calculate the rcon used in key expansion
    var c = 1;

    if (input == 0) {
        return 0;
    }

    while (input != 1) {
        c = gmul(c, 2);
        input--;
    }

    return c;
};

var addRoundKey = function (input, hex) {
    var int, i;

    if (input.length != 16) {
        console.log("Cannot add round key. Input only " + input.length + " chars.");
        return input;
    }

    if (hex.length != 32) {
        console.log("Cannot add round key. Hex only " + hex.length + " chars.");
        return input;
    }

    int = hexToIntArray(hex);

    for (i = 0; i < 16; i++) {
        input[i] ^= int[i];
    }
    return input;
};

var subBytes = function (input) {

    if (input.length != 16) {
        console.log("Cannot substitute. Only " + input.length + " chars.");
        return input;
    }

    for (index = 0; index < 16; index++) {
        input[index] = forwardSBox(input[index]);
    }

    return input;
};

var shiftRows = function (input) {
    if (input.length != 16) {
        console.log("Cannot shift rows. Only " + input.length + " chars.");
        return input;
    }

    // First row, no shift

    // Second row, 1 shift left
    input[7]  = input[4];
    input[4]  = input[5];
    input[5]  = input[6];
    input[6]  = input[7];

    // Third row, 2 shifts left
    input[10] = input[8];
    input[11] = input[9];
    input[8]  = input[10];
    input[9]  = input[11];

    // Fourth row, 3 shifts left
    input[13] = input[12];
    input[14] = input[13];
    input[15] = input[14];
    input[12] = input[15];

    return input;
};

var circularRotate = function (input) {
    var a, i;

    // An 8-bit (= 1 byte) circular rotate to the left of a 4 byte word (= 8 hex chars)
    if (input.length != 4) {
        console.log("Cannot circular rotate. Word is " + input.length + " chars, instead of 4.");
        console.log("Word to rotate = " + input);
        return input;
    }

    a = input[0];
    for (i = 0; i < 3; i++) {
        input[i] = input[i + 1];
    }
    input[3] = a;

    if (input.length != 4) {
        console.log("Error in circularRotate()");
    }
    return input;
};

var hexToIntArray = function (hexArray) {
    var i, int = [];

    for (i = 0; i < (hexArray.length / 2); i++) {
        int[i] = parseInt(hexArray.substr(i * 2, 2), 16);
    }
    return int;
};

var intToHexArray = function (intArray) {
    var i, t, hex = "";

    for (i = 0; i < intArray.length; i++) {
        t = intArray[i].toString(16);
        if (t.length == 1) {
            hex += '0';
        }
        hex += t;
    }
    return hex;
};
