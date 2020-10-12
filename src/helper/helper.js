/**
 * Convert a string to a RegExp.
 *
 * @param {string} value the string that will be converted
 * @returns {string}
 */
function convertToRegex (value) {
  if (value.startsWith('/')) {
    var endpoint = value.replace(/\//g, '')
    return new RegExp(endpoint)
  } else {
    return value
  }
}

/**
 * Sanitize the information for XSS protection
 * @param {Object} data to sanitize
 * @returns the sanitized data
 */
function sanitizeErrorObject (data) {
  for (const key of ['error', 'errorDescription']) {
    if (data[key]) {
      data[key] = data[key].replace(/[\000-\037<>]/g, '')
    }
  }
  return data
}

module.exports = {
  convertToRegex,
  sanitizeErrorObject
}
