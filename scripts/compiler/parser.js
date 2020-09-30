
(function () {
    
var _tokens;
var _currentToken;
var _nextToken;
var _index;

var _cst;

/**
 * The Parser (a.k.a. Syntactic Analyzer).
 */
function Parser() {}

/**
 * Parses the given token stream.
 * 
 * @param {String} tokens (optional) the token stream to parse. If not specified, gets the current
 *     token stream set in the compiler.
 */
Parser.parse = function (tokens) {
    if (tokens) {
        _tokens = tokens;
    } else {
        _tokens = Compiler.tokenStream;
    }
    
    _index = 0;
    
    _currentToken = _tokens[_index++];
    _nextToken = _tokens[_index];
    
    _cst = new CST();
    
    parse(program);
    
    Compiler.cst = _cst;
};

/**
 * Parses following the given production function and any arguments to pass to it. Calling this and
 * passing the production allows any operations that should be done prior to and after parsing to
 * be done once, rather than in each production (such as CST construction).
 * 
 * @param {Object} production the production function to parse
 * @param {Object} args (optional) any arguments to pass to the production 
 */
function parse(production, args) {
    _cst.descend(Nonterminal.create(production.name));
    
    production(args);
    
    _cst.ascend();
}

// ---------- Productions ----------

/**
 * 
 * <Program> ::== <Statement> 
 */
function program() {
    parse(statement);
    //matchToken(Token.kinds.EOF_SIGN); // Not necessary to keep this in the tree.
}

/**
 * 
 * <Statement> ::== P ( <Expr> )
 *             ::== <Id> = <Expr>
 *             ::== <VarDecl>
 *             ::== { <StatementList> }
 *             ::== while <BooleanExpr> { <StatementList> }
 *             ::== if <BooleanExpr> { <StatementList> }
 */
function statement() {
    if (_currentToken.is(Token.kinds.PRINT)) {
        trace("Found 'P', parsing 'P ( <Expr> )'");
        // P ( <Expr> )
        matchToken(Token.kinds.PRINT);
        matchToken(Token.kinds.OPEN_PAREN);
        
        parse(expr);
        matchToken(Token.kinds.CLOSE_PAREN);
        
    } else if (_currentToken.is(Token.kinds.ID)) {
        trace('Found ' + _currentToken.name() + ", parsing '<Id> = <Expr>'");
        // <Id> = <Expr>
        parse(id);
        matchToken(Token.kinds.EQUALS);
        parse(expr);
    
    } else if (_currentToken.is(Token.kinds.TYPE)) {
        trace('Found ' + _currentToken.name() + ", parsing '<VarDecl>'");
        // <VarDecl>
        parse(varDecl);
    
    } else if (_currentToken.is(Token.kinds.OPEN_BRACE)) {
        trace('Found ' + _currentToken.name() + ", parsing '{ <StmtList> }'");
        // { <StatementList> }
        matchToken(Token.kinds.OPEN_BRACE);
        parse(statementList);
        matchToken(Token.kinds.CLOSE_BRACE);
    } else if (_currentToken.is(Token.kinds.WHILE)) {
        trace('Found ' + _currentToken.name() + ", parsing 'while <BoolExpr> { <StmtList> }'");
        // while <BooleanExpr> { <StatementList> }
        matchToken(Token.kinds.WHILE);
        parse(booleanExpr);
        matchToken(Token.kinds.OPEN_BRACE);
        parse(statementList);
        matchToken(Token.kinds.CLOSE_BRACE);
    } else if (_currentToken.is(Token.kinds.IF)) {
        trace('Found ' + _currentToken.name() + ", parsing 'if <BoolExpr> { <StmtList> }'");
        // if <BooleanExpr> { <StatementList> }
        matchToken(Token.kinds.IF);
        parse(booleanExpr);
        matchToken(Token.kinds.OPEN_BRACE);
        parse(statementList);
        matchToken(Token.kinds.CLOSE_BRACE);
    } else {
        trace('Invalid statement starting with ' + _currentToken.name());
        Compiler.addError('Invalid statement starting with ' + _currentToken.name(), _currentToken.line);
    }
}

/**
 * 
 * <StatementList> ::== <Statement> <StatementList>
 *                 ::== e
 */
function statementList() {
    // Closing brace signals end of statement list.
    if (!_currentToken.is(Token.kinds.CLOSE_BRACE)) {
        trace('Did not find ' + Token.nameOf(Token.kinds.CLOSE_BRACE) + ", parsing '<Statement> <StatementList>'");
        parse(statement);
        parse(statementList);
    } else {
        trace('Found ' + _currentToken.name() + ", end of '<StatementList>'");
        _cst.add(new Token(Token.kinds.EPSILON, '\u03B5')); // Epsilon
    }
}

/**
 * 
 *  <Expr> ::== <IntExpr>
 *         ::== <StringExpr>
 *         ::== <BooleanExpr>
 *         ::== <Id>        
 */
function expr() {
    if (_currentToken.is(Token.kinds.DIGIT)) {
        trace('Found ' + _currentToken.name() + ", parsing '<IntExpr>'");
        parse(intExpr);
    } else if (_currentToken.is(Token.kinds.QUOTE)) {
        trace('Found ' + _currentToken.name() + ", parsing '<CharExpr>'");
        parse(stringExpr);
    } else if (_currentToken.is(Token.kinds.ID)) {
        trace('Found ' + _currentToken.name() + ", parsing '<Id>'");
        parse(id);
    } else if (_currentToken.is(Token.kinds.OPEN_PAREN) || _currentToken.is(Token.kinds.BOOLEAN)) {
        trace('Found ' + _currentToken.name() + ", parsing '<BoolExpr>'");
        parse(booleanExpr);
    } else {
        trace("ERROR Invalid '<Expr>' starting with " + _currentToken.name());
        Compiler.addError("Invalid '<Expr>' starting with " + _currentToken.name(), _currentToken.line);
    }
}

/**
 * 
 * <IntExpr> ::== <digit> <op> <Expr>
 *           ::== <digit> 
 */
function intExpr() {
    // Parse the <digit>, as it's in both productions
    parse(digit);
    
    if (_currentToken.is(Token.kinds.OP)) {
        trace('Found ' + _currentToken.name() + ", parsing '<Op> <Expr>'");
        // <digit> <op> <Expr>
        parse(op);
        parse(expr);
    }
}

/**
 * 
 * <StringExpr> ::== " <CharList> " 
 */
function stringExpr() {
    matchToken(Token.kinds.QUOTE);
    parse(charList);
    matchToken(Token.kinds.QUOTE);
}

/**
 * 
 * <BooleanExpr> ::== ( <Expr> == <Expr> ) 
 *               ::== <Boolean>
 */
function booleanExpr() {
    if (_currentToken.is(Token.kinds.OPEN_PAREN)) {
        trace('Found ' + _currentToken.name() + ", parsing '( <Expr> == <Expr> )'");
        // ( <Expr> == <Expr> )
        matchToken(Token.kinds.OPEN_PAREN);
        parse(expr);
        matchToken(Token.kinds.DOUBLE_EQUALS);
        parse(expr);
        matchToken(Token.kinds.CLOSE_PAREN);
    } else if (_currentToken.is(Token.kinds.BOOLEAN)) {
        trace('Found ' + _currentToken.name() + ", parsing '<Boolean>'");
        // <Boolean>
        parse(boolean);
    } else {
        trace("ERROR Invalid '<BoolExpr>' starting with " + _currentToken.name());
        Compiler.addError("Invalid '<BoolExpr>' starting with " + _currentToken.name(), _currentToken.line);
    }
}

/**
 * 
 * <CharList> ::== <Char> <CharList>
 *            ::== e 
 */
function charList() {
    if (_currentToken.is(Token.kinds.CHAR)) {
        trace('Found ' + _currentToken.name() + ", parsing '<Char> <CharList>'");
        // <Char> <CharList>
        parse(char);
        parse(charList);
    } else if (_currentToken.is(Token.kinds.SPACE)) {
        trace('Found ' + _currentToken.name() + ", parsing '<Space> <CharList>'");
        parse(space);
        parse(charList);
    } else {
        trace('Found ' + _currentToken.name() + ", end of <CharList>");
        _cst.add(new Token(Token.kinds.EPSILON, '\u03B5')); // Epsilon
    }
}

/**
 * 
 * <VarDecl> ::== <Type> <Id>
 */
function varDecl() {
    var typeDecl = _currentToken.value;
    parse(type);
    parse(id, typeDecl);
}

/**
 * 
 * <Type> ::== int | string 
 */
function type() {
    matchToken(Token.kinds.TYPE);
}

/**
 * 
 * <Id> ::== <Char> 
 */
function id(type) {
    /* Symbol stuff here no longer valid due to scope.
    try {
        if (type) {
            // Came from <VarDecl>, set in symbol table.
            if (Compiler.symbolTable.symbols[_currentToken.value].type) {
                trace("ERROR Duplicate variable declaration: '" + type + ' ' + _currentToken.value + "'");
                Compiler.addError("Duplicate variable declaration: '" + type + ' ' + _currentToken.value + "'", _currentToken.line);
            } else {
                trace("Setting symbol '" + _currentToken.value + "' type to '" + type + "'");
                Compiler.symbolTable.symbols[_currentToken.value].type = type;
            }
        } else if (!Compiler.symbolTable.symbols[_currentToken.value].type) {
            // Variable is used before it's declared.
            trace("ERROR Variable is used before it is declared: '" + _currentToken.value + "'");
            Compiler.addError("Variable is used before it is declared: '" + _currentToken.value + "'", _currentToken.line);
        }
    } catch (e) {} // Invalid ID, match will catch error.
    */
    
    matchToken(Token.kinds.ID);
}

/**
 * 
 * <Char> ::== a | b | c | ... | z 
 */
function char() {
    matchToken(Token.kinds.CHAR);
}

/**
 *
 * <Space> ::== the space character
 */
function space() {
    matchToken(Token.kinds.SPACE);
}

/**
 * 
 * <Digit> ::== 1 | 2 | 3 | ... | 9 | 0
 */
function digit() {
    matchToken(Token.kinds.DIGIT);
}

/**
 * 
 * <Boolean> ::== false | true 
 */
function boolean() {
    matchToken(Token.kinds.BOOLEAN);
}

/**
 * 
 * <Op> ::== + | - 
 */
function op() {
    matchToken(Token.kinds.OP);
}

// ---------- Helper Functions ----------

/**
 * Matches and consumes the current token based on the specified kind. If the kind doesn't
 * match, an error is produced.
 * 
 * @param {Number} kind the kind of token or an array of accepted kinds.
 */
function matchToken(kind) {
    trace('Looking for ' + Token.nameOf(kind) + ' ...');
    
    if (_currentToken.is(kind)) {
        consumeToken();
    } else {
        trace('ERROR Found ' + _currentToken.name() + ', expected ' + Token.nameOf(kind));
        // No match, produce error stating expected kind.
        Compiler.addError("Found " + _currentToken.name() + ", expected " + Token.nameOf(kind),
                _currentToken.line);
    }
}

/**
 * Consumes the current token and iterates to the next, setting the _currentToken and 
 * _nextToken variables appropriately. 
 */
function consumeToken() {
    _cst.add(_currentToken);
    _currentToken = _tokens[_index++];
    _nextToken = _tokens[_index]; // If at the end, this will be undefined
}

/**
 * Prints a message to the compiler output. For verbose mode.
 *  
 * @param {String} message the message to print
 */
function trace(message) {
    Compiler.trace(message, _currentToken.line);
}


// Make available globally
window.Parser = Parser;

})();
