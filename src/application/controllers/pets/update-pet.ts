import { type HttpRequest, type HttpResponse, badRequest, serverError, notAcceptable, success } from '@/application/helpers'
import { type Controller, type Validation } from '@/application/protocols'
import { type UpdatePet } from '@/domain/use-cases'

export class UpdatePetController implements Controller {
  private readonly validation: Validation
  private readonly updatePet: UpdatePet

  constructor ({ validation, updatePet }: UpdatePetController.Dependencies) {
    this.validation = validation
    this.updatePet = updatePet
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate({ ...httpRequest.body, ...httpRequest.params })
      if (error) {
        return badRequest(error)
      }
      const guardianId = httpRequest.userId as string
      const petId = httpRequest.params.petId as string
      const image = httpRequest.file ?? null
      const updateData = { ...httpRequest.body, guardianId, petId, image }
      if (Object.hasOwn(updateData, 'gender')) {
        updateData.gender = updateData.gender?.toUpperCase()
      }

      const result = await this.updatePet.update(updateData)
      if (!result.isSuccess) {
        return notAcceptable(result.error as Error)
      }
      return success({
        id: result.data?.id,
        guardian: result.data?.guardian,
        specie: result.data?.specie,
        specieAlias: result.data?.specieAlias,
        petName: result.data?.petName,
        gender: result.data?.gender,
        breed: result.data?.breed,
        breedAlias: result.data?.breedAlias,
        size: result.data?.size,
        castrated: result.data?.castrated,
        dateOfBirth: result.data?.dateOfBirth,
        image: result.data?.image
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace UpdatePetController {
  export interface Dependencies {
    validation: Validation
    updatePet: UpdatePet
  }
}
