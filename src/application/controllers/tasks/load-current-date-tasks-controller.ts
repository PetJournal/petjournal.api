import {
  success,
  serverError,
  type HttpRequest,
  type HttpResponse
} from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadCurrentDateTasks } from '@/domain/use-cases'

export class LoadCurrentDateTasksController implements Controller {
  private readonly loadCurrentDateTasks: LoadCurrentDateTasks

  constructor ({ loadCurrentDateTasks }: LoadCurrentDateTasksController.Dependencies) {
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

export namespace LoadCurrentDateTasksController {
  export interface Dependencies {
    loadCurrentDateTasks: LoadCurrentDateTasks
  }
}
