/* eslint-disable max-nested-callbacks */
/* globals angular, beforeEach, afterEach */
'use strict';

describe('akamai.components.context', function() {

  describe('with a AKALASTMANAGEDACCOUNT cookie', function() {

    describe('when the app loads', function() {

      it('should decode the cookie for the current account');

      it('should send a request for current account context data');

    });

  });

  describe('with a group centric app', function() {

    describe('and a valid gid query string parameter', function() {

      describe('when the app loads', function() {

        it('should store the gid in the session store');

        it('should store the aid in the session store');

        it('the menu should show the breadcrumb');
      });

    });

    describe('and an invalid gid query string parameter', function() {

      describe('when the app loads', function() {

        it('should throw a invalid group error');

      });

    });

  });

  describe('with an account centric app', function() {

    describe('when the app loads', function() {

      it('the menu should hide the breadcrumb');

    });

  });

  describe('with a loaded app', function() {

    describe('when an app requests the current group/property', function() {

      it('should return the current group/property’s parents');

      it('should return the current group/property’s children');

      it('should return the current group/property’s name and identifier');

    });

    describe('when an app sets the current group/property', function() {

      it('should update the gid and aid in the session store');

      it('should broadcast a group/property changed event');

      it('should update the browser location with the new gid and aid query ' +
      'string parameter');

      it('should make a request to extend the session with the gid and aid ' +
      'query string parameter');

    });

    describe('when an api request is sent', function() {

      it('should add the current group as a gid query string parameter');

      describe('and the AKALASTMANAGEDACCOUNT cookie does not match the ' +
      'context component’s current account', function() {

        it('should show a message box asking the user if the account should be changed');

      });

    });

  });

  describe('with the message box shown', function() {

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

