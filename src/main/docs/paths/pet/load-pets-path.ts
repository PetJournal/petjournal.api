import { DocBuilder } from '../../utils/doc-builder'

export const loadPetsPath = DocBuilder.getBuilder()
  .addTags(['pet'])
  .addSummary('Load pets by guardian')
  .addJwtAuthSecurity()
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            $ref: '#/schemas/pet'
          }
        },
        example: [
          {
            id: 'c2309177-49f0-428e-a623-5e72c3ba0ca0',
            guardianId: 'd7eca09d-228b-4d49-8b70-68170aa4db71',
            specie: {
              id: '8dea7a22-02e9-4adf-a47e-042bf537f822',
              name: 'Gato'
            },
            specieAlias: null,
            petName: 'Garfield',
            gender: 'M',
            breedAlias: '',
            breed: {
              id: '96c08c4c-61a4-431e-ad71-e20f6f2a9959',
              name: 'Doméstico de Pelo Curto'
            },
            size: {
              id: '23c6db6c-2b77-4c80-91db-c75ed08577cf',
              name: 'Pequeno (Até 10Kg)'
            },
            castrated: true,
            dateOfBirth: '2021-01-01T00:00:00Z'
          },
          {
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
            dateOfBirth: '2021-01-01T00:00:00Z'
          }
        ]
      }
    }
  })
  .addBadRequestResponse()
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
