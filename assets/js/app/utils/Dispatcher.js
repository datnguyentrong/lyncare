function Dispatcher(){
  this.listeners = [];
}

Dispatcher.prototype = {

  addListener:function( eventName, fn, id ){
    this.removeListener(eventName,fn),
    this.listeners.push({name:eventName,closure:fn, id: id})

//console.log('addListener', eventName, id);

  },

  removeListener:function( eventName, fn ){

    var evt, i=0,
      l=this.listeners.length;

    for(;i<l;i++){
      evt=this.listeners[i];
      if(evt.name===eventName && evt.closure===fn){
//console.log('removeListener', eventName, evt.id);
        this.listeners.splice(i,1);
        i--;
        l--;
      }
    }



  },

  dispatch:function( eventName, params ){
    var evt,i=0,l=this.listeners.length;
    for(;i<l;i++){
      evt=this.listeners[i];
      if(!evt)continue;
      if(evt.name===eventName){
        if( typeof params != "undefined" ){
          evt.closure.apply( this, params );
        } else {
          evt.closure();
        }
      }
    }
  },

  removeAllListeners:function(){
    this.listeners.length = 0;
  }
  
};

module.exports = Dispatcher;