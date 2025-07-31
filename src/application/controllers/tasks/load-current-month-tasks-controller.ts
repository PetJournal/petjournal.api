import {
  serverError,
  success,
  type HttpRequest,
  type HttpResponse,
  badRequest
} from '@/application/helpers'
import { type Controller, type Validation } from '@/application/protocols'
import { type LoadCurrentMonthTasks } from '@/domain/use-cases'

export class LoadCurrentMonthTasksController implements Controller {
  private readonly loadCurrentMonthTasks: LoadCurrentMonthTasks
  private readonly validation: Validation

  constructor ({ loadCurrentMonthTasks, validation }: LoadCurrentMonthTasksController.Dependencies) {
    this.loadCurrentMonthTasks = loadCurrentMonthTasks
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.query)
      if (error) {
        return badRequest(error)
      }

      const { tagId } = httpRequest.query

      const now = new Date()
      now.setUTCHours(0, 0, 0, 0)

      const result = await this.loadCurrentMonthTasks.load({ date: now, tagId })
      return success(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadCurrentMonthTasksController {
  export interface Dependencies {
    loadCurrentMonthTasks: LoadCurrentMonthTasks
    validation: Validation
  }
}
