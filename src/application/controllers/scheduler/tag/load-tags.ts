import { type HttpRequest, type HttpResponse, serverError, success } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadTags } from '@/domain/use-cases/scheduler/tag'

export class LoadTagsController implements Controller {
  private readonly loadTags: LoadTags

  constructor ({ loadTags }: LoadTagsController.Dependencies) {
    this.loadTags = loadTags
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const result = await this.loadTags.loadAll()
      return success(result)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadTagsController {
  export type Dependencies = {
    loadTags: LoadTags
  }
}
