import { DocBuilder } from '../../utils/doc-builder'

export const loadNextTasksByPetIdAndTagIdPath = DocBuilder.getBuilder()
  .addTags(['task'])
  .addSummary('List upcoming tasks (future events) for a specific pet and specific tag')
  .addJwtAuthSecurity()
  .addPathParameter('petId', 'Pet ID to filter tasks', 'string', {
    required: true,
    format: 'uuid'
  })
  .addPathParameter('tagId', 'tag ID to filter tasks', 'string', {
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
            totalPages: { type: 'number', example: 3 },
            events: {
              type: 'array',
              items: { $ref: '#/schemas/event' }
            }
          }
        }
      }
    }
  })
  .addBadRequestResponse()
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
