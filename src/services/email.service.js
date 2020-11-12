'use strict'

const logger = require('../common/log').getLogger('email')
const sendMail = require('../transporter/transporter').sendMail
const validator = require('../validators/validator')

async function send (email) {
  logger.info('Email recebido para ser enviado', email)
  validator.emailValidator(email)
  await sendMail(email)
  logger.info('Email enviado com sucesso')
  return { msg: 'Email enviado com sucesso' }
}

module.exports = {
  send
}
