(function () {
    
var _$container;

var _$ast;
var _$astHeader;
var _$cst;
var _$cstHeader;

var _astTreeCode;
var _cstTreeCode;


function SyntaxTreeDisplay() {}

SyntaxTreeDisplay.init = function () {
    _$cst = $('#cst');
    _$cstHeader = $('#cstHeader');
    _$ast = $('#ast');
    _$astHeader = $('#astHeader');
    _$container = $('#syntaxTreeContainer');
    
    _$cst.hide();
    _$cstHeader.hide();
    
    _$cstHeader.click(toggleSyntaxTree);
    _$astHeader.click(toggleSyntaxTree);
};

SyntaxTreeDisplay.clear = function () {
    _$ast.loader();
    _$cst.loader();
};

SyntaxTreeDisplay.setAst = function (tree) {
    _astTreeCode = tree.toString();
    set(_$ast, _astTreeCode, showAst);
};

SyntaxTreeDisplay.setCst = function (tree) {
    _cstTreeCode = tree.toString();
    set(_$cst, _cstTreeCode, showCst);
};

function set($tree, treeCode, showFunct) {
    
    if (treeCode.length > 250) {
        $tree.html('<div>' +
                       '<div class="button" style="width: 100px;">Generate</div>' +
                       '<div class="subtle" style="padding-top: 10px;">May take a little while...</div>' +
                   '</div>');
                         
        $('.button', $tree).click(showFunct).parent().center();
    } else {
        showFunct();
    }
}

function showAst() {
    showTree(_$ast, _astTreeCode);
}

function showCst() {
    showTree(_$cst, _cstTreeCode);
}

function showTree($tree, treeCode) {
    // Showing the loader is more a style issue, as it will not animate when the tree is generating.
    //   Setting a timeout will allow for a little animation and then a freeze as the tree generates,
    //   at least informing the user that it is frozen if it starts taking too long.
    $tree.loader();
    
    setTimeout(function() {
        var img = buildSyntaxTree(treeCode, 10, '10pt monospace', '10pt monospace', 30, 5, true, true);
        
        $tree.empty();
        $tree.append(img);
        
        var $img = $('img', $tree);
        $img.attr('width', $tree.width());
        $img.attr('height', $tree.height());
        $img.wrap('<a href="' + $(img).attr('src') + '" target="_blank"></a>');
    }, 400);
}

var _cstOn = false;

function toggleSyntaxTree() {
    
    _cstOn = !_cstOn;
    
    var controlFlip;
    
    if (_cstOn) {
        controlFlip = function () { // Switch to CST
            _$cst.show();
            _$cstHeader.show();
            _$ast.hide();
            _$astHeader.hide();
        };
    } else {
        controlFlip = function () { // Switch to AST
            _$ast.show();
            _$astHeader.show();
            _$cst.hide();
            _$cstHeader.hide();
        };
    }
    
    _$container.rotate3Di('toggle', 'slow', { sideChange: controlFlip });
}


window.SyntaxTreeDisplay = SyntaxTreeDisplay;

})();