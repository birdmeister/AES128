// Mix Column, see http://www.samiam.org/mix-column.html

var mixColumns = function (hex) {
    var sub = "";

    if (hex.length != charsPerBlock) {
        console.log("Cannot mix columns. Only " + hex.length + " chars.");
        return sub;
    }

    if (sub.length != charsPerBlock) {
        console.log("Error in mixColumns()");
    }

    return hex;
};

