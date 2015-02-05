'use strict';

/* @ngInject */
module.exports = function($translate) {
    var translate = function(key, obj) {
    	return $translate.instant(key, obj);
    };
    return {
        get: translate
    };
};
