import { DocBuilder } from '../../utils/doc-builder'

export const loadTasksByPetIdPath = DocBuilder.getBuilder()
  .addTags(['task'])
  .addSummary('List task history and upcoming events for a specific pet')
  .addJwtAuthSecurity()
  .addPathParameter('petId', 'Pet ID to filter tasks', 'string', {
    required: true,
    format: 'uuid'
  })
  .addQueryParameter('page', 'Page number for history list (default = 1)', 'integer', { required: false })
  .addQueryParameter('limit', 'History items per page (default = 10)', 'integer', { required: false })
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalHistory: { type: 'number', example: 25 },
            totalPages: { type: 'number', example: 3 },

            history: {
              type: 'array',
              items: { $ref: '#/components/schemas/Event' }
            },

            nextEvents: {
              type: 'array',
              maxItems: 4,
              items: { $ref: '#/components/schemas/Event' }
            }
          }
        }
      }
    }
  })
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
