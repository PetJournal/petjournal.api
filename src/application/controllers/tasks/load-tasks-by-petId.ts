import {
  success,
  serverError,
  badRequest,
  type HttpRequest,
  type HttpResponse
} from '@/application/helpers'
import { type Validation, type Controller } from '@/application/protocols'
import { type LoadTasksByPetId } from '@/domain/use-cases'

export class LoadTasksByPetIdController implements Controller {
  private readonly loadTasksByPetId: LoadTasksByPetId
  private readonly validation: Validation

  constructor ({ loadTasksByPetId, validation }: LoadTasksByPetIdController.Dependencies) {
    this.loadTasksByPetId = loadTasksByPetId
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate({
        ...httpRequest.params,
        ...httpRequest.query
      })
      if (error) {
        return badRequest(error)
      }

      const { petId } = httpRequest.params
      const {
        page = 1,
        limit = 10
      } = httpRequest.query

      const result = await this.loadTasksByPetId.load({
        petId,
        page: Number(page),
        limit: Number(limit)
      })

      return success({
        page: result.page,
        limit: result.limit,
        totalHistory: result.totalHistory,
        totalPages: result.totalPages,
        history: result.history,
        nextEvents: result.nextEvents
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadTasksByPetIdController {
  export interface Dependencies {
    loadTasksByPetId: LoadTasksByPetId
    validation: Validation
  }
}
