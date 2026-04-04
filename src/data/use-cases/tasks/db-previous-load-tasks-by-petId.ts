import { NotFoundError } from '@/application/errors'
import { type LoadPreviousTasksByPetId } from '@/domain/use-cases'
import { type LoadPreviousTasksByPetIdRepository, type LoadPetByIdRepository } from '@/data/protocols'

export class DbLoadPreviousTasksByPetId implements LoadPreviousTasksByPetId {
  constructor (
    private readonly eventRepository: LoadPreviousTasksByPetIdRepository,
    private readonly petRepository: LoadPetByIdRepository
  ) {}

  async load ({
    guardianId,
    petId,
    page,
    limit
  }: LoadPreviousTasksByPetId.Params): Promise<LoadPreviousTasksByPetId.Result> {
    const petExists = await this.petRepository.loadById({ guardianId, petId })

    if (!petExists) {
      return {
        isSuccess: false,
        error: new NotFoundError('petId')
      }
    }

    const tasks = await this.eventRepository.loadPreviousByPetId({
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
