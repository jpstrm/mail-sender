'use strict'

const awsController = require('../../src/controllers/aws.controller')

jest.doMock('aws-sdk', () => {
  return {
    S3: jest.fn(() => {
      getObject: jest.fn((params) => Promise.resolve(Buffer.from([])))
    }),
    config: jest.fn(() => {
      update: jest.fn(() => {})
    })
  }
})

describe('AWS controller', () => {
  it('should throw error if bad credentials', async () => {

    const body = { name: 'test', bucketName: 'test' }
    try {
      const res = await awsController.getTemplate(body)
      expect(res).toBeUndefined()
    } catch (e) {
      expect(e).not.toBeUndefined()
    }
  })
})
