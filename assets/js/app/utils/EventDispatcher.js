var _ = require('utils/utils');

var EventDispatcher = {

    /**
     *  normalise event names 
     */
    normalize: function(eventName){
        return eventName.replace(':', '');
    },

    /**
     *  list of events callbacks
     */
    listeners: [],


    on: function( eventName, fn, target){
        var eventName = this.normalize(eventName);
        this.listeners.push({name: eventName, closure:fn, target: target});
    },

    /**
     *  remove callback to a global event chanel
     */
    off: function(eventName, fn){

        var evt,
            i=0,
            l=this.listeners.length,
            eventName = this.normalize(eventName);

        for(;i<l;i++){
            evt=this.listeners[i];
            if(evt.name===eventName && evt.closure===fn){
                this.listeners.splice(i,1);
                i--;
                l--;
            }
        }
    },

    /**
     *  trigger callbacks from a global event chanel
     */
    trigger: function(eventName, params){

        var evt,
            i=0,
            l=this.listeners.length,
            eventName = this.normalize(eventName);

        for(;i<l;i++){
            evt=this.listeners[i];
            if(!evt)continue;
            if(evt.name===eventName){
                if( typeof params != "undefined" ){
                    evt.closure.apply( evt.target, params );
                } else {
                    evt.closure.call( evt.target);
                }
            }
        }

    },

    /**
     *  list of request callbacks
     */
    handlers: {},

    /**
     * create global request chanel handler
     */
    setHandler: function(handlerName, handler){
        this.handlers[ this.normalize(handlerName) ] = handler;
    },

    /**
     * trigger global request chanel
     */
    request: function(handlerName, params){
        var handlerName = this.normalize( handlerName );
        if( typeof this.handlers[ handlerName ] != 'undefined' ){
            return typeof params != "undefined" ? this.handlers[ handlerName ].apply(this, params) : this.handlers[ handlerName ]();
        } else {
            return { error: 'request error :: no handler found', handler: handlerName };
        }

    },


    /**
     * COMPATIBILITY
     */
    subscribe: function( eventName, fn, target ){
        _.warn( "EventDispatcher.on is depreciated and will be removed. Please use EventDispatcher.on instead" );
        this.subscribe(eventName, fn, target);
    },
    unsubscribe: function( eventName, fn ){
        _.warn( "EventDispatcher.off is depreciated and will be removed. Please use EventDispatcher.off instead" );
        this.off(eventName, fn, target);
    },
    publish: function(eventName, params){
        _.warn( "EventDispatcher.trigger is depreciated and will be removed. Please use EventDispatcher.trigger) instead" );
        this.trigger(eventName, params);
    },

}


module.exports = EventDispatcher;