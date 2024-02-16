export const petRegistryPath = {
  post: {
    tags: ['pet'],
    summary: 'add a new pet',
    description: '',
    security: [{
      bearerAuth: []
    }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/schemas/petRegistryParams'
          },
          example: {
            specieName: 'Gato',
            petName: 'Garfield',
            gender: 'M',
            breedName: 'Doméstico de Pelo Curto',
            size: 'Pequeno (Até 10Kg)',
            castrated: true
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
              $ref: '#/schemas/pet'
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
