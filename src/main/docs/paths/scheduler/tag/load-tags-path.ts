export const loadTagsPath = {
  get: {
    tags: ['tag'],
    summary: 'load all tags',
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
            schema: {
              $ref: '#/schemas/tag'
            },
            example: [
              {
                id: '77532a20-7927-464d-bd06-61de29b7f30f',
                name: 'Vacina',
                color: '#2c2966'
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
