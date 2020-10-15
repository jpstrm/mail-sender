const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const logger = require('../common/log').getLogger('transporter')
const errors = require('../errors/errors')
const config = require('../config')
const aws = require('../services/aws.controller')
const templateTypes = require('../../templates/templateSource.enum')

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
    logger.error('Error ao criar transporter', err)
  } else {
    logger.info('Transporter criado com sucesso')
  }
})

const sendMail = async (emailReq) => {
  let templatePath = `${path.resolve('./')}/templates/${emailReq.template.name}`
  let template = ''
  let emailData = ''
  if (emailReq.template.source === templateTypes.AWS) {
    logger.info('Buscando template do diretório da AWS S3')
    template = await aws.getTemplate(emailReq.template)
    logger.info('Template obtido com sucesso da AWS S3')
    emailData = ejs.render(template)
  } else {
    templatePath = `${path.resolve('./')}/templates/${emailReq.template.name}`
    emailData = await ejs.renderFile(templatePath, { name: emailReq.name })
  }

  const options = {
    from: emailReq.from,
    to: emailReq.email,
    cc: emailReq.cc,
    subject: emailReq.subject,
    html: emailData
  }
  logger.debug('html data', options.html)
  try {
    logger.info('Enviando email com o transproter...')
    return await transporter.sendMail(options)
  } catch (err) {
    logger.error(new errors.MailError(err))
  }
}

module.exports = {
  sendMail
}
