var support = require('utils/BrowserSupport');
var $setTimeout = require('utils/$setTimeout');
var dom = require('utils/dom');

export default class AcmeSearch {

  constructor(){
    this.$body        = document.getElementsByTagName("body")[0];
    this.$btnSearch   = dom.query('.js-search');
    this.$inputSearch = dom.query('.js-input-search');
    this.onBtnSearchClick = this.onBtnSearchClick.bind(this);

    dom.addEventListener( this.$btnSearch, 'click', this.onBtnSearchClick );
  }

    onBtnSearchClick(){

      if( dom.hasClass('is-searching', this.$body ) ){
        dom.removeClass( 'is-searching', this.$body );
      } else {
        dom.addClass( 'is-searching', this.$body );

        //delay to trigger the focus, if not, the animation is broken
        $setTimeout(function(){
           this.$inputSearch.focus();
        }, 750, this );
      }
    }
}

