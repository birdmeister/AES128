/* AES implementation by Martin Voorzanger
    Key size = 128 bits (AES-128)
    Block size = 128 bits (= 16 bytes: 4 x 4 matrix of 8 bits)
    Number of rounds = 10
    AES is a substitution / permutation network
 */

var charsPerBlock = 32; // 128 bits key = 32 chars * 4 bits per hex

var AESCBC_Encrypt = function (key, PT) {
    // CBC = Cipher Block Chaining
    var CT = "", round, block, numBlocks, needPadding, hex = "", keyArray = [];

    console.log("AES-128 encryption");
    console.log("==================");
    console.log("Key:" + key);
    console.log("PT :" + PT);

    // Check the key length
    if (key.length != charsPerBlock) {
        console.log("Key is not 128 bytes. Required for AES-128");
        return CT;
    }

    // Determine the number of blocks
    numBlocks = Math.ceil(PT.length / charsPerBlock);
    console.log("Encryption of PT can be done in " + numBlocks + " blocks.");

    // Check if PT needs padding
    needPadding = (PT.length % charsPerBlock) != 0;
    if (needPadding) {
        console.log("Encryption of PT needs padding");
        // Expand PT using PKCS5 padding scheme
        // to be done
    }

    // Convert key to array of integers
    keyArray = hexToIntArray(key);

    // Key expansion from 16 bytes to 11 * 16 = 176 bytes
    keyArray = expandKey(keyArray);
    console.log(keyArray);

    // For each block in the PT
    for (block = 1; block <= numBlocks; block++) {
        console.log("");
        console.log("Block #" + block);
        console.log("========");

        // initial round - addRoundKey (XOR)
        hex = PT.substr((block - 1) * charsPerBlock, charsPerBlock);
        console.log("PT" + block + ":" + hex);
        console.log("Key:" + keyArray[0]);
        hex = addRoundKey(keyArray[0], hex);
        console.log("Rnd:" + hex);

        // AES-128 has 10 rounds
        for (round = 1; round <= 10; round++) {
            // subBytes
            hex = subBytes(hex);
            console.log("Sub:" + hex);

            // shiftRows
            hex = shiftRows(hex);
            console.log("Shf:" + hex);

            // mixColumns, expect in the 10th round
            if (round != 10) {
                // mixColumns
                hex = mixColumns(hex);
                console.log("Mix:" + hex);
            }

            // addRoundKey (XOR)
            console.log("Key:" + keyArray[round]);
            hex = addRoundKey(keyArray[round], hex);
        }
        CT += hex;
    }
    return CT;
};

var AESCBC_Decrypt = function (key, CT) {
    // CBC = Cipher Block Chaining
    var PT = "";

    return PT;
};

var AESCTR_Encrypt = function (key, PT) {
    // CTR = Counter, iv is 16-byte randomly chosen and prepended to ciphertext
    var CT = "", nonce = "", iv = "";

    return CT;
};

var AESCTR_Decrypt = function (key, CT) {
    // CTR = Counter
    var PT = "", nonce = "";

    return PT;
};

//var q1CBCKey = "140b41b22a29beb4061bda66b6747e14"; // 32 chars * 4 bits = 128 bits key
var q1CBCKey = "00000000000000000000000000000000"; // 32 chars * 4 bits = 128 bits key
//var q1CBCKey = "ffffffffffffffffffffffffffffffff"; // 32 chars * 4 bits = 128 bits key
var q1CBCCT  = "4ca00ff4c898d61e1edbf1800618fb2828a226d160dad07883d04e008a7897ee2e4b7465d5290d0c0e6c6822236e1daafb94ffe0c5da05d9476be028ad7c1d81";

console.log(AESCBC_Encrypt(q1CBCKey, q1CBCCT)); // SHOULD BE DECRYPT EVENTUALLY

var q2CBCKey = "140b41b22a29beb4061bda66b6747e14"; // 128 bits key
var q2CBCCT = "5b68629feb8606f9a6667670b75b38a5b4832d0f26e1ab7da33249de7d4afc48e713ac646ace36e872ad5fb8a512428a6e21364b0c374df45503473c5242a253";

console.log(AESCBC_Decrypt(q2CBCKey, q2CBCCT));

var q3CTRKey = "36f18357be4dbd77f050515c73fcf9f2"; // 128 bits key
var q3CTRCT = "69dda8455c7dd4254bf353b773304eec0ec7702330098ce7f7520d1cbbb20fc388d1b0adb5054dbd7370849dbf0b88d393f252e764f1f5f7ad97ef79d59ce29f5f51eeca32eabedd9afa9329";

console.log(AESCTR_Decrypt(q3CTRKey, q3CTRCT));

var q4CTRKey = "36f18357be4dbd77f050515c73fcf9f2"; // 128 bits key
var q4CTRCT = "770b80259ec33beb2561358a9f2dc617e46218c0a53cbeca695ae45faa8952aa0e311bde9d4e01726d3184c34451";

console.log(AESCTR_Decrypt(q4CTRKey, q4CTRCT));
