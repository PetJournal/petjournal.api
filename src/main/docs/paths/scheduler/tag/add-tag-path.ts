export const addTagPath = {
  post: {
    tags: ['tag'],
    summary: 'add a new tag',
    description: '',
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
            $ref: '#/schemas/addTagParams'
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
              $ref: '#/schemas/tag'
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
