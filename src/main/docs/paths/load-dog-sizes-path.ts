export const loadDogSizesPath = {
  get: {
    tags: ['size'],
    summary: 'Load dog sizes',
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
                  $ref: '#/schemas/size'
                }
              },
              example: [
                {
                  id: '25368bf6-da12-4a60-a292-90cd0773a7ae',
                  specieId: 'beecf878-ce6f-4360-9761-026b245eba4a',
                  name: 'Médio (15 à 24Kg)'
                },
                {
                  id: 'b0be626e-e78d-4857-bf44-eb9614ced894',
                  specieId: 'beecf878-ce6f-4360-9761-026b245eba4a',
                  name: 'Pequeno (6 à 14Kg)'
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
