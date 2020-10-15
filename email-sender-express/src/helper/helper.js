const errors = require('../errors/errors')

/**
 * Convert a string to a RegExp.
 *
 * @param {string} value the string that will be converted
 * @returns {string}
 */
const convertToRegex = (value) => {
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
const sanitizeErrorObject = (data) => {
  for (const key of ['error', 'errorDescription']) {
    if (data[key]) {
      data[key] = data[key].replace(/[\000-\037<>]/g, '')
    }
  }
  return data
}

const _getRejectRequest = (logger) => {
  let spaces = 0
  if (logger.isDebugEnabled()) {
    spaces = 2
  }

  const rejectRequest = (req, res, err) => {
    if (err instanceof errors.ApiError) {
      err.body['x-request-id'] = req.id
    } else {
      err.body = {
        error: 'Unexpected error',
        errorDescription: err.message,
        statusCode: 500,
        'x-request-id': req.id
      }

      logger.error('error:', err.stack, req.id)
    }

    // Store error for https:access logs
    req.responseError = err.body.error

    let internalData = ''
    if (err.internalData) {
      if (typeof err.internalData === 'object') {
        internalData = err.internalData
      } else {
        internalData = { data: err.internalData }
      }
    }
    internalData = 'internalData: ' + JSON.stringify(internalData, null, spaces)

    logger.error(JSON.stringify(err, null, spaces), internalData)
    res.status(err.body.statusCode)
    res.send(err.body)
  }

  return (req, res, err) => {
    try {
      rejectRequest(req, res, err)
    } catch (error) {
      const errorBody = {
        error: 'Unexpected exception',
        errorDescription: error.message,
        statusCode: 500,
        'x-request-id': req.id
      }
      let stack = error.stack
      if (!logger.isDebugEnabled()) {
        stack = error.stack.replace(/\n/g, '')
      }
      logger.error('Unexpected exception:', stack, JSON.stringify(errorBody, null, spaces),
        ' while processing error:', err)
      res.status(500)
      res.send(errorBody)
    }
  }
}

module.exports = {
  convertToRegex,
  sanitizeErrorObject,
  getRejectRequest: _getRejectRequest
}
