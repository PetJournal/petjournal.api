import { type AddSchedulerRepository, type AddTagRepository, type DeleteSchedulerByIdRepository, type LoadPetByIdRepository, type LoadTagByIdRepository } from '@/data/protocols'
import { type EventsGenerator } from '@/data/protocols/service'
import { DbAddScheduler } from '@/data/use-cases/scheduler/db-add-scheduler'
import { type AddScheduler } from '@/domain/use-cases'
import { makeFakeEventsGenerator, makeFakePetRepository, makeFakeSchedulerRepository, makeFakeTagRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbAddScheduler
  tagRepositoryStub: AddTagRepository & LoadTagByIdRepository
  petRepositoryStub: LoadPetByIdRepository
  schedulerRepositoryStub: AddSchedulerRepository & DeleteSchedulerByIdRepository
  eventsGeneratorStub: EventsGenerator
}

const makeSut = (): SutTypes => {
  const tagRepositoryStub = makeFakeTagRepository()
  const petRepositoryStub = makeFakePetRepository()
  const schedulerRepositoryStub = makeFakeSchedulerRepository()
  const eventsGeneratorStub = makeFakeEventsGenerator()
  const dependencies: AddScheduler.Dependencies = {
    tagRepository: tagRepositoryStub,
    petRepository: petRepositoryStub,
    schedulerRepository: schedulerRepositoryStub,
    eventGenerator: eventsGeneratorStub
  }
  const sut = new DbAddScheduler(dependencies)
  return {
    sut,
    tagRepositoryStub,
    petRepositoryStub,
    schedulerRepositoryStub,
    eventsGeneratorStub
  }
}

describe('DbAddScheduler Use case', () => {
  const params: AddScheduler.Params = {
    tagId: 'any_tag_id',
    guardianId: 'any_guardian_id',
    title: 'any_title',
    description: 'any_description',
    note: 'any_note',
    startAt: new Date('2024-04-04T15:00:00Z'),
    endAt: new Date('2025-04-04T17:00:00Z'),
    daysOfWeek: [],
    daysOfMonth: [],
    daily: false,
    pets: ['any_pet_id']
  }
  describe('TagRepository', () => {
    it('Should call loadById with correct value', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(tagRepositoryStub, 'loadById')
      await sut.add(params)
      expect(loadSpy).toHaveBeenCalledWith('any_tag_id')
    })

    it('Should throw if loadById throws', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.add(params)
      await expect(promise).rejects.toThrow()
    })
  })
})
