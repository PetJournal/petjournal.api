import { type EventsGenerator } from '@/data/protocols/service/events-generator'
import { type LoadEventByDateAndStartRepository, type AddEventRepository, type AddManyEventsRepository } from '@/data/protocols'
import { NotAcceptableError, ServerError } from '@/application/errors'

export class EventsGeneratorService implements EventsGenerator {
  private readonly eventRepository: AddEventRepository & LoadEventByDateAndStartRepository & AddManyEventsRepository

  constructor ({ eventRepository }: EventsGenerator.Dependencies) {
    this.eventRepository = eventRepository
  }

  async generate ({ schedulerId, startAt, endAt, daysOfWeek, daysOfMonth, daily }: EventsGenerator.Params): Promise<EventsGenerator.Result> {
    const startAtDatePart = startAt.toISOString().split('T')[0]
    const startAtTimePart = startAt.toISOString().split('T')[1].split('.')[0]
    const endAtTimePart = endAt.toISOString().split('T')[1].split('.')[0]

    if (daysOfWeek) {
      const events = []
      const currentDate = new Date()
      for (let i = 0; currentDate.getDate() <= endAt.getDate(); i++) {
        currentDate.setDate(currentDate.getDate() + i)
        if (daysOfWeek.includes(currentDate.getDay())) {
          const event = await this.eventRepository.loadByDateAndStart({ date: currentDate, start: startAtTimePart })
          if (event) {
            return {
              isSuccess: false,
              error: new NotAcceptableError('Conflict start event'),
              data: event
            }
          }
          events.push({
            schedulerId,
            start: new Date(startAtTimePart),
            end: new Date(endAtTimePart),
            date: currentDate
          })
        }
      }

      const eventsAddManyResult = await this.eventRepository.addMany(events)
      if (!eventsAddManyResult) {
        return {
          isSuccess: false,
          error: new ServerError('Internal Server Error!')
        }
      }

      return {
        isSuccess: true
      }
    }

    if (daysOfMonth) {
      const events = []
      const currentDate = new Date()
      for (let i = 0; currentDate.getDate() <= endAt.getDate(); i++) {
        currentDate.setDate(currentDate.getDate() + i)
        if (daysOfMonth.includes(currentDate.getDate())) {
          const event = await this.eventRepository.loadByDateAndStart({ date: currentDate, start: startAtTimePart })
          if (event) {
            return {
              isSuccess: false,
              error: new NotAcceptableError('Conflict start event'),
              data: event
            }
          }
          events.push({
            schedulerId,
            start: new Date(startAtTimePart),
            end: new Date(endAtTimePart),
            date: currentDate
          })
        }
      }

      const eventsAddManyResult = await this.eventRepository.addMany(events)
      if (!eventsAddManyResult) {
        return {
          isSuccess: false,
          error: new ServerError('Internal Server Error!')
        }
      }

      return {
        isSuccess: true
      }
    }

    if (daily) {
      const events = []
      const currentDate = new Date()
      for (let i = 0; currentDate.getDate() <= endAt.getDate(); i++) {
        currentDate.setDate(currentDate.getDate() + i)
        const event = await this.eventRepository.loadByDateAndStart({ date: currentDate, start: startAtTimePart })
        if (event) {
          return {
            isSuccess: false,
            error: new NotAcceptableError('Conflict start event'),
            data: event
          }
        }
        events.push({
          schedulerId,
          start: new Date(startAtTimePart),
          end: new Date(endAtTimePart),
          date: currentDate
        })
      }

      const eventsAddManyResult = await this.eventRepository.addMany(events)
      if (!eventsAddManyResult) {
        return {
          isSuccess: false,
          error: new ServerError('Internal Server Error!')
        }
      }

      return {
        isSuccess: true
      }
    }
    const event = await this.eventRepository.loadByDateAndStart({ date: new Date(startAtDatePart), start: startAtTimePart })
    if (event) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('Conflict start event'),
        data: event
      }
    }

    const eventAddResult = await this.eventRepository.add({
      schedulerId,
      start: new Date(startAtTimePart),
      end: new Date(endAtTimePart),
      date: new Date(startAtDatePart)
    })

    if (!eventAddResult) {
      return {
        isSuccess: false,
        error: new ServerError('Internal Server Error!')
      }
    }

    return {
      isSuccess: true,
      data: eventAddResult
    }
  }
}
