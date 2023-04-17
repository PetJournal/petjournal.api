export const serverError = {
  description: 'Internal server error',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      },
      example: {
        error: 'Internal server error. An unexpected error happened. Please try again in a moment.'
      }
    }
  }
}
