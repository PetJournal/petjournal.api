import {
  success,
  serverError,
  badRequest,
  type HttpRequest,
  type HttpResponse
} from '@/application/helpers'
import { type Validation, type Controller } from '@/application/protocols'
import { type LoadPreviousTasksByPetId } from '@/domain/use-cases'

export class LoadPreviousTasksByPetIdController implements Controller {
  private readonly loadPreviousTasksByPetId: LoadPreviousTasksByPetId
  private readonly validation: Validation

  constructor ({ loadPreviousTasksByPetId, validation }: LoadPreviousTasksByPetIdController.Dependencies) {
    this.loadPreviousTasksByPetId = loadPreviousTasksByPetId
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

      const result = await this.loadPreviousTasksByPetId.load({
        petId,
        page: Number(page),
        limit: Number(limit)
      })

      return success({
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        history: result.history
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadPreviousTasksByPetIdController {
  export interface Dependencies {
    loadPreviousTasksByPetId: LoadPreviousTasksByPetId
    validation: Validation
  }
}
