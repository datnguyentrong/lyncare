if (!Array.prototype.filter)
{
  Array.prototype.filter = function(fun /*, thisArg */)
  {
    "use strict";

    if (this === void 0 || this === null) {
      throw new TypeError();
    }

    var t = Object(this);
    var len = t.length >>> 0;
    
    // NOTE : fix to avoid very long loop on negative length value
    
    if (len > t.length || typeof fun != 'function') {
      throw new TypeError();
    }

    var res = [];
    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
    for (var i = 0; i < len; i++)
    {
      if (i in t)
      {
        var val = t[i];

        // NOTE: Techniquement on devrait utiliser Object.defineProperty
        //       pour le prochain index car push peut être affecté
        //       par les propriétés d'Object.prototype et d'Array.prototype.
        //       Cependant cette méthode est récente et les cas de collisions
        //       devraient rester rares : on préfère donc l'alternative la plus
        //       compatible.
        if (fun.call(thisArg, val, i, t))
          res.push(val);
      }
    }

    return res;
  };
}