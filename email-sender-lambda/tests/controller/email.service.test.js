'use strict'

const emailService = require('../../src/services/email.service')

describe('Email service', () => {
  it('should throw S3 error if key does not exist', async () => {
    const body = {
      name: 'John',
      from: 'test123@test.com',
      to: 'test1234@test.com',
      subject: 'This is a test',
      template: {
        name: 'aws.template.ejs',
        source: 'AWS',
        bucketName: 'bucket.test'
      }
    }
    try {
      await emailService.send(body)
    } catch (e) {
      expect(e.statusCode).toEqual(404)
      expect(e.name).toEqual('AwsError')
      expect(e.body.error).toEqual(expect.stringContaining('key does not exist'))
    }
  })

  it('should throw S3 error if key does not exist', async () => {
    const body = {
      name: 'John',
      from: 'test123@test.com',
      to: 'test1234@test.com',
      subject: 'This is a test',
      template: {
        name: 'aws.template.ejs',
        source: 'AWS',
        bucketName: 'bucket.test'
      }
    }
    try {
      await emailService.send(body)
    } catch (e) {
      expect(e.statusCode).toEqual(404)
      expect(e.name).toEqual('AwsError')
      expect(e.body.error).toEqual(expect.stringContaining('key does not exist'))
    }
  })
})
