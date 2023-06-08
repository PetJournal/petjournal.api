export const passwordRequirementsError = {
  description: 'Invalid request',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      },
      example: {
        error: 'The entered password does not meet the required 8-character requirements'
      }
    }
  }
}
