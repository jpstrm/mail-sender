const logger = require('./common/log').getLogger('index')
const emailService = require('./services/email.service')
const awsService = require('./services/aws.service')

module.exports.handler = async (event, context) => {
  logger.debug('Event', event)
  logger.info('Inicializando função de envio de emails')
  let total = 0
  if (event && event.Records && event.Records.length) {
    for (const record of event.Records) {
      try {
        await emailService.send(JSON.parse(record.body))
        total++
      } catch (err) {
        await awsService.sendQueue(record)
      }
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
