export const signUpPath = {
  post: {
    tags: ['guardian'],
    summary: 'adds a new guardian',
    description: '',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/signUpParams'
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
              type: 'boolean'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
