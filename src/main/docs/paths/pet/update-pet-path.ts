import { DocBuilder } from '../../utils/doc-builder'

export const updatePetPath = DocBuilder.putBuilder()
  .addTags(['pet'])
  .addSummary('Update an existing pet')
  .addJwtAuthSecurity()
  .addPathParameter('petId', 'Pet ID', 'string')
  .addJsonProduces()
  .addXmlProduces()
  .addJsonConsumes()
  .addJsonBody('#/schemas/updatePetParams', true)
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/pet'
        }
      }
    }
  })
  .addBadRequestResponse()
  .addNotAcceptableResponse()
  .addServerErrorResponse()
  .build()
