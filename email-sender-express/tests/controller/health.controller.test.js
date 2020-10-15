'use strict'

const request = require('supertest')
const app = require('../../src/app')

describe('Health controller', () => {
  it('should send test health', async () => {
    const res = await request(app)
      .get('/api/health')
    expect(res.statusCode).toEqual(200)
    expect(res.uptime).not.toBeNaN()
    expect(res.body.message).toBe('OK')
    expect(res.body.timestamp).not.toBeNaN()
  })
})
