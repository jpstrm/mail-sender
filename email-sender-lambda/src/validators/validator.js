const errors = require('../../src/errors/errors')
const emailSchema = require('../schema/email.schema')

function validator (body) {
  console.log('test')
  const { error } = emailSchema.validate(body)
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
