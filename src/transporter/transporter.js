const nodemailer = require('nodemailer')
const ejs = require('ejs')
const path = require('path')
const logger = require('../common/log').getLogger('transporter')
const errors = require('../errors/errors')
const config = require('../config')
const awsService = require('../services/aws.service')
const templateTypes = require('../../templates/templateSource.enum')

const transport = {
  host: config.get('email:host'),
  port: config.get('email:port'),
  secure: config.get('email:secure'),
  requireTLS: config.get('email:tlsRejectUnauthorized'),
  auth: {
    user: config.get('email:user'),
    pass: config.get('email:pass')
  },
  tls: {
    rejectUnauthorized: config.get('email:tls')
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

async function sendMail (emailReq) {
  const emailData = await getHtmlContent(emailReq)

  const options = {
    from: emailReq.from,
    to: emailReq.to,
    cc: emailReq.cc,
    subject: emailReq.subject,
    html: emailData,
    attachments: emailReq.attachments
  }
  logger.debug('html data', options.html)
  try {
    logger.info(`Enviando email com o transproter no host: ${transport.host} e na port ${transport.port}.`)
    return await transporter.sendMail(options)
  } catch (err) {
    logger.error('Erro ao enviar email')
    throw new errors.MailError(err)
  }
}

async function getHtmlContent (emailReq) {
  let templatePath = `${path.resolve('./')}/templates/${emailReq.template.name}`
  let emailHtml = ''
  if (emailReq.template.source === templateTypes.AWS) {
    logger.info('Buscando template do diretório da AWS S3')
    const template = await awsService.getTemplate(emailReq.template)
    logger.info('Template obtido com sucesso da AWS S3')
    emailHtml = ejs.render(template)
  } else {
    templatePath = `${path.resolve('./')}/templates/${emailReq.template.name}`
    emailHtml = await ejs.renderFile(templatePath, { data: emailReq.renderData })
  }

  return getTemplate(emailReq.options, emailHtml)
}

function getTemplate (options, html) {
  let templateName = 'email-base'
  if (options.customEmail) {
    const photoSiteLogo = options.photoSiteLogo
    options.logo = photoSiteLogo ? `https://static.saipos.com/${photoSiteLogo}` : undefined
    templateName = `${templateName}-by-store`
  }

  const templateBasePath = `${path.resolve('./')}/templates/${templateName}.ejs`
  return ejs.renderFile(templateBasePath, {
    ...options,
    htmlContent: html
  })
}

module.exports = {
  sendMail
}
