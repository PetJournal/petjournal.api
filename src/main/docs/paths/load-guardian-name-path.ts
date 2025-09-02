import { DocBuilder } from '../utils/doc-builder'

export const loadGuardianNamePath = DocBuilder.getBuilder()
  .addTags(['guardian'])
  .addSummary('Load guardian name')
  .addJwtAuthSecurity()
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string'
            },
            lastName: {
              type: 'string'
            }
          },
          example: {
            firstName: 'John',
            lastName: 'Doe'
          }
        }
      }
    }
  })
  .addBadRequestResponse()
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
