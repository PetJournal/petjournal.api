export const updateTagParamsSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      example: 'Vacina'
    }
  },
  required: ['name']
}
