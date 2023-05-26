export const waitingCodePath = {
  post: {
    tags: ['recovery-password'],
    summary: 'send email and forgetPasswordCode for recovery password',
    description: '',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/waitingCodeParams'
          },
          example: {
            email: 'johndoe@email.com',
            forgetPasswordCode: '123456'
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
              $ref: '#/schemas/accessToken'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      401: {
        description: 'Unauthorized guardian',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/error'
            },
            example: {
              error: 'Forget password code mismatch'
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
