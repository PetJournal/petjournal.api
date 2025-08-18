export const updateSettingsParamsSchema = {
  type: 'object',
  properties: {
    notificationEmail: {
      type: 'boolean',
      example: true,
      nullable: true
    },
    notificationMobile: {
      type: 'boolean',
      example: true,
      nullable: true
    }
  }
}
