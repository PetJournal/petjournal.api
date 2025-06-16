import {
  success,
  badRequest,
  serverError,
  type HttpRequest,
  type HttpResponse
} from '@/application/helpers'
import { type Controller, type Validation } from '@/application/protocols'
import { type LoadCurrentDateTasks } from '@/domain/use-cases'

export class LoadCurrentDateTasksController implements Controller {
  private readonly loadCurrentDateTasks: LoadCurrentDateTasks
  private readonly validation: Validation

  constructor ({ loadCurrentDateTasks, validation }: LoadCurrentDateTasksController.Dependencies) {
    this.loadCurrentDateTasks = loadCurrentDateTasks
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const dateParam = httpRequest.body?.date
      const date = new Date(dateParam)

      if (isNaN(date.getTime())) {
        return badRequest(new Error('Invalid date'))
      }

      const result = await this.loadCurrentDateTasks.load({ date })
      return success(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadCurrentDateTasksController {
  export interface Dependencies {
    validation: Validation
    loadCurrentDateTasks: LoadCurrentDateTasks
  }
}
