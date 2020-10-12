const Joi = require('joi')

const sendEmailSchema = Joi.object().keys({
  name: Joi.string().alphanum().required(),
  from: Joi.string().email().required(),
  to: Joi.string().email().required(),
  cc: Joi.array().items(
    Joi.string().email().required()
  ),
  subject: Joi.string().alphanum().required()
})

module.exports = {
  sendEmailSchema
}
