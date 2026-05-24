export const updatePetParamsSchema = {
  type: 'object',
  properties: {
    specieName: {
      type: 'string',
      example: 'Gato'
    },
    petName: {
      type: 'string',
      example: 'Garfield'
    },
    gender: {
      type: 'string',
      example: 'M'
    },
    breedName: {
      type: 'string',
      example: 'Doméstico de Pelo Curto'
    },
    size: {
      type: 'string',
      example: 'Pequeno (Até 10Kg)'
    },
    castrated: {
      type: 'boolean',
      example: true
    },
    dateOfBirth: {
      type: 'Date',
      example: '2024-04-04T00:00:00Z'
    }
  }
}
