// Key schedule, see http://www.samiam.org/key-schedule.html

var expandKey = function (hex) {
    var key, c, rcon, t = [], i;

    // Convert key to array of integers
    key = hexToIntArray(hex);

    // Start with 1 key of 16 bytes and expand to 11 keys of 16 bytes (= 176 bytes)
    if (key.length != 16) {
        console.log("Cannot expand key. Only " + key.length + " chars.");
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

    var temp = intToHexArray(key);
    for (i = 0; i <= 16; i++) {
        if (i < 10) {
            console.log("Key0" + i + " = " + temp.substr(32*i, 32));
        } else {
            console.log("Key" + i + " = " + temp.substr(32*i, 32));
        }
    }

    if (key.length != 176) {
        console.log("Error in expandKey()");
    }

    return t;
};

