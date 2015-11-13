import angular from 'angular';

const TAB = 'TAB';
const ENTER = 'ENTER';
const TAB_KEYCODE = 9;
const ENTER_KEYCODE = 13;
const DELETE_KEYCODE = 8;
const DEFAULT_DELIMITERS = [',', TAB, ENTER];
const PLACEHOLDER_KEY = 'components.tag-input.placeholder';
const NEW_TAG_LABEL_KEY = 'components.tag-input.taggingLabel';

export default class TagInputController {
  static get $inject() {
    return ['$scope', '$log', '$attrs', '$element', '$parse', '$translate', 'appendToBodyService',
      '$timeout', '$filter'];
  }

  constructor($scope, $log, $attrs, $element, $parse, $translate, appendToBodyService, $timeout,
              $filter) {
    this.$log = $log;
    this.$translate = $translate;
    this.appendToBodyService = appendToBodyService;
    this.$element = $element;
    this.$timeout = $timeout;
    this.$filter = $filter;

    this.isDraggable = angular.isDefined($attrs.isDraggable);
    this.appendedToBody = angular.isDefined($attrs.appendedToBody);
    this.stacked = angular.isDefined($attrs.stacked);

    this.proposedTag = '';
    this.canDelete = false;
    this.selectedTags = [];
    this.selectedTagi18nMap = new Map();
    this.menuTags = [];
    this.menuTagMap = new Map();
    this.menuTagI18nMap = new Map();

    this.getTextProperty = $parse(this.textProperty);
    this.setTextProperty = this.getTextProperty.assign;

    this.sortableConfig = {
      draggable: '.tag',
      filter: '.tag-input-container',
      disabled: !this.isDraggable || !this.canEdit(),
      animation: 150,
      onSort: () => {
        // this fixes an issue with tag-input-container being
        // moved away from the last position
        let inputElem = angular.element(this.tagListElem[0]
          .querySelector('.tag-input-container'))
          .detach();
        this.tagListElem.append(inputElem);
        this.updateModel();
      }
    };

    this.initDelimiterSets();
    this.initTranslations();

    $attrs.$observe('restricted', restricted => {
      this.restricted = angular.isDefined(restricted);
    });
    $scope.$watchCollection('taginput.items', this.initMenuTags.bind(this));
    $scope.$watch('taginput.proposedTag', this.inspectProposedTag.bind(this));
  }

  initialize(ngModel) {
    this.ngModel = ngModel;

    this.tagMenu = angular.element(this.$element[0].querySelector('.dropdown-menu'));
    this.tagListElem = angular.element(this.$element[0].querySelector('.tag-input-list'));

    // to minimize watches
    this.tagMenu.toggleClass('tagInputAppendedMenu', this.appendedToBody);
    this.tagListElem.toggleClass('draggable', this.isDraggable);
    this.tagListElem.toggleClass('stacked', this.stacked);

    ngModel.$formatters.push(modelValue => {
      if (!angular.isArray(modelValue)) {
        return modelValue;
      }

      let viewValue = [];
      modelValue.forEach(modelItem => {
        this.$translate(this.tag(modelItem)).then(translatedModelItem => {
          let viewValueItem = this.textProperty ? angular.copy(modelItem) : translatedModelItem;
          if (this.textProperty) {
            this.setTextProperty(viewValueItem, translatedModelItem);
          }
          viewValue.push(viewValueItem);
          this.selectedTagi18nMap.set(translatedModelItem, modelItem);
        });
      });

      return viewValue;
    });

    ngModel.$render = () => {
      this.selectedTags = angular.isArray(this.ngModel.$viewValue) ?
        this.ngModel.$viewValue : [];

      this.$timeout(() => {
        if (angular.isFunction(this.onSort)) {
          this.onSort({tags: this.selectedTags});
        }
        if (angular.isFunction(ngModel.$validators.required)) {
          ngModel.$validators.required = (modelValue, viewValue) => {
            return angular.isArray(viewValue) && viewValue.length > 0;
          };
        }
        this.setSelectedTagsClasses();
      });
    };

    ngModel.$validators.validTags = (modelValue, viewValue) => {
      if (angular.isFunction(this.onValidate) && angular.isArray(viewValue)) {
        return viewValue.every(tag => this.tagValid(tag));
      }
      return true;
    };

    ngModel.$parsers.push(viewValue => {
      if (!angular.isArray(viewValue)) {
        return viewValue;
      }
      let modelValue = [];
      viewValue.forEach(viewValueItem => {
        let selectedTag = this.selectedTagi18nMap.get(this.tag(viewValueItem)) ||
          this.menuTagI18nMap.get(this.tag(viewValueItem));

        modelValue.push(selectedTag || viewValueItem);
      });
      return modelValue;
    });

    this.appendToBody();
  }

  initMenuTags(items) {
    let addItemsToMenuTagMap = tagItems => {
      if (!angular.isArray(tagItems)) {
        throw new Error('Tag items must be an Array');
      }
      this.menuTags = [];
      tagItems.forEach((tagItem) => {
        this.$translate(this.tag(tagItem))
          .then(translatedTag => {
            let newTagItem;
            if (this.textProperty) {
              newTagItem = angular.copy(tagItem);
              this.setTextProperty(newTagItem, translatedTag);
            } else {
              newTagItem = translatedTag;
            }
            this.menuTags.push(newTagItem);
            this.menuTagMap.set(this.tag(newTagItem), newTagItem);
            this.menuTagI18nMap.set(this.tag(newTagItem), tagItem);
          });
      });
    };

    items = items || [];

    if (angular.isFunction(items.then)) {
      items.then((tagItems) => {
        addItemsToMenuTagMap(tagItems)
      }, reason => {
        throw new Error(`Error while returning items. Reason: ${reason}`);
      });
    } else {
      addItemsToMenuTagMap(items)
    }
  }

  initDelimiterSets() {
    this.delimiterSet = new Set();
    this.submitKeyCodeSet = new Set();

    this.delimiters = this.delimiters || DEFAULT_DELIMITERS;

    this.delimiters.forEach(delimiter => {
      switch (true) {
        case delimiter === TAB:
          this.submitKeyCodeSet.add(TAB_KEYCODE);
          break;
        case delimiter === ENTER:
          this.submitKeyCodeSet.add(ENTER_KEYCODE);
          break;
        default:
          this.delimiterSet.add(delimiter);
      }
    });
  }

  initTranslations() {
    this.$translate(this.placeholder || PLACEHOLDER_KEY)
      .then(value => this.placeholder = value);

    this.$translate(this.newTagLabel || NEW_TAG_LABEL_KEY)
      .then(value => this.newTagLabel = value);
  }

  setSelectedTagsClasses() {
    // We need to wrap this in a $timeout because the tag elements are in the middle of
    // rendering in this $digest cycle and won't be available until the next cycle.
    this.$timeout(() => {
      let selectedTagElems = this.$element[0].querySelectorAll('li.tag');

      for (let i = 0, len = selectedTagElems.length; i < len; i++) {
        let selectedTagLi = angular.element(selectedTagElems[i]);
        selectedTagLi.toggleClass('lastTag', i === this.selectedTags.length - 1);
        selectedTagLi.toggleClass('invalid', !this.tagValid(this.selectedTags[i]));
      }
    });
  }

  canEdit() {
    return !this.isDisabled && !this.isReadOnly;
  }

  tag(tag) {
    return angular.isString(tag) ? tag : this.getTextProperty(tag);
  }

  getFilteredMenuTags() {
    return this.$filter('filter')(this.menuTags, this.proposedTag);
  }

  highlightMatchingMenuTags() {
    // wrap in $timeout so that menu tag elements finish rendering
    this.$timeout(() => {
      let menuTagElems = this.$element[0].querySelectorAll('li.menu-tag > a > span');

      for (let i = 0, len = menuTagElems.length; i < len; i++) {
        let menuTagLi = angular.element(menuTagElems[i]);
        let tag = menuTagLi.text().trim();
        let menuTagHtml = this.proposedTag.length ?
          this.$filter('highlight')(tag, this.proposedTag) : tag;

        menuTagLi.html(menuTagHtml);
      }
    })
  }

  getFilteredMenuTag(menuTag) {
    return this.$filter('highlight')(this.tag(menuTag), this.proposedTag);
  }

  appendToBody() {
    if (this.appendedToBody) {
      this.appendToBodyService.appendToBody(this.$element, this.tagMenu, () => {
        this.tagMenu.css('width', `${this.$element[0].getBoundingClientRect().width}px`);
      });
    }
  }

  inspectProposedTag(proposedTag) {
    if (this.appendedToBody) {
      this.tagMenu.toggleClass('util-show', proposedTag);
      this.tagMenu.toggleClass('util-hide', !proposedTag);
    }

    this.highlightMatchingMenuTags();

    if (!proposedTag.length) {
      return;
    }

    if (proposedTag.length === 1 &&
      this.delimiterSet.has(proposedTag)) {
      this.proposedTag = '';
      return;
    }

    if (this.delimiters.some(delimiter => proposedTag.includes(delimiter)) &&
      proposedTag.length > 1) {
      this.parseTagsString(proposedTag).forEach(tag => this.addTag(tag));
      this.proposedTag = '';
    }
  }

  assessKeyDown(event) {

    if (event.which === DELETE_KEYCODE && !this.proposedTag) {
      let lastTag = this.getLastSelectedTag();
      if (angular.isUndefined(lastTag)) {
        return;
      }
      if (this.canDelete) {
        this.selectedTags.pop();
        this.updateModel();
        this.canDelete = false;
      } else {
        this.canDelete = true;
      }
      return;
    }
    this.canDelete = false;
    if (this.submitKeyCodeSet.has(event.which)) {
      event.preventDefault();

      this.addTag(this.proposedTag);
      this.proposedTag = '';
    }
  }

  addTag(tag) {
    if (angular.isString(tag)) {
      tag = tag.trim();
    }
    if (this.canAddTag(tag)) {
      this.selectedTags.push(this.getNewSelectedTag(tag));
      this.updateModel();
    }
  }

  removeTag(tag) {
    this.selectedTags.splice(this.selectedTags.indexOf(tag), 1);
    this.updateModel();
  }

  canAddTag(tag) {
    if (tag && !this.selectedTags.find(selectedTag => this.tag(selectedTag) === this.tag(tag))) {
      return this.restricted && !this.isTagInList(tag) ? false : true;
    }
  }

  getLastSelectedTag() {
    return this.selectedTags.length ?
      this.selectedTags[this.selectedTags.length - 1] : undefined;
  }

  tagValid(tag) {
    return angular.isFunction(this.onValidate) ? this.onValidate({tag: tag}) : true;
  }

  getNewSelectedTag(tag) {
    if (!this.isTagInList(tag)) {
      if (this.textProperty) {
        let newTag = {};
        this.setTextProperty(newTag, tag);
        return newTag;
      } else {
        return tag;
      }
    }
    return this.menuTagMap.get(this.tag(tag));
  }

  isTagInList(tag) {
    return this.menuTagMap.has(this.tag(tag));
  }

  parseTagsString(tagsString) {
    let tagSet = new Set(), hasDelimiter = false;

    // iterate over each delimiter
    this.delimiterSet.forEach(delimiter => {

      // if the tagString includes this delimiter, replace the delimiter with a new line
      // character which will be used as a marker for the final split.
      if (tagsString.includes(delimiter)) {
        hasDelimiter = true;
        tagsString = tagsString.split(delimiter).join('\n');
      }
    });

    // if it had a delimiter do a final split and return an array of unique tags
    if (hasDelimiter) {
      tagsString.split('\n').forEach(tag => {
        if (tag) {
          tagSet.add(tag);
        }
      });
      return Array.from(tagSet);
    }
    return [tagsString];
  }

  setSelectedTag(tag) {
    if (this.restricted) {
      if (this.isTagInList(tag)) {
        this.addTag(tag);
      }
    } else {
      this.addTag(tag);
    }
    this.proposedTag = '';
  }

  blur() {
    this.focused = false;
    this.proposedTag = '';
    this.tagMenu.addClass('util-hide');
    this.tagMenu.removeClass('util-show');
    this.ngModel.$setTouched();
  }

  focus() {
    this.appendToBody();
    this.focused = true;
    this.tagMenu.addClass('util-show');
    this.tagMenu.removeClass('util-hide');
  }

  updateModel() {
    if (angular.isFunction(this.onSort)) {
      this.onSort({tags: this.selectedTags});
    }
    this.ngModel.$setViewValue(angular.copy(this.selectedTags));
    this.ngModel.$setTouched();
    this.setSelectedTagsClasses();
    this.appendToBody();
  }
}
