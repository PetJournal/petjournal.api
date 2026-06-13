import { DocBuilder } from '../../utils/doc-builder'

export const deleteTaskByIdPath = DocBuilder.deleteBuilder()
  .addTags(['task'])
  .addSummary('delete task by id')
  .addJwtAuthSecurity()
  .addPathParameter('eventId', 'event id', 'string')
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
            eventId: {
              type: 'string'
            }
          },
          example: {
            message: 'event deleted',
            schedulerId: '1cbb4c26-d078-4d45-88cd-08aa167bc1b5'
          }
        }
      }
    }
  })
  .addBadRequestResponse()
  .addNotAcceptableResponse()
  .addServerErrorResponse()
  .build()
