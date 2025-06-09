import { NotAcceptableError, ServerError } from '@/application/errors'
import { type AddEventRepository, type AddManyEventsRepository, type LoadEventByDateAndStartRepository } from '@/data/protocols'
import { type EventsGenerator, type DateAddDay, type DateGeneratorUtc, type DateSetTime, type DateToJSDate } from '@/data/protocols/service'
import { EventsGeneratorService } from '@/infra/service'
import { makeFakeEventRepository } from '@/tests/utils'
import { DateTime } from 'luxon'

interface SutTypes {
  sut: EventsGeneratorService
  eventRepositoryStub: AddEventRepository & LoadEventByDateAndStartRepository & AddManyEventsRepository
  dateTimeStub: DateGeneratorUtc & DateToJSDate & DateSetTime & DateAddDay
}

const makeFakeDateTimeStub = (): DateGeneratorUtc & DateToJSDate & DateSetTime & DateAddDay => {
  return {
    generate: jest.fn((date: Date) => {
      return DateTime.fromJSDate(date, { zone: 'utc' })
    }),
    toJSDate: jest.fn((dateTime: DateTime) => dateTime.toJSDate()),
    setTime: jest.fn(({ dateTime, time }) =>
      dateTime.set({ hour: time.hour, minute: time.minute, second: time.second })
    ),
    addDay: jest.fn((dateTime: DateTime) => dateTime.plus({ days: 1 }))
  }
}

const makeSut = (): SutTypes => {
  const eventRepositoryStub = makeFakeEventRepository()
  const dateTimeStub = makeFakeDateTimeStub()
  const dependencies: EventsGenerator.Dependencies = {
    eventRepository: eventRepositoryStub,
    dateTime: dateTimeStub
  }
  const sut = new EventsGeneratorService(dependencies)
  return {
    sut,
    eventRepositoryStub,
    dateTimeStub
  }
}

const generateDate = (): any => {
  const start = new Date()
  const end = new Date()
  end.setDate(end.getDate() + 1)
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
    daysOfWeek: [0, 1, 6],
    daysOfMonth: [new Date().getDate()],
    daily: true
  }

  const startAtDateTimeFake = DateTime.fromISO(params.startAt.toISOString(), { zone: 'utc' })
  const endAtDateTimeFake = DateTime.fromISO(params.endAt.toISOString(), { zone: 'utc' })

  describe('Days of Week', () => {
    it('Should call loadByDateAndStart with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDateAndStart')
      await sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      expect(loadSpy).toHaveBeenCalledWith({ start: startAtDateTimeFake.toJSDate() })
    })

    it('Should throw if loadByDateAndStart throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if loadByDateAndStart returns null because date conflits', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce({
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
      const { sut, eventRepositoryStub, dateTimeStub } = makeSut()
      const events = [{
        schedulerId: 'any_scheduler_id',
        start: dateTimeStub.toJSDate(startAtDateTimeFake),
        end: dateTimeStub.setTime({
          dateTime: startAtDateTimeFake,
          time: {
            hour: endAtDateTimeFake.hour,
            minute: endAtDateTimeFake.minute,
            second: endAtDateTimeFake.second
          }
        })
      }]
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      const addSpy = jest.spyOn(eventRepositoryStub, 'addMany')
      await sut.generate({ ...params, daysOfWeek: [1], daysOfMonth: undefined, daily: false })
      expect(addSpy).toHaveBeenCalledWith([{
        schedulerId: events[0].schedulerId,
        start: events[0].start,
        end: events[0].end
      }])
    })

    it('Should throw if addMany throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if addMany fails', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(false)
      const result = await sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
    })

    it('Should return true if generate weekly events on success', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(true)
      const result = await sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      expect(result).toEqual({ isSuccess: true })
    })
  })

  describe('Days of Month', () => {
    it('Should call loadByDateAndStart with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDateAndStart')
      await sut.generate({ ...params, daysOfWeek: undefined, daily: false })
      expect(loadSpy).toHaveBeenCalledWith({ start: startAtDateTimeFake.toJSDate() })
    })

    it('Should throw if loadByDateAndStart throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfWeek: undefined, daily: false })
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if loadByDateAndStart returns null because date conflits', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce({
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
      const { sut, eventRepositoryStub, dateTimeStub } = makeSut()
      const events = [{
        schedulerId: 'any_scheduler_id',
        start: dateTimeStub.toJSDate(startAtDateTimeFake),
        end: dateTimeStub.setTime({
          dateTime: startAtDateTimeFake,
          time: {
            hour: endAtDateTimeFake.hour,
            minute: endAtDateTimeFake.minute,
            second: endAtDateTimeFake.second
          }
        })
      }]
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      const addSpy = jest.spyOn(eventRepositoryStub, 'addMany')
      await sut.generate({ ...params, daysOfMonth: [new Date().getDate()], daysOfWeek: undefined, daily: false })
      expect(addSpy).toHaveBeenCalledWith([{
        schedulerId: events[0].schedulerId,
        start: events[0].start,
        end: events[0].end
      }])
    })

    it('Should throw if addMany throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfWeek: undefined, daily: false })
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if addMany fails', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(false)
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daily: false })
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
    })

    it('Should return true if generate monthly events on success', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(true)
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daily: false })
      expect(result).toEqual({ isSuccess: true })
    })
  })

  describe('Daily', () => {
    it('Should call loadByDateAndStart with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDateAndStart')
      await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined })
      expect(loadSpy).toHaveBeenCalledWith({ start: startAtDateTimeFake.toJSDate() })
    })

    it('Should throw if loadByDateAndStart throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined })
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if loadByDateAndStart returns null because date conflits', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce({
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
      const { sut, eventRepositoryStub, dateTimeStub } = makeSut()
      const dateAddOneDay = dateTimeStub.addDay(startAtDateTimeFake)
      const events = [{
        schedulerId: 'any_scheduler_id',
        start: dateTimeStub.toJSDate(startAtDateTimeFake),
        end: dateTimeStub.setTime({
          dateTime: startAtDateTimeFake,
          time: {
            hour: endAtDateTimeFake.hour,
            minute: endAtDateTimeFake.minute,
            second: endAtDateTimeFake.second
          }
        })
      },
      {
        schedulerId: 'any_scheduler_id',
        start: dateTimeStub.toJSDate(dateAddOneDay),
        end: dateTimeStub.setTime({
          dateTime: dateAddOneDay,
          time: {
            hour: endAtDateTimeFake.hour,
            minute: endAtDateTimeFake.minute,
            second: endAtDateTimeFake.second
          }
        })
      }
      ]
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      const addSpy = jest.spyOn(eventRepositoryStub, 'addMany')
      await sut.generate({ ...params, daysOfMonth: undefined, daysOfWeek: undefined })
      expect(addSpy).toHaveBeenCalledWith(events)
    })

    it('Should throw if addMany throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined })
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if addMany fails', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(false)
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined })
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
    })

    it('Should return true if generate daily events on success', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'addMany').mockResolvedValueOnce(true)
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined })
      expect(result).toEqual({ isSuccess: true })
    })
  })

  describe('Punctual', () => {
    it('Should call loadByDateAndStart with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDateAndStart')
      await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined, daily: false })
      expect(loadSpy).toHaveBeenCalledWith({ start: startAtDateTimeFake.toJSDate() })
    })

    it('Should throw if loadByDateAndStart throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined, daily: false })
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotAcceptableError if loadByDateAndStart returns null because date conflits', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce({
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
      const { sut, eventRepositoryStub, dateTimeStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      const addSpy = jest.spyOn(eventRepositoryStub, 'add')
      await sut.generate({ ...params, daysOfMonth: undefined, daysOfWeek: undefined, daily: false })
      expect(addSpy).toHaveBeenCalledWith({
        schedulerId: 'any_scheduler_id',
        start: dateTimeStub.toJSDate(startAtDateTimeFake),
        end: dateTimeStub.toJSDate(endAtDateTimeFake)
      })
    })

    it('Should throw if add throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'add').mockRejectedValue(() => { throw new Error() })
      const promise = sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined, daily: false })
      await expect(promise).rejects.toThrow()
    })

    it('Should return ServerError if add fails', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'add').mockResolvedValueOnce(undefined)
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined, daily: false })
      expect(result).toEqual({
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      })
    })

    it('Should return true if generate Punctual event on success', async () => {
      const { sut, eventRepositoryStub, dateTimeStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByDateAndStart').mockResolvedValueOnce(null)
      jest.spyOn(eventRepositoryStub, 'add').mockResolvedValue({
        id: 'any_id',
        schedulerId: 'any_scheduler_id',
        start: dateTimeStub.toJSDate(startAtDateTimeFake),
        end: dateTimeStub.toJSDate(endAtDateTimeFake)
      })
      const result = await sut.generate({ ...params, daysOfWeek: undefined, daysOfMonth: undefined, daily: false })
      expect(result).toEqual({
        isSuccess: true,
        data: {
          id: 'any_id',
          schedulerId: 'any_scheduler_id',
          start: dateTimeStub.toJSDate(startAtDateTimeFake),
          end: dateTimeStub.toJSDate(endAtDateTimeFake)
        }
      })
    })
  })
})
