'use strict'

const logger = require('../common/log').getLogger('email')
const asyncMiddleware = require('../middleware/async.middleware')
const sendMail = require('../mail/transporter').sendMail

const send = asyncMiddleware(async (req, res, next) => {
  logger.debug('Sending email')
  await sendMail(req.body)

  res.status(200).send({ message: 'Email sent successfully' })
})

module.exports = {
  send
}
