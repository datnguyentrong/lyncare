import support from 'utils/BrowserSupport';
import $setTimeout from 'utils/$setTimeout';
import dom from 'utils/dom';

export default class AcmeBurger {

  constructor(){
    this.$body      = document.getElementsByTagName("body")[0];
    this.$btnBurger = dom.query( '.js-burger');

    this.onBtnBurgerClick = this.onBtnBurgerClick.bind(this)

    dom.addEventListener( this.$btnBurger, 'click', this.onBtnBurgerClick );


  }

  onBtnBurgerClick(){
    if( dom.hasClass('is-nav-opened', this.$body ) ){
      dom.removeClass( 'is-nav-opened', this.$body );
      dom.removeClass( 'scroll-disable', this.$body );
    } else {
      dom.addClass( 'is-nav-opened', this.$body );
      dom.addClass( 'scroll-disable', this.$body );
    }
  }
}
