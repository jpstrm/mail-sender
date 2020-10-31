const Joi = require('joi')
const errors = require('../../src/errors/errors')
const emailSchema = require('../schema/email.schema')

function validator (body, schema) {
  const { error } = Joi.validate(body, schema)
  const valid = error == null

  if (!valid) {
    const { details } = error
    const errorDetails = details.map(i => i.message).join(',')
    throw new errors.JoiError(error, errorDetails)
  }
}
const _emailValidator = (body) => {
  validator(body, emailSchema)
}

module.exports = {
  emailValidator: _emailValidator
}
