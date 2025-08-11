import { DocBuilder } from '@/main/docs/utils/doc-builder'

export const updateTagPath = DocBuilder.putBuilder()
  .addTags(['tag'])
  .addSummary('update a tag')
  .addDescription('update the name of tag')
  .addJwtAuthSecurity()
  .addJsonConsumes()
  .addJsonProduces()
  .addXmlProduces()
  .addPathParameter('tagId', 'tag id')
  .addJsonBody('#/schemas/updateTagParams')
  .addResponse(200, {
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
