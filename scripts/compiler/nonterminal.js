
(function () {
    
/**
 * Creates a new nonterminal.
 * 
 * @param {Number} kind the kind of nonterminal, usually specified by Nonterminal.kinds.<KIND>
 */
function Nonterminal(kind, line) {
    this.kind = kind === undefined ? -1 : kind;
    this.line = line === undefined ? -1 : line;
}

/**
 * Returns true if the nonterminal is of the specified kind. 
 * 
 * @param {Number} kind the kind to test, usually specified by Nonterminal.kinds.<KIND>
 * 
 * @return {Boolean} true if the nonterminal is of the specified kind, false otherwise
 */
Nonterminal.prototype.is = function (kind) {
    return this.kind === kind;
};

/**
 * Returns the name of the nonterminal (for error and status reporting).
 * 
 * @return {String} the name of the nonterminal
 */
Nonterminal.prototype.name = function () {
    return Nonterminal.nameOf(this.kind);
};

/**
 * Returns a string representation of this nonterminal.
 * 
 * @return {String} a string representation of this nonterminal 
 */
Nonterminal.prototype.toString = function () {
    return this.name();
};

/**
 * Creates a new nonterminal given it's name. Throws an exception if the name specifies a
 * nonexistent nonterminal.
 * 
 * @param {String} name the nonterminal's name
 * 
 * @return {Nonterminal} the nonterminal 
 */
Nonterminal.create = function (name, line) {
    try {
        var nonterminal = _nonterminals[name]();
        nonterminal.line = line;
        return nonterminal;
    } catch (e) {
        throw "No such nonterminal: '" + name + "'";
    }
};

var _nonterminals = {
    // CST
    'program'       : function () { return new Nonterminal(Nonterminal.kinds.PROGRAM); },
    'statement'     : function () { return new Nonterminal(Nonterminal.kinds.STATEMENT); },
    'statementList' : function () { return new Nonterminal(Nonterminal.kinds.STATEMENT_LIST); },
    'expr'          : function () { return new Nonterminal(Nonterminal.kinds.EXPR); },
    'intExpr'       : function () { return new Nonterminal(Nonterminal.kinds.INT_EXPR); },
    'stringExpr'    : function () { return new Nonterminal(Nonterminal.kinds.STRING_EXPR); },
    'booleanExpr'   : function () { return new Nonterminal(Nonterminal.kinds.BOOLEAN_EXPR); },
    'charList'      : function () { return new Nonterminal(Nonterminal.kinds.CHAR_LIST); },
    'varDecl'       : function () { return new Nonterminal(Nonterminal.kinds.VAR_DECL); },
    'type'          : function () { return new Nonterminal(Nonterminal.kinds.TYPE); },
    'id'            : function () { return new Nonterminal(Nonterminal.kinds.ID); },
    'char'          : function () { return new Nonterminal(Nonterminal.kinds.CHAR); },
    'space'         : function () { return new Nonterminal(Nonterminal.kinds.SPACE); },
    'digit'         : function () { return new Nonterminal(Nonterminal.kinds.DIGIT); },
    'boolean'       : function () { return new Nonterminal(Nonterminal.kinds.BOOLEAN); },
    'op'            : function () { return new Nonterminal(Nonterminal.kinds.OP); },
    
    // AST - Creating a separate object for this may be more clear, but they serve the same purpose...
    'block'       : function () { return new Nonterminal(Nonterminal.kinds.BLOCK); },
    '{'           : function () { return new Nonterminal(Nonterminal.kinds.BLOCK); },
    'while'       : function () { return new Nonterminal(Nonterminal.kinds.WHILE); },
    'if'          : function () { return new Nonterminal(Nonterminal.kinds.IF); },
    'declaration' : function () { return new Nonterminal(Nonterminal.kinds.DECLARATION); },
    'assignment'  : function () { return new Nonterminal(Nonterminal.kinds.ASSIGNMENT); },
    '='           : function () { return new Nonterminal(Nonterminal.kinds.ASSIGNMENT); },
    'string'      : function () { return new Nonterminal(Nonterminal.kinds.STRING); },
    '"'           : function () { return new Nonterminal(Nonterminal.kinds.STRING); },
    'print'       : function () { return new Nonterminal(Nonterminal.kinds.PRINT); },
    'add'         : function () { return new Nonterminal(Nonterminal.kinds.ADD); },
    '+'           : function () { return new Nonterminal(Nonterminal.kinds.ADD); },
    'subtract'    : function () { return new Nonterminal(Nonterminal.kinds.SUBTRACT); },
    '-'           : function () { return new Nonterminal(Nonterminal.kinds.SUBTRACT); },
    'equal'       : function () { return new Nonterminal(Nonterminal.kinds.EQUAL); },
    '=='          : function () { return new Nonterminal(Nonterminal.kinds.EQUAL); }
};

/**
 * An object defining the kinds of nonterminals.
 */
Nonterminal.kinds = bidirectional(numbered({
    // CST
    PROGRAM: 0,
    STATEMENT: 0,
    STATEMENT_LIST: 0,
    EXPR: 0,
    INT_EXPR: 0,
    STRING_EXPR: 0,
    BOOLEAN_EXPR: 0,
    CHAR_LIST: 0,
    VAR_DECL: 0,
    TYPE: 0,
    ID: 0,
    CHAR: 0,
    SPACE: 0,
    DIGIT: 0,
    BOOLEAN: 0,
    OP: 0,
    
    // AST
    BLOCK: 0,
    WHILE: 0,
    IF: 0,
    DECLARATION: 0,
    ASSIGNMENT: 0,
    STRING: 0,
    PRINT: 0,
    ADD: 0,
    SUBTRACT: 0,
    EQUAL: 0
}, 100)); // Apply ID offset so that comparisons to Tokens are not mixed

/**
 * Returns the name of the nonterimal given its kind (for error and status reporting), as well as
 * drawing the syntax trees.
 * 
 * @param {Number} kind the kind of nonterminal, usually specified by Nonterminal.kinds.<KIND>
 */
Nonterminal.nameOf = function (kind) {
    switch (kind) {
        // CST
        case Nonterminal.kinds.PROGRAM:        return '<Program>';
        case Nonterminal.kinds.STATEMENT:      return '<Stmt>';
        case Nonterminal.kinds.STATEMENT_LIST: return '<StmtList>';
        case Nonterminal.kinds.EXPR:           return '<Expr>';
        case Nonterminal.kinds.INT_EXPR:       return '<IntExpr>';
        case Nonterminal.kinds.STRING_EXPR:    return '<StringExpr>';
        case Nonterminal.kinds.BOOLEAN_EXPR:   return '<BoolExpr>';
        case Nonterminal.kinds.CHAR_LIST:      return '<CharList>';
        case Nonterminal.kinds.VAR_DECL:       return '<VarDecl>';
        case Nonterminal.kinds.TYPE:           return '<Type>';
        case Nonterminal.kinds.ID:             return '<Id>';
        case Nonterminal.kinds.CHAR:           return '<Char>';
        case Nonterminal.kinds.SPACE:          return '<Space>';
        case Nonterminal.kinds.DIGIT:          return '<Digit>';
        case Nonterminal.kinds.BOOLEAN:        return '<Bool>';
        case Nonterminal.kinds.OP:             return '<Op>';
        
        // AST (meta-symbol nodes)
        case Nonterminal.kinds.BLOCK:          return '{}';
        case Nonterminal.kinds.WHILE:          return 'while';
        case Nonterminal.kinds.IF:             return 'if';
        case Nonterminal.kinds.DECLARATION:    return 'decl';
        case Nonterminal.kinds.ASSIGNMENT:     return '=';
        case Nonterminal.kinds.STRING:         return 'string';
        case Nonterminal.kinds.PRINT:          return 'print';
        case Nonterminal.kinds.ADD:            return '+';
        case Nonterminal.kinds.SUBTRACT:       return '-';
        case Nonterminal.kinds.EQUAL:          return '==';
        
        default:                               return '<>';
    }
}

window.Nonterminal = Nonterminal;

})();
