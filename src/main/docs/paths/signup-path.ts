import { DocBuilder } from '../utils/doc-builder'

export const signUpPath = DocBuilder.postBuilder()
  .addTags(['guardian'])
  .addSummary('adds a new guardian')
  .addJsonBody('#/schemas/signUpParams', true, {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@email.com',
    password: 'Teste@123',
    passwordConfirmation: 'Teste@123',
    phone: '11987654321',
    isPrivacyPolicyAccepted: true
  })
  .addResponse(201, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/guardian'
        }
      }
    }
  })
  .addConflictResponse()
  .addBadRequestResponse()
  .addServerErrorResponse()
  .build()
