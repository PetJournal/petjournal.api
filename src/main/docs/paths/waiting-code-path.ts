import { DocBuilder } from '../utils/doc-builder'

export const waitingCodePath = DocBuilder.postBuilder()
  .addTags(['recovery-password'])
  .addSummary('send email and verificationToken for recovery password')
  .addBody('#/schemas/waitingCodeParams', true, {
    email: 'johndoe@email.com',
    verificationToken: '123456'
  })
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/accessToken'
        }
      }
    }
  })
  .addBadRequestResponse()
  .addUnauthorizedResponse()
  .addServerErrorResponse()
  .build()
