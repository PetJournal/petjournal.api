import { DocBuilder } from '../../utils/doc-builder'

export const createSchedulerPath = DocBuilder.postBuilder()
  .addTags(['scheduler'])
  .addSummary('create a new scheduler')
  .addDescription(`
    create a new scheduler to generate events(tasks)
    daysOfWeek, daysOfMonth, daily can be undefined
    a scheduler without daysOfWeek, daysOfMonth and daily is a single event.
    daysOfWeek gap are 0 to 6
    daysOfMonth gap are 1 to 31
  `)
  .addJwtAuthSecurity()
  .addJsonConsumes()
  .addJsonProduces()
  .addXmlProduces()
  .addJsonBody('#/schemas/schedulerParams')
  .addResponse(200, {
    description: 'Success',
    content: {
      'application/json': {
        schema: {
          $ref: '#/schemas/scheduler'
        }
      }
    }
  })
  .addBadRequestResponse()
  .addNotAcceptableResponse()
  .addServerErrorResponse()
  .build()
