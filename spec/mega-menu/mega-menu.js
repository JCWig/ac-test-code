/* eslint-disable max-nested-callbacks */
/* globals angular, beforeEach, afterEach */
'use strict';

describe('akamai.components.context', function() {

  describe('given an AKALASTMANAGEDACCOUNT cookie', function() {

    describe('when the app loads', function() {

      it('should decode the cookie for the current account');

      it('should send a request for current account context data');

    });

  });

  describe('given a group centric app', function() {

    describe('and a valid gid query string parameter', function() {

      describe('when the app loads', function() {

        it('should show the breadcrumb');
      });

    });

    describe('and an invalid gid query string parameter', function() {

      describe('when the app loads', function() {

        it('should throw a invalid group error');

      });

    });

  });

  describe('given an account centric app', function() {

    describe('when the app loads', function() {

      it('should hide the breadcrumb');

    });

  });

  describe('given a loaded app', function() {

    describe('when an app sets the current group/property', function() {

      it('should update the browser location with the new gid and aid query ' +
      'string parameter');

    });

  });

  // TODO: some of this needs to be in the auth tests
  describe('given the message box shown', function() {

    describe('when the user accepts changing the account', function() {

      it('should send a request to update the current account');

      it('should should send a request for current account context data');

      it('should update the breadcrumb');

      it('should continue the original API request');

    });

    describe('when the user declines changing the account', function() {

      it('should go to the home page');

    });

  });

});

