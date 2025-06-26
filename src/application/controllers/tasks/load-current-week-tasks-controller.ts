import {
  success,
  serverError,
  type HttpRequest,
  type HttpResponse
} from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadCurrentWeekTasks } from '@/domain/use-cases'

export class LoadCurrentWeekTasksController implements Controller {
  private readonly loadCurrentWeekTasks: LoadCurrentWeekTasks

  constructor ({ loadCurrentWeekTasks }: LoadCurrentWeekTasksController.Dependencies) {
    this.loadCurrentWeekTasks = loadCurrentWeekTasks
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const now = new Date()
      now.setUTCHours(0, 0, 0, 0)

      const result = await this.loadCurrentWeekTasks.load({ date: now })
      return success(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadCurrentWeekTasksController {
  export interface Dependencies {
    loadCurrentWeekTasks: LoadCurrentWeekTasks
  }
}
