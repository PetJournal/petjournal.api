import { DocBuilder } from '../utils/doc-builder'

export const loadGuardianPath = DocBuilder.getBuilder()
  .addTags(['guardian'])
  .addSummary('Load guardian data')
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
            lastName: 'Doe',
            email: 'email@email.com',
            phone: '21988435780',
            image: 'image.jpg'
          }
        }
      }
    }
  })
  .addBadRequestResponse()
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
