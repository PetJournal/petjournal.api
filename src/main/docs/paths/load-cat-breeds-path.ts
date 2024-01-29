export const loadCatBreedsPath = {
  get: {
    tags: ['breed'],
    summary: 'Load cat breeds',
    description: '',
    security: [{
      bearerAuth: []
    }],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  $ref: '#/schemas/breed'
                }
              },
              example: [
                {
                  id: '2cc5de89-ea5e-4031-8608-d4911390dd06',
                  specieId: '4be45afe-32a6-4b48-9373-fe99b4e29045',
                  name: 'Snowshoe'
                },
                {
                  id: 'ce9c896b-1afd-4953-8557-561af5ffab23',
                  specieId: '4be45afe-32a6-4b48-9373-fe99b4e29045',
                  name: 'Doméstico de Pelo Curto'
                }
              ]

            }
          }
        }
      },
      400: {
        description: 'Invalid request',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/error'
            },
            example: {
              error: 'Missing param: authorization'
            }
          }
        }
      },
      401: {
        description: 'Unauthorized guardian',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/error'
            },
            example: {
              error: 'Invalid or expired token'
            }
          }
        }
      },
      500: {
        $ref: '#/components/serverError'
      }
    }

  }
}
