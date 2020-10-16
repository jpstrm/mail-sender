const _merge = require('lodash').merge
const dotenv = require('dotenv')

// configure environment from .env file
dotenv.config({ path: '../.env' })

const local = {
  logging: {
    level: 'debug',
    layoutType: 'coloured',
    maxStringLength: 80
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.test.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE || 'secure123',
    tls: process.env.EMAIL_TLS || false,
    user: process.env.EMAIL_USER || 'test@test.com.br',
    pass: process.env.EMAIL_USER_PASS || 'test123',
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
    logging: {
      level: 'debug',
      layoutType: 'basic'
    }
  }
}
