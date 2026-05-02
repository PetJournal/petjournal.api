import { NotAcceptableError, ServerError } from '@/application/errors'
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
      expect(loadSpy).toHaveBeenCalledWith({ guardianId: params.guardianId, tagId: params.tagId })
    })

    it('Should throw if loadById throws', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.add(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if an invalid tagId is provided', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const result = await sut.add(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('tagId')
      })
    })
  })

  describe('PetRepository', () => {
    it('Should call loadById with correct value', async () => {
      const { sut, petRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(petRepositoryStub, 'loadById')
      await sut.add(params)
      expect(loadSpy).toHaveBeenCalledWith({ guardianId: params.guardianId, petId: params.pets[0] })
    })

    it('Should throw if loadById throws', async () => {
      const { sut, petRepositoryStub } = makeSut()
      jest.spyOn(petRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.add(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if an invalid petId is provided', async () => {
      const { sut, petRepositoryStub } = makeSut()
      jest.spyOn(petRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const result = await sut.add(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('petId')
      })
    })
  })

  describe('SchedulerRepository', () => {
    describe('Add Method', () => {
      it('Should call add with correct values', async () => {
        const { sut, schedulerRepositoryStub } = makeSut()
        const addSpy = jest.spyOn(schedulerRepositoryStub, 'add')
        await sut.add(params)
        expect(addSpy).toHaveBeenCalledWith({
          tagId: 'any_id',
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
        })
      })

      it('Should throw if add throws', async () => {
        const { sut, schedulerRepositoryStub } = makeSut()
        jest.spyOn(schedulerRepositoryStub, 'add').mockRejectedValue(new Error())
        const promise = sut.add(params)
        await expect(promise).rejects.toThrow()
      })

      it('Should return ServerError if add fails', async () => {
        const { sut, schedulerRepositoryStub } = makeSut()
        jest.spyOn(schedulerRepositoryStub, 'add').mockResolvedValueOnce(undefined)
        const result = await sut.add(params)
        expect(result).toEqual({
          isSuccess: false,
          error: new ServerError('Internal Server Error')
        })
      })
    })
    describe('Delete Method', () => {
      it('Should call delete with correct value', async () => {
        const { sut, schedulerRepositoryStub, eventsGeneratorStub } = makeSut()
        jest.spyOn(eventsGeneratorStub, 'generate').mockResolvedValueOnce({
          isSuccess: false,
          error: new ServerError('Internal Server Error!')
        })
        const deleteSpy = jest.spyOn(schedulerRepositoryStub, 'delete')
        await sut.add(params)
        expect(deleteSpy).toHaveBeenCalledWith({ guardianId: 'any_guardian_id', schedulerId: 'any_id' })
      })

      it('Should throw if delete throws', async () => {
        const { sut, schedulerRepositoryStub, eventsGeneratorStub } = makeSut()
        jest.spyOn(eventsGeneratorStub, 'generate').mockResolvedValueOnce({
          isSuccess: false,
          error: new ServerError('Internal Server Error!')
        })
        jest.spyOn(schedulerRepositoryStub, 'delete').mockRejectedValue(new Error())
        const promise = sut.add(params)
        await expect(promise).rejects.toThrow()
      })

      it('Should return ServerError if delete fails', async () => {
        const { sut, schedulerRepositoryStub, eventsGeneratorStub } = makeSut()
        jest.spyOn(eventsGeneratorStub, 'generate').mockResolvedValueOnce({
          isSuccess: false,
          error: new ServerError('Internal Server Error!')
        })
        jest.spyOn(schedulerRepositoryStub, 'delete').mockResolvedValueOnce(false)
        const result = await sut.add(params)
        expect(result).toEqual({
          isSuccess: false,
          error: new ServerError('Internal Server Error')
        })
      })
    })
  })
  describe('EventsGenerator', () => {
    it('Should call generate with correct values', async () => {
      const { sut, eventsGeneratorStub } = makeSut()
      const loadSpy = jest.spyOn(eventsGeneratorStub, 'generate')
      await sut.add(params)
      expect(loadSpy).toHaveBeenCalledWith({
        schedulerId: 'any_id',
        guardianId: 'any_guardian_id',
        startAt: new Date('2024-04-04T15:00:00Z'),
        endAt: new Date('2025-04-04T17:00:00Z'),
        daysOfWeek: [],
        daysOfMonth: [],
        daily: false
      })
    })

    it('Should throw if generate throws', async () => {
      const { sut, eventsGeneratorStub } = makeSut()
      jest.spyOn(eventsGeneratorStub, 'generate').mockRejectedValue(new Error())
      const promise = sut.add(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if generate fails to punctual event', async () => {
      const { sut, eventsGeneratorStub } = makeSut()
      jest.spyOn(eventsGeneratorStub, 'generate').mockResolvedValueOnce({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
      const result = await sut.add(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error')
      })
    })

    it('Should return ServerError if generate fails', async () => {
      const { sut, schedulerRepositoryStub, eventsGeneratorStub } = makeSut()
      jest.spyOn(eventsGeneratorStub, 'generate').mockResolvedValueOnce({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
      jest.spyOn(schedulerRepositoryStub, 'delete').mockResolvedValueOnce(true)
      const result = await sut.add(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error')
      })
    })
  })
  it('Should return true if add success', async () => {
    const { sut } = makeSut()
    const result = await sut.add(params)
    expect(result).toEqual({
      isSuccess: true,
      data: {
        id: 'any_id',
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
        pets: [{
          breedAlias: 'any_breed_alias',
          breedId: 'any_breed_id',
          castrated: false,
          dateOfBirth: new Date('2000-11-23T02:00:00.000Z'),
          gender: 'M',
          guardianId: 'any_guardian_id',
          id: 'any_id',
          image: '',
          petName: 'any_pet_name',
          sizeId: 'any_size_id',
          specieAlias: 'any_specie_alias',
          specieId: 'any_specie_id'
        }]
      }
    })
  })
})
