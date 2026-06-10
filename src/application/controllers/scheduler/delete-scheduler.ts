import { badRequest, notAcceptable, serverError, success, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Validation, type Controller } from '@/application/protocols'
import { type DeleteScheduler } from '@/domain/use-cases'

export class DeleteSchedulerController implements Controller {
  private readonly deleteScheduler: DeleteScheduler
  private readonly validation: Validation

  constructor ({ deleteScheduler, validation }: DeleteSchedulerController.Dependencies) {
    this.deleteScheduler = deleteScheduler
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.params)
      if (error) {
        return badRequest(error)
      }
      const { schedulerId } = httpRequest.params
      const guardianId = httpRequest.userId as string
      const result = await this.deleteScheduler.delete({ schedulerId, guardianId })
      if (!result.isSuccess) {
        return notAcceptable(result.error as Error)
      }
      return success({
        message: 'Scheduler and events deleted',
        schedulerId
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace DeleteSchedulerController {
  export type Dependencies = {
    deleteScheduler: DeleteScheduler
    validation: Validation
  }
}
