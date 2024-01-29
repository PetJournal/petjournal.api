import { type HttpRequest, type HttpResponse, badRequest, create, serverError, notAcceptable } from '@/application/helpers'
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
      const { specieName, petName, breedName, size } = httpRequest.body
      const gender = httpRequest.body.gender.toUpperCase()
      const result = await this.addPet.add({
        guardianId,
        specieName,
        petName,
        gender,
        breedName,
        size
      })
      if (!result.isSuccess) {
        return notAcceptable(result.error as Error)
      }
      return create({
        id: result.data?.id,
        guardian: result.data?.guardian,
        specie: result.data?.specie,
        specieAlias: result.data?.specieAlias,
        petName: result.data?.petName,
        gender: result.data?.gender,
        breed: result.data?.breed,
        breedAlias: result.data?.breedAlias,
        size: result.data?.size
      })
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
