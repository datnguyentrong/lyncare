function isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]' || Object.prototype.toString.call(object) === '[object NodeList]';
}

function extend(){

    var options, k,
        baseObject = arguments[0] || {},
        i = 1,
        length = arguments.length;

    if ( typeof baseObject !== "object" && typeof baseObject !== 'function' )
        baseObject = {};

    for ( ; i<length; i++ ) {
        if ( (options = arguments[i]) != null ) {
            for ( k in options ) {
                if ( options[k] !== undefined ) {
                    baseObject[k] = options[k];
                }
            }
        }
    }

    return baseObject;

};


function has( key, scope ){
    return key in scope;
}

function clone( obj ){
    return isArray(obj) ? obj.slice() : extend({}, obj);
}

function isFunction(fn){
    return typeof fn === "function";
}

function warn(msg){
    console.log( '[Scriptease warn]: ' + msg );
}


var nop = function() {};

var nob = {};



module.exports = {
  isArray: isArray,
  extend: extend,
    has: has,
    clone: clone,
    isFunction: isFunction,
    nop: nop,
    nob: nob,
    warn: warn
}