import { DocBuilder } from '../utils/doc-builder'

export const signUpPath = DocBuilder.postBuilder()
  .addTags(['guardian'])
  .addSummary('adds a new guardian')
  .addMultipartFormDataBody({
    type: 'object',
    properties: {
      firstName: {
        type: 'string',
        example: 'John'
      },
      lastName: {
        type: 'string',
        example: 'Doe'
      },
      email: {
        type: 'string',
        example: 'johndoe@email.com'
      },
      password: {
        type: 'string',
        example: 'Teste@123'
      },
      passwordConfirmation: {
        type: 'string',
        example: 'Teste@123'
      },
      phone: {
        type: 'string',
        example: '11987654321'
      },
      isPrivacyPolicyAccepted: {
        type: 'boolean',
        example: true
      },
      image: {
        type: 'string',
        format: 'binary'
      }
    }
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
