"use strict";
/**
 * Created by monad on 1/30/17.
 */
var Util = (function () {
    function Util() {
    }
    Util.randomIndex = function (arryLength) {
        // function to pick random index from array;
        return Math.floor(Math.random() * arryLength);
    };
    Util.convertEmptySpaceToNbsp = function (arry, letter) {
        //case 1. User Input - with user input letter: change input letter
        if (letter)
            return arry.map(function (c) {
                if (c === " ")
                    return "&nbsp"; // to make empty space character take some space. <span>&nbsp</span>
                else if (c.toUpperCase() === letter)
                    return "<strong>" + c + "</strong>";
                else
                    return c;
            });
        else
            return arry.map(function (c) {
                if (c === " ")
                    return "&nbsp";
                else
                    return c;
            });
    };
    return Util;
}());
exports.Util = Util;
