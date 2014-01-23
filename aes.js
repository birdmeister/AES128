/* AES implementation by Martin Voorzanger
    Key size = 128 bits (AES-128)
    Block size = 128 bits (= 16 bytes: 4 x 4 matrix of 8 bits)
    Number of rounds = 10
    AES is a substitution / permutation network
 */

var blockSize = 128;               // block size in bits
var charsPerBlock = blockSize / 4; // 128 bits key = 32 chars * 4 bits per hex

var AESCBC_Encrypt = function (key, PT) {
    // CBC = Cipher Block Chaining
    var CT = [], round, block, numBlocks, needPadding, keyArray, PTblock, PTArray, output, j;

    if (!key || !PT) {
        console.log("Error - input parameters missing");
        return CT;
    }

    if (key.length != charsPerBlock) {
        console.log("Error - key length incorrect");
        return CT;
    }

    console.log("AES-128 encryption");
    console.log("==================");
    console.log("Key:" + key.toLowerCase());
    console.log("PT :" + PT.toLowerCase());

    // get IV (16 bytes)
    CT = getRandomBytes(blockSize / 8);
    console.log("IV :" + intToHexArray(CT));

    // Check if PT needs padding
    needPadding = (PT.length % charsPerBlock) != 0;
    if (needPadding) {
        console.log("Encryption of PT needs padding");
        // Expand PT using PKCS5 padding scheme
        // to be done
    }

    // Determine the number of blocks
    numBlocks = PT.length / charsPerBlock;
    console.log("Encryption of PT can be done in " + numBlocks + " block(s).");

    // Key expansion from 16 bytes to 11 * 16 = 176 bytes
    keyArray = hexToIntArray(key);
    keyArray = expandKey(keyArray);

    // For each block in the PT
    for (block = 0; block < numBlocks; block++) {
        console.log("");
        console.log("Block #" + block);
        console.log("========");

        // Get a block of the plaintext and convert to array of integers
        PTblock = PT.slice(block * charsPerBlock, (block + 1) * charsPerBlock);
        PTArray = hexToIntArray(PTblock);
        console.log("PT" + block + ":" + intToHexArray(PTArray));

        // initial round - addRoundKey (XOR)
        output = CT.slice(block * charsPerBlock, (block + 1) * charsPerBlock);
        output = addRoundKey(output, PTArray);
        console.log("Rnd:" + intToHexArray(output));

        // AES-128 has 10 rounds
        for (round = 1; round <= 10; round++) {
            console.log("");
            console.log("Round #" + round);
            console.log("=========");
            // subBytes
            output = subBytes(output);
            console.log("Sub:" + intToHexArray(output));

            // shiftRows
            output = shiftRows(output);
            console.log("Shf:" + intToHexArray(output));

            // mixMatrix, expect in the 10th round
            if (round != 10) {
                // mixMatrix
                output = mixMatrix(output);
                console.log("Mix:" + intToHexArray(output));
            }

            // addRoundKey
            console.log("K#" + round + ":" + intToHexArray(getKey(keyArray, round)));
            output = addRoundKey(getKey(keyArray, round), output);
            console.log("OUT:" + intToHexArray(output));
        }

        for (j = 0; j < 16; j++) {
            CT.push(output[j]);
        }
        console.log(" CT:" + hexToAscii(intToHexArray(CT)));

        CT = CT.concat(output);
        console.log("CTx:" + hexToAscii(intToHexArray(CT)));
    }
    return CT;
};

var AESCBC_Decrypt = function (key, CT) {
    // CBC = Cipher Block Chaining
    var PT = [], round, block, numBlocks, needPadding, keyArray, CTblock, CTArray, output, j;

    if (!key || !CT) {
        console.log("Error - input parameters missing");
        return PT;
    }

    if (key.length != charsPerBlock) {
        console.log("Error - key length incorrect");
        return PT;
    }

    console.log("AES-128 decryption");
    console.log("==================");
    console.log("Key:" + key);
    console.log("CT :" + CT);

    // Check if CT needs padding
    needPadding = (CT.length % charsPerBlock) != 0;
    if (needPadding) {
        console.log("Decryption of CT needs padding");
        // Expand CT using PKCS5 padding scheme
        // to be done
    }

    // Determine the number of blocks
    numBlocks = CT.length / charsPerBlock;
    console.log("Decryption of CT can be done in " + numBlocks + " block(s).");

    // Key expansion from 16 bytes to 11 * 16 = 176 bytes
    keyArray = hexToIntArray(key);
    keyArray = expandKey(keyArray);

    // For each block in the CT
    for (block = 1; block <= numBlocks; block++) {
        console.log("");
        console.log("Block #" + block);
        console.log("========");

        // Get a block of the ciphertext and convert to array of integers
        CTblock = CT.substr((block - 1) * charsPerBlock, charsPerBlock);
        CTArray = hexToIntArray(CTblock);
        console.log("CT" + block + ":" + intToHexArray(CTArray));

        // AES-128 has 10 rounds
        for (round = 10; round > 0; round--) {
            console.log("");
            console.log("Round #" + round);
            console.log("=========");

            // initial round - addRoundKey (XOR)
            console.log("Key:" + intToHexArray(getKey(keyArray, round)));
            if (round != 10) {
                output = addRoundKey(getKey(keyArray, round), output);
            } else {
                output = addRoundKey(getKey(keyArray, round), CTArray);
            }
            console.log("Ark:" + intToHexArray(output));

            // mixMatrix, expect in the 10th round
            if (round != 10) {
                // mixMatrix
                output = inverseMixMatrix(output);
                console.log("Mix:" + intToHexArray(output));
            }

            // shiftRows
            output = inverseShiftRows(output);
            console.log("Shf:" + intToHexArray(output));

            // subBytes
            output = inverseSubBytes(output);
            console.log("Sub:" + intToHexArray(output));
        }

        // addRoundKey
        console.log("Key:" + intToHexArray(getKey(keyArray, 0)));
        output = addRoundKey(getKey(keyArray, 0), output);

        for (j = 0; j < 16; j++) {
            PT.push(output[j]);
        }
        console.log(" PT:" + intToHexArray(PT));
    }
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

var testKey = "E8E9EAEBEDEEEFF0F2F3F4F5F7F8F9FA";
var testPT  = "014BAF2278A69D331D5180103643E99A";

console.log(hexToAscii("05e384738657007cdd4520a473c3f201"));

AESCBC_Encrypt(testKey, testPT);

var q1CBCKey = "140b41b22a29beb4061bda66b6747e14"; // 32 chars * 4 bits = 128 bits key
var q1CBCCT  = "4ca00ff4c898d61e1edbf1800618fb2828a226d160dad07883d04e008a7897ee2e4b7465d5290d0c0e6c6822236e1daafb94ffe0c5da05d9476be028ad7c1d81";

//AESCBC_Decrypt(q1CBCKey, q1CBCCT);

var q2CBCKey = "140b41b22a29beb4061bda66b6747e14"; // 128 bits key
var q2CBCCT = "5b68629feb8606f9a6667670b75b38a5b4832d0f26e1ab7da33249de7d4afc48e713ac646ace36e872ad5fb8a512428a6e21364b0c374df45503473c5242a253";

//console.log(AESCBC_Decrypt(q2CBCKey, q2CBCCT));

var q3CTRKey = "36f18357be4dbd77f050515c73fcf9f2"; // 128 bits key
var q3CTRCT = "69dda8455c7dd4254bf353b773304eec0ec7702330098ce7f7520d1cbbb20fc388d1b0adb5054dbd7370849dbf0b88d393f252e764f1f5f7ad97ef79d59ce29f5f51eeca32eabedd9afa9329";

//console.log(AESCTR_Decrypt(q3CTRKey, q3CTRCT));

var q4CTRKey = "36f18357be4dbd77f050515c73fcf9f2"; // 128 bits key
var q4CTRCT = "770b80259ec33beb2561358a9f2dc617e46218c0a53cbeca695ae45faa8952aa0e311bde9d4e01726d3184c34451";

//console.log(AESCTR_Decrypt(q4CTRKey, q4CTRCT));
