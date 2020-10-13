const AWS = require('aws-sdk')
const config = require('../config')
const errors = require('../errors/errors')
const logger = require('../common/log').getLogger('email')

// Set the region
AWS.config.update({ region: config.get('aws:region') })

// Create S3 service object
const s3Client = new AWS.S3({ apiVersion: config.get('aws:apiVersion') })

// Call S3 to list the buckets
const getTemplate = async (aws) => {
  let template = ''
  try {
    logger.debug('Fetching buckets from AWS S3')
    const params = { Bucket: aws.bucketName, Key: aws.name }
    const data = (await s3Client.getObject(params).promise())
    template = data.Body.toString('utf-8')
  } catch (err) {
    logger.error('S3 error when listing buckets')
    throw new errors.AwsError(err)
  }
  if (!template) {
    throw new errors.NotFoundError('Template not found in AWS S3', 'Template not found')
  }
  return template
}

module.exports = {
  getTemplate
}
