export const schedulerParamsSchema = {
  type: 'object',
  properties: {
    tagId: {
      type: 'string',
      example: '49fa84f8-20f9-40dd-b3bc-75e894ba0501'
    },
    title: {
      type: 'string',
      example: 'Passear com o dog'
    },
    description: {
      type: 'string',
      example: 'levar o dog para passear no parque'
    },
    note: {
      type: 'string',
      example: 'passeio'
    },
    startAt: {
      type: 'Date',
      example: '2024-04-04T15:00:00Z'
    },
    endAt: {
      type: 'Date',
      example: '2025-04-04T17:00:00Z'
    },
    daysOfWeek: {
      type: 'array',
      items: {
        type: 'number'
      },
      example: '[0, 3, 6]',
      nullable: true
    },
    daysOfMonth: {
      type: 'array',
      items: {
        type: 'number'
      },
      example: '[1, 16, 31]',
      nullable: true
    },
    daily: {
      type: 'boolean',
      example: true,
      nullable: true
    },
    pets: {
      type: 'array',
      items: {
        type: 'string'
      },
      example: ['49fa84f8-20f9-40dd-b3bc-75e894ba0501', 'cbc5097a-bee5-45d2-9a7e-2fd29c9cf47d']
    }

  },
  required: ['tagId', 'title', 'description', 'note', 'startAt', 'endAt', 'pets']
}
