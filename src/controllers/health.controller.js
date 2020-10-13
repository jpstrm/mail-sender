'use strict'

const logger = require('../common/log').getLogger('health')

const health = (req, res, next) => {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now()
  }
  try {
    logger.debug('Health check')
    res.status(200).send(health)
  } catch (ex) {
    logger.error('Health check error', ex)
    health.message = ex
    res.status(503).send()
  }
}

module.exports = health
