export const unauthorized = {
  description: 'Unauthorized guardian',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      },
      example: {
        error: 'Unauthorized'
      }
    }
  }
}
