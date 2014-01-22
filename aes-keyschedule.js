// Key schedule, see http://www.samiam.org/key-schedule.html
// Verified on 22-jan-2014

var expandKey = function (key) {
    var c, rcon, t = [], i;

    // Start with 1 key of 16 bytes and expand to 11 keys of 16 bytes (= 176 bytes)
    if (key.length != 16) {
        console.log("Key is not 128 bytes, but " + key.length * 8 + "bytes. Required for AES-128.");
        return key;
    }

    // The first 16 bytes of the expanded key are simply the encryption key
    c = 16;

    // The rcon iteration value is set to 1
    rcon = 1;

    // Until we have 176 bytes of the expanded key, generate 16 more bytes of expanded key
    while (c < 176) {
        // Create a 4-byte temporary variable t
        // Assign the value of the previous 4 bytes in the temporary key to t
        for (i = 0; i < 4; i++) {
            t[i] = key[i + c - 4];
        }

        // Every four blocks (of four bytes) do a complex calculation
        if (c % 16 == 0) {
            // Perform scheduleCore on t, with rcon iteration value
            scheduleCore(t, rcon);

            // Increment rcon by one
            rcon++;
        }

        // XOR t with the four-byte block, 16 bytes before the new expanded key.
        // This becomes the next four bytes in the expanded key.
        for (i = 0; i < 4; i++) {
            key[c] = key[c - 16] ^ t[i];
            c++;
        }
    }

    if (key.length != 176) {
        console.log("Error in expandKey()");
    }

    return key;
};

var getKey = function (keyArray, round) {
    var key = [], i;

    if (keyArray.length != 11 * 16) {
        console.log("Wrong number of key. Expected 16 keys, " + keyArray.length / 16 + " counted.");
        return key;
    }

    for (i = 0; i < 16; i++) {
        key[i] = keyArray[i + 16 * round];
    }
    return key;
};

