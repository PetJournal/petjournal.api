import {
  success,
  serverError,
  type HttpRequest,
  type HttpResponse
} from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadCurrentWeekTasks } from '@/domain/use-cases'

export class LoadCurrentWeekTasksController implements Controller {
  private readonly loadCurrentDateTasks: LoadCurrentWeekTasks

  constructor ({ loadCurrentDateTasks }: LoadCurrentWeekTasksController.Dependencies) {
    this.loadCurrentDateTasks = loadCurrentDateTasks
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const now = new Date()
      now.setUTCHours(0, 0, 0, 0)

      const result = await this.loadCurrentDateTasks.load({ date: now })
      return success(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadCurrentWeekTasksController {
  export interface Dependencies {
    loadCurrentDateTasks: LoadCurrentWeekTasks
  }
}
