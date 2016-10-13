// Production steps / ECMA-262, Edition 5, 15.4.4.19
// Référence : http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

  Array.prototype.map = function(callback, thisArg) {

    var T, A, k;

    if (this == null) {
      throw new TypeError(' this est null ou non défini');
    }

    // 1. Soit O le résultat de l'appel ToObject avec |this| 
    //    comme argument.
    var O = Object(this);

    // 2. Soit lenValue le résultat de l'appel de la méthode interne
    //    Get de O avec l'argument "length".
    // 3. Soit len égal à ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. Si IsCallable(callback) vaut false, on renvoie une TypeError
    // Voir : http://es5.github.com/#x9.11
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' n est pas une fonction');
    }

    // 5. Si thisArg a été utilisé, on définit T avec thisArg
    //    sinon T vaudra undefined.
    if (arguments.length > 1) {
      T = thisArg;
    }

    // 6. Soit A un nouveau tableau créé tel
    //    qu'avec l'expression new Array(len) 
    //    où Array est le constructeur natif standard
    A = new Array(len);

    // 7. Soit k égal à 0
    k = 0;

    // 8. On répète tant que k < len
    while (k < len) {

      var kValue, mappedValue;

      // a. Soit Pk égal à ToString(k).
      //    (implicite pour l'opérande gauche de in)
      // b. Soit kPresent le résultat de l'appel à la méthode
      //    interne de O HasProperty appelée avec l'argument 
      //     Pk.
      //    Cette étape peut être combinée avec c
      // c. Si kPresent vaut true, alors
      if (k in O) {

        // i. Soit kValue le résultat de l'appel de la méthode
        //    interne Get de O avec l'argument Pk.
        kValue = O[k];

        // ii. Soit mappedValue le résultat de l'appel de la 
        //     méthode interne Call de callback avec T comme première
        //     valeur et la liste des arguments kValue, k, et O.
        mappedValue = callback.call(T, kValue, k, O);

        // iii. On appelle la méthode intnerne DefineOwnProperty de A
        // avec les arguments Pk, Property Descriptor
        // { Value: mappedValue,
        //   Writable: true,
        //   Enumerable: true,
        //   Configurable: true },
        // et false.

        // Pour les navigateurs qui supportent Object.defineProperty
        // on pourra utiliser :
        // Object.defineProperty(A, k, {
        //   value: mappedValue,
        //   writable: true,
        //   enumerable: true,
        //   configurable: true
        // });

        // Pour un meilleur suppport, on utilisera :
        A[k] = mappedValue;
      }
      // d. On augmente k de 1.
      k++;
    }

    // 9. On renvoie A
    return A;
  };
}