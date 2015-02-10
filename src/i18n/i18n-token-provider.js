'use strict';

/* @ngInject */
module.exports = function i18nTokenProvider(i18nConfig) {
    this.locale = i18nConfig.defaultLocale;
    this.urls = [i18nConfig.localePath];
    var self = this;

    /**
     * This function adds path and part value to urls array and it will be used in the i18nCustomLoader.
     *
     * @param {array | string} path - an array of url path value or url path string value
     * @param {string=}  part - a value to append to the path
     * @param {Boolean=} isForComponent if it is true value here, it is special case for adding component path, otherwise, consider only for app
     */
    var addPathAndPart = function(path, part, isForComponent) {
        if (angular.isUndefined(path) || path===null) {
            return;
        }
        if (angular.isArray(path) && path.length) {
            if (isForComponent) {
                self.urls[0] = path[0];
            } else {
                self.urls.push.apply(self.urls, path);
            }
        } else if (angular.isString(path) && path.trim().length) {
            var pp = path + (part || "");
            if (isForComponent) {
                self.urls[0] = pp;
            } else {
                self.urls.push(pp);
            }
        } else {
            return;
        }
    };

    this.useLocale = function(loc) {
        this.locale = loc;
    };
    /**
     * @ngdoc method
     * @name akamai.components.i18n.I18nTokenProvider#addAppLocalePath
     * @methodOf akamai.components.i18n.I18nTokenProvider
     *
     * @description add app locale files path and part to the urls array during app config,it will carry those values and to be used in customLoader
     * @param {array | string} path The array type contains path info to the file (part should be appended from caller, in this case).
     * If path is string type, then path just the path to locale file, there will be no part info
     * @param {string=} part The string value to be appended to the path, e.g. message_xxx
     *
     */
    this.addAppLocalePath = function(path, part) {
        return addPathAndPart(path, part);
    };

    /**
     * @ngdoc method
     * @name akamai.components.i18n.I18nTokenProvider#addComponentLocalePath
     * @methodOf akamai.components.i18n.I18nTokenProvider
     *
     * @description method provides a way to add component locale files path and part to the urls array during app config, it will carry those values and to be used in customLoader
     * @param {array | string} path The array type contains path info to the file (part should be appended from caller, in this case).
     * If path is string type, then path just the path to locale file, there will be no part info. If this method never called, it will use default path.
     * in case of this method gets called, it will attempt to replace the path value already in the urls array. This is only for component, so as pass to addPathAndPart with param of true.
     * @param {string=} part The string value to be appended to the path, e.g. message_xxx
     *
     */
    this.addComponentLocalePath = function(path, part) {
        return addPathAndPart(path, part, true);
    };

    this.$get = function i18nTokenFactory() {
        var locale = this.locale,
            localeUrls = this.urls;
        return {
            getUrls: function() {
                return localeUrls;
            },
            getLocale: function() {
                return locale;
            }
        };
    };
};
