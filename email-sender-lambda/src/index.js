const logger = require('./common/log').getLogger('index')
const emailService = require('./services/email.service')

module.exports.handler = async (event, context) => {
  logger.debug('Event', event)
  logger.debug('Context', context)
  logger.info('Inicializando função de envio de emails')
  let total = 0
  if (event && event.Messages && event.Messages.length) {
    for (const message of event.Messages) {
      await emailService.send(JSON.parse(message.body))
      total++
    }
    const successMsg = 'Emails enviados com sucesso, total: ' + total
    logger.info(successMsg)
    return {
      statusCode: 200,
      body: {
        message: successMsg
      }
    }
  } else {
    return {
      statusCode: 500,
      body: {
        message: 'Não foi possível processar o envio dos emails'
      }
    }
  }
}
