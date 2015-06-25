/* globals beforeEach, afterEach, sinon, $ */

'use strict';

var renderer = require('../../src/mega-menu/utils/renderer');

describe('renderer', function() {
  // create a DOM element that we can target, even though we don't verify its contents. This is just to
  // ensure that the render method completes without throwing an exception
  var elem, id, selector;

  beforeEach(function() {
    elem = document.createElement('div');
    id = 'test-id';
    selector = '#' + id;

    elem.setAttribute('id', id);
    $('body').append(elem);
  });

  describe('render', function() {
    it('should call the template function with data', function() {
      var templateFn = jasmine.createSpy('spy'),
        data = {name: 'Stella'};

      renderer.render(selector, templateFn, data);
      expect(templateFn).toHaveBeenCalledWith(data);

    });
  });

  describe('fetchAndRender', function() {
    var template, callback;

    beforeEach(function() {
      this.server = sinon.fakeServer.create();
      template = function() {};
      callback = jasmine.createSpy('spy');
    });

    afterEach(function() {
      this.server.restore();
    });

    it('should return an empty object on error', function() {
      var url = '/dogs/1/show';

      this.server.respondWith('GET', url, [
        500, {'Content-Type': 'application/json'}, JSON.stringify({message: 'No dogs allowed.'})
      ]);
      renderer.fetchAndRender(url, selector, template, callback);
      this.server.respond();

      expect(callback).toHaveBeenCalledWith(false);
    });

    it('should render on success', function() {
      var url = '/cats/1/show';
      this.server.respondWith('GET', url, [
        200, {'Content-Type': 'application/json'}, JSON.stringify({name: 'stanley'})
      ]);
      renderer.fetchAndRender(url, selector, template, callback);
      this.server.respond();

      expect(callback).toHaveBeenCalledWith(true);
    });

    it('should render on success, even with a bogus callback', function() {
      var url = '/cats/1/show';
      this.server.respondWith('GET', url, [
        200, {'Content-Type': 'application/json'}, JSON.stringify({some: 'data'})
      ]);
      renderer.fetchAndRender(url, selector, template, 'blarg');
      this.server.respond();
    });
  });

});
