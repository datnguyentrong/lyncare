var support = require('utils/BrowserSupport');
var $setTimeout = require('utils/$setTimeout');
var dom = require('utils/dom');

import AcmeSearch  from "components/acme-search";
import AcmePopin from "components/acme-popin";
import AcmeBurger from "components/acme-burger";
import AcmeMap from "components/acme-map";
import AcmeRoot from "components/acme-root";
import AcmeNewsletter from "components/acme-newsletter";


var Application = {

    initialize: function(){

      this.$doc                   = document.documentElement || document;
      this.$win                   = window;
      this.$body                  = document.getElementsByTagName("body")[0];
      this.bodyRect               = this.$body.getBoundingClientRect();

      this.$mouseIcon             = dom.query('.js-mouse');
      this.$wrapperHeader         = dom.query('.js-wrapper-header');
      this.$submitForm            = dom.query('.js-submit-form');
      this.$scrollContainer       = dom.query('.js-scroll-container');
      this.$selectAnchorIndustrie = dom.query('.js-anchor-industries');

      this.$parallax              = dom.queryAll( '.js-parallax' );
      this.$animScroll            = dom.queryAll('.js-scroll-anim');


      this.resizeTimer   = null;
      this.winHeight     = 0;
      this.winWidth      = 0;
      this.halfWinHeight = 0;
      this.halfWinWidth  = 0;

      this.winWidth      = this.$win.innerWidth || this.$doc.clientWidth || this.$body.clientWidth;
      this.winHeight     = this.$win.innerHeight|| this.$doc.clientHeight|| this.$body.clientHeight;

      this.bodyHeight    = 0;
      this.windowHeight  = 0;
      this.windowWidth   = 0;
      this.scrollRatio   = 0;
      this.scrollTop     = 0;
      this.currScrollTop = 0;

      this.userHasScrolled = false;


      this.animScrollArr = [];
      for (var i = 0, l = this.$animScroll.length; i < l; i++) {
        var el = {
          elRect : this.$animScroll[i].getBoundingClientRect(),
          anim: this.$animScroll[i].getAttribute('data-anim'),
          delay: Number(this.$animScroll[i].getAttribute('data-delay')) / 1000,
          offset: Number(this.$animScroll[i].getAttribute('data-offset')),
          time: Number(this.$animScroll[i].getAttribute('data-time')) / 1000,
          offsetTop: ((this.$animScroll[i].getBoundingClientRect().top + this.scrollTop) - this.$animScroll[i].offsetHeight) - (this.winHeight - 280)
        }
        this.animScrollArr.push(el);
      }




      this.numParallax = this.$parallax.length;
      this.objectsArr = new Array( this.numParallax );
      for(var i=0; i<this.numParallax; i++){
        this.objectsArr[i] = {
          el: this.$parallax[i],
          ratio: this.$parallax[i].getAttribute('data-ratio')
        };

        console.log(this.objectsArr[i].offsetTop);

      }

      if (this.$submitForm != null) {
        this.$submitForm.innerHTML = this.$submitForm.innerHTML + '<div class="btn btn--square bg--yellow align-center valign-bottom wrapper--valign"><svg version="1.1" class="ico ico--arrow cell" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20.2 4.7" enable-background="new 0 0 20.2 4.7" xml:space="preserve"><path fill="#fff" d="M0,2.6h16v-1H0V2.6z M16.2,0v4.7l4.1-2.4L16.2,0z"/></svg><div class="wrapper wrapper--panel wrapper--valign bg--dark btn--square__overlay"><svg version="1.1" class="ico ico--arrow cell" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 20.2 4.7" enable-background="new 0 0 20.2 4.7" xml:space="preserve"><path fill="#FFFFFF" d="M0,2.6h16v-1H0V2.6z M16.2,0v4.7l4.1-2.4L16.2,0z"/></svg></div></div>';
      };

      document.addEventListener("scroll", this.onScroll.bind(this) );

      dom.addEventListener( this.$win, 'resize', this.onResize.bind(this) );
      dom.addEventListener( this.$win, 'orientationchange', this.onResize.bind(this) );
      
      if (this.$selectAnchorIndustrie !== null) {
        dom.addEventListener( this.$selectAnchorIndustrie, 'change', this.selectAnchorIndustrieClick.bind(this) );
      };

      //TODO: IE8

      this.acmeSearch       = new AcmeSearch();
      this.acmePopin        = new AcmePopin();
      this.acmeMap          = new AcmeMap();
      this.acmeBurger       = new AcmeBurger();
      this.acmeRoot         = new AcmeRoot();
      this.acmeNewsletter   = new AcmeNewsletter();

      this.onResize();
      this.onEnterFrame();

    },


    onResize: function () {

      var winWidth  = this.$win.innerWidth || this.$doc.clientWidth || this.$body.clientWidth;
      var winHeight = this.$win.innerHeight|| this.$doc.clientHeight|| this.$body.clientHeight;

      //IE 7/8 willt triggerresize event on dom node size change
      if( winWidth == this.lastWinWidth && winHeight == this.lastWinHeight ){
        return;
      }

      this.winWidth  = winWidth;
      this.winHeight = winHeight;
      this.lastWinWidth  = this.winWidth;
      this.lastWinHeight = this.winHeight;

      //working alternative for ios7 height issue but hardcoded :
      if (support.isIOS7 && this.winWidth > this.winHeight)
        this.winHeight -= 20;

      this.halfWinHeight = this.winHeight >> 1;
      this.halfWinWidth = this.winWidth >> 1;
      this.quarterWinWidth = this.halfWinWidth >> 1;
      this.quarterWinHeight = this.halfWinHeight >> 1;
      this.winRatio = this.winWidth / this.winHeight;  

      this.updatescrollHeight();

    },

    updatescrollHeight: function(){
      this.scrollContentHeight =  this.$scrollContainer.clientHeight;
      document.getElementById('fake-scroll').style.height = this.scrollContentHeight + 'px';
    },

    onScroll: function () {
      this.scrollTop =  window.pageYOffset || document.documentElement.scrollTop;
    },
  
    onEnterFrame: function(){

      requestAnimationFrame( this.onEnterFrame.bind(this) );

      if (this.winWidth > 1024) {

        for(var i=0; i< this.numParallax; i++){
            this.objectsArr[i].el.style[support.transform] = "translateY("+( ( this.scrollTop -  this.scrollRatio ) *  this.objectsArr[i].ratio )+"px) translateZ(0)";
        }

        for(var i=0; i < this.$animScroll.length; i++){

          if (this.animScrollArr[i].offset != null) {
            if (this.scrollTop > (this.animScrollArr[i].offsetTop + this.animScrollArr[i].offset)) {
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


        this.currScrollTop += (this.scrollTop - this.currScrollTop) * (0.075);

        this.$scrollContainer.style[ support.transform ] = 'translateY(' + (-this.currScrollTop) + 'px) translateZ(0)';

     };

    },

    selectAnchorIndustrieClick:function(e){

      var anchor = this.$selectAnchorIndustrie.value;
      var scrollToAnchor = document.getElementById(anchor);

      var scrollToAnchorRect = scrollToAnchor.getBoundingClientRect();

      window.scrollTo(0,scrollToAnchorRect.top);

      this.$selectAnchorIndustrie.options[0].selected = true;

    }

};

module.exports = Application;