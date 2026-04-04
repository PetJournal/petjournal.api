import { NotAcceptableError, ServerError } from '@/application/errors'
import { type DeletePetByIdRepository, type LoadGuardianByIdRepository, type LoadPetByIdRepository } from '@/data/protocols'
import { type DeletePet } from '@/domain/use-cases'

export class DbDeletePet implements DeletePet {
  private readonly guardianRepository: LoadGuardianByIdRepository
  private readonly petRepository: LoadPetByIdRepository & DeletePetByIdRepository

  constructor ({ guardianRepository, petRepository }: DeletePet.Dependencies) {
    this.guardianRepository = guardianRepository
    this.petRepository = petRepository
  }

  async delete ({ petId, guardianId }: DeletePet.Params): Promise<DeletePet.Result> {
    const guardian = await this.guardianRepository.loadById(guardianId)
    if (!guardian) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('userId')
      }
    }
    const pet = await this.petRepository.loadById({ guardianId, petId })
    if (!pet) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('petId')
      }
    }
    const petDeleteResult = await this.petRepository.deleteById(petId)
    if (!petDeleteResult) {
      return {
        isSuccess: false,
        error: new ServerError('delete error')
      }
    }
    return {
      isSuccess: true
    }
  }
}
