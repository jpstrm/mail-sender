const nodemailer = require('nodemailer')
const logger = require('../common/log').getLogger('transporter')
const config = require('../config')

const transport = {
  host: config.get('mail:host'),
  auth: {
    user: config.get('mail:user'),
    pass: config.get('mail:pass')
  }
}

// create transport instance
const transporter = nodemailer.createTransport(transport)

transporter.verify((err, success) => {
  if (err) {
    logger.error('Transporter error', err)
  } else {
    logger.info('Mail Server is ready')
  }
})

module.exports = transporter
