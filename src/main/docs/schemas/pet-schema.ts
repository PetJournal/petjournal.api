export const petSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    guardian: {
      $ref: '#/schemas/guardian'
    },
    specie: {
      $ref: '#/schemas/specie'
    }
  }
}
