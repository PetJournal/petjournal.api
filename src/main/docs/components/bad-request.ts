export const badRequest = {
  description: 'Invalid request',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      },
      example: {
        error: 'Invalid param: password'
      }
    }
  }
}
