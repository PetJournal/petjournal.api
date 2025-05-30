import { type EventsGenerator } from '@/data/protocols/service/events-generator'
import { type LoadEventByDateAndStartRepository, type AddEventRepository, type AddManyEventsRepository } from '@/data/protocols'
import { NotAcceptableError, ServerError } from '@/application/errors'

export class EventsGeneratorService implements EventsGenerator {
  private readonly eventRepository: AddEventRepository & LoadEventByDateAndStartRepository & AddManyEventsRepository

  constructor ({ eventRepository }: EventsGenerator.Dependencies) {
    this.eventRepository = eventRepository
  }

  async generate ({ schedulerId, startAt, endAt, daysOfWeek, daysOfMonth, daily }: EventsGenerator.Params): Promise<EventsGenerator.Result> {
    const [startAtDatePart] = startAt.toISOString().split('T')
    const [startAtTimePart] = startAt.toISOString().split('T')[1].split('.')
    const [endAtTimePart] = endAt.toISOString().split('T')[1].split('.')

    if (daysOfWeek) {
      const events = []
      const currentDate = new Date(startAt)
      while (currentDate <= endAt) {
        if (daysOfWeek.includes(currentDate.getDay())) {
          const event = await this.eventRepository.loadByDateAndStart({ start: currentDate })
          if (event) {
            return {
              isSuccess: false,
              error: new NotAcceptableError('Conflict start event'),
              data: event
            }
          }
          events.push({
            schedulerId,
            start: this.setTimeOnDate(currentDate, startAtTimePart),
            end: this.setTimeOnDate(currentDate, endAtTimePart),
            date: currentDate
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
      const currentDate = new Date(startAt)
      while (currentDate <= endAt) {
        if (daysOfMonth.includes(currentDate.getDate())) {
          const event = await this.eventRepository.loadByDateAndStart({ start: currentDate })
          if (event) {
            return {
              isSuccess: false,
              error: new NotAcceptableError('Conflict start event'),
              data: event
            }
          }
          events.push({
            schedulerId,
            start: this.setTimeOnDate(currentDate, startAtTimePart),
            end: this.setTimeOnDate(currentDate, endAtTimePart),
            date: currentDate
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
      const currentDate = new Date(startAt)
      while (currentDate <= endAt) {
        const event = await this.eventRepository.loadByDateAndStart({ start: currentDate })
        if (event) {
          return {
            isSuccess: false,
            error: new NotAcceptableError('Conflict start event'),
            data: event
          }
        }
        events.push({
          schedulerId,
          start: this.setTimeOnDate(currentDate, startAtTimePart),
          end: this.setTimeOnDate(currentDate, endAtTimePart),
          date: currentDate
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
    const event = await this.eventRepository.loadByDateAndStart({ start: startAt })
    if (event) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('Conflict start event'),
        data: event
      }
    }

    const eventAddResult = await this.eventRepository.add({
      schedulerId,
      start: this.setTimeOnDate(startAt, startAtTimePart),
      end: this.setTimeOnDate(endAt, endAtTimePart),
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

  private setTimeOnDate (date: Date, timePart: string): Date {
    const [hour, minutes, seconds] = timePart.split(':')
    const dateWithNewTime = new Date(date)
    dateWithNewTime.setUTCHours(Number(hour), Number(minutes), Number(seconds), 0)
    return dateWithNewTime
  }
}
