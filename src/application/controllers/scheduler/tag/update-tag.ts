import { badRequest, notAcceptable, serverError, success, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Validation, type Controller } from '@/application/protocols'
import { type UpdateTag } from '@/domain/use-cases/scheduler/tag'

export class UpdateTagController implements Controller {
  private readonly updateTag: UpdateTag
  private readonly validation: Validation

  constructor ({ updateTag, validation }: UpdateTagController.Dependencies) {
    this.updateTag = updateTag
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate({ ...httpRequest.body, ...httpRequest.params })
      if (error) {
        return badRequest(error)
      }
      const { name } = httpRequest.body
      const result = await this.updateTag.update(name)
      if (!result.isSuccess) {
        return notAcceptable(result.error as Error)
      }
      return success(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace UpdateTagController {
  export type Dependencies = {
    updateTag: UpdateTag
    validation: Validation
  }
}
