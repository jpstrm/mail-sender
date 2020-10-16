const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const logger = require('../common/log').getLogger('transporter')
const errors = require('../errors/errors')
const config = require('../config')
const aws = require('../controllers/aws.controller')
const templateTypes = require('./templateSource.enum')

const transport = {
  host: config.get('email:host'),
  port: config.get('email:port') || 587,
  secure: config.get('email:secure') || false,
  requireTLS: config.get('email:tls') || false,
  auth: {
    user: config.get('email:user'),
    pass: config.get('email:pass')
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
  let template = ''
  let emailData = ''
  if (body.template.source === templateTypes.AWS) {
    logger.debug('Fetching repository from AWS S3')
    template = await aws.getTemplate(body.template)
    logger.info('Template fetched from AWS S3')
    emailData = ejs.render(template)
  } else {
    templatePath = `${path.resolve('./')}/templates/${body.template.name}`
    emailData = await ejs.renderFile(templatePath, { name: body.name })
  }

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
