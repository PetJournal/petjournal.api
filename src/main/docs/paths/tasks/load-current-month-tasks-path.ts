import { DocBuilder } from '../../utils/doc-builder'

export const loadCurrentMonthTasksPath = DocBuilder.getBuilder()
  .addTags(['task'])
  .addSummary('List tasks of current month')
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
              end: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    }
  })
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
