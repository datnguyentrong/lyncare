import support from 'utils/BrowserSupport';
import $setTimeout from 'utils/$setTimeout';
import dom from 'utils/dom';

export default class AcmePopin {

  constructor(){
    this.$body             = document.getElementsByTagName("body")[0];
    this.$doc              = document.documentElement || document;
    this.$win              = window;

    this.$bigPopin         = dom.queryAll('.js-big-popin');
    this.$btnBigPopin      = dom.queryAll('.js-btn-big-popin');
    this.$btnCloseBigPopin = dom.queryAll('.js-close-big-popin');
    this.$btnPopin         = dom.queryAll('.js-btn-popin');
    this.$gridTab          = dom.queryAll('.js-grid-tab');
    this.$gridPopin        = dom.queryAll('.js-grid-popin');
    this.$wrapperPopin     = dom.query('.js-wrapper-popin');
    this.$linkContactJob   = dom.queryAll('.js-contact-job');
    this.$selectJob        = dom.query('.js-select-job');
    this.$gridContainer    = dom.query('.js-grid-container');
    this.$mainHeader       = dom.query('.js-main-header');

    this.$mailObject  = dom.queryAll('.js-mail-object');
    this.$boxSelect   = dom.queryAll('.js-box-select');

    if (this.$gridContainer !== null) {
      this.gridContainerRect   = this.$gridContainer.getBoundingClientRect();
      this.gridContainerWidth  = this.$gridContainer.offsetWidth;
      this.gridContainerHeight = this.$gridContainer.offsetHeight;
    };

    this.onBtnBigPopinClick      = this.onBtnBigPopinClick.bind(this);     
    this.onDocumentDown          = this.onDocumentDown.bind(this);
    this.onClickLinkContactJob   = this.onClickLinkContactJob.bind(this)
    this.onBtnPopinClick         = this.onBtnPopinClick.bind(this);
    this.onMailObjectClick       = this.onMailObjectClick.bind(this);
    this.onBtnCloseBigPopinClick = this.onBtnCloseBigPopinClick.bind(this);
      
    document.addEventListener('click', this.onDocumentDown, this);

    for(var i=0; i < this.$btnBigPopin.length; i++){
      dom.addEventListener( this.$btnBigPopin[i],'click', this.onBtnBigPopinClick );
    }

    for(i=0; i < this.$linkContactJob.length; i++){
      dom.addEventListener(this.$linkContactJob[i], 'click', this.onClickLinkContactJob );
    }

    for(i=0; i < this.$btnPopin.length; i++){
      dom.addEventListener(this.$btnPopin[i], 'click', this.onBtnPopinClick );
    }

    for(i=0; i< this.$mailObject.length; i++){
        dom.addEventListener( this.$mailObject[i],'click', this.onMailObjectClick );
    }

    for (var i = 0; i < this.$btnCloseBigPopin.length; i++) {
      dom.addEventListener( this.$btnCloseBigPopin[i],'click', this.onBtnCloseBigPopinClick );
    };

  }

  onBtnBigPopinClick(e){

    e.stopPropagation();

    var index = Number(e.currentTarget.getAttribute('data-index'));
   
      if( dom.hasClass('is-open', this.$bigPopin ) ){

        for(var i=0; i< this.$bigPopin.length; i++){
          dom.removeClass('is-open', this.$bigPopin[i]);
          dom.removeClass( 'is-active', this.$wrapperPopin);
          dom.removeClass('scroll-disable', this.$body);
          dom.removeClass('is-out', this.$mainHeader);
        }
        
      } else {

        for(var i=0; i< this.$bigPopin.length; i++){
          dom.removeClass('is-open', this.$bigPopin[i]);
        }
        dom.addClass( 'is-active', this.$wrapperPopin);
        dom.addClass('scroll-disable', this.$body);
        dom.addClass('is-out', this.$mainHeader);
        dom.addClass( 'is-open', this.$bigPopin[index]);
      } 

      this.isPopinOpened = true;
      this.currentPopinNode = this.$bigPopin[index];


  }

  onBtnCloseBigPopinClick(e, index){
      this.closePopin();
  }

  onBtnPopinClick(e){

    e.stopPropagation();

    var index = e.currentTarget.getAttribute('data-index');
    var el = e.currentTarget.getBoundingClientRect();

    var posX = el.left - this.gridContainerRect.left;
    var posY = el.top  - this.gridContainerRect.height;

    var gridTabWidth  = this.$gridPopin[index].offsetWidth;
    var gridTabHeight = this.$gridPopin[index].offsetHeight;


    if ((posX + gridTabWidth) > (this.gridContainerWidth) ) {
      this.$gridPopin[index].style.left = (-100) + '%';
    } else {
      this.$gridPopin[index].style.left = (100) + '%';
    }


    if ( dom.hasClass('is-active', this.$gridTab[index]) ) {

      for(var i=0; i< this.$gridPopin.length; i++){
        dom.removeClass('is-inactive', this.$gridTab[i]);
      }  

      dom.removeClass('is-active', this.$gridTab[index]);

    } else {

      for(var i=0; i< this.$gridPopin.length; i++){
        dom.addClass('is-inactive', this.$gridTab[i]);
      }  

      dom.addClass('is-active', this.$gridTab[index]);

    }

    this.isPopinOpened = true;
    this.currentPopinNode = this.$btnPopin[index];
  }



  onClickLinkContactJob(e){

    var index = Number(e.currentTarget.getAttribute('data-index')) + 1;
    this.closePopin();

    for (var i = 0; i < this.$boxSelect.length; i++) {
      dom.removeClass('is-active', this.$boxSelect[i]);
      dom.addClass('is-active', this.$boxSelect[1]);
      dom.removeClass('is-selected', this.$mailObject[i]);
      dom.addClass('is-selected', this.$mailObject[1]);
    };

    this.$selectJob.options[index].selected = true;
  }

  closePopin() {
    
    for (var i = 0; i < this.$bigPopin.length; i++) {
      dom.removeClass('is-open', this.$bigPopin[i]);
    }

    if (this.$wrapperPopin != null) {
      dom.removeClass('is-active', this.$wrapperPopin);
      dom.removeClass('scroll-disable', this.$body);
      dom.removeClass('is-out', this.$mainHeader);
    };

    for (var i = 0; i < this.$gridTab.length; i++) {
      dom.removeClass('is-active', this.$gridTab[i]);
      dom.removeClass('is-inactive', this.$gridTab[i]);
    }
    
    

    this.isPopinOpened = false;
    this.currentPopinNode = null;
  }

  onDocumentDown(e){

    if( this.isPopinOpened && this.currentPopinNode ){

      var node = e.target;
      var match = false;

      while( node.parentNode ){
        if( node == this.currentPopinNode  ){
          match = true;
          break;
        }
        node = node.parentNode;
      }

      //if we click outside the currentPopin, close it
      if( !match ){
        this.closePopin();
      } 
    } else {

    }
  }

  onMailObjectClick(e) {
    
    for(var i=0; i< this.$mailObject.length; i++){
      dom.removeClass('is-selected', this.$mailObject[i]);
    }

    for(var i=0; i< this.$boxSelect.length; i++){
      dom.removeClass('is-active', this.$boxSelect[i]);
    }

    var dataMailObject = e.currentTarget.getAttribute('data-mail-object');
    dom.addClass('is-active', document.getElementById('objectMail' + dataMailObject));


    if( dom.hasClass('is-selected', e.currentTarget ) ){
      dom.removeClass( 'is-selected', e.currentTarget );
    } else {
      dom.addClass( 'is-selected', e.currentTarget );
    }   

  }
}
