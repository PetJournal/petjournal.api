import { DocBuilder } from '@/main/docs/utils/doc-builder'

export const addTagPath = DocBuilder.postBuilder()
  .addTags(['tag'])
  .addSummary('add a new tag')
  .addJwtAuthSecurity()
  .addJsonConsumes()
  .addJsonProduces()
  .addXmlProduces()
  .addJsonBody('#/schemas/addTagParams')
  .addResponse(201, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/tag'
        }
      }
    }
  })
  .addBadRequestResponse()
  .addNotAcceptableResponse()
  .addServerErrorResponse()
  .build()
