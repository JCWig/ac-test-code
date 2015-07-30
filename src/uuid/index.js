var angular = require('angular');

/**
 * @name akamai.components.uuid
 * @description Provides a factory service that generates pseudo
 * random universally unique ids.
 */
module.exports = angular.module('akamai.components.uuid', [])

/**
 * @name akamai.components.uuid.uuid
 * @description Provides a factory service to generate
 * uuid and guid values.
 */
  .factory('uuid', require('./uuid-service'));
