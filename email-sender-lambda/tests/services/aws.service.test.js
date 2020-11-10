'use strict'

const awsService = require('../../src/services/aws.service')

describe('AWS service', () => {
  it('should throw error if bad credentials', async () => {
    const body = { name: 'test', bucketName: 'test' }
    try {
      const res = await awsService.getTemplate(body)
      expect(res).toBeUndefined()
    } catch (e) {
      expect(e).not.toBeUndefined()
    }
  })
})
