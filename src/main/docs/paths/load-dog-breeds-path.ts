export const loadDogBreedsPath = {
  get: {
    tags: ['breed'],
    summary: 'Load dog breeds',
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
                  id: '977176f4-f596-4044-bcb1-322e31633661',
                  specieId: '15ab58e0-b1a0-45c1-b755-7d89d22153d8',
                  name: 'Coton de Tuléar'
                },
                {
                  id: '7d97e719-2476-45bd-8c1c-9eff6f37ae7b',
                  specieId: '15ab58e0-b1a0-45c1-b755-7d89d22153d8',
                  name: 'Mastife'
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
