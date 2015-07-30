/* globals beforeEach, afterEach, sinon, $ */

'use strict';

// note, these tests were taken from the taggle github repo and adapted for the
// browserified environment.

var Taggle = require('../../src/mega-menu/utils/taggle');

function createContainer(width, height) {
  var container = document.createElement('div');

  container.style.width = width + 'px';
  container.style.height = height + 'px';

  return container;
}

function getObjectLength(obj) {
  var len = 0, key;

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      len += 1;
    }
  }
  return len;
}

describe('Taggle', function() {

  beforeEach(function() {
    this.container = createContainer(500, 300);
    this.container.id = 'taggle';
    document.body.appendChild(this.container);
  });

  afterEach(function() {
    this.container.parentNode.removeChild(this.container);
  });

  describe('Initialization', function() {
    it('should exist as a global', function() {
      expect(Taggle).not.toBe(null);
    });
  });

  describe('Options', function() {

    beforeEach(function() {
      this.instance = new Taggle(this.container);
    });

    afterEach(function() {
      this.instance = null;
    });

    it('should disallow duplicate tags to be added by default', function() {
      expect(this.instance.getTags().values.length).toEqual(0);
      this.instance.add(['tag', 'tag']);
      expect(this.instance.getTags().values.length).toEqual(1);
    });

    it('should allow duplicate tags to be added when allowDuplicates is true', function() {
      var taggle = new Taggle(this.container, {
        allowDuplicates: true
      });

      expect(taggle.getTags().values.length).toEqual(0);
      taggle.add(['tag', 'tag']);
      expect(taggle.getTags().values.length).toEqual(2);

    });

    describe('#onTagAdd', function() {
      it('should be called after a tag has been added', function() {
        var container = createContainer(300, 400),
          tag = 'one',
          onTagAddSpy = jasmine.createSpy('spy'),
          ret,
          taggle;

        document.body.appendChild(container);

        taggle = new Taggle(container, {
          onTagAdd: onTagAddSpy
        });

        expect(onTagAddSpy).not.toHaveBeenCalled();
        taggle.add(tag);
        expect(onTagAddSpy.calls.count()).toEqual(1);

        //expect(onTagAddSpy.calls.argsFor(0)[0]).to.not.be.ok;
        expect(onTagAddSpy.calls.argsFor(0)[0]).toBe(null);
        expect(onTagAddSpy.calls.argsFor(0)[1]).toEqual(tag);
      });

      it('should reflect one additional tag value when being called', function() {
        var tags_length,
          container = createContainer(300, 400),
          tag = 'tag',
          cb_length,
          taggle;

        document.body.appendChild(container);

        taggle = new Taggle(container, {
          onTagAdd: function() {
            cb_length = taggle.getTagElements().length;
          }
        });

        tags_length = taggle.getTagElements().length;

        taggle.add(tag);

        expect(cb_length).toEqual(tags_length + 1);
      });
    });

    describe('#onTagRemove', function() {
      it('should be called after a tag has been removed', function() {
        var container = createContainer(300, 400),
          tag = 'one',
          onTagRemoveSpy = jasmine.createSpy('spy'),
          ret,
          taggle;

        document.body.appendChild(container);

        taggle = new Taggle(container, {
          onTagRemove: onTagRemoveSpy
        });

        expect(onTagRemoveSpy).not.toHaveBeenCalled();
        taggle.remove(tag);
        expect(onTagRemoveSpy).not.toHaveBeenCalled();

        taggle.add(tag);
        taggle.remove(tag);
        expect(onTagRemoveSpy.calls.count()).toEqual(1);

        expect(onTagRemoveSpy.calls.argsFor(0)[0]).toBe(undefined);
        expect(onTagRemoveSpy.calls.argsFor(0)[1]).toEqual(tag);
      });

      it('should reflect one less tag value when being called', function() {
        var tags_length,
          container = createContainer(300, 400),
          tag = 'tag',
          cb_length,
          taggle;

        document.body.appendChild(container);

        taggle = new Taggle(container, {
          onTagRemove: function() {
            cb_length = taggle.getTagElements().length;
          }
        });

        taggle.add(tag);

        tags_length = taggle.getTagElements().length;

        taggle.remove(tag);

        expect(cb_length).toEqual(tags_length - 1);
      });
    });
  });

  describe('Public API', function() {
    beforeEach(function() {
      this.instance = new Taggle(this.container, {
        tags: ['zero', 'one', 'two', 'three']
      });
    });

    describe('#getTagValues', function() {
      it('should match length of tags passed in options', function() {
        expect(this.instance.getTagValues().length).toEqual(4);
      });
    });

    describe('#getTagElements', function() {
      it('should match length of added tags', function() {
        expect(this.instance.getTagElements().length).toEqual(4);
      });
    });

    describe('#getTags', function() {
      it('should return an object with 2 arrays that match getTagValues() and getTagElements()', function() {
        expect(getObjectLength(this.instance.getTags())).toEqual(2);
        expect(this.instance.getTags().values.length).toEqual(4);
        expect(this.instance.getTags().elements.length).toEqual(4);
      });
    });

    describe('#getContainer', function() {
      it('should return original selected DOM element', function() {
        expect(this.instance.getContainer()).toEqual(this.container);
      });
    });

    describe('#getInput', function() {
      it('should return the container\'s text input', function() {
        expect(this.instance.getInput()).toEqual(this.instance.getContainer().querySelector('input[type="text"]'));
      });
    });

    describe('#add', function() {
      it('should add a new tag from a string argument', function() {
        expect(this.instance.getTagElements().length).toEqual(4);
        this.instance.add('four');
        this.instance.add(3);
        this.instance.add(true);
        this.instance.add(false);
        this.instance.add([]);
        this.instance.add([2]);
        this.instance.add('');
        expect(this.instance.getTagElements().length).toEqual(5);
      });

      it('should add new tags from an array of strings', function() {
        expect(this.instance.getTagElements().length).toEqual(4);
        this.instance.add(['four', 'five', 4, true, undefined]);
        this.instance.add(['', Array, false]);
        expect(this.instance.getTagElements().length).toEqual(6);
      });
    });

    describe('#remove', function() {
      beforeEach(function() {
        this.instance = new Taggle(this.container, {
          tags: ['zero', 'one', 'two', 'three', 'four', 'three']
        });
      });

      it('should remove the most recent occurance of the tag if it exists', function() {
        expect(this.instance.getTagElements().length).toEqual(6);
        this.instance.remove('four');
        this.instance.remove('five');
        this.instance.remove(3);
        this.instance.remove(false, true);
        this.instance.remove('');
        expect(this.instance.getTagElements().length).toEqual(5);
        expect(this.instance.getTagValues().length).toEqual(5);
        expect(this.instance.getTagValues()[4]).toEqual(this.instance.getTagValues()[3]);
      });

      it('should remove all occurances of a string if the second argument is true', function() {
        expect(this.instance.getTagElements().length).toEqual(6);
        this.instance.remove('three', true);
        this.instance.remove('five', true);
        this.instance.remove(2, true);
        this.instance.remove('', true);
        expect(this.instance.getTagElements().length).toEqual(4);
        expect(this.instance.getTagValues().length).toEqual(4);
        expect(this.instance.getTagValues()[3]).toEqual('four');
      });
    });
  });
});

