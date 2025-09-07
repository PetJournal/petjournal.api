import { DocBuilder } from '../../utils/doc-builder'

export const loadCurrentWeekTasksPath = DocBuilder.getBuilder()
  .addTags(['task'])
  .addSummary('List tasks of current week')
  .addJwtAuthSecurity()
  .addQueryParameter('tagId', 'Optional tag ID to filter tasks', 'string', { required: false, format: 'uuid' })
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              schedulerId: { type: 'string' },
              start: { type: 'string', format: 'date-time' },
              end: { type: 'string', format: 'date-time' },
              page: { type: 'number', example: 1 },
              limit: { type: 'number', example: 10 },
              count: { type: 'number', example: 1 }
            }
          }
        }
      }
    }
  })
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
