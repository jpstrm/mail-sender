'use strict'

/**
 * Global beforeAll
 * @type {Express}
 */

const mockFn = jest.fn({
  getObject: jest.fn()
})

jest.mock('aws-sdk', () => {
  S3: new mockFn()
})
