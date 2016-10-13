var support = require('utils/BrowserSupport');
var _ = require('utils/utils');

function queryAll( selector, scope ) {
  if( typeof selector !== "string" )
    return selector
  scope = scope || document;
  return scope.querySelectorAll( selector );
};

function query( selector, scope ) {
  if( typeof selector !== "string" )
    return selector
  scope = scope || document;
  return scope.querySelector( selector );
}

function addClass(cls, node ){

  if (node.classList) {
    node.classList.add(cls);
  } else {
    var cur = ' ' + (node.getAttribute('class') || '') + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      node.setAttribute('class', (cur + cls).trim());
    }
  }
};

function removeClass(cls, node){
  if (node.classList) {
    node.classList.remove(cls);
  } else {
    var cur = ' ' + (node.getAttribute('class') || '') + ' ';
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    node.setAttribute('class', cur.trim());
  }
};

function hasClass(className, node) {
  return new RegExp(' ' + className + ' ').test( ' ' + node.className + ' ' );
};

function getOrSetAttribute(node, attrName, attrValue){
  if ( typeof attrValue !== "undefined") {
    node.setAttribute(attrName, attrValue);
  }
  return node.getAttribute(attrName);
};


function fixEvent(event) {

  var doc = document.documentElement, body = document.body,
      pageX = event.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 ),
      pageY = event.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );

  var fixedEvnt = {
    target: event.srcElement,
    currentTarget : event.srcElement,
    pageX:  pageX,
    pageY:  pageY,
    stopPropagation: function() { this.cancelBubble = true; },
    preventDefault:  function() { this.returnValue = false; }
  };

  for(var k in fixedEvnt){
    if( typeof event[ k ] === 'undefined' ){
      event[k] = fixedEvnt[k];
    }
  }

  return event;

}


function addEventListener(node, eventName, callback){
  if (node.addEventListener) {
    node.addEventListener( eventName, callback, false);
  }
  else if (node.attachEvent){
    node.attachEvent( "on" + eventName, callback);
  }
}



function removeEventListener(node, eventName, callback){

  if( !callback || typeof callback === "undefined" ){
    return;
  }

  if (node.removeEventListener) {
    node.removeEventListener( eventName, callback);
  }
  else if (node.detachEvent){
    node.detachEvent( "on" + eventName, callback);
  }
}


function setStyle(node, props) {

  for (var k in props) {
    var prop = support.getPrefixed(k);
    if (_.isArray(node) || node.length ) {
      for (var i = 0, l = node.length; i < l; i++) {
        node[i].style[prop] = props[k];
      }
    } else {
      node.style[prop] = props[k];
    }
  }
  
}

function transform( node, transformPorps ){
    
  if( support.transform ){

    var transform = '';

    if( 'translateX' in transformPorps )
      transform += 'translateX('+ transformPorps.translateX +') ';

    if( 'translateY' in transformPorps )
      transform += 'translateY('+ transformPorps.translateY +') ';

    if( 'scale' in transformPorps )
      transform += 'scale('+ transformPorps.scale +') ';

    if( 'force3D' in transformPorps )
      transform += " " + support.translateZ;

    this.setStyle( node, {
      transform: transform
    });

  } else {

    var styles = {};

    if( 'translateX' in transformPorps )
      styles.left = transformPorps.translateX;

    if( 'translateY' in transformPorps )
      styles.top = transformPorps.translateY;

    if( 'scale' in transformPorps )
      styles.zoom = transformPorps.scale;

    this.setStyle( node, styles );

  }

}

module.exports = {
  query: query,
  queryAll: queryAll,
  attr: getOrSetAttribute,
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass,
  addEventListener: addEventListener,
  removeEventListener: removeEventListener,
  fixEvent: fixEvent,
  setStyle: setStyle,
  transform: transform
};