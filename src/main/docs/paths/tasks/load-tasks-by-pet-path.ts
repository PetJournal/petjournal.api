import { DocBuilder } from '../../utils/doc-builder'

export const loadTasksByPetIdPath = DocBuilder.getBuilder()
  .addTags(['task'])
  .addSummary('List tasks associated with a specific pet')
  .addJwtAuthSecurity()
  .addPathParameter('petId', 'Pet ID to filter tasks', 'string', {
    required: true,
    format: 'uuid'
  })
  .addQueryParameter('page', 'Page number (default = 1)', 'integer', { required: false })
  .addQueryParameter('limit', 'Number of items per page (default = 10)', 'integer', { required: false })
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            total: { type: 'number', example: 42 },
            totalPages: { type: 'number', example: 5 },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  schedulerId: { type: 'string' },
                  start: { type: 'string', format: 'date-time' },
                  end: { type: 'string', format: 'date-time' },
                  scheduler: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      description: { type: 'string' },
                      note: { type: 'string' },
                      startAt: { type: 'string', format: 'date-time' },
                      endAt: { type: 'string', format: 'date-time' },
                      daysOfWeek: {
                        type: 'array',
                        items: { type: 'number' }
                      },
                      daysOfMonth: {
                        type: 'array',
                        items: { type: 'number' }
                      },
                      daily: { type: 'boolean' },
                      tag: {
                        type: 'object',
                        properties: {
                          name: { type: 'string' },
                          color: { type: 'string' }
                        }
                      },
                      pets: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            image: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
