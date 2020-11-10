'use strict'

const emailService = require('../../src/services/email.service')
const transporter = require('../../src/transporter/transporter')

jest.mock('../../src/transporter/transporter')

describe('Email service', () => {
  transporter.sendMail = jest.fn().mockRejectedValue('An error occurred')
  it('should send email and return success message', async () => {
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

    const response = await emailService.send(body)
    expect(response).not.toBeUndefined()
    expect(response.msg).toBe('Email enviado com sucesso')
  })
})
