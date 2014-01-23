var getRandomBytes = function (howMany) {
    var i, bytes = [];

    // This implementation is not suited for the real world
    for (i = 0; i < howMany; i++)
        bytes[i] = Math.round(Math.random() * 255);

    return bytes;
};

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

var addRoundKey = function (key, text) {
    var i, output = [];

    if (key.length != 16) {
        console.log("Cannot add round key. Key only " + key.length + " chars.");
        return output;
    }

    if (text.length != 16) {
        console.log("Cannot add round key. Text only " + text.length + " chars.");
        return output;
    }

    for (i = 0; i < 16; i++) {
        output[i] = key[i] ^ text[i];
    }
    return output;
};

var subBytes = function (input) {
    var index;

    if (input.length != 16) {
        console.log("Cannot substitute. Only " + input.length + " chars.");
        return input;
    }

    for (index = 0; index < 16; index++) {
        input[index] = forwardSBox(input[index]);
    }

    return input;
};

var inverseSubBytes = function (input) {
    var index;

    if (input.length != 16) {
        console.log("Cannot inverse substitute. Only " + input.length + " chars.");
        return input;
    }

    for (index = 0; index < 16; index++) {
        input[index] = inverseSBox(input[index]);
    }

    return input;

};

var shiftRows = function (input) {
    var temp;

    if (input.length != 16) {
        console.log("Cannot shift rows. Only " + input.length + " chars.");
        return input;
    }

    // First row, no shift

    // Second row, 1 shift left
    temp = input[4];
    input[4]  = input[5];
    input[5]  = input[6];
    input[6]  = input[7];
    input[7]  = temp;

    // Third row, 2 shifts left
    temp = input[10];
    input[10] = input[8];
    input[8]  = temp;

    temp = input[11];
    input[11] = input[9];
    input[9]  = temp;

    // Fourth row, 3 shifts left
    temp = input[15];
    input[15] = input[14];
    input[14] = input[13];
    input[13] = input[12];
    input[12] = temp;

    return input;
};

var inverseShiftRows = function (input) {
    var temp;

    if (input.length != 16) {
        console.log("Cannot inverse shift rows. Only " + input.length + " chars.");
        return input;
    }

    // First row, no shift

    // Second row, 1 shift right
    temp = input[7];
    input[7]  = input[6];
    input[6]  = input[5];
    input[5]  = input[4];
    input[4]  = temp;

    // Third row, 2 shifts right
    temp = input[11];
    input[11] = input[9];
    input[9]  = temp;

    temp = input[10];
    input[10] = input[8];
    input[8]  = temp;

    // Fourth row, 3 shifts right
    temp = input[15];
    input[15] = input[12];
    input[12] = input[13];
    input[13] = input[14];
    input[14] = temp;

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
    var i, hex = "";

    if (!intArray) {
        return hex;
    }

    for (i = 0; i < intArray.length; i++) {
        hex += ((intArray[i] < 16) ? "0" : "") + intArray[i].toString(16);
    }
    return hex;
};

var displayAscii = function (input) {
    var output = "", i, char;

    for (i = 0; i < input.length; i++) {
        char = String.fromCharCode(input[i]);
        output+= char;
    }
    return output;
};

var hexToAscii = function (hex) {
    var output = "", i;

    // If hex starts with 0x, skip this part
    if (hex.indexOf("0x") == 0 || hex.indexOf("0X") == 0) {
        hex = hex.substr(2);
    }

    // If hex length is odd, add "0" at the end
    if (hex.length % 2) {
        hex +="0";
    }

    for (i = 0; i < hex.length; i+= 2) {
        output += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
    }

    return output;
};
