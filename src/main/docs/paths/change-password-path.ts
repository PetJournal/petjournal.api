import { DocBuilder } from '../utils/doc-builder'

export const changePasswordPath = DocBuilder.patchBuilder()
  .addTags(['guardian'])
  .addSummary('change guardian password')
  .addJwtAuthSecurity()
  .addJsonBody('#/schemas/changePasswordParams', true, {
    password: 'New_password_test@123',
    passwordConfirmation: 'New_password_test@123'
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
