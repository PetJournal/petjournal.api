export const passwordMismatchError = {
  description: 'Invalid request',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      },
      example: {
        error: 'Passwords must be identical'
      }
    }
  }
}
