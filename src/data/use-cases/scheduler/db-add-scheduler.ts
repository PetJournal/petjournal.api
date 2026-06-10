import { NotAcceptableError, ServerError } from '@/application/errors'
import { type LoadTagByIdRepository, type AddSchedulerRepository, type AddTagRepository, type LoadPetByIdRepository, type DeleteSchedulerByIdRepository } from '@/data/protocols'
import { type EventsGenerator } from '@/data/protocols/service'
import { type AddScheduler } from '@/domain/use-cases/scheduler'

export class DbAddScheduler implements AddScheduler {
  private readonly tagRepository: AddTagRepository & LoadTagByIdRepository
  private readonly petRepository: LoadPetByIdRepository
  private readonly schedulerRepository: AddSchedulerRepository & DeleteSchedulerByIdRepository
  private readonly eventsGenerator: EventsGenerator

  constructor ({ tagRepository, eventGenerator, schedulerRepository, petRepository }: AddScheduler.Dependencies) {
    this.tagRepository = tagRepository
    this.petRepository = petRepository
    this.schedulerRepository = schedulerRepository
    this.eventsGenerator = eventGenerator
  }

  async add (params: AddScheduler.Params): Promise<AddScheduler.Result> {
    const tag = await this.tagRepository.loadById({ guardianId: params.guardianId, tagId: params.tagId })
    if (!tag) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('tagId')
      }
    }
    if (!(await this.checkPets(params.guardianId, params.pets))) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('petId')
      }
    }
    const scheduler = await this.schedulerRepository.add({
      tagId: tag.id,
      guardianId: params.guardianId,
      title: params.title,
      description: params.description,
      note: params.note,
      startAt: params.startAt,
      endAt: params.endAt,
      daysOfWeek: params.daysOfWeek,
      daysOfMonth: params.daysOfMonth,
      daily: params.daily,
      pets: params.pets
    })

    if (!scheduler) {
      return {
        isSuccess: false,
        error: new ServerError('Internal Server Error')
      }
    }

    const eventGeneratorResult = await this.eventsGenerator.generate({
      schedulerId: scheduler.id,
      guardianId: params.guardianId,
      startAt: params.startAt,
      endAt: params.endAt,
      daysOfWeek: params.daysOfWeek,
      daysOfMonth: params.daysOfMonth,
      daily: params.daily
    })

    if (!eventGeneratorResult.isSuccess) {
      const schedulerDeleted = await this.schedulerRepository.delete({ guardianId: scheduler.guardianId, schedulerId: scheduler.id })
      if (!schedulerDeleted) {
        return {
          isSuccess: false,
          error: new ServerError('Internal Server Error')
        }
      }
      return {
        isSuccess: false,
        error: eventGeneratorResult.error
      }
    }

    return {
      isSuccess: true,
      data: scheduler
    }
  }

  private async checkPets (guardianId: string, pets: string[]): Promise<boolean> {
    for (const petId of pets) {
      const result = await this.petRepository.loadById({ guardianId, petId })
      if (!result) {
        return false
      }
    }
    return true
  }
}
