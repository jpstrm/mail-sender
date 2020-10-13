const AWS = require('aws-sdk')
const config = require('../config')
const logger = require('../common/log').getLogger('email')

// Set the region
AWS.config.update({ region: 'REGION' })

// Create S3 service object
const s3 = new AWS.S3({ apiVersion: config.get('aws:apiVersion') })

// Call S3 to list the buckets
const listBuckets = () => {
  return new Promise((resolve, reject) => {
    s3.listBuckets((err, data) => {
      if (err) {
        logger.error('S3 error when listing buckets')
        reject(err)
      } else {
        logger.debug('S3 buckets fetched successfully')
        resolve(data.Buckets)
      }
    })
  })
}

module.exports = {
  listBuckets
}
