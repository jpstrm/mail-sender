const joi = require('joi')
const errors = require('../errors/errors')

const middleware = (schema, property) => {
  return (req, res, next) => {
    const { err } = joi.validate(req.body, schema)
    const valid = err == null

    if (valid) { next() } else {
      const { details } = err
      const errorDetail = details.map(i => i.message).join(',')
      throw new errors.ValidationError(500, err, errorDetail)
    }
  }
}

module.exports = middleware
