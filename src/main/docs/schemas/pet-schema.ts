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
    specieAlias: { type: 'string', nullable: true }
  }
}
