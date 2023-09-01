export const loadGuardianNamePath = {
  get: {
    tags: ['guardian'],
    summary: 'Load guardian name',
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
              type: 'object',
              properties: {
                firstName: {
                  type: 'string'
                },
                lastName: {
                  type: 'string'
                }
              },
              example: {
                firstName: 'John',
                lastName: 'Doe'
              }
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
