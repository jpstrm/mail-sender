const logger = require('./common/log').getLogger('appHandler')
const emailService = require('./services/email.service')

module.exports.handler = async (event, context) => {
  console.log('context', context)
  logger.info('Inicializando função de envio de emails')
  let total = 0
  if (event && event.Records && event.Records.length) {
    event.Records.forEach(entry => {
      emailService.send(entry.body)
      total++
    })
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
