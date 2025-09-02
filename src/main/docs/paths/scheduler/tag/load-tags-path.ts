import { DocBuilder } from '@/main/docs/utils/doc-builder'

export const loadTagsPath = DocBuilder.getBuilder()
  .addTags(['tag'])
  .addSummary('load all tags')
  .addJwtAuthSecurity()
  .addJsonConsumes()
  .addJsonProduces()
  .addXmlProduces()
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/tag'
        },
        example: [
          {
            id: '77532a20-7927-464d-bd06-61de29b7f30f',
            name: 'Vacina',
            color: '#2c2966'
          }
        ]
      }
    }
  })
  .addBadRequestResponse()
  .addNotAcceptableResponse()
  .addServerErrorResponse()
  .build()
