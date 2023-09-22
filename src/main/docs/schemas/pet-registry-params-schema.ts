export const petRegistryParamsSchema = {
  type: 'object',
  properties: {
    specieName: {
      type: 'string'
    },
    specieAlias: {
      type: 'string'
    }
  },
  required: ['specieName']
}
