import { notAcceptable, serverError, success, type HttpRequest, type HttpResponse } from '@/application/helpers'
import { type Controller } from '@/application/protocols'
import { type DeletePet } from '@/domain/use-cases'

export class PetDeleteController implements Controller {
  private readonly deletePet: DeletePet

  constructor ({ petDelete }: PetDeleteController.Dependencies) {
    this.deletePet = petDelete
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const guardianId = httpRequest.userId as string
      const petId = httpRequest.params.petId as string
      const result = await this.deletePet.delete({ petId, guardianId })
      if (!result.isSuccess) {
        return notAcceptable(result.error as Error)
      }
      return success({
        message: 'Pet deleted',
        petId
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace PetDeleteController {
  export type Dependencies = {
    petDelete: DeletePet
  }
}
