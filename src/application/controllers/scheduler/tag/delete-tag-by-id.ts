import { notAcceptable, serverError, success, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type DeleteTagById } from '@/domain/use-cases/scheduler/tag'

export class DeleteTagByIdController implements Controller {
  private readonly deleteTag: DeleteTagById

  constructor ({ deleteTag }: DeleteTagByIdController.Dependencies) {
    this.deleteTag = deleteTag
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { tagId } = httpRequest.params
      const guardianId = httpRequest.userId as string
      const result = await this.deleteTag.deleteById({ guardianId, tagId })
      if (!result.isSuccess) {
        return notAcceptable(result.error as Error)
      }
      return success({
        message: 'Tag deleted',
        tagId
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace DeleteTagByIdController {
  export type Dependencies = {
    deleteTag: DeleteTagById
  }
}
