export const badRequest = {
  description: 'Invalid request',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }

  }
}
