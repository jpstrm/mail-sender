'use strict'

const emailService = require('../../src/services/email.service')
const awsService = require('../../src/services/aws.service')
const transporter = require('../../src/transporter/transporter')

jest.mock('../../src/services/aws.service')
jest.mock('../../src/transporter/transporter')

describe('Email service', () => {
  it('should send email', async () => {
    awsService.getTemplate = jest.fn().mockResolvedValue('success')
    const body = {
      from: 'test123@test.com',
      to: 'test1234@test.com',
      subject: 'This is a test',
      template: {
        name: 'aws.template.ejs',
        source: 'AWS',
        bucketName: 'bucket.test'
      }
    }
    const res = await emailService.send(body)
    expect(transporter.sendMail).toHaveBeenCalled()
    expect(res.msg).toEqual('Email enviado com sucesso')
  })

  it('should throw error if aws error', async () => {
    awsService.getTemplate = jest.fn().mockRejectedValue(new Error('Error test'))
    const body = {
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
    } catch (err) {
      expect(err.message).toEqual('Error test')
    }
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

  it('should reject with invalid \'from\' field', async () => {
    body.from = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"from" is not allowed to be empty'))
      body.from = 'test123@test.com'
    }
  })

  it('should reject with invalid \'to\' field', async () => {
    body.to = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"to" is not allowed to be empty'))
      body.to = 'test1234@test.com'
    }
  })

  it('should reject with invalid \'cc\' field', async () => {
    body.cc = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"cc" is not allowed to be empty'))
      body.cc = undefined
    }
  })

  it('should reject with invalid \'subject\' field', async () => {
    body.subject = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"subject" is not allowed to be empty'))
    }
    body.subject = 'This is a test'
  })

  it('should reject with invalid \'template\' object', async () => {
    body.template = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"template" must be'))
      body.template = template
    }
  })

  it('should reject with invalid \'template.name\' field', async () => {
    body.template.name = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"template.name" is not allowed to be empty'))
      body.template.name = 'aws.template.ejs'
    }
  })

  it('should reject with invalid \'template.source\' field', async () => {
    body.template.source = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"template.source" must be one of [LOCAL, AWS]'))
      body.template.source = 'AWS'
    }
  })

  it('should reject with invalid \'template.bucketName\' field', async () => {
    body.template.bucketName = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"template.bucketName" is not allowed to be empty'))
      body.template.source = 'AWS'
    }
  })

  it('should reject with invalid \'template.bucketName\' field when \'source\' is LOCAL', async () => {
    body.template.source = 'LOCAL'
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"template.bucketName" is not allowed to be empty'))
      body.template.source = 'AWS'
    }
  })

  it('should reject with invalid \'renderData\' field', async () => {
    body.renderData = 'test'
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"template.bucketName" is not allowed to be empty'))
      body.renderData = undefined
    }
  })
})
