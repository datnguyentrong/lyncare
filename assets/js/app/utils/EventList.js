var EventList = {

  ENTER_FRAME: 'enterframe',

  DOM_READY: 'ready',
  APLLICATION_READY: 'applicationready',
  
  RESIZE: 'resize',
  RESIZE_END: 'resizeend',
  CUSTOM_RESIZE: 'customresize',

  SLIDESHOW_READY: 'slideshowready',

  VIEW_OPENED: 'viewopened',
  VIEW_CLOSED: 'viewclosed',
  VIEW_READY: 'viewready',

  OPEN_POPIN: 'openpopin',
  CLOSE_POPIN: 'closepopin',
  SWITCH_OPEN_POPIN: 'switchopenpopin',
  SWITCH_CLOSE_POPIN: 'switchclosepopin',
  POPIN_CLOSED: 'popinclosed',
  POPIN_OPENED: 'popinopened',
  BEFORE_OPEN_POPIN: 'beforeopenpopin',
  
  SCROLL: 'scroll',
  SCROLL_END: 'scrollend',
  SCROLL_DISABLE: 'disablescroll',
  SCROLL_ENABLE: 'enablescroll',
  SCROLL_TARGET_CHANGE: 'scrolltargetchange',
  SCROLL_PREV: 'scrollprev',
  SCROLL_JUMP_TO: 'scrolljumpto',
  SCROLL_TO: 'scrollto',
    SCROLL_UPDATE: 'scrollupdate',

  ROUTER_PREV: 'routerprev',

  SEQUENCE_LOADING: 'document.SEQUENCE_LOADING',
  SEQUENCE_LOADED: 'document.SEQUENCE_LOADED',


};

EventList.add = function(key, value) {
  EventList[key] = value;
};

module.exports = EventList;