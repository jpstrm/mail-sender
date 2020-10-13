const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const logger = require('../common/log').getLogger('transporter')
const errors = require('../errors/errors')
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

const sendMail = (body) => {
  const templatePath = `${path.resolve('./')}/templates/${body.template}`
  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, { name: body.name }, function (err, data) {
      if (err) {
        logger.error('Ejs render error', err)
        reject(err)
      } else {
        const options = {
          from: body.from,
          to: body.email,
          subject: body.subject,
          html: data
        }
        logger.debug('html data', options.html)

        transporter.sendMail(options)
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(new errors.MailError(err))
          })
      }
    })
  })
}

module.exports = {
  sendMail
}
