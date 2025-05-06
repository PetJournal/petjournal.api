export const createSchedulerPath = {
  post: {
    tags: ['scheduler'],
    summary: 'create a new scheduler',
    description: 'create a new scheduler to generate events(tasks)',
    security: [{
      bearerAuth: []
    }],
    consumes: [
      'application/json'
    ],
    produces: [
      'application/json',
      'application/xml'
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/schedulerParams'
          }
        }
      }
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/scheduler'
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
