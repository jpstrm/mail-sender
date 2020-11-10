const Joi = require('joi')
const templateTypes = require('../../templates/templateSource.enum')

const emailSend = Joi.object().keys({
  from: Joi.string().trim().email().required(),
  to: Joi.string().trim().email().required(),
  cc: Joi.string().trim().email(),
  subject: Joi.string().trim().required(),
  attachments: Joi.array().items(Joi.object({
    filename: Joi.string().trim().required(),
    content: Joi.any().required(),
    path: Joi.string().trim(),
    href: Joi.string().trim(),
    httpHeaders: Joi.string().trim(),
    contentType: Joi.string().trim().required(),
    contentDisposition: Joi.string().trim(),
    cid: Joi.string().trim(),
    encoding: Joi.string().trim().required(),
    headers: Joi.string().trim(),
    raw: Joi.string().trim()
  })),
  template: Joi.object().keys({
    name: Joi.string().trim().required(),
    source: Joi.string().trim().valid(...Object.values(templateTypes)),
    bucketName: Joi.when('source', {
      is: 'AWS',
      then: Joi.string().trim().required(),
      otherwise: Joi.string()
    })
  }).required(),
  renderData: Joi.object()
})

module.exports = emailSend
