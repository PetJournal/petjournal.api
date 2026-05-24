import { NotFoundError } from '@/application/errors'
import { type LoadNextTasksByPetId } from '@/domain/use-cases'
import {
  type LoadNextTasksByPetIdRepository,
  type LoadPetByIdRepository
} from '@/data/protocols'

export class DbLoadNextTasksByPetId implements LoadNextTasksByPetId {
  constructor (
    private readonly eventRepository: LoadNextTasksByPetIdRepository,
    private readonly petRepository: LoadPetByIdRepository
  ) {}

  async load ({
    guardianId,
    petId,
    page,
    limit
  }: LoadNextTasksByPetId.Params): Promise<LoadNextTasksByPetId.Result> {
    const petExists = await this.petRepository.loadById({ guardianId, petId })

    if (!petExists) {
      return {
        isSuccess: false,
        error: new NotFoundError('petId')
      }
    }

    const tasks = await this.eventRepository.loadNextByPetId({
      guardianId,
      petId,
      page,
      limit
    })

    return {
      isSuccess: true,
      data: tasks
    }
  }
}
