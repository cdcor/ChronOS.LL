
(function () {
    
var $borg
var $enterprise;
var _borgSound;
var _enterpriseSound;

function EasterEgg() {}

EasterEgg.init = function () {
    $borg = $('#borgcube');
    $enterprise = $('#ncc1701d');
    borgSound = new Audio('resources/borg_flyby.wav');
    enterpriseSound = new Audio('resources/tng_warp_out1.wav');
}

EasterEgg.animate = function () {
    enterpriseSound.play();
    animate($enterprise, 1250, 0);
    setTimeout(function () {
        borgSound.play();
        
        setTimeout(function() {
            animate($borg, 2000, -500);
        }, 3600 - 2000);
    }, 1250);
};

function animate($ship, time, top) {
    var defaultTop = $ship.css('top');
    var fullWidth = $ship.width();
    var fullHeight = $ship.height();     
    
    $ship.css({
        width: 0,
        height: 0,
        left: window.innerWidth * 0.66,
        top: window.innerHeight * 0.33
    });
    
    $ship.animate({
        width: fullWidth * 1.5,
        height: fullHeight * 1.5,
        left: -fullWidth * 1.25,
        top: top
    }, time, 'easeInExpo', function () {
        $ship.css({
            width: fullWidth,
            height: fullHeight,
            top: defaultTop
        });
    });
}

window.EasterEgg = EasterEgg;

})();
