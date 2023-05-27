export const changePasswordPath = {
  post: {
    tags: ['guardian'],
    summary: 'change guardian password ',
    description: '',
    security: [
      {
        bearerAuth: []
      }
    ],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/changePasswordParams'
          },
          example: {
            password: 'New_password_teste@123',
            passwordConfirmation: 'New_password_teste@123'
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
      400.1: {
        $ref: '#/components/badRequest',
        example: {
          error: 'Invalid param: password'
        }
      },
      400.2: {
        $ref: '#/components/passwordMismatchError'
      },
      400.3: {
        $ref: '#/components/passwordRequirementsError'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }

}
