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
  const guardianId = 'any_guardian_id'

  const daysOfWeekParams: EventsGenerator.Params = {
    schedulerId: 'any_scheduler_id',
    guardianId,
    startAt: generateDate().startAt,
    endAt: generateDate().endAt,
    daysOfWeek: [new Date().getDay()],
    daysOfMonth: undefined,
    daily: false
  }

  const daysOfMonthParams: EventsGenerator.Params = {
    schedulerId: 'any_scheduler_id',
    startAt: generateDate().startAt,
    endAt: generateDate().endAt,
    daysOfWeek: undefined,
    daysOfMonth: [new Date().getDate()],
    daily: false,
    guardianId
  }

  const dailyParams: EventsGenerator.Params = {
    schedulerId: 'any_scheduler_id',
    startAt: generateDate().startAt,
    endAt: generateDate().endAt,
    daysOfWeek: undefined,
    daysOfMonth: undefined,
    daily: true,
    guardianId
  }

  const punctualParams: EventsGenerator.Params = {
    schedulerId: 'any_scheduler_id',
    startAt: generateDate().startAt,
    endAt: generateDate().endAt,
    daysOfWeek: undefined,
    daysOfMonth: undefined,
    daily: false,
    guardianId
  }

  describe('Days of Week', () => {
    it('Should call loadByDate with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDate')
      await sut.generate({ ...daysOfWeekParams, daysOfMonth: undefined, daily: false })
      expect(loadSpy).toHaveBeenCalledWith({ guardianId: daysOfWeekParams.guardianId, date: daysOfWeekParams.startAt })
    })

    it('Should throw if loadByDate throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate(daysOfWeekParams)
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if loadByDate returns an existing event (conflict)', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce({
        schedulerId: 'any_scheduler_id',
        start: new Date('2025-06-01T10:30:00Z'),
        end: new Date('2025-07-01T11:30:00Z')
      })
      const result = await sut.generate(daysOfWeekParams)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('Conflict start event')
      })
    })

    it('Should call addMany with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      const addSpy = jest.spyOn(eventRepositoryStub, 'addMany')
      await sut.generate(daysOfWeekParams)
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
      const promise = sut.generate(daysOfWeekParams)
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if addMany fails', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(false)
      const result = await sut.generate(daysOfWeekParams)
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
    })

    it('Should return true if generate weekly events on success', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(true)
      const result = await sut.generate(daysOfWeekParams)
      expect(result).toEqual({
        isSuccess: true,
        data: [
          {
            schedulerId: 'any_scheduler_id',
            start: expect.any(Date),
            end: expect.any(Date)
          }
        ]
      })
    })
  })

  describe('Days of Month', () => {
    it('Should call loadByDate with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDate')
      await sut.generate({ ...daysOfMonthParams, daysOfWeek: undefined, daily: false })
      expect(loadSpy).toHaveBeenCalledWith({ guardianId: daysOfMonthParams.guardianId, date: daysOfMonthParams.startAt })
    })

    it('Should throw if loadByDate throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate(daysOfMonthParams)
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if loadByDate returns an existing event (conflict)', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce({
        schedulerId: 'any_scheduler_id',
        start: new Date('2025-06-01T10:30:00Z'),
        end: new Date('2025-07-01T11:30:00Z')

      })
      const result = await sut.generate(daysOfMonthParams)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('Conflict start event')
      })
    })

    it('Should call addMany with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      const addSpy = jest.spyOn(eventRepositoryStub, 'addMany')
      await sut.generate(daysOfMonthParams)
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
      const promise = sut.generate(daysOfMonthParams)
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if addMany fails', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(false)
      const result = await sut.generate(daysOfMonthParams)
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
    })

    it('Should return true if generate monthly events on success', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(true)
      const result = await sut.generate(daysOfMonthParams)
      expect(result).toEqual({
        isSuccess: true,
        data: [
          {
            schedulerId: 'any_scheduler_id',
            start: expect.any(Date),
            end: expect.any(Date)
          }
        ]
      })
    })
  })

  describe('Daily', () => {
    it('Should call loadByDate with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDate')
      await sut.generate({ ...dailyParams, daysOfWeek: undefined, daysOfMonth: undefined })
      expect(loadSpy).toHaveBeenCalledWith({ guardianId: dailyParams.guardianId, date: dailyParams.startAt })
    })

    it('Should throw if loadByDate throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate(dailyParams)
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if loadByDate returns an existing event (conflict)', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce({
        schedulerId: 'any_scheduler_id',
        start: new Date('2025-06-01T10:30:00Z'),
        end: new Date('2025-07-01T11:30:00Z')
      })
      const result = await sut.generate(dailyParams)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('Conflict start event')
      })
    })

    it('Should call addMany with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      const addSpy = jest.spyOn(eventRepositoryStub, 'addMany')
      await sut.generate(dailyParams)
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
      const promise = sut.generate(dailyParams)
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if addMany fails', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(false)
      const result = await sut.generate(dailyParams)
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
      const result = await sut.generate(dailyParams)
      expect(result).toEqual({
        isSuccess: true,
        data: [
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
        ]
      })
    })
  })

  describe('Punctual', () => {
    it('Should call loadByDate with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDate')
      await sut.generate({ ...punctualParams, daysOfWeek: undefined, daysOfMonth: undefined, daily: false })
      expect(loadSpy).toHaveBeenCalledWith({ guardianId: punctualParams.guardianId, date: punctualParams.startAt })
    })

    it('Should throw if loadByDate throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate(punctualParams)
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if loadByDate returns an existing event (conflict)', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce({
        schedulerId: 'any_scheduler_id',
        start: new Date('2025-06-01T10:30:00Z'),
        end: new Date('2025-07-01T11:30:00Z')

      })
      const result = await sut.generate(punctualParams)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('Conflict start event')
      })
    })

    it('Should call add with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      const addSpy = jest.spyOn(eventRepositoryStub, 'add')
      await sut.generate(punctualParams)
      expect(addSpy).toHaveBeenCalledWith({
        schedulerId: 'any_scheduler_id',
        start: punctualParams.startAt,
        end: punctualParams.endAt
      })
    })

    it('Should throw if add throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'add').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate(punctualParams)
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if add fails', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDate').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'add').mockResolvedValueOnce(undefined)
      const result = await sut.generate(punctualParams)
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
        start: punctualParams.startAt,
        end: punctualParams.endAt
      })
      const result = await sut.generate(punctualParams)
      expect(result).toEqual({
        isSuccess: true,
        data: {
          id: 'any_id',
          schedulerId: 'any_scheduler_id',
          start: punctualParams.startAt,
          end: punctualParams.endAt
        }
      })
    })
  })
})
