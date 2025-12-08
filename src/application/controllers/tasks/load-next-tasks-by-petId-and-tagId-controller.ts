import { badRequest, serverError, success, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Validation, type Controller } from '@/application/protocols'
import { type LoadNextTasksByPetIdAndTagId } from '@/domain/use-cases'

export class LoadNextTaskByPetIdAndTagIdController implements Controller {
  private readonly loadNextTasksByPetIdAndTagId: LoadNextTasksByPetIdAndTagId
  private readonly validation: Validation

  constructor ({ loadNextTasksByPetIdAndTagId, validation }: LoadNextTaskByPetIdAndTagIdController.Dependencies) {
    this.loadNextTasksByPetIdAndTagId = loadNextTasksByPetIdAndTagId
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

      const { petId, tagId } = httpRequest.params
      const { page = 1, limit = 10 } = httpRequest.query

      const result = await this.loadNextTasksByPetIdAndTagId.load({
        petId,
        tagId,
        page: Number(page),
        limit: Number(limit)
      })

      if (!result.isSuccess) {
        return badRequest(result.error as Error)
      }

      return success({
        page: result.data?.page,
        limit: result.data?.limit,
        totalPage: result.data?.totalPages,
        events: result.data?.events
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadNextTaskByPetIdAndTagIdController {
  export type Dependencies = {
    loadNextTasksByPetIdAndTagId: LoadNextTasksByPetIdAndTagId
    validation: Validation
  }
}
