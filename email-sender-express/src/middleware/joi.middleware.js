const Joi = require('joi')
const errors = require('../errors/errors')

const middleware = (schema, property) => {
  return (req, res, next) => {
    const { error } = Joi.validate(req.body, schema)
    const valid = error == null

    if (valid) {
      next()
    } else {
      const { details } = error
      const errorDetails = details.map(i => i.message).join(',')
      throw new errors.JoiError(error, errorDetails)
    }
  }
}

module.exports = middleware
