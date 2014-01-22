// Mix Column, see http://www.samiam.org/mix-column.html
// Verified on 22-jan-2014

var mixColumns = function (input) {
    var a = [], b = [], i;

    if (input.length != 4) {
        console.log("Cannot mix columns. Not 4, but " + input.length + " columns.");
        return input;
    }
    for (i = 0; i < 4; i++) {
        a[i] = input[i];
        b[i] = gmul(input[i], 2);
    }

    input[0] = b[0] ^ a[3] ^ a[2] ^ b[1] ^ a[1];
    input[1] = b[1] ^ a[0] ^ a[3] ^ b[2] ^ a[2];
    input[2] = b[2] ^ a[1] ^ a[0] ^ b[3] ^ a[3];
    input[3] = b[3] ^ a[2] ^ a[1] ^ b[0] ^ a[0];

    return input;
};

var inverseMixColumns = function (input) {
    var a = [], i;

    if (input.length != 4) {
        console.log("Cannot inverse mix columns. Not 4, but " + input.length + " columns.");
        return input;
    }

    for (i = 0; i < 4; i++) {
        a[i] = input[i];
    }

    input[0] = gmul(a[0], 14) ^ gmul(a[3], 9) ^ gmul(a[2], 13) ^ gmul(a[1], 11);
    input[1] = gmul(a[1], 14) ^ gmul(a[0], 9) ^ gmul(a[3], 13) ^ gmul(a[2], 11);
    input[2] = gmul(a[2], 14) ^ gmul(a[1], 9) ^ gmul(a[0], 13) ^ gmul(a[3], 11);
    input[3] = gmul(a[3], 14) ^ gmul(a[2], 9) ^ gmul(a[1], 13) ^ gmul(a[0], 11);

    return input;
};


