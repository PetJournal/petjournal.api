import { DocBuilder } from '../utils/doc-builder'

export const loadDogBreedsPath = DocBuilder.getBuilder()
  .addTags(['breed'])
  .addSummary('Load dog breeds')
  .addJwtAuthSecurity()
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              $ref: '#/schemas/breed'
            }
          }
        },
        example: [
          {
            id: '977176f4-f596-4044-bcb1-322e31633661',
            specieId: '15ab58e0-b1a0-45c1-b755-7d89d22153d8',
            name: 'Coton de Tuléar'
          },
          {
            id: '7d97e719-2476-45bd-8c1c-9eff6f37ae7b',
            specieId: '15ab58e0-b1a0-45c1-b755-7d89d22153d8',
            name: 'Mastife'
          }
        ]
      }
    }
  })
  .addBadRequestResponse()
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
