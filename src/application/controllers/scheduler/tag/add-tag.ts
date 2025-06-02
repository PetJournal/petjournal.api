import { badRequest, create, notAcceptable, serverError, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Validation, type Controller } from '@/application/protocols'
import { type AddTag } from '@/domain/use-cases'

export class AddTagController implements Controller {
  private readonly validation: Validation
  private readonly addTag: AddTag

  constructor ({ addTag, validation }: AddTagController.Dependencies) {
    this.addTag = addTag
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { name, color } = httpRequest.body
      const guardianId = httpRequest.userId as string
      const result = await this.addTag.add({ guardianId, name, color })
      if (!result.isSuccess) {
        return notAcceptable(result.error as Error)
      }
      return create({
        id: result.data?.id,
        guardianId: result.data?.guardianId,
        name: result.data?.name,
        color: result.data?.color
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace AddTagController {
  export type Dependencies = {
    validation: Validation
    addTag: AddTag
  }
}
