export const tagParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'Vacina'
    },
    color: {
      type: 'string',
      example: '#2c2966'
    }
  },
  required: ['name', 'color']
}
