const nconf = require('nconf')
const _merge = require('lodash').merge
const config = require('./default')

const environments = {
  LOG_LEVEL: 'logging:level'
}

nconf.env({
  parseValues: true,
  transform: (obj) => {
    if (environments[obj.key]) {
      obj.key = environments[obj.key]
      return obj
    }
  }
})

const configFile = process.env.CONFIG_PATH || '.local-config.json'

nconf.file({ file: configFile })

const env = process.env.ENVIRONMENT || 'local'

nconf.defaults(_merge({}, config.default, config[env]))

nconf.required(['allowedCorsOrigins'])

module.exports = nconf
