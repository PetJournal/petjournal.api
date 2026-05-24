import { DocBuilder } from '../../utils/doc-builder'

export const updateGuardianPath = DocBuilder.putBuilder()
  .addTags(['guardian'])
  .addSummary('Update an existing guardian')
  .addJwtAuthSecurity()
  .addPathParameter('guardianId', 'Guardian ID', 'string')
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
      phone: {
        type: 'string',
        example: '11987654321'
      },
      image: {
        type: 'string',
        format: 'binary'
      }
    }
  })
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/guardian'
        }
      }
    }
  })
  .addBadRequestResponse()
  .addNotAcceptableResponse()
  .addServerErrorResponse()
  .build()
