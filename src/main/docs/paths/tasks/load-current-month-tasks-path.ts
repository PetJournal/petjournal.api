export const loadCurrentMonthTasksPath = {
  get: {
    tags: ['task'],
    summary: 'List tasks of current month',
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
      },
      {
        name: 'page',
        in: 'query',
        required: false,
        schema: { type: 'integer', minimum: 1 },
        description: 'Page number (default = 1)'
      },
      {
        name: 'limit',
        in: 'query',
        required: false,
        schema: { type: 'integer', minimum: 1, maximum: 100 },
        description: 'Number of items per page (default = 10)'
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
