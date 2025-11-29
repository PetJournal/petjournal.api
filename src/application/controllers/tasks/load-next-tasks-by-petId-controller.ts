import {
  success,
  serverError,
  badRequest,
  type HttpRequest,
  type HttpResponse
} from '@/application/helpers'
import { type Validation, type Controller } from '@/application/protocols'
import { type LoadNextTasksByPetId } from '@/domain/use-cases'

export class LoadNextTasksByPetIdController implements Controller {
  private readonly loadNextTasksByPetId: LoadNextTasksByPetId
  private readonly validation: Validation

  constructor ({ loadNextTasksByPetId, validation }: LoadNextTasksByPetIdController.Dependencies) {
    this.loadNextTasksByPetId = loadNextTasksByPetId
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

      const result = await this.loadNextTasksByPetId.load({
        petId,
        page: Number(page),
        limit: Number(limit)
      })

      return success({
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        nextEvents: result.nextEvents
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadNextTasksByPetIdController {
  export interface Dependencies {
    loadNextTasksByPetId: LoadNextTasksByPetId
    validation: Validation
  }
}
