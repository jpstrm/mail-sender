const Joi = require('joi')
const templateTypes = require('../mail/templateSource.enum')

const emailPost = Joi.object().keys({
  name: Joi.string().trim().required(),
  from: Joi.string().trim().email().required(),
  to: Joi.string().trim().email().required(),
  cc: Joi.string().trim().email(),
  subject: Joi.string().trim().required(),
  template: Joi.object().keys({
    name: Joi.string().trim().required(),
    source: Joi.string().trim().valid(...Object.values(templateTypes)),
    bucketName: Joi.when('source', {
      is: 'AWS',
      then: Joi.string().trim().required(),
      otherwise: Joi.forbidden()
    })
  }).required()
})

module.exports = {
  emailPost
}
