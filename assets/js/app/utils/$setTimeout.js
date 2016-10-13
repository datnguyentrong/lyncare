module.exports = function( callback, delay, ctx){

  return setTimeout(function(){
    callback.call(ctx);
  }, delay);

}