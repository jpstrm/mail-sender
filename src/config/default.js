const _merge = require('lodash').merge

const local = {
  allowedCorsOrigins: ['/localhost/'],
  logging: {
    level: 'debug',
    layoutType: 'coloured',
    maxStringLength: 80
  }
}

const dev = {
}

module.exports = {
  dev: dev,
  local: _merge({}, dev, local),
  default: {
    basePath: '/api',
    logging: {
      level: 'debug',
      layoutType: 'basic'
    }
  }
}