import { notAcceptable, serverError, success, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type DeleteEventById } from '@/domain/use-cases'

export class DeleteEventByIdController implements Controller {
  private readonly deleteEvent: DeleteEventById

  constructor ({ deleteEvent }: DeleteEventByIdController.Dependencies) {
    this.deleteEvent = deleteEvent
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const guardianId = httpRequest.userId as string
      const eventId = httpRequest.params.eventId as string
      const result = await this.deleteEvent.deleteById({ eventId, guardianId })
      if (!result.isSuccess) {
        return notAcceptable(result.error as Error)
      }
      return success({
        message: 'event deleted',
        eventId
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace DeleteEventByIdController {
  export type Dependencies = {
    deleteEvent: DeleteEventById
  }
}
