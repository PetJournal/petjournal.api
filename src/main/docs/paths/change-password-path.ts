export const changePasswordPath = {
  patch: {
    tags: ['guardian'],
    summary: 'change guardian password ',
    description: '',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/changePasswordParams'
          },
          example: {
            password: 'New_password_test@123',
            passwordConfirmation: 'New_password_test@123'
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
          error: 'Invalid param: password'
        }
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }

}
