export const guardianSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
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
