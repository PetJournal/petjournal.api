import { DocBuilder } from '../utils/doc-builder'

export const loginPath = DocBuilder.postBuilder()
  .addTags(['guardian'])
  .addSummary('login a guardian')
  .addJsonBody('#/schemas/loginParams', true, {
    email: 'johndoe@email.com',
    password: 'Teste@123'
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
