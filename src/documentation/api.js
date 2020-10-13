const { version } = require('../../package.json')

module.exports = {
  openapi: '3.0.1',
  info: {
    title: 'Mail Sender Document',
    description: 'Mail Sender Application using nodemailer and ejs',
    version: version,
    termsOfService: ''
  },
  servers: [
    { url: 'http://localhost:8080/api' }
  ],
  tags: {
    name: 'Specification',
    description: 'Swagger API specification'
  },
  paths: {
    '/health': {
      get: {
        description: 'Application health',
        produces: [
          'application/json'
        ],
        responses: {
          200: {
            description: 'Show Api information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    uptime: {
                      type: 'integer',
                      description: 'Application uptime'
                    },
                    message: {
                      type: 'string'
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time'
                    }
                  }
                }
              }
            }
          },
          503: {
            description: 'Service Unavailable'
          }
        }
      }
    },
    '/email/send': {
      post: {
        description: 'Send email',
        produces: [
          'application/json'
        ],
        consumes: [
          'application/json'
        ],
        responses: {
          200: {
            description: 'Show Api information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    uptime: {
                      type: 'integer',
                      description: 'Application uptime'
                    },
                    message: {
                      type: 'string'
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time'
                    }
                  }
                }
              }
            }
          },
          503: {
            description: 'Service Unavailable'
          }
        }
      }
    }
  }
}
