
(function () {
    
var $symbolTable;

function SymbolTableDisplay() {}

SymbolTableDisplay.init = function () {
    $symbolTable = $('#symbolTable');
    
};

SymbolTableDisplay.set = function (symbolTable) {
    var symbols = symbolTable.getSymbols();
    
    if ($.isEmptyObject(symbols)) {
        $symbolTable.html('No symbols found.');
        return;
    }
    
    var html = '<table>';
    
    // Header
    html += '<tr>' +
                '<th>Scope</th>' +
                '<th>Line<br>Declared</th>' +
                '<th>Name</th>' +
                '<th>Type</th>' +
            '</td>';
    
    for (var i = 0; i < symbols.length; i++) {
        html += '<tr>' +
                    '<td>' + symbols[i].scope + '</td>' +
                    '<td>' + symbols[i].line + '</td>' +
                    '<td>' + symbols[i].name + '</td>' +
                    '<td>' + symbols[i].type + '</td>' +
                '</td>';
    }
    
    html += '</table>';
    
    $symbolTable.html(html);
};

SymbolTableDisplay.clear = function () {
    $symbolTable.html('');
};

window.SymbolTableDisplay = SymbolTableDisplay;
    
})();
