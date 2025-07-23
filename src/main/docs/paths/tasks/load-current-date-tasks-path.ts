export const loadCurrentDateTasksPath = {
  get: {
    tags: ['task'],
    summary: 'List tasks of current day',
    security: [
      {
        bearerAuth: []
      }
    ],
    parameters: [
      {
        name: 'tagId',
        in: 'query',
        required: false,
        schema: {
          type: 'string',
          format: 'uuid'
        },
        description: 'Optional tag ID to filter tasks'
      }
    ],
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
                  id: { type: 'string' },
                  schedulerId: { type: 'string' },
                  start: { type: 'string', format: 'date-time' },
                  end: { type: 'string', format: 'date-time' }
                }
              }
            }
          }
        }
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: { $ref: '#/schemas/error' },
            example: {
              error: 'Invalid or expired token'
            }
          }
        }
      },
      500: { $ref: '#/components/serverError' }
    }
  }
}
