import { DocBuilder } from '../../utils/doc-builder'

export const loadPetByIdPath = DocBuilder.getBuilder()
  .addTags(['pet'])
  .addSummary('Load pet by id')
  .addJwtAuthSecurity()
  .addPathParameter('petId', 'Pet ID', 'string')
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          item: {
            $ref: '#/schemas/pet'
          }
        },
        example: {
          id: '4fc83c53-0d68-46b9-8d04-0ed4f208233d',
          guardianId: 'd7eca09d-228b-4d49-8b70-68170aa4db71',
          specie: {
            id: '0f2d53f6-09d5-4aa8-8b6c-487ee2524ffc',
            name: 'Cachorro'
          },
          specieAlias: null,
          petName: 'Chico',
          gender: 'M',
          breedAlias: '',
          breed: {
            id: 'b33b7c00-9a1e-43d2-a58b-a20981b54f9f',
            name: 'Dobermann'
          },
          size: {
            id: '794612ce-fbac-40a7-89f6-87a583547211',
            name: 'Médio (15 à 24Kg)'
          },
          castrated: false,
          dateOfBirth: '2021-01-01T00:00:00Z',
          image: '/path/for/your/image.jpg'
        }
      }
    }
  })
  .addBadRequestResponse()
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
