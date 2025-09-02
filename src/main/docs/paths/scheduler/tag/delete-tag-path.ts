import { DocBuilder } from '@/main/docs/utils/doc-builder'

export const deleteTagByIdPath = DocBuilder.deleteBuilder()
  .addTags(['tag'])
  .addSummary('delete tag by id')
  .addJwtAuthSecurity()
  .addJsonConsumes()
  .addJsonProduces()
  .addXmlProduces()
  .addPathParameter('tagId', 'tag id')
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
