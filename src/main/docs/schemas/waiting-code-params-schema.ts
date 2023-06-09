export const waitingCodeParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string'
    },
    verificationToken: {
      type: 'string'
    }
  }
}
