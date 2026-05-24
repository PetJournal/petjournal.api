import { DocBuilder } from '../../utils/doc-builder'

export const deletePetPath = DocBuilder.deleteBuilder()
  .addTags(['pet'])
  .addSummary('delete an existent pet')
  .addJwtAuthSecurity()
  .addPathParameter('petId', 'pet id', 'string')
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
            petId: {
              type: 'string'
            }
          },
          example: {
            message: 'Pet deleted',
            petId: '1cbb4c26-d078-4d45-88cd-08aa167bc1b5'
          }
        }
      }
    }
  })
  .addBadRequestResponse()
  .addNotAcceptableResponse()
  .addServerErrorResponse()
  .build()
