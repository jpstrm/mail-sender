const AWS = require('aws-sdk')
const config = require('../config')
const errors = require('../errors/errors')
const logger = require('../common/log').getLogger('aws')

// Set the region
AWS.config.update({ region: config.get('aws:region') })

// Create S3 service object
const s3Client = new AWS.S3()
// Create SQS service object
const sqsClient = new AWS.SQS()

// Call S3 to list the buckets
const getTemplate = async (aws) => {
  let template = ''
  try {
    logger.debug('Buscando buckets do AWS S3')
    const params = { Bucket: aws.bucketName, Key: aws.name }
    const data = (await s3Client.getObject(params).promise())
    template = data.Body.toString('utf-8')
  } catch (err) {
    logger.error('Erro ao listar buckets no AWS S3')
    throw new errors.AwsError(err)
  }
  if (!template) {
    throw new errors.NotFoundError('Template não encontrado no AWS S3', 'Template não encontrado')
  }
  return template
}

async function sendQueue (record) {
  record.retries = record.retries ? record.retries + 1 : 1
  const maxRetries = config.get('email:retries')
  if (record.retries === maxRetries) {
    logger.info(`Email removido da fila após ${maxRetries} tentativas`)
    return
  }
  const params = {
    QueueUrl: config.get('aws:queueUrl'),
    DelaySeconds: 0,
    MessageBody: JSON.stringify(record)
  }
  try {
    await sqsClient.sendMessage(params)
    logger.info('Mensagem enfileirada com sucesso!')
  } catch (err) {
    logger.error('Erro ao enviar mensagem para a fila', err)
  }
}

module.exports = {
  getTemplate,
  sendQueue
}
