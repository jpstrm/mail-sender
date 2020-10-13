'use strict'

const logger = require('../common/log').getLogger('email')
const rejectRequest = require('../helper/helper').getRejectRequest(logger)
const sendMail = require('../mail/transporter').sendMail

const send = (req, res, next) => {
  logger.debug('Sending email')
  sendMail(req.body)
    .then(res => {
      res.status(200).send({ message: 'Email sent successfully' })
    })
    .catch(err => {
      rejectRequest(req, res, err)
    })
}

module.exports = {
  send
}
