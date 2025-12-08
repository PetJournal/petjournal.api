export const eventSchema = {
  type: 'object',
  propetties: {
    id: {
      type: 'string',
      example: '61c2f94e-05c6-4449-be8f-aa5552e6ed57'
    },
    schedulerId: {
      type: 'string',
      example: '18eb6325-cffd-4fa1-9585-533cde60ff11'
    },
    start: {
      type: 'date-time'
    },
    end: {
      type: 'date-time'
    }
  }
}
