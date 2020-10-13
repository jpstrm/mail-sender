const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const logger = require('../common/log').getLogger('transporter')
const errors = require('../errors/errors')
const config = require('../config')
const aws = require('../controllers/aws.controller')
const templateTypes = require('./templateSource.enum')

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

const sendMail = async (body) => {
  let templatePath = `${path.resolve('./')}/templates/${body.template.name}`
  if (body.template.source === templateTypes.AWS) {
    logger.debug('Fetching repository from AWS S3')
    const buckets = await aws.listBuckets()
    logger.info('Buckets fetched from AWS', buckets)
  } else {
    templatePath = `${path.resolve('./')}/templates/${body.template.name}`
  }
  const emailData = await ejs.renderFile(templatePath, { name: body.name })

  const options = {
    from: body.from,
    to: body.email,
    subject: body.subject,
    html: emailData
  }
  logger.debug('html data', options.html)
  try {
    logger.debug('Sending email...')
    return await transporter.sendMail(options)
  } catch (err) {
    throw new errors.MailError(err)
  }
}

module.exports = {
  sendMail
}
