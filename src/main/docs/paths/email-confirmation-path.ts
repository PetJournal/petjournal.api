import { DocBuilder } from '../utils/doc-builder'

export const emailConfirmationPath = DocBuilder.getBuilder()
  .addTags(['guardian'])
  .addSummary('confirm email of guardian')
  .addJsonProduces()
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            message: {
              type: 'string'
            },
            userId: {
              type: 'string'
            },
            email: {
              type: 'string'
            }
          },
          example: {
            message: 'Email confirmed',
            userId: '74083fc1-8892-458a-9b9b-78f5e803c7b2',
            email: 'email@email.com'
          }
        }
      }
    }
  })
  .addPathParameter('userId', 'user id')
  .addBadRequestResponse()
  .addServerErrorResponse()
  .build()
