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
          },
          example: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'johndoe@email.com',
            password: 'Teste@123',
            passwordConfirmation: 'Teste@123',
            phone: '11987654321',
            isPrivacyPolicyAccepted: true
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
              $ref: '#/schemas/guardian'
            }
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      409: {
        $ref: '#/components/conflict'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
