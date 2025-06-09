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

describe('Events Generator Service', () => {
  const params: EventsGenerator.Params = {
    schedulerId: 'any_scheduler_id',
    startAt: new Date('2025-06-01T10:30:00Z'),
    endAt: new Date('2025-07-01T11:30:00Z'),
    daysOfWeek: [0, 4, 6],
    daysOfMonth: [1, 15, 31],
    daily: true
  }

  const startAtDateTimeFake = DateTime.fromISO('2025-06-01T10:30:00Z', { zone: 'utc' })
  const endAtDateTimeFake = DateTime.fromISO('2025-06-01T11:30:00Z', { zone: 'utc' })

  describe('Days of Week', () => {
    it('Should calls loadByDateAndStart with the correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(eventRepositoryStub, 'loadByDateAndStart')
      await sut.generate({ ...params, daysOfMonth: undefined, daily: false })
      expect(loadSpy).toHaveBeenCalledWith({ start: startAtDateTimeFake.toJSDate() })
    })
  })
})
