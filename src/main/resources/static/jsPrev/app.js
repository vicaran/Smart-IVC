/**
 * Created by Andrea on 19/03/2017.
 */
// Load canvas
window.addEventListener('DOMContentLoaded', function () {
    createCanvas();
});


// Handle Sidebar
var menuLeft = document.getElementById('cbp-spmenu-s1'),
    body = document.body;

showLeft.onclick = function () {
    classie.toggle(menuLeft, 'cbp-spmenu-open');
};


$(document).ready(function () {
    $('#showLeft').click(function () {
        $(this).toggleClass('open');
    });
});

(function(window) {

    'use strict';
    var hasClass, addClass, removeClass;

    hasClass = function(elem, c) {
        return elem.classList.contains(c);
    };
    addClass = function(elem, c) {
        elem.classList.add(c);
    };
    removeClass = function(elem, c) {
        elem.classList.remove(c);
    };

    function toggleClass(elem, c) {
        var fn = hasClass(elem, c) ? removeClass : addClass;
        fn(elem, c);
    }

    window.classie = {
        // full names
        hasClass: hasClass,
        addClass: addClass,
        removeClass: removeClass,
        toggleClass: toggleClass,
        // short names
        has: hasClass,
        add: addClass,
        remove: removeClass,
        toggle: toggleClass
    };

})(window);