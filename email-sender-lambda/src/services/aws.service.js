const aws = require('aws-sdk')
const config = require('../config')
const errors = require('../errors/errors')
const logger = require('../common/log').getLogger('aws')

// Set the region
aws.config.update({ region: config.get('aws:region') })

// Create S3 service object
const s3Client = new aws.S3()

// Call S3 to list the buckets
const getTemplate = async (body) => {
  let template = ''
  try {
    logger.debug('Buscando buckets do AWS S3')
    const params = { Bucket: body.bucketName, Key: body.name }
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

module.exports = {
  getTemplate
}
