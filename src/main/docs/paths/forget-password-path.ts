import { DocBuilder } from '../utils/doc-builder'

export const forgetPasswordPath = DocBuilder.postBuilder()
  .addTags(['recovery-password'])
  .addSummary('send email for recovery password')
  .addJsonBody('#/schemas/forgetPasswordParams', true, {
    email: 'johndoe@email.com'
  })
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          example: {
            message: 'Email sent successfully'
          }
        }
      }
    }
  })
  .addBadRequestResponse()
  .addServerErrorResponse()
  .build()
