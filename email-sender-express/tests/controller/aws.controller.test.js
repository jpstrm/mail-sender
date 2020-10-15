'use strict'

const awsController = require('../../src/controllers/aws.controller')

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
