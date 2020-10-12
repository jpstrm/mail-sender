class ApiError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class ApplicationError extends ApiError {
  constructor (statusCode, error, errorDescription, additionalParams) {
    super(error)
    this.statusCode = statusCode
    this.body = {
      statusCode,
      error,
      errorDescription,
      ...additionalParams
    }
  }
}

class InternalError extends ApiError {
  constructor (statusCode, error, errorDescription, additionalParams) {
    super(error)
    this.statusCode = statusCode || 500
    this.body = {
      error: error,
      errorDescription: errorDescription,
      statusCode: this.statusCode,
      ...additionalParams
    }
  }
}

module.exports = {
  ApiError,
  ApplicationError,
  InternalError
}
