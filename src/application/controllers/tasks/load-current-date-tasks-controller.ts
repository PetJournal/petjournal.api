import {
  success,
  serverError,
  badRequest,
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
      const error = this.validation.validate(httpRequest.query || {})
      if (error) return badRequest(error)

      const now = new Date()
      now.setUTCHours(0, 0, 0, 0)

      const { tagId, page = 1, limit = 10 } = httpRequest.query
      const guardianId = httpRequest.userId as string

      const result = await this.loadCurrentDateTasks.load({
        date: now,
        guardianId,
        tagId,
        page: Number(page),
        limit: Number(limit)
      })

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

export namespace LoadCurrentDateTasksController {
  export interface Dependencies {
    loadCurrentDateTasks: LoadCurrentDateTasks
    validation: Validation
  }
}
