/** RequestAnimationFrame browser compatibility */
(function() {

  var lastTime = 0, x = 0,
      vendors = ['ms', 'moz', 'webkit', 'o'];

  for( ; x < vendors.length && !window.requestAnimationFrame; ++x ) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = 
      window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
  }
  
  if( window.msRequestAnimationFrame ){
    window.requestAnimationFrame = function(callback){
      return window.msRequestAnimationFrame(function(){
        callback( +new Date() );
      });
    };
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback, element) {
      var currTime = Date.now();
      var timeToCall = 1000/60;//Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function(){ callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) { clearTimeout(id); };

}());