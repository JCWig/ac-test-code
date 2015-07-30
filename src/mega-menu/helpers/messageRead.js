/**
 * @ngdoc object
 * @name helpers.messageRead
 * @param {Object} message Message object to check
 * @description
 * Returns true if the message status is "R", false otherwise
 * @returns {Boolean} true if the message status is "R", false otherwise.
 */
function messageRead(message) {
  return message.status === 'R';
}

module.exports = messageRead;
