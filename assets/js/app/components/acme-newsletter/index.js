import support from 'utils/BrowserSupport';
import $setTimeout from 'utils/$setTimeout';
import dom from 'utils/dom';

export default class AcmeNewsletter {

  constructor() {

      this.$newsletterForm = document.getElementById('newsletter-subscribe');

      this.$newsletterForm.onsubmit = this.onNewsletterFormSubmit.bind(this);

  }

  serialize(form) {
      let field, s = {};
      if (typeof form == 'object' && form.nodeName == "FORM") {
          var len = form.elements.length;
          for (let i=0; i<len; i++) {
              field = form.elements[i];
              if (field.name && !field.disabled && field.type != 'file' && field.type != 'reset' && field.type != 'submit' && field.type != 'button') {
                  if (field.type == 'select-multiple') {
                      for (j=form.elements[i].options.length-1; j>=0; j--) {
                          if(field.options[j].selected)
                              s[field.name] = encodeURIComponent(field.options[j].value);
                      }
                  } else if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
                     s[field.name] = encodeURIComponent(field.value);
                  }
              }
          }
      }
      return s;
  }

  onNewsletterFormSubmit(e){

    e.preventDefault();

    var f = this.$newsletterForm;
    
    var re = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-]{1,})+\.)+([a-zA-Z0-9]{2,})+$/;

    if (!re.test(f.elements["ne"].value)) {
        document.getElementById('newsletter-subscribe__error-mail').style.display = 'block';
        document.getElementById('newsletter-subscribe__success').style.display = 'none';
        document.getElementById('newsletter-subscribe__error').style.display = 'none';
        return false;
    }

    for (var i=1; i<20; i++) {
      if (f.elements["np" + i] && f.elements["np" + i].required && f.elements["np" + i].value == "") {

          return false;
      }
    }

    if (f.elements["ny"] && !f.elements["ny"].checked) {
        return false;
    }

    $xhr.post( f.getAttribute('action'), {
      params: this.serialize( f )
    }).then( this.onNewsletterSuccess, this.onNewsletterError );

    return true;
  }

  onNewsletterSuccess(){
    document.getElementById('newsletter-subscribe__success').style.display = 'block';
    document.getElementById('newsletter-subscribe__error').style.display = 'none';
    document.getElementById('newsletter-subscribe__error-mail').style.display = 'none';
  }

  onNewsletterError(){
    document.getElementById('newsletter-subscribe__error').style.display = 'block';
    document.getElementById('newsletter-subscribe__error-mail').style.display = 'none';
    document.getElementById('newsletter-subscribe__success').style.display = 'none';
  }

}
