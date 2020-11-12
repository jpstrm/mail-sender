class AppError extends Error {
  constructor (message) {
    super(message)
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

class ApplicationError extends AppError {
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

class InternalError extends AppError {
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

class MailError extends AppError {
  constructor (error, additionalParams) {
    super(error)
    this.statusCode = 500
    this.body = {
      statusCode: this.statusCode,
      error: error.stack,
      errorDescription: error.message,
      ...additionalParams
    }
  }
}

class NotFoundError extends AppError {
  constructor (error, errorDescription, additionalParams) {
    super(error)
    this.statusCode = 404
    this.body = {
      statusCode: this.statusCode,
      error,
      errorDescription,
      ...additionalParams
    }
  }
}

class AwsError extends AppError {
  constructor (error, errorDescription, additionalParams) {
    super(error)
    this.statusCode = error.statusCode
    this.body = {
      statusCode: this.statusCode,
      error: error.stack,
      errorDescription: errorDescription || error.message,
      ...additionalParams
    }
  }
}

class JoiError extends AppError {
  constructor (error, errorDescription, additionalParams) {
    super(error)
    this.statusCode = 400
    this.body = {
      statusCode: this.statusCode,
      error: error.message,
      errorDescription,
      ...additionalParams
    }
  }
}

module.exports = {
  AppError,
  ApplicationError,
  InternalError,
  MailError,
  NotFoundError,
  AwsError,
  JoiError
}
