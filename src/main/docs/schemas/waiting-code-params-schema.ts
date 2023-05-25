export const waitingCodeParamsSchema = {
  type: 'object',
  properties: {
    email: {
      type: 'string'
    },
    forgetPasswordCode: {
      type: 'string'
    }
  }
}
