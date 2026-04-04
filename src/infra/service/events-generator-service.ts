import { type EventsGenerator } from '@/data/protocols/service/events-generator'
import { type LoadEventByDateRepository, type AddEventRepository, type AddManyEventsRepository } from '@/data/protocols'
import { NotAcceptableError, ServerError } from '@/application/errors'
export class EventsGeneratorService implements EventsGenerator {
  private readonly eventRepository: AddEventRepository & LoadEventByDateRepository & AddManyEventsRepository

  constructor ({ eventRepository }: EventsGenerator.Dependencies) {
    this.eventRepository = eventRepository
  }

  async generate ({ schedulerId, startAt, endAt, daysOfWeek, daysOfMonth, daily }: EventsGenerator.Params): Promise<EventsGenerator.Result> {
    const currentDate = new Date(startAt)
    const endAtDateTime = new Date(endAt)

    if (daysOfWeek) {
      const events = []
      while (currentDate <= endAtDateTime) {
        if (daysOfWeek.includes(currentDate.getDay())) {
          const event = await this.eventRepository.loadByDate({ schedulerId, date: currentDate })
          if (event) {
            return {
              isSuccess: false,
              error: new NotAcceptableError('Conflict start event'),
              data: event
            }
          }
          const start = new Date(currentDate)
          const end = new Date(currentDate)
          end.setHours(
            endAtDateTime.getHours(),
            endAtDateTime.getMinutes(),
            endAtDateTime.getSeconds()
          )
          events.push({
            schedulerId,
            start,
            end
          })
        }
        currentDate.setDate(currentDate.getDate() + 1)
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
      while (currentDate <= endAtDateTime) {
        if (daysOfMonth.includes(currentDate.getDate())) {
          const event = await this.eventRepository.loadByDate({ schedulerId, date: currentDate })
          if (event) {
            return {
              isSuccess: false,
              error: new NotAcceptableError('Conflict start event'),
              data: event
            }
          }
          const start = new Date(currentDate)
          const end = new Date(currentDate)
          end.setHours(
            endAtDateTime.getHours(),
            endAtDateTime.getMinutes(),
            endAtDateTime.getSeconds()
          )
          events.push({
            schedulerId,
            start,
            end
          })
        }
        currentDate.setDate(currentDate.getDate() + 1)
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
      while (currentDate <= endAtDateTime) {
        const event = await this.eventRepository.loadByDate({ schedulerId, date: currentDate })
        if (event) {
          return {
            isSuccess: false,
            error: new NotAcceptableError('Conflict start event'),
            data: event
          }
        }
        const start = new Date(currentDate)
        const end = new Date(currentDate)
        end.setHours(
          endAtDateTime.getHours(),
          endAtDateTime.getMinutes(),
          endAtDateTime.getSeconds()
        )
        events.push({
          schedulerId,
          start,
          end
        })
        currentDate.setDate(currentDate.getDate() + 1)
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

    const event = await this.eventRepository.loadByDate({ schedulerId, date: currentDate })
    if (event) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('Conflict start event'),
        data: event
      }
    }

    const eventAddResult = await this.eventRepository.add({
      schedulerId,
      start: currentDate,
      end: endAtDateTime
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
