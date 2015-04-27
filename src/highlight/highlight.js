'use strict';

/* @ngInject */
module.exports = function($sce) {

  function highlight(text, phrase) {
    phrase = phrase.trim();

    if (phrase && !isDom(text)) {
      text = text.replace(new RegExp('(' + phrase + ')', 'gi'),
        '<span class="highlighted">$1</span>');
    }

    return $sce.trustAsHtml(text);
  }

  // not a perfect method, but if there is an instance of "<"
  // followed by at least one letter and then a ">", we return true
  function isDom(text) {
    return /<[A-Za-z]+.*>/.test(text);
  }

  return highlight;

};
