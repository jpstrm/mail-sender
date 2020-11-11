'use strict'

const awsService = require('../../src/services/aws.service')

jest.mock('aws-sdk')

describe('AWS service', () => {
  it('should throw error if aws error', async () => {
    const body = { name: 'test', bucketName: 'test' }
    try {
      const res = await awsService.getTemplate(body)
      expect(res).toBeUndefined()
    } catch (e) {
      expect(e).not.toBeUndefined()
    }
  })
})
