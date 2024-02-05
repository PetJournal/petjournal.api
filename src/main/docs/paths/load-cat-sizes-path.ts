export const loadCatSizesPath = {
  get: {
    tags: ['size'],
    summary: 'Load cat sizes',
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
                  id: 'fc815451-1b54-4360-97bb-cc60c607ce96',
                  specieId: '8e4bd2ce-0d60-4f66-aaf5-3839ae966d00',
                  name: 'Médio (11 à 24Kg)'
                },
                {
                  id: '7fb26d07-6bec-45e1-8743-daa1f5dedf46',
                  specieId: '8e4bd2ce-0d60-4f66-aaf5-3839ae966d00',
                  name: 'Pequeno (Até 10Kg)'
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
