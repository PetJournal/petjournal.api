import {
  success,
  serverError,
  type HttpRequest,
  type HttpResponse,
  badRequest
} from '@/application/helpers'
import { type Validation, type Controller } from '@/application/protocols'
import { type LoadCurrentWeekTasks } from '@/domain/use-cases'

export class LoadCurrentWeekTasksController implements Controller {
  private readonly loadCurrentWeekTasks: LoadCurrentWeekTasks
  private readonly validation: Validation

  constructor ({ loadCurrentWeekTasks, validation }: LoadCurrentWeekTasksController.Dependencies) {
    this.loadCurrentWeekTasks = loadCurrentWeekTasks
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.query)
      if (error) {
        return badRequest(error)
      }
      const { tagId, page = 1, limit = 10 } = httpRequest.query
      const guardianId = httpRequest.userId as string
      const now = new Date()
      now.setUTCHours(0, 0, 0, 0)

      const result = await this.loadCurrentWeekTasks.load({ date: now, guardianId, tagId, page: Number(page), limit: Number(limit) })
      return success({
        data: result,
        page,
        limit,
        count: result.length
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadCurrentWeekTasksController {
  export interface Dependencies {
    loadCurrentWeekTasks: LoadCurrentWeekTasks
    validation: Validation
  }
}
