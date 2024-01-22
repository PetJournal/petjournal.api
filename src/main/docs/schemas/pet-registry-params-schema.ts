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
    },
    breedName: {
      type: 'string'
    },
    size: {
      type: 'string'
    }
  },
  required: ['specieName', 'petName', 'gender', 'breedName', 'size']
}
