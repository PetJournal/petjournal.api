export const signUpParamsSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    passwordConfirmation: {
      type: 'string'
    },
    phone: {
      type: 'string'
    },
    isPrivacyPolicyAccepted: {
      type: 'boolean'
    }
  }
}
