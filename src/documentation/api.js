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
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/email-request'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Show Api information',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/email-response'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      'email-request': {
        type: 'object',
        required: [
          'name',
          'from',
          'to',
          'subject',
          'template'
        ],
        properties: {
          name: {
            type: 'string',
            description: 'Name'
          },
          from: {
            type: 'string',
            description: 'Email from'
          },
          to: {
            type: 'string',
            description: 'Email to'
          },
          subject: {
            type: 'string',
            description: 'Email subject'
          },
          template: {
            $ref: '#/components/schemas/email-template'
          }
        }
      },
      'email-response': {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Email resposne message'
          }
        }
      },
      'email-template': {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Template name'
          },
          source: {
            type: 'string',
            description: 'Template source'
          },
          bucketName: {
            type: 'string',
            description: 'Bucket name - If AWS source'
          }
        }
      }
    }
  }
}
