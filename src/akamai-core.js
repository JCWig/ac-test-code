import angular from 'angular';
import uuid from './uuid';
import i18n from './i18n';
import indeterminateProgress from './indeterminate-progress';
import contentPanel from './content-panel';
import menuButton from './menu-button';
import modalWindow from './modal-window';
import messageBox from './message-box';
import statusMessage from './status-message';
import datePicker from './date-picker';
import pagination from './pagination';
import listBox from './list-box';
import table from './table';
import spinner from './spinner';
import utils from './utils';
import switchButton from './switch-button';
import popover from './popover';
import treeView from './tree-view';
import timePicker from './time-picker';
import tagInput from './tag-input';
import dropdown from './dropdown';
import auth from './auth';
import autocomplete from './autocomplete';
import megaMenu from './mega-menu';
import wizard from './wizard';
import navigation from './navigation';
import dateRange from './date-range';
import spinnerButton from './spinner-button';
import progressBar from './progress-bar';

/**
 * @ngdoc overview
 * @name akamai.components
 *
 * @description UI Core Components have been enhanced with small but significant interaction
 * + visual changes and rewritten using the modern front end technology stack selected for
 * Project Pular.  This first release includes 21 components in 5 categories:
 *   * Navigational components provide ways to get around in the interface
 *   * Input Components provide controls to enter information and make selections
 *   * Informational Components give the user feedback and guidance
 *   * Content Containers structure data and present application content
 * We look forward to growing and evolving the component roster.
 */
angular.module('akamai.components', [
  uuid.name,
  i18n.name,
  indeterminateProgress.name,
  contentPanel.name,
  menuButton.name,
  modalWindow.name,
  messageBox.name,
  statusMessage.name,
  datePicker.name,
  pagination.name,
  listBox.name,
  table.name,
  spinner.name,
  utils.name,
  switchButton.name,
  popover.name,
  treeView.name,
  timePicker.name,
  tagInput.name,
  dropdown.name,
  auth.name,
  autocomplete.name,
  megaMenu.name,
  wizard.name,
  dateRange.name,
  navigation.name,
  spinnerButton.name,
  progressBar.name
]);
