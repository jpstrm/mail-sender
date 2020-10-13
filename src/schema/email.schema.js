const joi = require('joi')
const templateTypes = require('../mail/templateSource.enum')

const sendEmailSchema = joi.object().keys({
  name: joi.string().alphanum().required(),
  from: joi.string().email().required(),
  to: joi.string().email().required(),
  cc: joi.array().items(
    joi.string().email().required()
  ),
  subject: joi.string().alphanum().required(),
  templateSource: joi.string().valid(...Object.values(templateTypes))
})

module.exports = {
  sendEmailSchema
}
