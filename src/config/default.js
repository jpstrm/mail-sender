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
    secure: process.env.EMAIL_SECURE || false,
    tls: process.env.EMAIL_TLS || false,
    tlsRejectUnauthorized: process.env.EMAIL_TLS_REJECT_UNAUTHORIZED || false,
    user: process.env.EMAIL_USER || 'test@test.com.br',
    pass: process.env.EMAIL_USER_PASS || 'test123',
    retries: process.env.EMAIL_RETRIES || 3
  },
  aws: {
    region: process.env.AWS_REGION || 'us-west-2'
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
