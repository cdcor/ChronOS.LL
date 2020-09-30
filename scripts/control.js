
$(document).ready(function() {
    Control.init();
});

function Control() {}

Control.init = function () {
    Source.init();
    
    TokenStreamDisplay.init();
    SyntaxTreeDisplay.init();
    SymbolTableDisplay.init();
    OutputDisplay.init();
    EasterEgg.init();
    
    $('#compileButton').click(Compiler.compile);
};