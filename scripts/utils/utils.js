(function () {

function defineFunction(obj, funct) {
    if (obj.prototype.hasOwnProperty(funct.name)) {
        console.warn("WARNING: PREDEFINED PROPERTY POSSIBLY OVERWRITTEN: " + obj.name + ": " + funct.name);
    }
    
    Object.defineProperty(obj.prototype, funct.name, { value: funct });
}

defineFunction(String, function prepad(length, character) {
    character = character || " ";
    
    var str = this; // This performs a deep copy.
    
    while (str.length < length)
        str = character + str;
    
    return str;
});

defineFunction(String, function pad(length, character) {
    character = character || " ";
    
    var str = this; // This performs a deep copy.
    
    while (str.length < length)
        str += character;
    
    return str;
});

defineFunction(Number, function toHex(prepadding) {
    prepadding = prepadding || 0;
    return this.toString(16).toUpperCase().prepad(prepadding, '0');
});

/**
 * Converts the given integer to the two's complement representation.
 * 
 * For e.g. 0xF7 is -9 represented in two's complement using 1 byte.
 * 
 * (JavaScript's numbers are 64 bits until a bitwise operator is used on them, then they are
 *  converted to 32 bits).
 * 
 * let x = -9, and n = 8 bits
 * 
 * -x    = 0000 0000 0000 0000 0000 0000 0000 1001
 *       -                                       1 (subtract 1)
 *       = 0000 0000 0000 0000 0000 0000 0000 1000 
 *       | 1111 1111 1111 1111 1111 1111 0000 0000 (| with ~(2^n - 1))
 *       = 1111 1111 1111 1111 1111 1111 0000 1000 
 * ~x    = 0000 0000 0000 0000 0000 0000 1111 0111 = 0xF7  
 * 
 * @param {Number} integer the integer to convert
 * @param {Number} numberBytes the number of bytes representing the number (defaults to 1 if not
 *     specified)
 */
defineFunction(Number, function toTwosComplement(numberBytes) {
    var integer = this;
    
    if (integer % 1 !== 0) {
        return;
    }
    
    var numberBits = (numberBytes || 1) * 8;
    
    // Ensure it's in range given the number of bits
    if (integer < (-(1 << (numberBits - 1))) || integer > ((1 << (numberBits - 1)) - 1))
        throw "Integer out of range given " + numberBytes + " byte(s) to represent.";
    
    // If positive, return the positive value
    if (integer >= 0)
        return integer;
        
    // Else negative, convert to two's complement representation
    return ~(((-integer) - 1) | ~((1 << numberBits) - 1));
});

/**
 * Converts the given two's complement representation to the represented integer.
 * 
 * For e.g. 0xF7 is -9 represented in two's complement using 1 byte.
 * 
 * (JavaScript's numbers are 64 bits until a bitwise operator is used on them, then they are
 *  converted to 32 bits).
 * 
 * let x = 0xF7, and n = 8 bits
 * 
 * x     = 0000 0000 0000 0000 0000 0000 1111 0111
 * ~x    = 1111 1111 1111 1111 1111 1111 0000 1000
 *       & 0000 0000 0000 0000 0000 0000 1111 1111  (mask with 2^n - 1)
 *       = 0000 0000 0000 0000 0000 0000 0000 1000
 *       +                                       1  (add 1)
 *       = 0000 0000 0000 0000 0000 0000 0000 1001
 * 
 * This gives 9, then return the negation.  
 * 
 * @param {Number} twosComplement the two's complement representation
 * @param {Object} numberBytes the number of bytes representing the number (defaults to 1 if not
 *     specified)
 *
 * @return {Number} the represented integer
 */
defineFunction(Number, function fromTwosComplement(numberBytes) {
    var twosComplement = this;
    var numberBits = (numberBytes || 1) * 8;
    
    if (twosComplement < 0 || twosComplement > (1 << numberBits) - 1)
        throw "Two's complement out of range given " + numberBytes + " byte(s) to represent.";
    
    // If less than the maximum positive: 2^(n-1)-1, the number stays positive
    if (twosComplement <= (1 << (numberBits - 1)) - 1)
        return twosComplement;
    
    // Else convert to it's negative representation
    return -(((~twosComplement) & ((1 << numberBits) - 1)) + 1);
});

})();


function bidirectional(obj) {
    for (var key in obj) {
        obj[obj[key]] = key;
    }
    
    return obj;
}

function numbered(obj, start) {
    var id = 0;
    if (start)
        id = start;
        
    for (var key in obj) {
        obj[key] = id++;
    }
    
    return obj;
}

/**
 * Returns true if the specified object is a instance of the specified class.
 * 
 * @param {Object} obj the object to test
 * @param {Object} theClass the class to test the object against
 * 
 * @return {Boolean} true if the object is a instance of the class, false otherwise
 */
function is(obj, theClass) {
    return obj.constructor === theClass;
}

/**
 * Converts the given integer to the two's complement representation.
 * 
 * For e.g. 0xF7 is -9 represented in two's complement using 1 byte.
 * 
 * (JavaScript's numbers are 64 bits until a bitwise operator is used on them, then they are
 *  converted to 32 bits).
 * 
 * let x = -9, and n = 8 bits
 * 
 * -x    = 0000 0000 0000 0000 0000 0000 0000 1001
 *       -                                       1 (subtract 1)
 *       = 0000 0000 0000 0000 0000 0000 0000 1000 
 *       | 1111 1111 1111 1111 1111 1111 0000 0000 (| with ~(2^n - 1))
 *       = 1111 1111 1111 1111 1111 1111 0000 1000 
 * ~x    = 0000 0000 0000 0000 0000 0000 1111 0111 = 0xF7  
 * 
 * @param {Number} integer the integer to convert
 * @param {Number} numberBytes the number of bytes representing the number (defaults to 1 if not
 *     specified)
 */
function toTwosComplement(integer, numberBytes) 
{    
    var numberBits = (numberBytes || 1) * 8;
    
    // Ensure it's in range given the number of bits
    if (integer < (-(1 << (numberBits - 1))) || integer > ((1 << (numberBits - 1)) - 1))
        throw "Integer out of range given " + numberBytes + " byte(s) to represent.";
    
    // If positive, return the positive value
    if (integer >= 0)
        return integer;
        
    // Else negative, convert to two's complement representation
    return ~(((-integer) - 1) | ~((1 << numberBits) - 1));
}

/**
 * Converts the given two's complement representation to the represented integer.
 * 
 * For e.g. 0xF7 is -9 represented in two's complement using 1 byte.
 * 
 * (JavaScript's numbers are 64 bits until a bitwise operator is used on them, then they are
 *  converted to 32 bits).
 * 
 * let x = 0xF7, and n = 8 bits
 * 
 * x     = 0000 0000 0000 0000 0000 0000 1111 0111
 * ~x    = 1111 1111 1111 1111 1111 1111 0000 1000
 *       & 0000 0000 0000 0000 0000 0000 1111 1111  (mask with 2^n - 1)
 *       = 0000 0000 0000 0000 0000 0000 0000 1000
 *       +                                       1  (add 1)
 *       = 0000 0000 0000 0000 0000 0000 0000 1001
 * 
 * This gives 9, then return the negation.  
 * 
 * @param {Number} twosComplement the two's complement representation
 * @param {Object} numberBytes the number of bytes representing the number (defaults to 1 if not
 *     specified)
 *
 * @return {Number} the represented integer
 */
function fromTwosComplement(twosComplement, numberBytes) 
{   
    var numberBits = (numberBytes || 1) * 8;
    
    if (twosComplement < 0 || twosComplement > (1 << numberBits) - 1)
        throw "Two's complement out of range given " + numberBytes + " byte(s) to represent.";
    
    // If less than the maximum positive: 2^(n-1)-1, the number stays positive
    if (twosComplement <= (1 << (numberBits - 1)) - 1)
        return twosComplement;
    
    // Else convert to it's negative representation
    return -(((~twosComplement) & ((1 << numberBits) - 1)) + 1);
}

$.fn.center = function () {
    this.wrap('<div></div>');
    var $div = this.parent();
    
    $div.css({
        width: '100%',
        height: '100%',
        'text-align': 'center'
    });
    
    this.css({
        position: 'relative',
        margin: 'auto',
        top: $div.height() / 2 - this.height() / 2
    }).children().css({
        margin: 'auto'
    });
    
    return this;
};

$.fn.loader = function () {
    this.html('<div class="loader"></div>');
    $('div', this).center();
}
