(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("application", function(exports, require, module) {
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _componentsAcmeSearch = require("components/acme-search");

var _componentsAcmeSearch2 = _interopRequireDefault(_componentsAcmeSearch);

var _componentsAcmePopin = require("components/acme-popin");

var _componentsAcmePopin2 = _interopRequireDefault(_componentsAcmePopin);

var _componentsAcmeBurger = require("components/acme-burger");

var _componentsAcmeBurger2 = _interopRequireDefault(_componentsAcmeBurger);

var _componentsAcmeMap = require("components/acme-map");

var _componentsAcmeMap2 = _interopRequireDefault(_componentsAcmeMap);

var _componentsAcmeRoot = require("components/acme-root");

var _componentsAcmeRoot2 = _interopRequireDefault(_componentsAcmeRoot);

var _componentsAcmeNewsletter = require("components/acme-newsletter");

var _componentsAcmeNewsletter2 = _interopRequireDefault(_componentsAcmeNewsletter);

var support = require('utils/BrowserSupport');
var $setTimeout = require('utils/$setTimeout');
var dom = require('utils/dom');

var Application = {

  initialize: function initialize() {

    this.$doc = document.documentElement || document;
    this.$win = window;
    this.$body = document.getElementsByTagName("body")[0];
    this.bodyRect = this.$body.getBoundingClientRect();

    this.$mouseIcon = dom.query('.js-mouse');
    this.$wrapperHeader = dom.query('.js-wrapper-header');
    this.$submitForm = dom.query('.js-submit-form');
    this.$scrollContainer = dom.query('.js-scroll-container');
    this.$selectAnchorIndustrie = dom.query('.js-anchor-industries');

    this.$parallax = dom.queryAll('.js-parallax');
    this.$animScroll = dom.queryAll('.js-scroll-anim');

    this.resizeTimer = null;
    this.winHeight = 0;
    this.winWidth = 0;
    this.halfWinHeight = 0;
    this.halfWinWidth = 0;

    this.winWidth = this.$win.innerWidth || this.$doc.clientWidth || this.$body.clientWidth;
    this.winHeight = this.$win.innerHeight || this.$doc.clientHeight || this.$body.clientHeight;

    this.bodyHeight = 0;
    this.windowHeight = 0;
    this.windowWidth = 0;
    this.scrollRatio = 0;
    this.scrollTop = 0;
    this.currScrollTop = 0;

    this.userHasScrolled = false;

    this.animScrollArr = [];
    for (var i = 0, l = this.$animScroll.length; i < l; i++) {
      var el = {
        elRect: this.$animScroll[i].getBoundingClientRect(),
        anim: this.$animScroll[i].getAttribute('data-anim'),
        delay: Number(this.$animScroll[i].getAttribute('data-delay')) / 1000,
        offset: Number(this.$animScroll[i].getAttribute('data-offset')),
        time: Number(this.$animScroll[i].getAttribute('data-time')) / 1000,
        offsetTop: this.$animScroll[i].getBoundingClientRect().top + this.scrollTop - this.$animScroll[i].offsetHeight - (this.winHeight - 280)
      };
      this.animScrollArr.push(el);
    }

    this.numParallax = this.$parallax.length;
    this.objectsArr = new Array(this.numParallax);
    for (var i = 0; i < this.numParallax; i++) {
      this.objectsArr[i] = {
        el: this.$parallax[i],
        ratio: this.$parallax[i].getAttribute('data-ratio')
      };

      console.log(this.objectsArr[i].offsetTop);
    }

    if (this.$submitForm != null) {
      this.$submitForm.innerHTML = this.$submitForm.innerHTML + '<div class="btn btn--square bg--yellow align-center valign-bottom wrapper--valign"><svg version="1.1" class="ico ico--arrow cell" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20.2 4.7" enable-background="new 0 0 20.2 4.7" xml:space="preserve"><path fill="#fff" d="M0,2.6h16v-1H0V2.6z M16.2,0v4.7l4.1-2.4L16.2,0z"/></svg><div class="wrapper wrapper--panel wrapper--valign bg--dark btn--square__overlay"><svg version="1.1" class="ico ico--arrow cell" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20.2 4.7" enable-background="new 0 0 20.2 4.7" xml:space="preserve"><path fill="#FFFFFF" d="M0,2.6h16v-1H0V2.6z M16.2,0v4.7l4.1-2.4L16.2,0z"/></svg></div></div>';
    };

    document.addEventListener("scroll", this.onScroll.bind(this));

    dom.addEventListener(this.$win, 'resize', this.onResize.bind(this));
    dom.addEventListener(this.$win, 'orientationchange', this.onResize.bind(this));

    if (this.$selectAnchorIndustrie !== null) {
      dom.addEventListener(this.$selectAnchorIndustrie, 'change', this.selectAnchorIndustrieClick.bind(this));
    };

    //TODO: IE8

    this.acmeSearch = new _componentsAcmeSearch2['default']();
    this.acmePopin = new _componentsAcmePopin2['default']();
    this.acmeMap = new _componentsAcmeMap2['default']();
    this.acmeBurger = new _componentsAcmeBurger2['default']();
    this.acmeRoot = new _componentsAcmeRoot2['default']();
    this.acmeNewsletter = new _componentsAcmeNewsletter2['default']();

    this.onResize();
    this.onEnterFrame();
  },

  onResize: function onResize() {

    var winWidth = this.$win.innerWidth || this.$doc.clientWidth || this.$body.clientWidth;
    var winHeight = this.$win.innerHeight || this.$doc.clientHeight || this.$body.clientHeight;

    //IE 7/8 willt triggerresize event on dom node size change
    if (winWidth == this.lastWinWidth && winHeight == this.lastWinHeight) {
      return;
    }

    this.winWidth = winWidth;
    this.winHeight = winHeight;
    this.lastWinWidth = this.winWidth;
    this.lastWinHeight = this.winHeight;

    //working alternative for ios7 height issue but hardcoded :
    if (support.isIOS7 && this.winWidth > this.winHeight) this.winHeight -= 20;

    this.halfWinHeight = this.winHeight >> 1;
    this.halfWinWidth = this.winWidth >> 1;
    this.quarterWinWidth = this.halfWinWidth >> 1;
    this.quarterWinHeight = this.halfWinHeight >> 1;
    this.winRatio = this.winWidth / this.winHeight;

    this.updatescrollHeight();
  },

  updatescrollHeight: function updatescrollHeight() {
    this.scrollContentHeight = this.$scrollContainer.clientHeight;
    document.getElementById('fake-scroll').style.height = this.scrollContentHeight + 'px';
  },

  onScroll: function onScroll() {
    this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  },

  onEnterFrame: function onEnterFrame() {

    requestAnimationFrame(this.onEnterFrame.bind(this));

    if (this.winWidth > 1024) {

      for (var i = 0; i < this.numParallax; i++) {
        this.objectsArr[i].el.style[support.transform] = "translateY(" + (this.scrollTop - this.scrollRatio) * this.objectsArr[i].ratio + "px) translateZ(0)";
      }

      for (var i = 0; i < this.$animScroll.length; i++) {

        if (this.animScrollArr[i].offset != null) {
          if (this.scrollTop > this.animScrollArr[i].offsetTop + this.animScrollArr[i].offset) {
            dom.addClass(this.animScrollArr[i].anim, this.$animScroll[i]);
            this.$animScroll[i].style[support.transitionDelay] = this.animScrollArr[i].delay + 's';
            this.$animScroll[i].style[support.transitionDuration] = this.animScrollArr[i].time + 's';
          }
        } else {
          if (this.scrollTop > this.animScrollArr[i].offsetTop) {
            dom.addClass(this.animScrollArr[i].anim, this.$animScroll[i]);
            this.$animScroll[i].style[support.transitionDelay] = this.animScrollArr[i].delay + 's';
            this.$animScroll[i].style[support.transitionDuration] = this.animScrollArr[i].time + 's';
          }
        }
      };

      this.currScrollTop += (this.scrollTop - this.currScrollTop) * 0.075;

      this.$scrollContainer.style[support.transform] = 'translateY(' + -this.currScrollTop + 'px) translateZ(0)';
    };
  },

  selectAnchorIndustrieClick: function selectAnchorIndustrieClick(e) {

    var anchor = this.$selectAnchorIndustrie.value;
    var scrollToAnchor = document.getElementById(anchor);

    var scrollToAnchorRect = scrollToAnchor.getBoundingClientRect();

    window.scrollTo(0, scrollToAnchorRect.top);

    this.$selectAnchorIndustrie.options[0].selected = true;
  }

};

module.exports = Application;
});

require.register("components/acme-burger/index", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsBrowserSupport = require('utils/BrowserSupport');

var _utilsBrowserSupport2 = _interopRequireDefault(_utilsBrowserSupport);

var _utils$setTimeout = require('utils/$setTimeout');

var _utils$setTimeout2 = _interopRequireDefault(_utils$setTimeout);

var _utilsDom = require('utils/dom');

var _utilsDom2 = _interopRequireDefault(_utilsDom);

var AcmeBurger = (function () {
  function AcmeBurger() {
    _classCallCheck(this, AcmeBurger);

    this.$body = document.getElementsByTagName("body")[0];
    this.$btnBurger = _utilsDom2['default'].query('.js-burger');

    this.onBtnBurgerClick = this.onBtnBurgerClick.bind(this);

    _utilsDom2['default'].addEventListener(this.$btnBurger, 'click', this.onBtnBurgerClick);
  }

  _createClass(AcmeBurger, [{
    key: 'onBtnBurgerClick',
    value: function onBtnBurgerClick() {
      if (_utilsDom2['default'].hasClass('is-nav-opened', this.$body)) {
        _utilsDom2['default'].removeClass('is-nav-opened', this.$body);
        _utilsDom2['default'].removeClass('scroll-disable', this.$body);
      } else {
        _utilsDom2['default'].addClass('is-nav-opened', this.$body);
        _utilsDom2['default'].addClass('scroll-disable', this.$body);
      }
    }
  }]);

  return AcmeBurger;
})();

exports['default'] = AcmeBurger;
module.exports = exports['default'];
});

;require.register("components/acme-map/index", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsBrowserSupport = require('utils/BrowserSupport');

var _utilsBrowserSupport2 = _interopRequireDefault(_utilsBrowserSupport);

var _utils$setTimeout = require('utils/$setTimeout');

var _utils$setTimeout2 = _interopRequireDefault(_utils$setTimeout);

var _utilsDom = require('utils/dom');

var _utilsDom2 = _interopRequireDefault(_utilsDom);

var AcmeBurger = (function () {
  function AcmeBurger() {
    _classCallCheck(this, AcmeBurger);

    this.$boxMap = _utilsDom2['default'].queryAll('.js-box-map');
    this.$linkOpenMap = _utilsDom2['default'].queryAll('.js-open-map');

    this.onLinkOpenMapClick = this.onLinkOpenMapClick.bind(this);
    this.onDocumentDown = this.onDocumentDown.bind(this);

    for (var i = 0; i < this.$linkOpenMap.length; i++) {
      _utilsDom2['default'].addEventListener(this.$linkOpenMap[i], 'click', this.onLinkOpenMapClick);
    }

    document.addEventListener('click', this.onDocumentDown, this);
  }

  _createClass(AcmeBurger, [{
    key: 'onLinkOpenMapClick',
    value: function onLinkOpenMapClick(e) {

      var index = e.currentTarget.getAttribute('data-index');

      if (_utilsDom2['default'].hasClass('is-active', this.$boxMap[index])) {

        console.log('hasclass', this.$boxMap[index]);
        _utilsDom2['default'].removeClass('is-active', this.$boxMap[index]);
      } else {
        console.log(index, 'hasntclass', this.$boxMap[index]);
        _utilsDom2['default'].addClass('is-active', this.$boxMap[index]);
      }

      this.isPopinOpened = true;
      this.currentPopinNode = this.$linkOpenMap[index];
    }
  }, {
    key: 'onDocumentDown',
    value: function onDocumentDown(e) {

      if (this.isPopinOpened && this.currentPopinNode) {

        var node = e.target;
        var match = false;

        while (node.parentNode) {
          if (node == this.currentPopinNode) {
            match = true;
            break;
          }
          node = node.parentNode;
        }

        //if we click outside the currentPopin, close it
        if (!match) {
          this.closeMap();
        }
      } else {}
    }
  }, {
    key: 'closeMap',
    value: function closeMap() {

      for (var i = 0; i < this.$boxMap.length; i++) {
        _utilsDom2['default'].removeClass('is-active', this.$boxMap[i]);
      };

      this.isPopinOpened = false;
      this.currentPopinNode = null;
    }
  }]);

  return AcmeBurger;
})();

exports['default'] = AcmeBurger;
module.exports = exports['default'];
});

;require.register("components/acme-newsletter/index", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsBrowserSupport = require('utils/BrowserSupport');

var _utilsBrowserSupport2 = _interopRequireDefault(_utilsBrowserSupport);

var _utils$setTimeout = require('utils/$setTimeout');

var _utils$setTimeout2 = _interopRequireDefault(_utils$setTimeout);

var _utilsDom = require('utils/dom');

var _utilsDom2 = _interopRequireDefault(_utilsDom);

var AcmeNewsletter = (function () {
    function AcmeNewsletter() {
        _classCallCheck(this, AcmeNewsletter);

        this.$newsletterForm = document.getElementById('newsletter-subscribe');

        this.$newsletterForm.onsubmit = this.onNewsletterFormSubmit.bind(this);
    }

    _createClass(AcmeNewsletter, [{
        key: 'serialize',
        value: function serialize(form) {
            var field = undefined,
                s = {};
            if (typeof form == 'object' && form.nodeName == "FORM") {
                var len = form.elements.length;
                for (var i = 0; i < len; i++) {
                    field = form.elements[i];
                    if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                        if (field.type == 'select-multiple') {
                            for (j = form.elements[i].options.length - 1; j >= 0; j--) {
                                if (field.options[j].selected) s[field.name] = encodeURIComponent(field.options[j].value);
                            }
                        } else if (field.type != 'checkbox' && field.type != 'radio' || field.checked) {
                            s[field.name] = encodeURIComponent(field.value);
                        }
                    }
                }
            }
            return s;
        }
    }, {
        key: 'onNewsletterFormSubmit',
        value: function onNewsletterFormSubmit(e) {

            e.preventDefault();

            var f = this.$newsletterForm;

            var re = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-]{1,})+\.)+([a-zA-Z0-9]{2,})+$/;

            if (!re.test(f.elements["ne"].value)) {
                document.getElementById('newsletter-subscribe__error-mail').style.display = 'block';
                document.getElementById('newsletter-subscribe__success').style.display = 'none';
                document.getElementById('newsletter-subscribe__error').style.display = 'none';
                return false;
            }

            for (var i = 1; i < 20; i++) {
                if (f.elements["np" + i] && f.elements["np" + i].required && f.elements["np" + i].value == "") {

                    return false;
                }
            }

            if (f.elements["ny"] && !f.elements["ny"].checked) {
                return false;
            }

            $xhr.post(f.getAttribute('action'), {
                params: this.serialize(f)
            }).then(this.onNewsletterSuccess, this.onNewsletterError);

            return true;
        }
    }, {
        key: 'onNewsletterSuccess',
        value: function onNewsletterSuccess() {
            document.getElementById('newsletter-subscribe__success').style.display = 'block';
            document.getElementById('newsletter-subscribe__error').style.display = 'none';
            document.getElementById('newsletter-subscribe__error-mail').style.display = 'none';
        }
    }, {
        key: 'onNewsletterError',
        value: function onNewsletterError() {
            document.getElementById('newsletter-subscribe__error').style.display = 'block';
            document.getElementById('newsletter-subscribe__error-mail').style.display = 'none';
            document.getElementById('newsletter-subscribe__success').style.display = 'none';
        }
    }]);

    return AcmeNewsletter;
})();

exports['default'] = AcmeNewsletter;
module.exports = exports['default'];
});

;require.register("components/acme-popin/index", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsBrowserSupport = require('utils/BrowserSupport');

var _utilsBrowserSupport2 = _interopRequireDefault(_utilsBrowserSupport);

var _utils$setTimeout = require('utils/$setTimeout');

var _utils$setTimeout2 = _interopRequireDefault(_utils$setTimeout);

var _utilsDom = require('utils/dom');

var _utilsDom2 = _interopRequireDefault(_utilsDom);

var AcmePopin = (function () {
  function AcmePopin() {
    _classCallCheck(this, AcmePopin);

    this.$body = document.getElementsByTagName("body")[0];
    this.$doc = document.documentElement || document;
    this.$win = window;

    this.$bigPopin = _utilsDom2['default'].queryAll('.js-big-popin');
    this.$btnBigPopin = _utilsDom2['default'].queryAll('.js-btn-big-popin');
    this.$btnCloseBigPopin = _utilsDom2['default'].queryAll('.js-close-big-popin');
    this.$btnPopin = _utilsDom2['default'].queryAll('.js-btn-popin');
    this.$gridTab = _utilsDom2['default'].queryAll('.js-grid-tab');
    this.$gridPopin = _utilsDom2['default'].queryAll('.js-grid-popin');
    this.$wrapperPopin = _utilsDom2['default'].query('.js-wrapper-popin');
    this.$linkContactJob = _utilsDom2['default'].queryAll('.js-contact-job');
    this.$selectJob = _utilsDom2['default'].query('.js-select-job');
    this.$gridContainer = _utilsDom2['default'].query('.js-grid-container');
    this.$mainHeader = _utilsDom2['default'].query('.js-main-header');

    this.$mailObject = _utilsDom2['default'].queryAll('.js-mail-object');
    this.$boxSelect = _utilsDom2['default'].queryAll('.js-box-select');

    if (this.$gridContainer !== null) {
      this.gridContainerRect = this.$gridContainer.getBoundingClientRect();
      this.gridContainerWidth = this.$gridContainer.offsetWidth;
      this.gridContainerHeight = this.$gridContainer.offsetHeight;
    };

    this.onBtnBigPopinClick = this.onBtnBigPopinClick.bind(this);
    this.onDocumentDown = this.onDocumentDown.bind(this);
    this.onClickLinkContactJob = this.onClickLinkContactJob.bind(this);
    this.onBtnPopinClick = this.onBtnPopinClick.bind(this);
    this.onMailObjectClick = this.onMailObjectClick.bind(this);
    this.onBtnCloseBigPopinClick = this.onBtnCloseBigPopinClick.bind(this);

    document.addEventListener('click', this.onDocumentDown, this);

    for (var i = 0; i < this.$btnBigPopin.length; i++) {
      _utilsDom2['default'].addEventListener(this.$btnBigPopin[i], 'click', this.onBtnBigPopinClick);
    }

    for (i = 0; i < this.$linkContactJob.length; i++) {
      _utilsDom2['default'].addEventListener(this.$linkContactJob[i], 'click', this.onClickLinkContactJob);
    }

    for (i = 0; i < this.$btnPopin.length; i++) {
      _utilsDom2['default'].addEventListener(this.$btnPopin[i], 'click', this.onBtnPopinClick);
    }

    for (i = 0; i < this.$mailObject.length; i++) {
      _utilsDom2['default'].addEventListener(this.$mailObject[i], 'click', this.onMailObjectClick);
    }

    for (var i = 0; i < this.$btnCloseBigPopin.length; i++) {
      _utilsDom2['default'].addEventListener(this.$btnCloseBigPopin[i], 'click', this.onBtnCloseBigPopinClick);
    };
  }

  _createClass(AcmePopin, [{
    key: 'onBtnBigPopinClick',
    value: function onBtnBigPopinClick(e) {

      e.stopPropagation();

      var index = Number(e.currentTarget.getAttribute('data-index'));

      if (_utilsDom2['default'].hasClass('is-open', this.$bigPopin)) {

        for (var i = 0; i < this.$bigPopin.length; i++) {
          _utilsDom2['default'].removeClass('is-open', this.$bigPopin[i]);
          _utilsDom2['default'].removeClass('is-active', this.$wrapperPopin);
          _utilsDom2['default'].removeClass('scroll-disable', this.$body);
          _utilsDom2['default'].removeClass('is-out', this.$mainHeader);
        }
      } else {

        for (var i = 0; i < this.$bigPopin.length; i++) {
          _utilsDom2['default'].removeClass('is-open', this.$bigPopin[i]);
        }
        _utilsDom2['default'].addClass('is-active', this.$wrapperPopin);
        _utilsDom2['default'].addClass('scroll-disable', this.$body);
        _utilsDom2['default'].addClass('is-out', this.$mainHeader);
        _utilsDom2['default'].addClass('is-open', this.$bigPopin[index]);
      }

      this.isPopinOpened = true;
      this.currentPopinNode = this.$bigPopin[index];
    }
  }, {
    key: 'onBtnCloseBigPopinClick',
    value: function onBtnCloseBigPopinClick(e, index) {
      this.closePopin();
    }
  }, {
    key: 'onBtnPopinClick',
    value: function onBtnPopinClick(e) {

      e.stopPropagation();

      var index = e.currentTarget.getAttribute('data-index');
      var el = e.currentTarget.getBoundingClientRect();

      var posX = el.left - this.gridContainerRect.left;
      var posY = el.top - this.gridContainerRect.height;

      var gridTabWidth = this.$gridPopin[index].offsetWidth;
      var gridTabHeight = this.$gridPopin[index].offsetHeight;

      if (posX + gridTabWidth > this.gridContainerWidth) {
        this.$gridPopin[index].style.left = -100 + '%';
      } else {
        this.$gridPopin[index].style.left = 100 + '%';
      }

      if (_utilsDom2['default'].hasClass('is-active', this.$gridTab[index])) {

        for (var i = 0; i < this.$gridPopin.length; i++) {
          _utilsDom2['default'].removeClass('is-inactive', this.$gridTab[i]);
        }

        _utilsDom2['default'].removeClass('is-active', this.$gridTab[index]);
      } else {

        for (var i = 0; i < this.$gridPopin.length; i++) {
          _utilsDom2['default'].addClass('is-inactive', this.$gridTab[i]);
        }

        _utilsDom2['default'].addClass('is-active', this.$gridTab[index]);
      }

      this.isPopinOpened = true;
      this.currentPopinNode = this.$btnPopin[index];
    }
  }, {
    key: 'onClickLinkContactJob',
    value: function onClickLinkContactJob(e) {

      var index = Number(e.currentTarget.getAttribute('data-index')) + 1;
      this.closePopin();

      for (var i = 0; i < this.$boxSelect.length; i++) {
        _utilsDom2['default'].removeClass('is-active', this.$boxSelect[i]);
        _utilsDom2['default'].addClass('is-active', this.$boxSelect[1]);
        _utilsDom2['default'].removeClass('is-selected', this.$mailObject[i]);
        _utilsDom2['default'].addClass('is-selected', this.$mailObject[1]);
      };

      this.$selectJob.options[index].selected = true;
    }
  }, {
    key: 'closePopin',
    value: function closePopin() {

      for (var i = 0; i < this.$bigPopin.length; i++) {
        _utilsDom2['default'].removeClass('is-open', this.$bigPopin[i]);
      }

      if (this.$wrapperPopin != null) {
        _utilsDom2['default'].removeClass('is-active', this.$wrapperPopin);
        _utilsDom2['default'].removeClass('scroll-disable', this.$body);
        _utilsDom2['default'].removeClass('is-out', this.$mainHeader);
      };

      for (var i = 0; i < this.$gridTab.length; i++) {
        _utilsDom2['default'].removeClass('is-active', this.$gridTab[i]);
        _utilsDom2['default'].removeClass('is-inactive', this.$gridTab[i]);
      }

      this.isPopinOpened = false;
      this.currentPopinNode = null;
    }
  }, {
    key: 'onDocumentDown',
    value: function onDocumentDown(e) {

      if (this.isPopinOpened && this.currentPopinNode) {

        var node = e.target;
        var match = false;

        while (node.parentNode) {
          if (node == this.currentPopinNode) {
            match = true;
            break;
          }
          node = node.parentNode;
        }

        //if we click outside the currentPopin, close it
        if (!match) {
          this.closePopin();
        }
      } else {}
    }
  }, {
    key: 'onMailObjectClick',
    value: function onMailObjectClick(e) {

      for (var i = 0; i < this.$mailObject.length; i++) {
        _utilsDom2['default'].removeClass('is-selected', this.$mailObject[i]);
      }

      for (var i = 0; i < this.$boxSelect.length; i++) {
        _utilsDom2['default'].removeClass('is-active', this.$boxSelect[i]);
      }

      var dataMailObject = e.currentTarget.getAttribute('data-mail-object');
      _utilsDom2['default'].addClass('is-active', document.getElementById('objectMail' + dataMailObject));

      if (_utilsDom2['default'].hasClass('is-selected', e.currentTarget)) {
        _utilsDom2['default'].removeClass('is-selected', e.currentTarget);
      } else {
        _utilsDom2['default'].addClass('is-selected', e.currentTarget);
      }
    }
  }]);

  return AcmePopin;
})();

exports['default'] = AcmePopin;
module.exports = exports['default'];
});

;require.register("components/acme-root/index", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsBrowserSupport = require('utils/BrowserSupport');

var _utilsBrowserSupport2 = _interopRequireDefault(_utilsBrowserSupport);

var _utils$setTimeout = require('utils/$setTimeout');

var _utils$setTimeout2 = _interopRequireDefault(_utils$setTimeout);

var _utilsDom = require('utils/dom');

var _utilsDom2 = _interopRequireDefault(_utilsDom);

var AcmeRoot = (function () {
  function AcmeRoot() {
    _classCallCheck(this, AcmeRoot);

    this.$doc = document.documentElement || document;
    this.$win = window;
    this.$body = document.getElementsByTagName("body")[0];

    this.winWidth = this.$win.innerWidth || this.$doc.clientWidth || this.$body.clientWidth;
    this.winHeight = this.$win.innerHeight || this.$doc.clientHeight || this.$body.clientHeight;

    this.$wrapperLoad = _utilsDom2['default'].query('.js-wrapper-load');
    this.$linkRoot = _utilsDom2['default'].queryAll('.js-root');

    this.$mainNav = _utilsDom2['default'].query('.js-list-main-nav');
    this.$loadBar = _utilsDom2['default'].query('.js-load-bar');
    this.$content = _utilsDom2['default'].query('.js-content');

    this.$nav = _utilsDom2['default'].query('.js-main-nav');
    this.$mainHeader = _utilsDom2['default'].query('.js-main-header');
    this.$logo = _utilsDom2['default'].query('.js-logo');

    // this.$logoLoader  = dom.query('.js-logo-loader');

    // this.logoOffset       = this.$logo.offsetTop;
    // this.logoLoaderOffset = this.$logoLoader.offsetTop

    this.offsetLoadBar = this.$loadBar.offsetTop;
    this.offsetNav = this.$nav.offsetTop;

    this.transformValue = this.offsetLoadBar - this.$nav.offsetTop - 59;

    this.$maskRight = _utilsDom2['default'].query('.js-mask-right');
    this.offsetMaskRight = this.winWidth - this.$maskRight.offsetLeft;
    this.maskRightWidth = this.$maskRight.offsetWidth;

    this.$maskTop = _utilsDom2['default'].query('.js-mask-top');
    this.offsetMaskTop = this.$maskRight.offsetTop;
    this.maskTopHeight = this.$maskTop.offsetHeight;

    if (_utilsDom2['default'].hasClass('home', this.$body)) {
      this.$logo.style.transform = 'translateY(' + (this.offsetLoadBar - 150) + 'px)';
      this.$logo.style.opacity = '1';
    }

    this.$previewMask = _utilsDom2['default'].queryAll('.js-preview-mask');
    for (var i = 0; i < this.$previewMask.length; i++) {

      this.$previewMask[i].width = this.winWidth;
      this.$previewMask[i].height = this.winHeight;
    };

    this.crop = this.calculateAspectRatio(1600, 900, this.winHeight, this.winHeight, this.fit);

    this.deltaX = (this.crop.width - this.winWidth) / 2;
    this.deltaY = (this.crop.height - this.winHeight) / 2;
    this.loadImages();

    for (var i = 0; i < this.$linkRoot.length; i++) {
      this.$linkRoot[i].setAttribute('data-index', i);
    };

    this.onClickLinkRoot = this.onClickLinkRoot.bind(this);
    this.onLinkRootHover = this.onLinkRootHover.bind(this);
    this.onLinkRootOut = this.onLinkRootOut.bind(this);
    this.onMainNavHover = this.onMainNavHover.bind(this);

    for (var i = 0; i < this.$linkRoot.length; i++) {

      _utilsDom2['default'].addEventListener(this.$linkRoot[i], 'click', this.onClickLinkRoot);
      //dom.addEventListener( this.$linkRoot[i], 'mouseover', this.onLinkRootHover);
      //dom.addEventListener( this.$linkRoot[i], 'mouseout', this.onLinkRootOut);
      //dom.addEventListener( this.$mainNav, 'mouseover', this.onMainNavHover);
      //dom.addEventListener( this.$mainNav, 'mouseout', this.onMainNavOut);
    }

    (0, _utils$setTimeout2['default'])(function () {
      window.scrollTo(0, 0);
      _utilsDom2['default'].addClass('is-ready', this.$body);
      _utilsDom2['default'].addClass('scroll-disable', this.$body);
    }, 100, this);

    (0, _utils$setTimeout2['default'])(function () {
      window.scrollTo(0, 0);
      _utilsDom2['default'].addClass('intro', this.$body);
    }, 250, this);

    (0, _utils$setTimeout2['default'])(function () {
      this.$loadBar.style.transform = 'translateY(' + -this.transformValue + 'px) translateX(-50%)';

      if (_utilsDom2['default'].hasClass('home', this.$body)) {
        this.$logo.style.transition = ' .7s 1.22s cubic-bezier(0.125, 0.750, 0.415, 1.000)';
        this.$logo.style.transform = 'translateY(' + 0 + 'px)';
      };

      //this.$logoLoader.style.transform = 'translateY(' + (- this.logoLoaderOffset - this.logoOffset + 57 ) + 'px)';
    }, 1000, this);

    (0, _utils$setTimeout2['default'])(function () {
      _utilsDom2['default'].removeClass('scroll-disable', this.$body);
    }, 1900, this);

    (0, _utils$setTimeout2['default'])(function () {
      _utilsDom2['default'].addClass('invisible', this.$wrapperLoad);
    }, 2600, this);
  }

  _createClass(AcmeRoot, [{
    key: 'calculateAspectRatio',
    value: function calculateAspectRatio(srcWidth, srcHeight, maxWidth, maxHeight, fit) {

      var ratio = [maxWidth / srcWidth, maxHeight / srcHeight];
      ratio = fit ? Math.min(ratio[0], ratio[1]) : Math.max(ratio[0], ratio[1]);

      return { width: srcWidth * ratio, height: srcHeight * ratio };
    }
  }, {
    key: 'loadImages',
    value: function loadImages() {

      // this.imgArray= new Array();
      // this.ctx       = new Array();

      // for (var i = 0; i < this.$previewMask.length; i++) {

      //   this.ctx[i]          = this.$previewMask[i].getContext('2d');
      //   this.imgArray[i]     = new Image(0,0);
      //   this.imgArray[i].src = "wp-content/themes/immersivegarden/images/preview/"+ "preview-" + i + ".jpg";

      //   var self=this;

      //   (function(index){

      //     self.imgArray[index].onload = function(){
      //       self.imgArray[index].onload = null;
      //       self.draw( index );
      //     }.bind(self);

      //   })(i);

      // };

    }
  }, {
    key: 'draw',
    value: function draw(index) {

      // var xRect      = (this.offsetMaskRight - (this.maskRightWidth/2));
      // var yRect      = (this.maskTopHeight / 2);
      // var widthRect  = (this.winWidth - this.maskRightWidth);
      // var heightRect = (this.winHeight - (this.maskTopHeight)) + (this.maskTopHeight);

      // console.log('__draw__', index);

      // this.ctx[index].drawImage(this.imgArray[index], (-this.deltaX), (-this.deltaY), this.crop.width, this.crop.height);
      // this.ctx[index].globalCompositeOperation = "destination-out";
      // this.ctx[index].fillRect(xRect, yRect, widthRect, heightRect);

    }
  }, {
    key: 'onClickLinkRoot',
    value: function onClickLinkRoot(e) {

      e.preventDefault();

      console.log('onClickLinkRoot');

      var el = e.currentTarget;

      var redirectLink = e.currentTarget.href;

      (0, _utils$setTimeout2['default'])(function () {
        _utilsDom2['default'].addClass('is-out', this.$mainHeader);
        _utilsDom2['default'].addClass('is-out', this.$content);
      }, 50, this);

      setTimeout(function () {
        window.location = redirectLink;
      }, 100);
    }

    // onLinkRootHover(e){
    //   var el    = e.currentTarget;
    //   var index = el.getAttribute('data-index');

    //   $setTimeout(function(){
    //     dom.addClass('is-active', this.$previewMask[index]);
    //   }, 50, this);
    // }

    // onLinkRootOut(e){
    //   var el    = e.currentTarget;
    //   var index = el.getAttribute('data-index');

    //   dom.removeClass('is-active', this.$previewMask[index]);
    // }

  }, {
    key: 'onMainNavHover',
    value: function onMainNavHover() {
      // console.log('onMainNavHover');
      // dom.removeClass('invisible', this.$wrapperLoad);

      // $setTimeout(function(){
      //   dom.addClass( 'is-half', this.$body );
      // }, 50, this);
    }
  }, {
    key: 'onMainNavOut',
    value: function onMainNavOut() {
      // console.log('out');
      // dom.removeClass( 'is-half', this.$body );

      // $setTimeout(function(){
      //   dom.addClass('invisible', this.$wrapperLoad);
      // }, 550, this);
    }
  }, {
    key: 'onLinkRootHover',
    value: function onLinkRootHover(e) {

      // var el    = e.currentTarget;
      // var index = el.getAttribute('data-index');

      // dom.removeClass('invisible', this.$wrapperLoad);

      // dom.removeClass('is-leaving', this.$previewMask[index]);

      // $setTimeout(function(){
      //   dom.addClass( 'is-half', this.$body );
      // }, 50, this);

      // $setTimeout(function(){
      //   dom.addClass('is-active', this.$previewMask[index]);
      // }, 350, this);

    }
  }, {
    key: 'onLinkRootOut',
    value: function onLinkRootOut(e) {

      // var el    = e.currentTarget;
      // var index = el.getAttribute('data-index');

      // for (var i = 0; i < this.$previewMask.length; i++) {
      //   dom.removeClass('is-active', this.$previewMask[i]);
      // };

      // dom.removeClass( 'is-half', this.$body );

      // $setTimeout(function(){
      //   dom.addClass('invisible', this.$wrapperLoad);
      // }, 550, this);
    }
  }]);

  return AcmeRoot;
})();

exports['default'] = AcmeRoot;
module.exports = exports['default'];
});

;require.register("components/acme-search/index", function(exports, require, module) {
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var support = require('utils/BrowserSupport');
var $setTimeout = require('utils/$setTimeout');
var dom = require('utils/dom');

var AcmeSearch = (function () {
  function AcmeSearch() {
    _classCallCheck(this, AcmeSearch);

    this.$body = document.getElementsByTagName("body")[0];
    this.$btnSearch = dom.query('.js-search');
    this.$inputSearch = dom.query('.js-input-search');
    this.onBtnSearchClick = this.onBtnSearchClick.bind(this);

    dom.addEventListener(this.$btnSearch, 'click', this.onBtnSearchClick);
  }

  _createClass(AcmeSearch, [{
    key: 'onBtnSearchClick',
    value: function onBtnSearchClick() {

      if (dom.hasClass('is-searching', this.$body)) {
        dom.removeClass('is-searching', this.$body);
      } else {
        dom.addClass('is-searching', this.$body);

        //delay to trigger the focus, if not, the animation is broken
        $setTimeout(function () {
          this.$inputSearch.focus();
        }, 750, this);
      }
    }
  }]);

  return AcmeSearch;
})();

exports['default'] = AcmeSearch;
module.exports = exports['default'];
});

;require.register("initialize", function(exports, require, module) {
'use strict';

var Application = require('./application');
Application.initialize();
});

require.register("utils/$setTimeout", function(exports, require, module) {
"use strict";

module.exports = function (callback, delay, ctx) {

  return setTimeout(function () {
    callback.call(ctx);
  }, delay);
};
});

;require.register("utils/BrowserSupport", function(exports, require, module) {
'use strict';

var support = {},

/** tests list */
tests = null,
    docElement = document.documentElement,

/** the div to test properties on */
testDiv = document.createElement('div'),
    testDivStyle = testDiv.style,
    prefixes = ' Webkit WebKit Moz O Ms'.split(' '),
    cssprefixes = ' -webkit- -webkit- -moz- -o- -ms-'.split(' '),
    prefixesLength = prefixes.length,
    useCache = false,

/**
 * check if the given property exists in div.style or window
 * and returns the prefixed version or if not found, false;
 *
 * @param {string} prop Name of the property to check
 * @param {Boolean} cssformat return css prefixed version ? default: false
 * @return {String|Boolean} prefixed version, or if not found, false.
 */
testProperty = function testProperty(prop, cssformat) {

  if (useCache & prop in support) {
    return support[prop];
  }

  var formatForCss = typeof cssformat != "undefined" ? cssformat : false,
      propd,
      l = prefixesLength;

  propd = prop.replace(/(^[a-z])/g, function (val) {
    return val.toUpperCase();
  }).replace(/\-([a-z])/g, function (val, a) {
    return a.toUpperCase();
  });

  while (l--) {
    if (prop in testDivStyle) {
      return prop;
    } else if (prefixes[l] + propd in testDivStyle) {
      return formatForCss ? cssprefixes[l] + prop.toLowerCase() : prefixes[l] + propd;
    } else if (typeof window[prefixes[l].toLowerCase() + propd] !== 'undefined') {
      return prefixes[l].toLowerCase() + propd;
    } else if (typeof window[prefixes[l] + propd] != 'undefined') {
      return prefixes[l] + propd;
    }
  }

  return false;
};

tests = {

  prefix: function prefix() {
    var prefixedProp = testProperty('transform');
    return !!prefixedProp ? prefixedProp.replace('Transform', '') : '';
  },

  cssprefix: function cssprefix() {
    var prefixedProp = testProperty('transform', true);
    return !!prefixedProp ? prefixedProp.replace('transform', '') : '';
  },

  transform: function transform() {
    return testProperty('transform');
  },

  transformCss: function transformCss() {
    return testProperty('transform', true);
  },

  transform3d: function transform3d() {
    return 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix() || !!testProperty('perspective');
  },

  translateZ: function translateZ() {
    return this.transform3d() ? 'translateZ(0)' : '';
  },

  transformOrigin: function transformOrigin() {
    return testProperty('transformOrigin');
  },

  backfaceVisibility: function backfaceVisibility() {
    return testProperty('backfaceVisibility');
  },

  perspective: function perspective() {
    return testProperty('perspective');
  },

  perspectiveOrigin: function perspectiveOrigin() {
    return testProperty('perspectiveOrigin');
  },

  transition: function transition() {
    return testProperty('transition');
  },

  transitionProperty: function transitionProperty() {
    return testProperty('transitionProperty');
  },

  transitionDuration: function transitionDuration() {
    return testProperty('transitionDuration');
  },

  transitionTimingFunction: function transitionTimingFunction() {
    return testProperty('transitionTimingFunction');
  },

  transitionDelay: function transitionDelay() {
    return testProperty('transitionDelay');
  },

  transitionEvent: function transitionEvent() {
    return testProperty('transitionEvent');
  },

  transitionEventPrefix: function transitionEventPrefix() {
    return !!testProperty('transitionEvent') ? testProperty('transitionEvent').replace('TransitionEvent', '').toLowerCase() : '';
  },

  transitionEnd: function transitionEnd() {
    return this.transitionEventPrefix() !== '' ? this.transitionEventPrefix() + 'TransitionEnd' : 'transitionend';
  },

  touch: function touch() {
    return 'ontouchstart' in window || /*|| (navigator.maxTouchPoints > 0)*/navigator.msMaxTouchPoints > 0;
  },

  //IE10 Pointers
  msPointer: function msPointer() {
    return !!window.navigator.msPointerEnabled;
  },

  //IE11 Pointers
  pointer: function pointer() {
    return !!window.navigator.pointerEnabled;
  },

  ipad: function ipad() {
    return navigator.userAgent.match(/.*(iPad).*/) ? true : false;
  },
  iphone: function iphone() {
    return navigator.userAgent.match(/.*(iPhone).*/) ? true : false;
  },
  android: function android() {
    return navigator.userAgent.match(/.*(Android).*/) ? true : false;
  },

  /** browser */
  ltIE9: function ltIE9() {
    return window.attachEvent && !window.addEventListener;
  },

  uidown: function uidown() {
    return this.touch() ? 'touchstart' : this.pointer() ? 'pointerdown' : this.msPointer() ? 'MSPointerDown' : 'mousedown';
  },
  uiup: function uiup() {
    return this.touch() ? 'touchend' : this.pointer() ? 'pointerup' : this.msPointer() ? 'MSPointerUp' : 'mouseup';
  },
  uimove: function uimove() {
    return this.touch() ? 'touchmove' : this.pointer() ? 'pointermove' : this.msPointer() ? 'MSPointerMove' : 'mousemove';
  },
  uienter: function uienter() {
    return this.pointer() ? 'pointerenter' : this.msPointer() ? 'mouseenter' : 'mouseenter';
  },
  uileave: function uileave() {
    return this.pointer() ? 'pointerleave' : this.msPointer() ? 'mouseleave' : 'mouseleave';
  },

  pointerdown: function pointerdown() {
    return this.touch() ? 'touchstart' : this.pointer() ? 'pointerdown' : this.msPointer() ? 'MSPointerDown' : 'mousedown';
  },
  pointerup: function pointerup() {
    return this.touch() ? 'touchend' : this.pointer() ? 'pointerup' : this.msPointer() ? 'MSPointerUp' : 'mouseup';
  },
  pointermove: function pointermove() {
    return this.touch() ? 'touchmove' : this.pointer() ? 'pointermove' : this.msPointer() ? 'MSPointerMove' : 'mousemove';
  },
  pointerenter: function pointerenter() {
    return this.pointer() ? 'pointerenter' : this.msPointer() ? 'mouseenter' : 'mouseenter';
  },
  pointerleave: function pointerleave() {
    return this.pointer() ? 'pointerleave' : this.msPointer() ? 'mouseleave' : 'mouseleave';
  },

  smallscreen: function smallscreen() {
    return window.innerWidth < 700;
  },

  canvas: function canvas() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  },

  video: function video() {
    var video = document.createElement("video");
    return typeof video.play != "undefined";
  },

  audio: function audio() {
    var audio = document.createElement("audio");
    return typeof audio.play != "undefined";
  }

};

var featureName;
for (var feature in tests) {
  if (tests.hasOwnProperty(feature)) {
    featureName = feature;
    support[featureName] = tests[feature]();
  }
}

/**
 * check if the given property exists in div.style or window
 * and returns a boolean
 *
 * @param {string} prop Name of the property to check
 * @return {Boolean} true, or if not found, false.
 */
support['test'] = function (prop) {
  return !!testProperty(prop);
};

/**
 * check if the given property exists in div.style or window and
 * returns it with the vendor prefixe
 *
 * @param {string} prop Name of the property to check
 * @return {String|Boolean} prefix + prop, or if not found, false.
 */
support['getPrefixed'] = function (prop) {
  return testProperty(prop);
};

/**
 * same as getPrefixed but it returns the css perfixed version
 *
 * @param {string} prop Name of the property to check
 * @return {String|Boolean} prefix + prop, or if not found, false.
 */
support['getCssPrefixed'] = function (prop) {
  return testProperty(prop, true);
};

useCache = true;

module.exports = support;
});

require.register("utils/Cubic", function(exports, require, module) {
"use strict";

function cubic(a, b, c, d) {
  if (a < 0 || a > 1 || c < 0 || c > 1) {
    return function (x) {
      return x;
    };
  }
  return function (x) {
    var start = 0,
        end = 1;
    while (1) {
      var f = function f(a, b, m) {
        return 3 * a * (1 - m) * (1 - m) * m + 3 * b * (1 - m) * m * m + m * m * m;
      };

      var mid = (start + end) / 2;
      ;
      var xEst = f(a, c, mid);
      if (Math.abs(x - xEst) < 0.001) {
        return f(b, d, mid);
      }
      if (xEst < x) {
        start = mid;
      } else {
        end = mid;
      }
    }
  };
}

module.exports = cubic;
});

require.register("utils/Dispatcher", function(exports, require, module) {
"use strict";

function Dispatcher() {
  this.listeners = [];
}

Dispatcher.prototype = {

  addListener: function addListener(eventName, fn, id) {
    this.removeListener(eventName, fn), this.listeners.push({ name: eventName, closure: fn, id: id });

    //console.log('addListener', eventName, id);
  },

  removeListener: function removeListener(eventName, fn) {

    var evt,
        i = 0,
        l = this.listeners.length;

    for (; i < l; i++) {
      evt = this.listeners[i];
      if (evt.name === eventName && evt.closure === fn) {
        //console.log('removeListener', eventName, evt.id);
        this.listeners.splice(i, 1);
        i--;
        l--;
      }
    }
  },

  dispatch: function dispatch(eventName, params) {
    var evt,
        i = 0,
        l = this.listeners.length;
    for (; i < l; i++) {
      evt = this.listeners[i];
      if (!evt) continue;
      if (evt.name === eventName) {
        if (typeof params != "undefined") {
          evt.closure.apply(this, params);
        } else {
          evt.closure();
        }
      }
    }
  },

  removeAllListeners: function removeAllListeners() {
    this.listeners.length = 0;
  }

};

module.exports = Dispatcher;
});

require.register("utils/EnterFrame", function(exports, require, module) {
'use strict';

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

EnterFrame.prototype.start = function () {
  if (this.paused) {
    this.paused = false;
    this.animate();
  }
};

EnterFrame.prototype.stop = function () {
  if (!this.paused) {
    this.paused = true;
    cancelAnimationFrame(this.raf);
  }
};

EnterFrame.prototype.animate = function () {
  var self = this;
  this.dispatch(EventList.ENTER_FRAME);
  if (this.paused) return;
  this.raf = requestAnimationFrame(function () {
    self.animate();
  });
};

EnterFrame.getInstance = function () {
  if (!isInitialized) {
    isInitialized = true;
    instance = new EnterFrame();
  }
  return instance;
};

module.exports = EnterFrame;
});

require.register("utils/EventDispatcher", function(exports, require, module) {
'use strict';

var _ = require('utils/utils');

var EventDispatcher = {

    /**
     *  normalise event names 
     */
    normalize: function normalize(eventName) {
        return eventName.replace(':', '');
    },

    /**
     *  list of events callbacks
     */
    listeners: [],

    on: function on(eventName, fn, target) {
        var eventName = this.normalize(eventName);
        this.listeners.push({ name: eventName, closure: fn, target: target });
    },

    /**
     *  remove callback to a global event chanel
     */
    off: function off(eventName, fn) {

        var evt,
            i = 0,
            l = this.listeners.length,
            eventName = this.normalize(eventName);

        for (; i < l; i++) {
            evt = this.listeners[i];
            if (evt.name === eventName && evt.closure === fn) {
                this.listeners.splice(i, 1);
                i--;
                l--;
            }
        }
    },

    /**
     *  trigger callbacks from a global event chanel
     */
    trigger: function trigger(eventName, params) {

        var evt,
            i = 0,
            l = this.listeners.length,
            eventName = this.normalize(eventName);

        for (; i < l; i++) {
            evt = this.listeners[i];
            if (!evt) continue;
            if (evt.name === eventName) {
                if (typeof params != "undefined") {
                    evt.closure.apply(evt.target, params);
                } else {
                    evt.closure.call(evt.target);
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
    setHandler: function setHandler(handlerName, handler) {
        this.handlers[this.normalize(handlerName)] = handler;
    },

    /**
     * trigger global request chanel
     */
    request: function request(handlerName, params) {
        var handlerName = this.normalize(handlerName);
        if (typeof this.handlers[handlerName] != 'undefined') {
            return typeof params != "undefined" ? this.handlers[handlerName].apply(this, params) : this.handlers[handlerName]();
        } else {
            return { error: 'request error :: no handler found', handler: handlerName };
        }
    },

    /**
     * COMPATIBILITY
     */
    subscribe: function subscribe(eventName, fn, target) {
        _.warn("EventDispatcher.on is depreciated and will be removed. Please use EventDispatcher.on instead");
        this.subscribe(eventName, fn, target);
    },
    unsubscribe: function unsubscribe(eventName, fn) {
        _.warn("EventDispatcher.off is depreciated and will be removed. Please use EventDispatcher.off instead");
        this.off(eventName, fn, target);
    },
    publish: function publish(eventName, params) {
        _.warn("EventDispatcher.trigger is depreciated and will be removed. Please use EventDispatcher.trigger) instead");
        this.trigger(eventName, params);
    }

};

module.exports = EventDispatcher;
});

require.register("utils/EventList", function(exports, require, module) {
'use strict';

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
  SEQUENCE_LOADED: 'document.SEQUENCE_LOADED'

};

EventList.add = function (key, value) {
  EventList[key] = value;
};

module.exports = EventList;
});

require.register("utils/Fx", function(exports, require, module) {
'use strict';

var EventDispatcher = require('utils/EventDispatcher');
var EventList = require('utils/EventList');
var CubicBezier = require('utils/CubicBezier');
var EnterFrame = require('utils/EnterFrame');
var Cubic = require('utils/Cubic');
var _ = require('utils/utils');

frame = EnterFrame.getInstance();

function Fx(options) {

  var self = this;

  this.options = _.extend({
    id: '',
    startAt: 0,
    duration: 400,
    delay: 0,
    easing: [0.250, 0.250, 0.750, 0.750],
    step: function step() {},
    complete: function complete() {}
  }, options || {});

  this.animDuration = this.options.duration;
  this.animStartTime = 0;
  this.animProgress = 0;

  this.cubicMethod = Cubic.apply(this, this.options.easing);

  if (this.options.startAt != 0) {
    this.animProgress = this.options.duration * this.options.startAt;
  }

  if (this.options.delay != 0) {
    this.delay = setTimeout(function () {
      self.startFx();
    }, this.options.delay);
  } else {
    this.startFx();
  }
}

Fx.prototype = {

  startFx: function startFx() {
    this._step = this.step.bind(this);
    this.animStartTime = Date.now();
    frame.addListener(EventList.ENTER_FRAME, this._step, 'fx');
    frame.start();
  },

  step: function step() {

    if (this.ended) return;

    if (this.animProgress >= this.options.duration) {
      this.stop(true);
      return;
    }

    var timestamp = Date.now();
    var diff = timestamp - this.animStartTime;
    this.animRatio = this.animProgress !== 0 ? this.cubicMethod(this.animProgress / this.options.duration) : 0;
    this.animProgress = this.animProgress + diff;
    this.animStartTime = timestamp;
    this.options.step(this.animRatio);
  },

  stop: function stop(doComplete) {
    frame.removeListener(EventList.ENTER_FRAME, this._step);
    this.ended = true;
    if (doComplete) {
      this.options.complete();
    }
  },

  pause: function pause() {
    frame.removeListener(EventList.ENTER_FRAME, this._step);
  },

  resume: function resume() {
    frame.addListener(EventList.ENTER_FRAME, this._step);
    frame.start();
  },

  clear: function clear() {
    this.stop();
  }

};

module.exports = Fx;
});

require.register("utils/degToRad", function(exports, require, module) {
"use strict";

var degToRadMult = Math.PI / 180;

module.exports = function (angle) {
  return angle * degToRadMult;
};
});

require.register("utils/dom", function(exports, require, module) {
'use strict';

var support = require('utils/BrowserSupport');
var _ = require('utils/utils');

function queryAll(selector, scope) {
  if (typeof selector !== "string") return selector;
  scope = scope || document;
  return scope.querySelectorAll(selector);
};

function query(selector, scope) {
  if (typeof selector !== "string") return selector;
  scope = scope || document;
  return scope.querySelector(selector);
}

function addClass(cls, node) {

  if (node.classList) {
    node.classList.add(cls);
  } else {
    var cur = ' ' + (node.getAttribute('class') || '') + ' ';
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      node.setAttribute('class', (cur + cls).trim());
    }
  }
};

function removeClass(cls, node) {
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
  return new RegExp(' ' + className + ' ').test(' ' + node.className + ' ');
};

function getOrSetAttribute(node, attrName, attrValue) {
  if (typeof attrValue !== "undefined") {
    node.setAttribute(attrName, attrValue);
  }
  return node.getAttribute(attrName);
};

function fixEvent(event) {

  var doc = document.documentElement,
      body = document.body,
      pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0),
      pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);

  var fixedEvnt = {
    target: event.srcElement,
    currentTarget: event.srcElement,
    pageX: pageX,
    pageY: pageY,
    stopPropagation: function stopPropagation() {
      this.cancelBubble = true;
    },
    preventDefault: function preventDefault() {
      this.returnValue = false;
    }
  };

  for (var k in fixedEvnt) {
    if (typeof event[k] === 'undefined') {
      event[k] = fixedEvnt[k];
    }
  }

  return event;
}

function addEventListener(node, eventName, callback) {
  if (node.addEventListener) {
    node.addEventListener(eventName, callback, false);
  } else if (node.attachEvent) {
    node.attachEvent("on" + eventName, callback);
  }
}

function removeEventListener(node, eventName, callback) {

  if (!callback || typeof callback === "undefined") {
    return;
  }

  if (node.removeEventListener) {
    node.removeEventListener(eventName, callback);
  } else if (node.detachEvent) {
    node.detachEvent("on" + eventName, callback);
  }
}

function setStyle(node, props) {

  for (var k in props) {
    var prop = support.getPrefixed(k);
    if (_.isArray(node) || node.length) {
      for (var i = 0, l = node.length; i < l; i++) {
        node[i].style[prop] = props[k];
      }
    } else {
      node.style[prop] = props[k];
    }
  }
}

function transform(node, transformPorps) {

  if (support.transform) {

    var transform = '';

    if ('translateX' in transformPorps) transform += 'translateX(' + transformPorps.translateX + ') ';

    if ('translateY' in transformPorps) transform += 'translateY(' + transformPorps.translateY + ') ';

    if ('scale' in transformPorps) transform += 'scale(' + transformPorps.scale + ') ';

    if ('force3D' in transformPorps) transform += " " + support.translateZ;

    this.setStyle(node, {
      transform: transform
    });
  } else {

    var styles = {};

    if ('translateX' in transformPorps) styles.left = transformPorps.translateX;

    if ('translateY' in transformPorps) styles.top = transformPorps.translateY;

    if ('scale' in transformPorps) styles.zoom = transformPorps.scale;

    this.setStyle(node, styles);
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
});

require.register("utils/parse", function(exports, require, module) {
"use strict";

function createNamespace(path) {
    var namespaceArr = path.split("."),
        namespace = null,
        root = window;
    for (var i = 0; i < namespaceArr.length; i++) {
        namespace = namespaceArr[i];
        root[namespace] = root[namespace] || {};
        root = root[namespace];
    }
    return root;
}

function namespace(path, root) {
    var namespaceArr = path.split("."),
        namespace = null,
        root = root || this;
    for (var i = 0; i < namespaceArr.length; i++) {
        namespace = namespaceArr[i];
        root[namespace] = root[namespace] || {};
        root = root[namespace];
    }
    return root;
}
});

;require.register("utils/requestFullScreen", function(exports, require, module) {
"use strict";

var vendors = ["moz", "webkit", "", "ms", "o"],
    l = vendors.length,
    fs,
    requestFn,
    cancelFn,
    eventName,
    isFullScreen;

if (document.cancelFullscreen !== undefined) {
    requestFn = "requestFullscreen";
    cancelFn = "exitFullscreen";
    eventName = "fullscreenchange";
} else {
    while (l--) {
        if ((vendors[l] != "moz" || document.mozFullScreenEnabled) && document[vendors[l] + "CancelFullScreen"] !== undefined) {
            requestFn = vendors[l] + "RequestFullScreen";
            cancelFn = vendors[l] + "CancelFullScreen";
            eventName = vendors[l] + "fullscreenchange";
            isFullScreen = vendors[l] == "webkit" ? vendors[l] + "IsFullScreen" : vendors[l] + "FullScreen";
        }
    }
}

module.exports = {
    requestFn: requestFn,
    cancelFn: cancelFn,
    eventName: eventName,
    isFullScreen: isFullScreen
};
});

require.register("utils/utils", function(exports, require, module) {
'use strict';

function isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]' || Object.prototype.toString.call(object) === '[object NodeList]';
}

function extend() {

    var options,
        k,
        baseObject = arguments[0] || {},
        i = 1,
        length = arguments.length;

    if (typeof baseObject !== "object" && typeof baseObject !== 'function') baseObject = {};

    for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (k in options) {
                if (options[k] !== undefined) {
                    baseObject[k] = options[k];
                }
            }
        }
    }

    return baseObject;
};

function has(key, scope) {
    return key in scope;
}

function clone(obj) {
    return isArray(obj) ? obj.slice() : extend({}, obj);
}

function isFunction(fn) {
    return typeof fn === "function";
}

function warn(msg) {
    console.log('[Scriptease warn]: ' + msg);
}

var nop = function nop() {};

var nob = {};

module.exports = {
    isArray: isArray,
    extend: extend,
    has: has,
    clone: clone,
    isFunction: isFunction,
    nop: nop,
    nob: nob,
    warn: warn
};
});

;
//# sourceMappingURL=app.js.map