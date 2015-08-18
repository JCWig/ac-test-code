var config = require('../utils/config'),
  ajax = require('../utils/ajax'),
  renderer = require('../utils/renderer'),
  throttle = require('../utils/throttle'),
  redirect = require('../utils/redirect'),
  template = require('./timeout.hbs'),
  constants = require('../utils/constants');

var backdropSelector = '.timeout.modal-backdrop',
  selector = '.timeout.modal';

var warnDelay,    // amount of time before killing the session that we show the warning modal, in ms
  logoutDelay,    // amount of time before we kill the session, in ms
  urlBase;        // used to 'warn', 'extend' or 'invalidate'

// private references to the modal and its backdrop. Useful for showing and hiding
var timeoutModal, timeoutModalBackdrop;

// timers for showing the modal and killing the session respectively
var idleTimer, logoutTimer, throttledExtend, EXTEND_THROTTLE_DELAY = 60000;

/**
 * Method to show the dialog. The backdrop seems to have a default behavior of being shown and the
 * modal has a default behavior of being hidden so we have to toggle different classes to set the
 * state properly
 */
function showDialog() {
  if (!isDialogOpen()) {
    timeoutModal.classList.add(constants.SHOW_CLASS);
    timeoutModalBackdrop.classList.remove(constants.HIDE_CLASS);
    unbindEvents();
    logoutTimer = setTimeout(logoutUser, warnDelay);
  }
}

/**
 * Method to hide the dialog
 */
function hideDialog() {
  if (isDialogOpen()) {
    timeoutModal.classList.remove(constants.SHOW_CLASS);
    timeoutModalBackdrop.classList.add(constants.HIDE_CLASS);
    bindEvents();
    clearTimeout(logoutTimer);
  }
}

/**
 * Utility to determine if the dialog is open. Used to prevent binding events many times
 * @returns {boolean} true if the dialog is open
 */
function isDialogOpen() {
  return timeoutModal.classList.contains(constants.SHOW_CLASS);
}

/**
 * Resets the idle counter and starts it back up again.
 */
function resetIdleTimer() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(warnUser, logoutDelay - warnDelay);
}

function extendSession() {
  var url = urlBase + '/extend';

  ajax.get(url, function() {
    resetIdleTimer();
    hideDialog();
  });
}

/**
 * Warns the user of a pending logout
 */
function warnUser() {
  var url = urlBase + '/warn';

  ajax.get(url, function(err, data) {
    if (!err && data.status === 'OK') {
      showDialog();
    } else {
      resetIdleTimer();
    }
  });
}

/**
 * Logs out the user and redirects them to the home page
 */
function logoutUser() {
  var url = urlBase + '/invalidate';

  ajax.get(url, function() {
    redirect(constants.TIMEOUT_URL);
  });
}

/**
 * Sets all of the different ways we can extend the session without needing the popup dialog
 */
function bindEvents() {
  document.body.addEventListener('mousemove', throttledExtend);
  document.body.addEventListener('keydown', throttledExtend);
  document.body.addEventListener('click', throttledExtend);
}

/**
 * Un-sets all of the different ways we can extend the session without needing the popup dialog
 */
function unbindEvents() {
  document.body.removeEventListener('mousemove', throttledExtend);
  document.body.removeEventListener('keydown', throttledExtend);
  document.body.removeEventListener('click', throttledExtend);
}

/**
 * @name timeout
 * @requires utils.config
 * @requires utils.constants
 * @requires utils.renderer
 * @param {Object} data the user config object
 * @param {String} data.username Username
 * @param {Boolean} data.isAutoLogoutEnabled Whether or not this module is enabled
 * @param {Integer} data.logoutTimer The amount of time **before the session expires** when we
 * should warn the user, in minutes.
 * @param {Integer} data.timeoutDuration The total amount of time that needs to pass before a
 * session timeout occurs, in minutes
 * @description
 * Module for handling auto timeout logic.
 */
function timeout(data) {
  if (data.isAutoLogoutEnabled) {
    urlBase = '/core/services/session/' + encodeURIComponent(data.username);
    warnDelay = data.logoutTimer * 60 * 1000;
    logoutDelay = data.timeoutDuration * 60 * 1000;
    timeoutModal = document.querySelector(selector);
    timeoutModalBackdrop = document.querySelector(backdropSelector);
    throttledExtend = throttle(extendSession, EXTEND_THROTTLE_DELAY);

    renderer.render(selector, template, {});

    timeoutModal.querySelector('button').addEventListener('click', throttledExtend);
    bindEvents();
    resetIdleTimer();
  }
}

module.exports = function() {
  config(timeout);
};
