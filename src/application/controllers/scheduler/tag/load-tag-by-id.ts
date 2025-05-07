import { serverError, success, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadTagById } from '@/domain/use-cases/scheduler/tag'

export class LoadTagByIdController implements Controller {
  private readonly loadTag: LoadTagById

  constructor ({ loadTag }: LoadTagByIdController.Dependencies) {
    this.loadTag = loadTag
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { tagId } = httpRequest.body
      const result = await this.loadTag.loadById(tagId)
      return success(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadTagByIdController {
  export type Dependencies = {
    loadTag: LoadTagById
  }
}
