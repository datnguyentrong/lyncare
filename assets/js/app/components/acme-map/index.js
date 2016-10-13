import support from 'utils/BrowserSupport';
import $setTimeout from 'utils/$setTimeout';
import dom from 'utils/dom';

export default class AcmeBurger {

  constructor(){
    this.$boxMap           = dom.queryAll('.js-box-map');
    this.$linkOpenMap      = dom.queryAll('.js-open-map');

    
    this.onLinkOpenMapClick = this.onLinkOpenMapClick.bind(this);
    this.onDocumentDown     = this.onDocumentDown.bind(this);


    for(var i=0; i< this.$linkOpenMap.length; i++){
      dom.addEventListener( this.$linkOpenMap[i], 'click', this.onLinkOpenMapClick );
    }

    document.addEventListener('click', this.onDocumentDown, this);

  }

  onLinkOpenMapClick(e){

    var index = e.currentTarget.getAttribute('data-index');

    if( dom.hasClass('is-active', this.$boxMap[index] ) ){

      console.log('hasclass', this.$boxMap[index]);
      dom.removeClass( 'is-active', this.$boxMap[index]);
    } else {
      console.log(index, 'hasntclass', this.$boxMap[index]);
      dom.addClass( 'is-active', this.$boxMap[index]);
    }

    this.isPopinOpened = true;
    this.currentPopinNode = this.$linkOpenMap[index];

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
        this.closeMap();
      } 
    } else {

    }
  }


  closeMap(){

    for (var i = 0; i < this.$boxMap.length; i++) {
      dom.removeClass( 'is-active', this.$boxMap[i]);
    };

    this.isPopinOpened = false;
    this.currentPopinNode = null;

  }
}
