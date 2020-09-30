(function () {

var _$output;

var _warningStyle = 'color: #D96D00;';
var _errorStyle = 'color: #D90000;';
var _stringStyle = 'font-weight: bold;';

function OutputDisplay() {}

OutputDisplay.init = function () {
    _$output = $('#textOutput');
};

OutputDisplay.set = function (text) {
    _$output.html(convertText(text) + '<br>');
    scrollToBottom();
};

OutputDisplay.add = function (text, lines) {
    _$output.append(convertText(text) + getBreaks(lines));
    scrollToBottom();
};

OutputDisplay.addCode = function (codeString) {
    for (var i = 0; i <= codeString.length; i += 72) {
        OutputDisplay.add(codeString.substring(i, i + 72));
    }  
};

OutputDisplay.addRaw = function(html, lines) {
    _$output.append(html + getBreaks(lines));
    scrollToBottom();
};

function getBreaks(number) {
    number = number === undefined ? 1 : number + 1;
    var breaks = '';
    
    while (number > 0) {
        breaks += '<br>';
        number--;
    }
    
    return breaks;
}

OutputDisplay.clear = function () {
    _$output.html('');
}

function convertText(text) {
    text = text.replace(/\s/g, '&nbsp;');
    text = text.replace(/\</g, '&lsaquo;');
    text = text.replace(/\>/g, '&rsaquo;');
    text = text.replace(/\n/g, '<br>');
    
    var pieces = text.split("'");
    text = '';
    for (var i = 0; i < pieces.length; i++) {
        if (i % 2 === 0) {
            text += pieces[i]; 
        } else {
            text += '<span style="' + _stringStyle + '">' + pieces[i] + '</span>';
        }
    }
    
    // Add styles
    text = text.replace(/WARNING/g, '<span style="' + _warningStyle + '">WARNING</span>');
    text = text.replace(/ERROR/g, '<span style="' + _errorStyle + '">ERROR</span>');
    
    return text;
}

function scrollToBottom() {
    _$output.scrollTop(_$output.prop('scrollHeight'));
}

window.OutputDisplay = OutputDisplay;

})();
