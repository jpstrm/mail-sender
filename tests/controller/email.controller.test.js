'use strict'

const request = require('supertest')
const app = require('../../src/app')

describe('Email controller', () => {
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

    const res = await request(app)
      .post('/api/email/send')
      .send(body)
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

    const res = await request(app)
      .post('/api/email/send')
      .send(body)
    expect(res.statusCode).toEqual(404)
    expect(res.body.error).toEqual(expect.stringContaining('key does not exist'))
  })
})

describe('Email request validators', () => {
  const template = {
    name: 'aws.template.ejs',
    source: 'AWS',
    bucketName: 'bucket.test'
  }
  const body = {
    name: 'test',
    from: 'test123@test.com',
    to: 'test1234@test.com',
    subject: 'This is a test',
    template
  }

  it('should reject with with invalid \'name\' field', async () => {
    body.name = ''
    const res = await request(app)
      .post('/api/email/send')
      .send(body)
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual(expect.stringContaining('"name" is not allowed to be empty'))
    body.name = 'test'
  })

  it('should reject with with invalid \'from\' field', async () => {
    body.from = ''
    const res = await request(app)
      .post('/api/email/send')
      .send(body)
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual(expect.stringContaining('"from" is not allowed to be empty'))
    body.from = 'test123@test.com'
  })

  it('should reject with with invalid \'to\' field', async () => {
    body.to = ''
    const res = await request(app)
      .post('/api/email/send')
      .send(body)
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual(expect.stringContaining('"to" is not allowed to be empty'))
    body.to = 'test1234@test.com'
  })

  it('should reject with with invalid \'cc\' field', async () => {
    body.cc = ''
    const res = await request(app)
      .post('/api/email/send')
      .send(body)
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual(expect.stringContaining('"cc" is not allowed to be empty'))
    body.cc = undefined
  })

  it('should reject with with invalid \'template\' object', async () => {
    body.template = ''
    const res = await request(app)
      .post('/api/email/send')
      .send(body)
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual(expect.stringContaining('"template" must be an object'))
    body.template = template
  })

  it('should reject with with invalid \'template.name\' field', async () => {
    body.template.name = ''
    const res = await request(app)
      .post('/api/email/send')
      .send(body)
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual(expect.stringContaining('[child "name" fails'))
    body.template.name = 'aws.template.ejs'
  })

  it('should reject with with invalid \'template.source\' field', async () => {
    body.template.source = ''
    const res = await request(app)
      .post('/api/email/send')
      .send(body)
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual(expect.stringContaining('[child "source" fails'))
    body.template.source = 'AWS'
  })

  it('should reject with with invalid \'template.bucketName\' field', async () => {
    body.template.bucketName = ''
    const res = await request(app)
      .post('/api/email/send')
      .send(body)
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual(expect.stringContaining('[child "bucketName" fails'))
    body.template.source = 'AWS'
  })

  it('should reject with with invalid \'template.bucketName\' field when \'source\' is LOCAL', async () => {
    body.template.source = 'LOCAL'
    const res = await request(app)
      .post('/api/email/send')
      .send(body)
    expect(res.statusCode).toEqual(400)
    expect(res.body.error).toEqual(expect.stringContaining('[child "bucketName" fails because ["bucketName" is not allowed]'))
    body.template.source = 'AWS'
  })
})
