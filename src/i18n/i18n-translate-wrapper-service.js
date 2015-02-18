'use strict';

/* @ngInject */
module.exports = function($translate) {

    // use sync
    var syncMethod = function(key, args) {
        return $translate.instant(key, args);
    };
    //use async
    var asyncMethod = function(keys, args) {
        if (angular.isArray(keys)) {
            return $translate([keys]);
        } else {
            return $translate(keys, args);
        }
    }
    return {
        async: asyncMethod,
        sync: syncMethod
    };
};
