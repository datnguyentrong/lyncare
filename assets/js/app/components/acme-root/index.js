import support from 'utils/BrowserSupport';
import $setTimeout from 'utils/$setTimeout';
import dom from 'utils/dom';

export default class AcmeRoot {

  constructor(){
    this.$doc       = document.documentElement || document;
    this.$win       = window;
    this.$body      = document.getElementsByTagName("body")[0];

    this.winWidth  = this.$win.innerWidth || this.$doc.clientWidth || this.$body.clientWidth;
    this.winHeight = this.$win.innerHeight|| this.$doc.clientHeight|| this.$body.clientHeight;

    this.$wrapperLoad = dom.query('.js-wrapper-load');
    this.$linkRoot    = dom.queryAll('.js-root');

    this.$mainNav     = dom.query('.js-list-main-nav');
    this.$loadBar     = dom.query('.js-load-bar');
    this.$content     = dom.query('.js-content');

    this.$nav         = dom.query('.js-main-nav');
    this.$mainHeader  = dom.query('.js-main-header');
    this.$logo        = dom.query('.js-logo');


    // this.$logoLoader  = dom.query('.js-logo-loader');

    // this.logoOffset       = this.$logo.offsetTop;
    // this.logoLoaderOffset = this.$logoLoader.offsetTop

    this.offsetLoadBar = this.$loadBar.offsetTop; 
    this.offsetNav     = this.$nav.offsetTop;

    this.transformValue = this.offsetLoadBar - this.$nav.offsetTop - 59;

    this.$maskRight      = dom.query('.js-mask-right');
    this.offsetMaskRight = this.winWidth - this.$maskRight.offsetLeft;
    this.maskRightWidth  = this.$maskRight.offsetWidth;


    this.$maskTop      = dom.query('.js-mask-top');
    this.offsetMaskTop = this.$maskRight.offsetTop;
    this.maskTopHeight  = this.$maskTop.offsetHeight;

    if (dom.hasClass('home', this.$body)) {
      this.$logo.style.transform = 'translateY(' + (this.offsetLoadBar - 150) + 'px)';
      this.$logo.style.opacity = '1';
    }

    this.$previewMask = dom.queryAll('.js-preview-mask');
    for (var i = 0; i < this.$previewMask.length; i++) {
      
      this.$previewMask[i].width  = this.winWidth;
      this.$previewMask[i].height = this.winHeight;
    };

    this.crop = this.calculateAspectRatio(1600,900,this.winHeight,this.winHeight,this.fit);

    this.deltaX = (this.crop.width - this.winWidth)/2;
    this.deltaY = (this.crop.height - this.winHeight)/2;
    this.loadImages();


    for (var i = 0; i < this.$linkRoot.length; i++) {
      this.$linkRoot[i].setAttribute('data-index', i);
    };

    this.onClickLinkRoot = this.onClickLinkRoot.bind(this);
    this.onLinkRootHover = this.onLinkRootHover.bind(this);
    this.onLinkRootOut   = this.onLinkRootOut.bind(this);
    this.onMainNavHover  = this.onMainNavHover.bind(this);


    for(var i=0; i < this.$linkRoot.length; i++){

      dom.addEventListener( this.$linkRoot[i], 'click', this.onClickLinkRoot);
      //dom.addEventListener( this.$linkRoot[i], 'mouseover', this.onLinkRootHover);
      //dom.addEventListener( this.$linkRoot[i], 'mouseout', this.onLinkRootOut);
      //dom.addEventListener( this.$mainNav, 'mouseover', this.onMainNavHover);
      //dom.addEventListener( this.$mainNav, 'mouseout', this.onMainNavOut);

    }



    $setTimeout(function(){
      window.scrollTo(0,0);
      dom.addClass( 'is-ready', this.$body );
      dom.addClass('scroll-disable', this.$body);
    }, 100, this );

    $setTimeout(function(){
      window.scrollTo(0,0);
      dom.addClass('intro', this.$body);
    }, 250, this );

    $setTimeout(function(){
      this.$loadBar.style.transform = 'translateY(' + (-this.transformValue) + 'px) translateX(-50%)';


      if (dom.hasClass('home', this.$body)) {
        this.$logo.style.transition = ' .7s 1.22s cubic-bezier(0.125, 0.750, 0.415, 1.000)';
        this.$logo.style.transform = 'translateY(' + 0 + 'px)';
      };
      
      //this.$logoLoader.style.transform = 'translateY(' + (- this.logoLoaderOffset - this.logoOffset + 57 ) + 'px)';
    }, 1000, this);

    $setTimeout(function(){
      dom.removeClass('scroll-disable', this.$body);
    }, 1900, this);

    $setTimeout(function(){
      dom.addClass('invisible', this.$wrapperLoad);
    }, 2600, this);

  }

  calculateAspectRatio(srcWidth, srcHeight, maxWidth, maxHeight, fit) {

      var ratio = [maxWidth / srcWidth, maxHeight / srcHeight ];
      ratio = (fit) ? Math.min(ratio[0], ratio[1]) : Math.max(ratio[0], ratio[1]);

      return { width: srcWidth*ratio, height: srcHeight*ratio };
      
  };

  loadImages(){

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


  draw( index ){

    // var xRect      = (this.offsetMaskRight - (this.maskRightWidth/2));
    // var yRect      = (this.maskTopHeight / 2);
    // var widthRect  = (this.winWidth - this.maskRightWidth);
    // var heightRect = (this.winHeight - (this.maskTopHeight)) + (this.maskTopHeight);

    // console.log('__draw__', index);

    // this.ctx[index].drawImage(this.imgArray[index], (-this.deltaX), (-this.deltaY), this.crop.width, this.crop.height);
    // this.ctx[index].globalCompositeOperation = "destination-out";
    // this.ctx[index].fillRect(xRect, yRect, widthRect, heightRect);

  }

  onClickLinkRoot(e){

      e.preventDefault();

      console.log('onClickLinkRoot');

      var el = e.currentTarget;

      var redirectLink = e.currentTarget.href;



      $setTimeout(function(){
        dom.addClass( 'is-out', this.$mainHeader );
        dom.addClass( 'is-out', this.$content );
      }, 50, this);

      setTimeout(function(){
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


    onMainNavHover(){
      // console.log('onMainNavHover');
      // dom.removeClass('invisible', this.$wrapperLoad);

      // $setTimeout(function(){
      //   dom.addClass( 'is-half', this.$body );
      // }, 50, this);
    }


    onMainNavOut(){
      // console.log('out');
      // dom.removeClass( 'is-half', this.$body );

      // $setTimeout(function(){
      //   dom.addClass('invisible', this.$wrapperLoad);
      // }, 550, this);
    }


    onLinkRootHover(e){

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


    onLinkRootOut(e){

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



}
