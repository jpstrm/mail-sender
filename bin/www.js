const app = require('../src/app')
const logger = require('../src/common/log').getLogger('www')
const http = require('http')
let server
let port

/**
 * Start server.
 */
async function startServer () {
  port = normalizePort(process.env.PORT || '8080')
  await app.configure(port)

  /**
   * Create HTTP server.
   */
  server = http.createServer(app)

  logger.info('Creating server...')

  /**
   * Listen on provided port, on all network interfaces.
   */
  server.listen(port)
  server.on('error', onError)
  server.on('listening', onListening)
  server.on('close', function () {
    logger.info('HTTP server closing ...')
  })
}

/**
 * Normalize a port into a number, string, or false.
 *
 * @param {string} val port value
 * @returns {(string|number|boolean)}
 */
function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 *
 * @param {Error} error error object
 */
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)

    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  logger.info(`Server listening on ${bind}`)
}

startServer()
