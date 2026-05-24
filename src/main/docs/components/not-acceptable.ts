export const notAcceptable = {
  description: 'Not acceptable request',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      },
      example: {
        error: 'Not acceptable: example_param'
      }
    }
  }
}
