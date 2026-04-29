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
  constructor (
    private readonly loadNextTasksByPetId: LoadNextTasksByPetId,
    private readonly validation: Validation
  ) {}

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
      const guardianId = httpRequest.userId as string
      const { page = 1, limit = 10 } = httpRequest.query

      const result = await this.loadNextTasksByPetId.load({
        guardianId,
        petId,
        page: Number(page),
        limit: Number(limit)
      })

      if (!result.isSuccess) {
        return badRequest(result.error)
      }

      return success(result.data)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
