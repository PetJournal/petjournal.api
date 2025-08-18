export const settingsSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      example: '61c2f94e-05c6-4449-be8f-aa5552e6ed57'
    },
    guardianId: {
      type: 'string',
      example: '61c2f94e-05c6-4449-be8f-aa5552e6ed57'
    },
    notificationEmail: {
      type: 'boolean',
      nullable: true
    },
    notificationMobile: {
      type: 'boolean',
      nullable: true
    }
  }
}
