
/**
 * Handles all interactions with the source code text window. IDE-ish window courtesy of CodeMirror.
 * http://codemirror.net/ 
 */
function Source() {}

Source.code = null;

Source.init = function () {
    // Set up code mirror
    Source.code = CodeMirror.fromTextArea($('#sourceText')[0], {
        lineNumbers: true
    });
    
    Source.code.setSize(446, 596);
    
    // Set up test code loader buttons
    var $buttons = $('#buttonContainer');
    
    for (var i in TEST_PROGS) {
        var html = '<div class="button">' + i + '</div>';
        
        $buttons.append(html);
        $buttons.children(':last-child').click(i, function (event) {
            Source.code.setValue(TEST_PROGS[event.data]);
        });
    }
};
