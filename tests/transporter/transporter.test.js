'use strict'

jest.mock('nodemailer')

const nodemailer = require('nodemailer')

const sendMail = jest.fn()
nodemailer.createTransport = jest.fn(() => ({
  sendMail: sendMail,
  verify: jest.fn()
}))

const transporter = require('../../src/transporter/transporter')
const awsService = require('../../src/services/aws.service')
const templateTypes = require('../../templates/templateSource.enum')

jest.mock('../../src/services/aws.service')

describe('Transporter test', () => {
  function getBody () {
    return {
      from: 'test123@test.com',
      to: 'test1234@test.com',
      subject: 'This is a test',
      template: {
        name: 'default.template.ejs',
        source: templateTypes.LOCAL,
        bucketName: ''
      },
      renderData: {
        name: 'Data test'
      },
      options: {
        withSaiposLogo: true,
        withSignature: true,
        customEmail: false
      }
    }
  }

  it('should send email', async () => {
    await transporter.sendMail(getBody())
    expect(sendMail.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        subject: 'This is a test',
        from: 'test123@test.com',
        to: 'test1234@test.com',
        cc: undefined,
        attachments: undefined,
        html: expect.stringContaining('<body class="full-padding" ')
      })
    )
  })

  it('should send email with Saipos logo', async () => {
    awsService.getTemplate = jest.fn().mockResolvedValue('success')
    await transporter.sendMail(getBody())
    expect(sendMail.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        subject: 'This is a test',
        from: 'test123@test.com',
        to: 'test1234@test.com',
        cc: undefined,
        attachments: undefined,
        html: expect.stringContaining('<img style="border: 0;display: block;height: auto;width: 100%;max-width: 200px;" alt="" width="200" src="https://s3-sa-east-1.amazonaws.com/saipos-estatico/logo-saipos-vertical-azul.png" />')
      })
    )
  })

  it('should send email with Saipos signature', async () => {
    awsService.getTemplate = jest.fn().mockResolvedValue('success')
    await transporter.sendMail(getBody())
    expect(sendMail.mock.calls[2][0]).toEqual(
      expect.objectContaining({
        subject: 'This is a test',
        from: 'test123@test.com',
        to: 'test1234@test.com',
        cc: undefined,
        attachments: undefined,
        html: expect.stringContaining('>Atenciosamente')
      })
    )
  })

  it('should send email no Saipos logo', async () => {
    awsService.getTemplate = jest.fn().mockResolvedValue('success')
    const body = getBody()
    body.options.withSaiposLogo = false
    await transporter.sendMail(body)
    expect(sendMail.mock.calls[3][0]).not.toEqual(
      expect.objectContaining({
        html: expect.stringContaining('<img style="border: 0;display: block;height: auto;width: 100%;max-width: 200px;" alt="" width="200" src="https://s3-sa-east-1.amazonaws.com/saipos-estatico/logo-saipos-vertical-azul.png" />')
      })
    )
  })

  it('should send email no Saipos signature', async () => {
    awsService.getTemplate = jest.fn().mockResolvedValue('success')
    const body = getBody()
    body.options.withSignature = false
    await transporter.sendMail(body)
    expect(sendMail.mock.calls[4][0]).not.toEqual(
      expect.objectContaining({
        html: expect.stringContaining('>Atenciosamente')
      })
    )
  })

  it('should send email when AWS source', async () => {
    awsService.getTemplate = jest.fn().mockResolvedValue('<p>aws-success</p>')
    const body = getBody()
    body.template.source = templateTypes.AWS
    body.template.bucketName = 'test'
    body.template.name = 'test.template.ejs'
    await transporter.sendMail(body)
    expect(sendMail.mock.calls[5][0]).toEqual(
      expect.objectContaining({
        subject: 'This is a test',
        from: 'test123@test.com',
        to: 'test1234@test.com',
        cc: undefined,
        attachments: undefined,
        html: expect.stringContaining('<p>aws-success</p>')
      })
    )
  })

  it('should send email with photoSiteLogo when customEmail is true', async () => {
    const photoSiteLogo = 'http://photo-site-logo.jpg'
    const body = getBody()
    body.options.customEmail = true
    body.options.photoSiteLogo = photoSiteLogo
    await transporter.sendMail(body)
    expect(sendMail.mock.calls[6][0]).toEqual(
      expect.objectContaining({
        subject: 'This is a test',
        from: 'test123@test.com',
        to: 'test1234@test.com',
        cc: undefined,
        attachments: undefined,
        html: expect.stringContaining(photoSiteLogo)
      })
    )
  })

  it('should throw error if aws error', async () => {
    awsService.getTemplate = jest.fn().mockResolvedValue('success')

    awsService.getTemplate = jest.fn().mockRejectedValue(new Error('Error test'))
    try {
      await transporter.sendMail(getBody())
    } catch (err) {
      expect(err.message).toEqual('Error test')
    }
  })
})
