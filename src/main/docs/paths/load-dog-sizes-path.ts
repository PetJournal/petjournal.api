import { DocBuilder } from '../utils/doc-builder'

export const loadDogSizesPath = DocBuilder.getBuilder()
  .addTags(['size'])
  .addSummary('Load dog sizes')
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
              $ref: '#/schemas/size'
            }
          }
        },
        example: [
          {
            id: '25368bf6-da12-4a60-a292-90cd0773a7ae',
            specieId: 'beecf878-ce6f-4360-9761-026b245eba4a',
            name: 'Médio (15 à 24Kg)'
          },
          {
            id: 'b0be626e-e78d-4857-bf44-eb9614ced894',
            specieId: 'beecf878-ce6f-4360-9761-026b245eba4a',
            name: 'Pequeno (6 à 14Kg)'
          }
        ]
      }
    }
  })
  .addBadRequestResponse()
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
