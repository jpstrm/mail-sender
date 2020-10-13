const _merge = require('lodash').merge
const dotenv = require('dotenv')

// configure environment from .env file
dotenv.config()

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
    region: process.env.AWS_REGION || 'us-west-2',
    apiVersion: '2006-03-01',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
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
