const _merge = require('lodash').merge

const local = {
  allowedCorsOrigins: ['/localhost/'],
  logging: {
    level: 'debug',
    layoutType: 'coloured',
    maxStringLength: 80
  },
  mail: {
    host: 'smtp.test.com',
    user: 'test@test.com.br',
    pass: 'test123'
  },
  aws: {
    region: 'us-west-2',
    apiVersion: '2006-03-01'
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
