'use strict'

const logger = require('../../common/log').getLogger('mail')
const errors = require('../../errors/errors')
const sendMail = require('../../mail/transporter').sendMail
const templateTypes = require('../../mail/template/types.template')

const send = (req, res, next) => {
  logger.debug('Sending email')
  sendMail(req.body, templateTypes.default)
    .then(res => {
      res.status(200).send({ message: 'Email sent successfully' })
    })
    .catch(err => {
      throw new errors.MailError(err, 'Error sending email')
    })
}

module.exports = {
  send
}
