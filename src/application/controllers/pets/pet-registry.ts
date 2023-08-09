import { type HttpRequest, type HttpResponse, badRequest, create, serverError } from '@/application/helpers'
import { type Controller, type Validation } from '@/application/protocols'
import { type AddPet } from '@/domain/use-cases'

export class PetRegistryController implements Controller {
  private readonly validation: Validation
  private readonly addPet: AddPet

  constructor ({ validation, addPet }: PetRegistryController.Dependencies) {
    this.validation = validation
    this.addPet = addPet
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const guardianId = httpRequest.userId as string
      const { specieId } = httpRequest.body
      const pet = await this.addPet.add({
        guardianId,
        specieId
      })
      return create(pet)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace PetRegistryController {
  export interface Dependencies {
    validation: Validation
    addPet: AddPet
  }
}
