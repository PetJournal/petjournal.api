import { DocBuilder } from '../../utils/doc-builder'

export const loadPreviousTasksByPetIdPath = DocBuilder.getBuilder()
  .addTags(['task'])
  .addSummary('List task history (expired events) for a specific pet')
  .addJwtAuthSecurity()
  .addPathParameter('petId', 'Pet ID to filter tasks', 'string', {
    required: true,
    format: 'uuid'
  })
  .addQueryParameter('page', 'Page number (default = 1)', 'integer')
  .addQueryParameter('limit', 'Items per page (default = 10)', 'integer')
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 5 },
            history: {
              type: 'array',
              items: { $ref: '#/schemas/event' }
            }
          }
        }
      }
    }
  })
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
