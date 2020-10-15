const log4js = require('log4js')
const log4jsExtend = require('log4js-extend')

const config = require('../config')
const logLevel = config.get('logging:level')
const layoutType = config.get('logging:layoutType')

log4js.configure({
  appenders: {
    out: {
      type: 'stdout',
      layout: { type: layoutType }
    }
  },
  categories: {
    default: { appenders: ['out'], level: logLevel }
  }
})

log4jsExtend(log4js, {
  path: __dirname,
  format: 'at @name (@file:@line:@column)'
})

const httpAccessConfig = {
  level: 'auto',
  // See https://github.com/log4js-node/log4js-node/blob/master/docs/connect-logger.md
  format: (req, res, format) => {
    const responseError = req.responseError || ''
    return format(`:remote-addr - ${req.id} - ":method :url HTTP/:http-version" status=:status :content-length :user-agent" "${responseError}" ${req.responseTimeInfo}`)
  },
  nolog: '\\.ico'
}

module.exports = {
  getLogger: log4js.getLogger,
  httpAccessConfig
}
