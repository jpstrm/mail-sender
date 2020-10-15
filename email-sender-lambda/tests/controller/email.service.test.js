'use strict'

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
    const res = body
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual(expect.stringContaining('key does not exist'))
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

    const res = body
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual(expect.stringContaining('key does not exist'))
  })
})
