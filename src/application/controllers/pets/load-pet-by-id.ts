import { badRequest, serverError, success, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type LoadPetById } from '@/domain/use-cases'

export class LoadPetByIdController implements Controller {
  private readonly loadPet: LoadPetById

  constructor ({ loadPet }: LoadPetByIdController.Dependencies) {
    this.loadPet = loadPet
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { petId } = httpRequest.params
      const result = await this.loadPet.loadById({ petId })
      if (!result.isSuccess) {
        return badRequest(result.error as Error)
      }
      return success(result.data)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace LoadPetByIdController {
  export type Dependencies = {
    loadPet: LoadPetById
  }
}
