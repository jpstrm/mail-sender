const serverless = require('serverless-http')
const app = require('./app')
const logger = require('./common/log').getLogger('appHandler')

const handler = serverless(app)

module.exports.handler = async (event, context) => {
  logger.info('Configuring application')
  await app.configure()
  logger.info('Application configured successfully')
  return await handler(event, context)
}
