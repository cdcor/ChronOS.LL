
(function () {

/**
 * Creates a new Token.
 *  
 * @param {Number} kind the kind of token, usually specified by Token.kinds.<KIND>
 * @param {Object} value the value of the token
 * @param {Number} line the line number the token's located on in the source code
 */
function Token(kind, value, line) {
    this.kind = kind === undefined ? -1 : kind;
    this.value = value === undefined ? null : value;
    this.line = line === undefined ? -1 : line + 1; // IDE window counts starting at 1.
    this.symbol = null; // Used by semantic analysis to reference the symbol if this token is an ID.
}

/**
 * Returns true if the token is of the specified kind. 
 * 
 * @param {Number} kind the kind to test, usually specified by Token.kinds.<KIND>
 * 
 * @return {Boolean} true if the token is of the specified kind, false otherwise
 */
Token.prototype.is = function (kind) {
    return this.kind === kind;
};

/**
 * Returns the name of the token (for error and status reporting).
 * 
 * @return {String} the name of the token
 */
Token.prototype.name = function () {
    return Token.nameOf(this.kind) + " '" + this.value + "'";
};

/**
 * Logs the attributes defining this token to the console. 
 */
Token.prototype.print = function () {
    console.log(this.line.toString().prepad(5) + ': ' + Token.kinds[this.kind].prepad(15) +
                ' ' + this.value.toString());
};

/**
 * Returns a string representation of this token. Returns just the value as this function is used
 * in syntax tree construction.
 * 
 * @return {String} a string representation of this token 
 */
Token.prototype.toString = function () {
    return this.value;
};

/**
 * An object defining the kinds of tokens. 
 * 
 * "numbered" will assign a unique numbered identifier to each for fast comparisons. "bidirectional"
 * will allow the programmer to look up the name of a token by its identifier.
 */
Token.kinds = bidirectional(numbered({
    // "Symbols"
    EOF_SIGN: 0,
    OPEN_BRACE: 0,
    CLOSE_BRACE: 0,
    OPEN_PAREN: 0,
    CLOSE_PAREN: 0,
    EQUALS: 0,
    OP: 0,
    QUOTE: 0,
    DOUBLE_EQUALS: 0,
    
    // Reserved words
    TYPE: 0,
    PRINT: 0,
    WHILE: 0,
    IF: 0,
    
    // Values
    DIGIT: 0,
    CHAR: 0,
    BOOLEAN: 0,
    SPACE: 0,
    ID: 0,
    
    EPSILON: 0 // User cannot enter this, the parser does it.
}));

/**
 * Returns the name of the token given its kind (for error and status reporting).
 * 
 * @param {Number} kind the kind of token, usually specified by Token.kinds.<KIND>
 */
Token.nameOf = function (kind) {
    switch (kind) {
        case Token.kinds.EOF_SIGN:      return "end of file";
        case Token.kinds.OPEN_BRACE:    return "opening brace";
        case Token.kinds.CLOSE_BRACE:   return "closing brace";
        case Token.kinds.OPEN_PAREN:    return "opening parenthesis";
        case Token.kinds.CLOSE_PAREN:   return "closing parenthesis";
        case Token.kinds.EQUALS:        return "equals";
        case Token.kinds.OP:            return "operator";
        case Token.kinds.QUOTE:         return "quotation";
        case Token.kinds.DOUBLE_EQUALS: return "double-equals";
            
        case Token.kinds.TYPE:          return "type";
        case Token.kinds.PRINT:         return "print";
        case Token.kinds.WHILE:         return "while";
        case Token.kinds.IF:            return "if";
        
        case Token.kinds.DIGIT:         return "digit";
        case Token.kinds.CHAR:          return "character";
        case Token.kinds.BOOLEAN:       return "boolean";
        case Token.kinds.SPACE:         return "space";
        case Token.kinds.ID:            return "indentifier";
        
        case Token.kinds.EPSILON:       return "epsilon";
        default:                        return "token";
    }
};

/**
 * Prints the given array of tokens to the console.
 *  
 * @param {Array} tokens the tokens to print
 */
Token.printTokens = function (tokens) {
    if ($.isArray(tokens)) {
        for (var i = 0; i < tokens.length; i++) {
            tokens[i].print();
        }
    }
};

// Make available globally.
window.Token = Token;

})();
