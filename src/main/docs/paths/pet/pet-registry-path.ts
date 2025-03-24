export const petRegistryPath = {
  post: {
    tags: ['pet'],
    summary: 'add a new pet',
    description: '',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              specieName: {
                type: 'string'
              },
              petName: {
                type: 'string'
              },
              gender: {
                type: 'string'
              },
              breedName: {
                type: 'string'
              },
              size: {
                type: 'string'
              },
              castrated: {
                type: 'boolean'
              },
              dateOfBirth: {
                type: 'string',
                format: 'date-time'
              },
              image: {
                type: 'string',
                format: 'binary'
              }
            },
            example: {
              specieName: 'Gato',
              petName: 'Garfield',
              gender: 'M',
              breedName: 'Doméstico de Pelo Curto',
              size: 'Pequeno (Até 10Kg)',
              castrated: true,
              dateOfBirth: '2021-01-01T00:00:00Z'
            }
          }
        }
      }
    },
    responses: {
      201: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/pet'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      406: {
        $ref: '#/components/notAcceptable'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
