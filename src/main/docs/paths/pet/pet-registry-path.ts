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
          examples: {
            'Without alias': {
              value: {
                specieName: 'Gato'
              }
            },
            'With other alias': {
              value: {
                specieName: 'Outros',
                specieAlias: 'Inseto'
              }
            }
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
