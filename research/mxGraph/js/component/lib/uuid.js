/*
 * UUID-js: A js library to generate and parse UUIDs, TimeUUIDs and generate
 * TimeUUID based on dates for range selections.
 * @see http://www.ietf.org/rfc/rfc4122.txt
 **/

function UUIDjs() {
}
;

UUIDjs.maxFromBits = function(bits) {
    return Math.pow(2, bits);
};

UUIDjs.limitUI04 = UUIDjs.maxFromBits(4);
UUIDjs.limitUI06 = UUIDjs.maxFromBits(6);
UUIDjs.limitUI08 = UUIDjs.maxFromBits(8);
UUIDjs.limitUI12 = UUIDjs.maxFromBits(12);
UUIDjs.limitUI14 = UUIDjs.maxFromBits(14);
UUIDjs.limitUI16 = UUIDjs.maxFromBits(16);
UUIDjs.limitUI32 = UUIDjs.maxFromBits(32);
UUIDjs.limitUI40 = UUIDjs.maxFromBits(40);
UUIDjs.limitUI48 = UUIDjs.maxFromBits(48);

UUIDjs.randomUI04 = function() {
    return Math.round(Math.random() * UUIDjs.limitUI04);
};
UUIDjs.randomUI06 = function() {
    return Math.round(Math.random() * UUIDjs.limitUI06);
};
UUIDjs.randomUI08 = function() {
    return Math.round(Math.random() * UUIDjs.limitUI08);
};
UUIDjs.randomUI12 = function() {
    return Math.round(Math.random() * UUIDjs.limitUI12);
};
UUIDjs.randomUI14 = function() {
    return Math.round(Math.random() * UUIDjs.limitUI14);
};
UUIDjs.randomUI16 = function() {
    return Math.round(Math.random() * UUIDjs.limitUI16);
};
UUIDjs.randomUI32 = function() {
    return Math.round(Math.random() * UUIDjs.limitUI32);
};
UUIDjs.randomUI40 = function() {
    return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 40 - 30)) * (1 << 30);
};
UUIDjs.randomUI48 = function() {
    return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30);
};

UUIDjs.paddedString = function(string, length, z) {
    string = String(string);
    z = (!z) ? '0' : z;
    var i = length - string.length;
    for (; i > 0; i >>>= 1, z += z) {
        if (i & 1) {
            string = z + string;
        }
    }
    return string;
};

UUIDjs.prototype.fromParts = function(timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node) {
    this.version = (timeHiAndVersion >> 12) & 0xF;
    this.hex = UUIDjs.paddedString(timeLow.toString(16), 8)
            + UUIDjs.paddedString(timeMid.toString(16), 4)
            + UUIDjs.paddedString(timeHiAndVersion.toString(16), 4)
            + UUIDjs.paddedString(clockSeqHiAndReserved.toString(16), 2)
            + UUIDjs.paddedString(clockSeqLow.toString(16), 2)
            + UUIDjs.paddedString(node.toString(16), 11);
    return this;
};


UUIDjs.create = function() {
    return "A" + (new UUIDjs().fromParts(
            UUIDjs.randomUI32(),
            UUIDjs.randomUI16(),
            0x4000 | UUIDjs.randomUI12(),
            0x80 | UUIDjs.randomUI06(),
            UUIDjs.randomUI08(),
            UUIDjs.randomUI48()
            ).hex);
};