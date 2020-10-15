'use strict'

/**
 * Global beforeAll
 * @type {Express}
 */

const app = require('../src/app')

beforeAll(async () => {
  // configure application
  await app.configure()
})
