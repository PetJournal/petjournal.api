export const petRegistryParamsSchema = {
  type: 'object',
  properties: {
    specieName: {
      type: 'string'
    },
    petName: {
      type: 'string'
    },
    gender: {
      type: 'string'
    }
  },
  required: ['specieName', 'petName', 'gender']
}
