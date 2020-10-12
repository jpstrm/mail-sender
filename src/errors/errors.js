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

class MailError extends ApiError {
  constructor (error, additionalParams) {
    super(error)
    this.statusCode = 500
    this.body = {
      error: error.stack,
      errorDescription: error.message,
      ...additionalParams
    }
  }
}

class ValidationError extends ApiError {
  constructor (error, errorDescription, additionalParams) {
    super(error)
    this.statusCode = 400
    this.body = {
      error,
      errorDescription,
      ...additionalParams
    }
  }
}

module.exports = {
  ApiError,
  ApplicationError,
  InternalError,
  MailError,
  ValidationError
}
