import { DocBuilder } from '../../utils/doc-builder'

export const loadCurrentMonthTasksPath = DocBuilder.getBuilder()
  .addTags(['task'])
  .addSummary('List tasks of current month')
  .addJwtAuthSecurity()
  .addQueryParameter('tagId', 'Optional tag ID to filter tasks', 'string', { required: false, format: 'uuid' })
  .addQueryParameter('page', 'Page number (default = 1)', 'integer', { required: false })
  .addQueryParameter('limit', 'Number of items per page (default = 10)', 'integer', { required: false })
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
