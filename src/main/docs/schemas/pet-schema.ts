export const petSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    guardian: {
      $ref: '#/schemas/guardian'
    },
    specie: {
      $ref: '#/schemas/specie'
    },
    specieAlias: { type: 'string', nullable: true },
    petName: { type: 'string' },
    gender: { type: 'string' },
    breed: {
      $ref: '#/schemas/breed'
    },
    breedAlias: { type: 'string' },
    size: {
      $ref: '#/schemas/size'
    }
  }
}
