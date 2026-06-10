import { DocBuilder } from '../../utils/doc-builder'

export const deleteSchedulerPath = DocBuilder.deleteBuilder()
  .addTags(['scheduler'])
  .addSummary('delete scheduler')
  .addJwtAuthSecurity()
  .addPathParameter('schedulerId', 'scheduler id', 'string')
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
            message: 'Scheduler deleted',
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
