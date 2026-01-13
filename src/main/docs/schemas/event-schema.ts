export const eventSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid',
      example: '61c2f94e-05c6-4449-be8f-aa5552e6ed57'
    },
    schedulerId: {
      type: 'string',
      format: 'uuid',
      example: '18eb6325-cffd-4fa1-9585-533cde60ff11'
    },
    start: {
      type: 'string',
      format: 'date-time',
      example: '2025-01-10T10:00:00Z'
    },
    end: {
      type: 'string',
      format: 'date-time',
      example: '2025-01-10T11:00:00Z'
    }
  }
}
