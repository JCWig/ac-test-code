/**
 * @ngdoc object
 * @name helpers
 * @description
 * A set of Handlebars helpers and partials for the Modular Mega Menu application.
 */

var Handlebars = require('hbsfy/runtime'),
  textTrue = require('./textTrue'),
  searchTargetBlank = require('./searchTargetBlank'),
  currentYear = require('./currentYear'),
  withItem = require('./withItem'),
  highlightFirstMatch = require('./highlightFirstMatch'),
  highlightText = require('./highlightText'),
  i18n = require('./i18n'),
  dateFormat = require('./dateFormat'),
  messageRead = require('./messageRead'),
  contextSelectorSection = require('../contextSelector/_contextSelectorSection.hbs'),
  footer = require('../footer/_footer.hbs');

/**
 * @ngdoc function
 * @name helpers.register
 * @methodOf helpers
 * @description
 * Registers all of the helpers and partials in this module
 */
var register = function() {
  Handlebars.registerHelper('currentYear', currentYear);
  Handlebars.registerHelper('textTrue', textTrue);
  Handlebars.registerHelper('withItem', withItem);
  Handlebars.registerHelper('highlightFirstMatch', highlightFirstMatch);
  Handlebars.registerHelper('highlightText', highlightText);
  Handlebars.registerHelper('i18n', i18n.i18n);
  Handlebars.registerHelper('dateFormat', dateFormat);

  Handlebars.registerHelper('messageRead', function(message, options) {
    if (messageRead(message)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerHelper('searchTargetBlank', function(category, options) {
    if (searchTargetBlank(category)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  });

  Handlebars.registerPartial('contextSelectorSection', contextSelectorSection);
  Handlebars.registerPartial('footer', footer);
};

module.exports = {
  register: register
};

