export const schedulerSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    tagId: { type: 'string' },
    guardianId: { type: 'string' },
    title: { type: 'string' },
    description: { type: 'string' },
    note: { type: 'string' },
    startAt: { type: 'string' },
    endAt: { type: 'string' },
    daysOfWeek: {
      type: 'array',
      items: {
        type: 'number'
      },
      nullable: true
    },
    daysOfMonth: {
      type: 'array',
      items: {
        type: 'number'
      },
      nullable: true
    },
    daily: {
      type: 'boolean',
      nullable: true
    },
    pets: {
      type: 'array',
      items: {
        $ref: '#/schemas/pet'
      }
    }
  }
}
