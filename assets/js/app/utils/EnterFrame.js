var Dispatcher = require('utils/Dispatcher');
var EventList = require('utils/EventList');

var isInitialized = false;
var instance = null;

function EnterFrame() {
  Dispatcher.call(this);
  this.raf = null;
  this.paused = true;
}

/** inheritance */
EnterFrame.prototype = Object.create(Dispatcher.prototype);
EnterFrame.prototype.constructor = EnterFrame;

EnterFrame.prototype.start = function() {
  if (this.paused) {
    this.paused = false;
    this.animate();
  }
};

EnterFrame.prototype.stop = function() {
  if (!this.paused) {
    this.paused = true;
    cancelAnimationFrame(this.raf);
  }
};

EnterFrame.prototype.animate = function() {
  var self = this;
  this.dispatch(EventList.ENTER_FRAME);
  if (this.paused) return;
  this.raf = requestAnimationFrame(function() {
    self.animate();
  });
};

EnterFrame.getInstance = function() {
  if (!isInitialized) {
    isInitialized = true;
    instance = new EnterFrame();
  }
  return instance;
};

module.exports = EnterFrame;