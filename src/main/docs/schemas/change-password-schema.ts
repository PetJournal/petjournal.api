export const changePasswordParamsSchema = {
  type: 'object',
  properties: {
    password: {
      type: 'string'
    },
    passwordConfirmation: {
      type: 'string'
    }
  }
}
