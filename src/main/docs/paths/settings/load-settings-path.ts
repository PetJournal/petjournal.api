export const loadSettingsPath = {
  get: {
    tags: ['settings'],
    summary: 'load all settings',
    description: '',
    security: [{
      bearerAuth: []
    }],
    consumes: [
      'application/json'
    ],
    produces: [
      'application/json',
      'application/xml'
    ],
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            example: [
              {
                notification_email: false,
                notification_mobile: false
              }
            ]
          }
        }
      },
      400: {
        $ref: '#/components/badRequest'
      },
      406: {
        $ref: '#/components/notAcceptable'
      },
      500: {
        $ref: '#/components/serverError'
      }
    }
  }
}
