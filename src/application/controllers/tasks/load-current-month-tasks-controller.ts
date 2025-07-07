import {
  success,
  serverError,
  type HttpRequest,
  type HttpResponse
} from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadCurrentMonthTasks } from '@/domain/use-cases'

export class LoadCurrentMonthTasksController implements Controller {
  private readonly loadCurrentMonthTasks: LoadCurrentMonthTasks

  constructor ({ loadCurrentMonthTasks }: LoadCurrentMonthTasksController.Dependencies) {
    this.loadCurrentMonthTasks = loadCurrentMonthTasks
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const now = new Date()
      now.setUTCHours(0, 0, 0, 0)

      const result = await this.loadCurrentMonthTasks.load({ date: now })
      return success(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadCurrentMonthTasksController {
  export interface Dependencies {
    loadCurrentMonthTasks: LoadCurrentMonthTasks
  }
}
