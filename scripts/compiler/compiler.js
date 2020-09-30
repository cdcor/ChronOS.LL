
(function () {

/**
 * The Compiler.
 */
function Compiler() {}

/**
 * Compiles! 
 */
Compiler.compile = function () {
    // Initialize defaults, in case something fails (in the source code, not the compiler code of course).
    console.log("------"); // Separate console output between compile, to differentiate possible errors.
    
    Compiler.sourceCode = Source.code.getValue();
    Compiler.tokenStream = [];
    Compiler.symbolTable = new SymbolTable();
    
    Compiler.cst = new CST();
    
    Compiler.code = '';
    
    Compiler.problems = [];
    
    Compiler.verboseOutput = $('#verbose').is(':checked');
    
    // Clear displays
    TokenStreamDisplay.clear();
    SyntaxTreeDisplay.clear();
    SymbolTableDisplay.clear();
    OutputDisplay.clear();
    
    // Compile - Perform all possible points of error inside the try block. If an error occurs,
    //   the compiler throws an exception, which immediately brings the program back to this point.
    //   This is the easiest way I could think of to get out of the parser and tree traversals 
    //   (in particular) if there's an error.
    try {
        Lexer.analyze();
        OutputDisplay.add('Lex completed successfully.', 1);
        
        Parser.parse();
        OutputDisplay.add('Parse completed successfully.', 1);
        
        Compiler.ast = new AST(Compiler.cst);
        
        SyntaxTreeDisplay.setCst(Compiler.cst);
        SyntaxTreeDisplay.setAst(Compiler.ast);
        
        SemanticAnalyzer.analyze();
        OutputDisplay.add('Semantic Analysis completed successfully.', 1);
        
        CodeGenerator.generate();
        
        OutputDisplay.addCode(Compiler.code);
        console.log(Compiler.code);
        
        if (Compiler.sourceCode.search(/print\(.*?the best of both worlds.*?\)/i) !== -1) {
            EasterEgg.animate();
            OutputDisplay.add('');
            OutputDisplay.add("'Resistance is futile.'");
        }
    } catch (e) {
        if (e === 'compiler-error') {
            // An error compiling.
            console.log(e);
        } else {
            // The compiler screwed up somewhere.
            throw e;
        }
    }
    
    // This is outside try block because it handles both errors and successes.
    TokenStreamDisplay.set(Compiler.tokenStream);
    SymbolTableDisplay.set(Compiler.symbolTable);
    
    // Show the problems.
    OutputDisplay.add('');
    
    for (var i = 0; i < Compiler.problems.length; i++) {
        OutputDisplay.add(Compiler.problems[i].toString());
    }
};

/**
 * Sends a message to the output console if the compiler is in verbose mode.
 * 
 * @param {String} message the message to send
 * @param {Number} the line number the message refers to 
 */
Compiler.trace = function (message, line) {
    if (Compiler.verboseOutput) {
        line = line ? line.toString() : '';
        OutputDisplay.add(line.prepad(3) + ' ' + message);
    }
};

/**
 * Adds a warning to the compiler output.
 * 
 * @param {String} message the warning message
 * @param {Number} the line number the warning refers to 
 */
Compiler.addWarning = function (message, line) {
    Compiler.problems.push(new Problem(Problem.types.WARNING, message, line));
};

/**
 * Adds an error to the compiler output and throws an exception to stop compiling process.
 * 
 * @param {String} message the error message
 * @param {Number} the line number the error refers to 
 */
Compiler.addError = function (message, line) {
    Compiler.problems.push(new Problem(Problem.types.ERROR, message, line));
    throw 'compiler-error';
};

/**
 * Creates a new Problem, a general object encapsulating both errors and warnings. 
 * 
 * @param {Number} type the type of proble, specified by Problem.types.<TYPE>
 * @param {String} message the message associated with the problem
 * @param {Number} line the line number the problem refers to in the source code
 */
function Problem(type, message, line) {
    if (type === undefined)
        type = -1;
    if (message === undefined)
        message = '';
    if (line === undefined)
        line = -1;
    
    this.type = type;
    this.message = message;
    this.line = line;
}

/**
 * Returns a string representation of this problem.
 * 
 * @return {String} a string representation of this problem
 */
Problem.prototype.toString = function () {
    return 'Line ' + this.line.toString().prepad(3) + ' ' + Problem.types[this.type].prepad(8) + ' ' + 
           this.message;
};

/**
 * Possible types of problems. 
 */
Problem.types = bidirectional(numbered({
    HINT: 0,
    WARNING: 0,
    ERROR: 0
}));

// Make available globally.
window.Compiler = Compiler;
window.Problem = Problem;

})();
