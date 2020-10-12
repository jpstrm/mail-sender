const compression = require('compression')
const httpErrors = require('http-errors')
const express = require('express')
const nocache = require('nocache')
const expressRequestID = require('express-request-id')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const log4js = require('log4js')

const config = require('./config')
const routes = require('./routes')
const log = require('./common/log')
const logger = log.getLogger('app')
const helper = require('./helper/helper')
const errors = require('./controllers/errors/errors')
const allowedCorsOrigins = config.get('allowedCorsOrigins')
const origins = allowedCorsOrigins.map(helper.convertToRegex)
const swaggerUi = require('swagger-ui-express')
const apiDocument = require('./documentation/api')

const app = express()

// Logging initialization
const { version } = require('../package.json')
logger.info('Starting application with version:', version, 'Node version', process.version)

process.on('unhandledRejection', (reason, promise) => {
  // See https://nodejs.org/api/process.html#process_event_unhandledrejection
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('exit', (code) => {
  logger.error('Exiting with code:', code)
  /*
  * See https://nodejs.org/dist/latest-v12.x/docs/api/process.html#process_event_exit
  * See https://medium.com/@deedee8/event-loop-cycle-in-node-js-bc9dd0f2834f
  */
  logger.error('Active handles:', process._getActiveHandles().length)
  logger.error('Active requests:', process._getActiveRequests().length)
})

// error handler
const getErrorHandler = () => {
  let spaces = 0
  if (logger.isDebugEnabled()) {
    spaces = 2
  }

  /**
   * Error Handler.
   *
   * @param {Error} err the error object
   * @param {Request} req the request object
   * @param {Response} req the response object
   * @param {function} next the next function
   */
  const errorHandler = (err, req, res, next) => {
    logger.debug(err)
    let data
    let printStackTrace = false

    if (err instanceof errors.ApiError) {
      data = err.body
    } else if (err.status) {
      data = {
        statusCode: err.status,
        error: err.message
      }
      if (data.statusCode === 400) {
        data.errorDescription = data.error
        data.error = 'badRequest'
      }
    } else {
      printStackTrace = true
      data = {
        statusCode: err.statusCode || 500,
        code: err.code,
        error: 'Unexpected error',
        errorDescription: err.message
      }
    }
    data['x-request-id'] = req.id
    data = helper.sanitizeErrorObject(data)

    // Store error for https:access logs
    req.responseError = data.error

    if (printStackTrace) {
      logger.error('error:', err.stack, req.id)
    }

    // Log error except 404
    if (data.statusCode >= 500) {
      logger.error(JSON.stringify(data, null, spaces))
    }

    if (app.get('env') === 'dev') {
      data.stack = err.stack
    }

    res.status(data.statusCode)
    res.json(data)
  }

  return errorHandler
}

// Configure application
const configure = async (port) => {
  app.set('port', port)

  // configure middlewares
  app.use(nocache())
  app.use(expressRequestID())
  app.use(cors({
    credentials: true,
    origin: origins
  }))

  // gzip - improve response performance
  app.use(compression())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(cookieParser())

  // swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDocument))

  // logs
  app.use(log4js.connectLogger(log.getLogger('http:access'), log.httpAccessConfig))

  // init routes
  app.use(config.get('basePath'), routes)

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(httpErrors(404))
  })

  // error handler
  app.use(getErrorHandler())

  return app
}

app.configure = configure

module.exports = app
