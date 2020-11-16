'use strict'

const emailService = require('../../src/services/email.service')
const awsService = require('../../src/services/aws.service')
const transporter = require('../../src/transporter/transporter')

jest.mock('../../src/services/aws.service')
jest.mock('../../src/transporter/transporter')

describe('Email service', () => {
  function getBody () {
    return {
      from: 'test123@test.com',
      to: 'test1234@test.com',
      subject: 'This is a test',
      template: {
        name: 'aws.template.ejs',
        source: 'AWS',
        bucketName: 'bucket.test'
      },
      renderData: {
        name: 'Data test'
      },
      options: {
        withSaiposLogo: true,
        withSignature: true,
        customEmail: true,
        photoSiteLogo: ''
      }
    }
  }

  it('should send email', async () => {
    awsService.getTemplate = jest.fn().mockResolvedValue('success')
    const res = await emailService.send(getBody())
    expect(transporter.sendMail).toHaveBeenCalled()
    expect(res.msg).toEqual('Email enviado com sucesso')
  })

  it('should throw error if aws error', async () => {
    awsService.getTemplate = jest.fn().mockRejectedValue(new Error('Error test'))
    try {
      await emailService.send(getBody())
    } catch (err) {
      expect(err.message).toEqual('Error test')
    }
  })
})

describe('Email request validators', () => {
  function getTemplate () {
    return {
      name: 'aws.template.ejs',
      source: 'AWS',
      bucketName: 'bucket.test'
    }
  }

  function getBody () {
    return {
      from: 'test123@test.com',
      to: 'test1234@test.com',
      subject: 'This is a test',
      template: getTemplate(),
      options: {
        withSaiposLogo: true,
        withSignature: true,
        customEmail: true
      }
    }
  }

  it('should reject with invalid \'from\' field', async () => {
    const body = getBody()
    body.from = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"from" is not allowed to be empty'))
    }
  })

  it('should reject with invalid \'to\' field', async () => {
    const body = getBody()
    body.to = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"to" is not allowed to be empty'))
    }
  })

  it('should reject with invalid \'cc\' field', async () => {
    const body = getBody()
    body.cc = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"cc" is not allowed to be empty'))
    }
  })

  it('should reject with invalid \'subject\' field', async () => {
    const body = getBody()
    body.subject = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"subject" is not allowed to be empty'))
    }
  })

  it('should reject with invalid \'template\' object', async () => {
    const body = getBody()
    body.template = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"template" must be'))
    }
  })

  it('should reject with invalid \'template.name\' field', async () => {
    const body = getBody()
    body.template.name = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"template.name" is not allowed to be empty'))
    }
  })

  it('should reject with invalid \'template.source\' field', async () => {
    const body = getBody()
    body.template.source = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"template.source" must be one of [LOCAL, AWS]'))
    }
  })

  it('should reject with invalid \'template.bucketName\' field', async () => {
    const body = getBody()
    body.template.bucketName = ''
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"template.bucketName" is not allowed to be empty'))
    }
  })

  it('should reject with invalid \'renderData\' field', async () => {
    const body = getBody()
    body.renderData = 'test'
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"renderData" must be of type object'))
    }
  })

  it('should reject with invalid \'options\' field', async () => {
    const body = getBody()
    body.options = undefined
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"options" is required'))
    }
  })

  it('should reject with invalid \'options\' field', async () => {
    let body = getBody()
    body.options.withSaiposLogo = 'test'
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"options.withSaiposLogo" must be a boolean'))
    }
    body = getBody()
    body.options.withSignature = 'test'
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"options.withSignature" must be a boolean'))
    }
    body = getBody()
    body.options.customEmail = 'test'
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"options.customEmail" must be a boolean'))
    }
  })

  it('should reject with invalid \'options.photoSiteLogo\' field', async () => {
    const body = getBody()
    body.options.customEmail = true
    body.options.photoSiteLogo = 123
    try {
      const res = await emailService.send(body)
      expect(res).toBeUndefined()
    } catch (err) {
      expect(err.statusCode).toEqual(400)
      expect(err.body.error).toEqual(expect.stringContaining('"options.photoSiteLogo" must be a string'))
    }
  })

  it('should not reject with \'options.photoSiteLogo\' field empty when customEmail false', async () => {
    const body = getBody()
    body.options.customEmail = false
    body.options.photoSiteLogo = ''
    const res = await emailService.send(body)
    expect(res).toEqual({ msg: 'Email enviado com sucesso' })
  })
})
