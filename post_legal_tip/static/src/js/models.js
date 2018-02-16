// Util prototypes
String.prototype.padRight = function(l,c) {return this+Array(l-this.length+1).join(c||" ")};

neotec_interface_models = (function(){

    var roundTo2 = function(n) {
        return Math.round(n * 100) / 100;
    };



    var exports = {
        roundTo2: roundTo2
    };

    return exports;

})();