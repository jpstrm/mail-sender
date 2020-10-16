const logger = require('./common/log').getLogger('index')
const emailService = require('./services/email.service')

module.exports.handler = async (event, context) => {
  logger.debug('Context', context)
  logger.info('Inicializando função de envio de emails')
  let total = 0
  if (event && event.Records && event.Records.length) {
    for (const record of event.Records) {
      const result = await emailService.send(record.body)
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
