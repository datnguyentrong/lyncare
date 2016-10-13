var EventDispatcher = require('utils/EventDispatcher');
var EventList = require('utils/EventList');
var CubicBezier = require('utils/CubicBezier');
var EnterFrame = require('utils/EnterFrame');
var Cubic = require('utils/Cubic');
var _ = require('utils/utils');

frame = EnterFrame.getInstance();


function Fx( options ){

  var self = this;

  this.options = _.extend({
    id: '',
    startAt: 0,
    duration: 400,
    delay: 0,
    easing: [0.250, 0.250, 0.750, 0.750],
    step: function(){},
    complete: function(){}
  }, options || {} );

  this.animDuration = this.options.duration;
  this.animStartTime = 0;
  this.animProgress  = 0;

  this.cubicMethod = Cubic.apply( this, this.options.easing );

  if( this.options.startAt != 0 ){
    this.animProgress = this.options.duration * this.options.startAt ;
  }

  if( this.options.delay != 0 ){
    this.delay = setTimeout(function(){
      self.startFx();
    }, this.options.delay );
  } else {
    this.startFx();
  }

}

Fx.prototype = {

  startFx: function(){
    this._step = this.step.bind(this);
    this.animStartTime = Date.now();
        frame.addListener(EventList.ENTER_FRAME, this._step, 'fx' );
        frame.start();
  },

  step: function(){

    if( this.ended )
      return;

    if ( this.animProgress >= this.options.duration) {
      this.stop(true);
      return;
    }

    var timestamp = Date.now();
    var diff = timestamp - this.animStartTime;
    this.animRatio = this.animProgress !== 0 ? this.cubicMethod( this.animProgress/this.options.duration ) : 0;
    this.animProgress = this.animProgress + diff;
    this.animStartTime = timestamp;
    this.options.step( this.animRatio );

  },

  stop: function( doComplete ){
    frame.removeListener(EventList.ENTER_FRAME, this._step );
    this.ended = true;
    if( doComplete ){
      this.options.complete();
    }
  },

  pause: function(){
    frame.removeListener(EventList.ENTER_FRAME, this._step );
  },

  resume: function(){
        frame.addListener(EventList.ENTER_FRAME, this._step );
        frame.start();
  },

  clear: function(){
    this.stop();
  }


};


module.exports = Fx;