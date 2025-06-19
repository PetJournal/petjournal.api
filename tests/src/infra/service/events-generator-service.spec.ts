import { NotAcceptableError, ServerError } from '@/application/errors'
import { type AddEventRepository, type AddManyEventsRepository, type LoadEventByDateRepository } from '@/data/protocols'
import { type EventsGenerator } from '@/data/protocols/service'
import { EventsGeneratorService } from '@/infra/service'
import { makeFakeEventRepository } from '@/tests/utils'

interface SutTypes {
  sut: EventsGeneratorService
  eventRepositoryStub: AddEventRepository & LoadEventByDateRepository & AddManyEventsRepository
}

const makeSut = (): SutTypes => {
  const eventRepositoryStub = makeFakeEventRepository()
  const dependencies: EventsGenerator.Dependencies = {
    eventRepository: eventRepositoryStub
  }
  const sut = new EventsGeneratorService(dependencies)
  return {
    sut,
    eventRepositoryStub
  }
}

const generateDate = (): any => {
  const start = new Date()
  const end = new Date()
  end.setDate(start.getDate() + 1)
  return {
    startAt: start,
    endAt: end
  }
}

describe('Events Generator Service', () => {
  const params: EventsGenerator.Params = {
    schedulerId: 'any_scheduler_id',
    startAt: generateDate().startAt,
    endAt: generateDate().endAt,
    daysOfWeek: [new Date().getDay()],
    daysOfMonth: [new Date().getDate()],
    daily: true
  }

  describe('Days of Week', () => {
    it('Should call loadByDate with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDate')
      await sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      expect(loadSpy).toHaveBeenCalledWith({ date: params.startAt })
    })

    it('Should throw if loadByDate throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if loadByDate returns null because date conflits', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce({
        schedulerId: 'any_scheduler_id',
        start: new Date('2025-06-01T10:30:00Z'),
        end: new Date('2025-07-01T11:30:00Z')

      })
      const result = await sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('Conflict start event'),
        data: {
          schedulerId: 'any_scheduler_id',
          start: new Date('2025-06-01T10:30:00Z'),
          end: new Date('2025-07-01T11:30:00Z')

        }
      })
    })

    it('Should call addMany with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      const addSpy = jest.spyOn(eventRepositoryStub, 'addMany')
      await sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      expect(addSpy).toHaveBeenCalledWith([{
        schedulerId: 'any_scheduler_id',
        start: expect.any(Date),
        end: expect.any(Date)
      }])
    })

    it('Should throw if addMany throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if addMany fails', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(false)
      const result = await sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
    })

    it('Should return true if generate weekly events on success', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(true)
      const result = await sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      expect(result).toEqual({ isSuccess: true })
    })
  })

  describe('Days of Month', () => {
    it('Should call loadByDate with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDate')
      await sut.generate({ ...params, daysOfWeek: undefined, daily: false })
      expect(loadSpy).toHaveBeenCalledWith({ date: params.startAt })
    })

    it('Should throw if loadByDate throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfWeek: undefined, daily: false })
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if loadByDate returns null because date conflits', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce({
        schedulerId: 'any_scheduler_id',
        start: new Date('2025-06-01T10:30:00Z'),
        end: new Date('2025-07-01T11:30:00Z')

      })
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daily: false })
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('Conflict start event'),
        data: {
          schedulerId: 'any_scheduler_id',
          start: new Date('2025-06-01T10:30:00Z'),
          end: new Date('2025-07-01T11:30:00Z')

        }
      })
    })

    it('Should call addMany with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      const addSpy = jest.spyOn(eventRepositoryStub, 'addMany')
      await sut.generate({ ...params, daysOfMonth: [new Date().getDate()], daysOfWeek: undefined, daily: false })
      expect(addSpy).toHaveBeenCalledWith([{
        schedulerId: 'any_scheduler_id',
        start: expect.any(Date),
        end: expect.any(Date)
      }])
    })

    it('Should throw if addMany throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfWeek: undefined, daily: false })
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if addMany fails', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(false)
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daily: false })
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
    })

    it('Should return true if generate monthly events on success', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(true)
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daily: false })
      expect(result).toEqual({ isSuccess: true })
    })
  })

  describe('Daily', () => {
    it('Should call loadByDate with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDate')
      await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined })
      expect(loadSpy).toHaveBeenCalledWith({ date: params.startAt })
    })

    it('Should throw if loadByDate throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined })
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if loadByDate returns null because date conflits', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce({
        schedulerId: 'any_scheduler_id',
        start: new Date('2025-06-01T10:30:00Z'),
        end: new Date('2025-07-01T11:30:00Z')

      })
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined })
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('Conflict start event'),
        data: {
          schedulerId: 'any_scheduler_id',
          start: new Date('2025-06-01T10:30:00Z'),
          end: new Date('2025-07-01T11:30:00Z')

        }
      })
    })

    it('Should call addMany with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      const addSpy = jest.spyOn(eventRepositoryStub, 'addMany')
      await sut.generate({ ...params, daysOfMonth: undefined, daysOfWeek: undefined })
      expect(addSpy).toHaveBeenCalledWith([
        {
          schedulerId: 'any_scheduler_id',
          start: expect.any(Date),
          end: expect.any(Date)
        },
        {
          schedulerId: 'any_scheduler_id',
          start: expect.any(Date),
          end: expect.any(Date)
        }
      ])
    })

    it('Should throw if addMany throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined })
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if addMany fails', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(false)
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined })
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
    })

    it('Should return true if generate daily events on success', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(true)
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined })
      expect(result).toEqual({ isSuccess: true })
    })
  })

  describe('Punctual', () => {
    it('Should call loadByDate with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDate')
      await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined, daily: false })
      expect(loadSpy).toHaveBeenCalledWith({ date: params.startAt })
    })

    it('Should throw if loadByDate throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined, daily: false })
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if loadByDate returns null because date conflits', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce({
        schedulerId: 'any_scheduler_id',
        start: new Date('2025-06-01T10:30:00Z'),
        end: new Date('2025-07-01T11:30:00Z')

      })
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined, daily: false })
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('Conflict start event'),
        data: {
          schedulerId: 'any_scheduler_id',
          start: new Date('2025-06-01T10:30:00Z'),
          end: new Date('2025-07-01T11:30:00Z')

        }
      })
    })

    it('Should call add with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      const addSpy = jest.spyOn(eventRepositoryStub, 'add')
      await sut.generate({ ...params, daysOfMonth: undefined, daysOfWeek: undefined, daily: false })
      expect(addSpy).toHaveBeenCalledWith({
        schedulerId: 'any_scheduler_id',
        start: params.startAt,
        end: params.endAt
      })
    })

    it('Should throw if add throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'add').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined, daily: false })
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if add fails', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'add').mockResolvedValueOnce(undefined)
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined, daily: false })
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
    })

    it('Should return true if generate Punctual event on success', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'add').mockResolvedValue({
        id: 'any_id',
        schedulerId: 'any_scheduler_id',
        start: params.startAt,
        end: params.endAt
      })
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined, daily: false })
      expect(result).toEqual({
        isSuccess: true,
        data: {
          id: 'any_id',
          schedulerId: 'any_scheduler_id',
          start: params.startAt,
          end: params.endAt
        }
      })
    })
  })
})
