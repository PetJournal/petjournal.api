import { NotFoundError } from '@/application/errors'
import { type LoadPetByIdRepository } from '@/data/protocols'
import { type LoadPetById } from '@/domain/use-cases'

export class DbLoadPetById implements LoadPetById {
  private readonly petRepository: LoadPetByIdRepository

  constructor ({ petRepository }: LoadPetById.Dependencies) {
    this.petRepository = petRepository
  }

  async loadById ({ petId }: LoadPetById.Params): Promise<LoadPetById.Result> {
    const result = await this.petRepository.loadById(petId)
    if (!result) {
      return {
        isSuccess: false,
        error: new NotFoundError('petId')
      }
    }
    return {
      isSuccess: true,
      data: result
    }
  }
}
