export const forgetPasswordPath = {
  post: {
    tags: ['recovery-password'],
    summary: 'send email for recovery password',
    description: '',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/forgetPasswordParams'
          },
          example: {
            email: 'johndoe@email.com'
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
              type: 'object',
              example: {
                message: 'Email sent successfully'
              }
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest',
        example: {
          error: 'Invalid param: email'
        }
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
