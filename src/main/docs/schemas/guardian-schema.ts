export const guardianSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    phone: {
      type: 'string'
    }
  }
}
