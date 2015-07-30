/**
 * @ngdoc object
 * @name helpers.searchTargetBlank
 * @param {String} category The search category to check
 * @description
 * Returns true if the inputted category is `documentation` or `knowledge_base`
 * @returns {Boolean} true if the inputted category is `documentation` or `knowledge_base`
 */
function searchTargetBlank(category) {
  return category === 'documentation' || category === 'knowledge_base';
}

module.exports = searchTargetBlank;
