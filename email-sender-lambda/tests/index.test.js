'use strict'

const index = require('../src')
const emailService = require('../src/services/email.service')
const awsService = require('../src/services/aws.service')

jest.mock('../src/services/email.service')
jest.mock('../src/services/aws.service')

describe('Handler test', () => {
  it('Deve enviar email e retornar statusCode 200', async () => {
    emailService.send = jest.fn()
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
    const event = {
      Records: [
        { body: JSON.stringify(body) },
        { body: JSON.stringify(body) }
      ]
    }
    await index.handler(event)
    expect(emailService.send).toBeCalledTimes(2)
  })

  it('Deve enviar mensagem para a fila carro haja erro no envio', async () => {
    emailService.send = jest.fn().mockRejectedValue('An error occurred')
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
    const event = {
      Records: [
        { body: JSON.stringify(body) }
      ]
    }
    await index.handler(event)
    expect(awsService.sendQueue).toBeCalledWith(body)
  })
})
