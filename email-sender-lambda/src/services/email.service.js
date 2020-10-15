'use strict'

const logger = require('../common/log').getLogger('email')
const sendMail = require('../transporter/transporter').sendMail

const send = async (email) => {
  logger.info("Email recebido para ser enviado", email)
  await sendMail(email)
  logger.info("Email enviado com sucesso")
  return { msg: 'Email enviado com sucesso' }
}

module.exports = {
  send
}
