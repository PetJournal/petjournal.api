export const petRegistryParamsSchema = {
  type: 'object',
  properties: {
    specieName: {
      type: 'string'
    }
  },
  required: ['specieName']
}
