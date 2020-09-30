
(function () {
    
var $tokenStream;

var _marqueeOptions = {
    speed: 20000,
    gap: 0,
    delayBeforeStart: 0,
    direction: 'left'
};

function TokenStreamDisplay() {}

TokenStreamDisplay.init = function () {
    $tokenStream = $('#tokenStream');
};

TokenStreamDisplay.set = function (tokens) {
    if (tokens.length === 0) {
        TokenStreamDisplay.error();
        return;
    }
    
    var html = '', length = 0;
    
    for (var i = 0; i < tokens.length; i++) {
        var kind = Token.kinds[tokens[i].kind];
        html += '&nbsp;&nbsp;<span class="number">' + i  + ':' + kind + ' </span>' + tokens[i].value;
        length += 5 + tokens[i].value.toString().length + kind.length;
    }
    
    while (length < 80) {
        html += html;
        length *= 2;
    }
    
    $tokenStream.html(html);
    _marqueeOptions.speed = length * 120;
    $tokenStream.marquee(_marqueeOptions);
};

TokenStreamDisplay.error = function () {
    var html = '<span style="color: #D90000;">&nbsp;&nbsp;ERROR&nbsp;&nbsp;</span>', length = 13;
    
    while (length < 80) {
        html += html;
        length *= 2;
    }
    
    $tokenStream.html(html);
    _marqueeOptions.speed = length * 120;
    $tokenStream.marquee(_marqueeOptions);
};

TokenStreamDisplay.clear = function() {
    $tokenStream.html('');
};

window.TokenStreamDisplay = TokenStreamDisplay;

})();

