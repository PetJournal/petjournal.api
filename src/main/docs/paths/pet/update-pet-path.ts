import { DocBuilder } from '../../utils/doc-builder'

export const updatePetPath = DocBuilder.putBuilder()
  .addTags(['pet'])
  .addSummary('Update an existing pet')
  .addJwtAuthSecurity()
  .addPathParameter('petId', 'Pet ID', 'string')
  .addMultipartFormDataBody({
    type: 'object',
    properties: {
      specieName: {
        type: 'string',
        example: 'Gato'
      },
      petName: {
        type: 'string',
        example: 'Garfield'
      },
      gender: {
        type: 'string',
        example: 'M'
      },
      breedName: {
        type: 'string',
        example: 'Doméstico de Pelo Curto'
      },
      size: {
        type: 'string',
        example: 'Pequeno (Até 10Kg)'
      },
      castrated: {
        type: 'boolean',
        example: true
      },
      dateOfBirth: {
        type: 'string',
        format: 'date-time',
        example: '2021-01-01T00:00:00Z'
      },
      image: {
        type: 'string',
        format: 'binary'
      }
    }
  })
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/pet'
        }
      }
    }
  })
  .addBadRequestResponse()
  .addNotAcceptableResponse()
  .addServerErrorResponse()
  .build()
