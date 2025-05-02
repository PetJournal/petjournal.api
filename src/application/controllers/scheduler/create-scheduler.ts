import { badRequest, create, notAcceptable, serverError, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Controller, type Validation } from '@/application/protocols'
import { type AddScheduler } from '@/domain/use-cases/scheduler'

export class CreateSchedulerController implements Controller {
  private readonly addScheduler: AddScheduler
  private readonly validation: Validation

  constructor ({ addScheduler, validation }: CreateSchedulerController.Dependencies) {
    this.addScheduler = addScheduler
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { tagId, title, description, note, startAt, endAt, daysOfWeek, daysOfMonth, daily, pets } = httpRequest.body
      const result = await this.addScheduler.add({
        tagId,
        title,
        description,
        note,
        startAt,
        endAt,
        daysOfWeek,
        daysOfMonth,
        daily,
        pets
      })
      if (!result.isSuccess) {
        return notAcceptable(result.error as Error)
      }
      return create({
        id: result.data?.id,
        tagId: result.data?.tagId,
        title: result.data?.title,
        description: result.data?.description,
        note: result.data?.note,
        startAt: result.data?.startAt,
        endAt: result.data?.endAt,
        daysOfWeek: result.data?.daysOfWeek,
        daysOfMonth: result.data?.daysOfMonth,
        daily: result.data?.daily,
        pets: result.data?.pets
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace CreateSchedulerController {
  export interface Dependencies {
    validation: Validation
    addScheduler: AddScheduler
  }
}
