'use strict';

/* @ngInject */
module.exports = function($sce) {
    return function(text, phrase) {
        if (!angular.isString(text)) {
            text = String(text);
        }

        phrase = String(phrase).trim();

        if (phrase){
            text = text.replace(new RegExp('('+phrase+')', 'gi'), '<span class="highlighted">$1</span>');
        }

        return $sce.trustAsHtml(text);
    };
};
