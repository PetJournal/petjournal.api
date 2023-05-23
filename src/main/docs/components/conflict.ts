export const conflict = {
  description: 'Conflict request',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      },
      example: {
        error: 'Phone or Email already registered'
      }
    }
  }
}
