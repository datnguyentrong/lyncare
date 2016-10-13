/**
 * Helper to manage xhr request
 *
 * TODO: integrate promises
 */
(function(window){

  "use strcit";

  function extend(){

    var options, k,
        baseObject = arguments[0] || {},
        i = 1,
        length = arguments.length;

    if ( typeof baseObject !== "object" && typeof baseObject !== 'function' )
        baseObject = {};

    for ( ; i<length; i++ ) {
        if ( (options = arguments[i]) !== null ) {
            for ( k in options ) {
                if ( options[k] !== undefined ) {
                    baseObject[k] = options[k];
                }
            }
        }
    }

    return baseObject;

  }


    
  function xhrRequest(url, options){

    this.xhr   = new XMLHttpRequest();

    this.options = extend({
      method: 'GET',
      dataType: "application/json; charset=utf-8",
      success: function(){},
      fail: function(){},
      params: null,
      elem: null
    }, options || {} );

    this.sendParams = null;

    var params = "";
    var index = 0;
    for( var k in this.options.params ){
      params += index == 0 ? "" : "&";
      params += k + "=" + this.options.params[k];
      index++;
    }

    if( this.options.method == "POST" ){
      this.sendParams = params;
    }

    if( this.options.method == "GET" &&  params != "" ){
      url += "?" + params;
    }

    this.xhr.onreadystatechange = this.onreadystatechange.bind(this);
    this.xhr.open( this.options.method, url, true );

    this.xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');

    // todo fix
    // multipart
    if(this.options.elem){
      var formData = new FormData(this.options.elem);
      this.xhr.send(formData);
    }
    else {

      if( this.options.method == "POST" ){
        this.xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
      } else {
        this.xhr.setRequestHeader("Content-type", this.options.dataType );
      }

      this.xhr.send( this.sendParams );
    }


    return this;

  }

  xhrRequest.prototype = {

    onreadystatechange: function(){
      this.checkRequest();
    },

    checkRequest: function(){
      if ( this.xhr.readyState == 4 && ( this.xhr.status == 200 ||  this.xhr.status == 0) ) {
        this.options.success( this.xhr.responseText );
      }
      else if ( this.xhr.readyState < 4 && this.xhr.status == 404 ) {
        this.options.fail( this.xhr.responseText );
      }
    },

    then: function( success, fail ){

      if( typeof success !== "undefined" ){
        this.options.success = success;
      }
      if( typeof fail !== "undefined" ){
        this.options.fail = fail;
      }

      this.checkRequest();

      return this;
    },

    abort: function(){
      this.xhr.onreadystatechange = null;
      // this.options.success = null;
      // this.options.fail = null;
      this.xhr.abort();
    }

  };



  window.$xhr = {
    post: function get(url, options){
      var options = options || {};
      options.method = 'POST';
      return new xhrRequest( url, options );
    },
    get: function get(url, options){
      var options = options || {};
      options.method = 'GET';
      return new xhrRequest( url, options );
    }
  };

})(window);

