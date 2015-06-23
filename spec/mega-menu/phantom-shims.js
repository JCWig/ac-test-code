'use strict';

// phantom js doesn't have a bind method on the Function prototype so we polyfill it here.
Function.prototype.bind = require('function-bind');
