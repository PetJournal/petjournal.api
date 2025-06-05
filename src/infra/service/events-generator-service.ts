import { type EventsGenerator } from '@/data/protocols/service/events-generator'
import { type LoadEventByDateAndStartRepository, type AddEventRepository, type AddManyEventsRepository } from '@/data/protocols'
import { NotAcceptableError, ServerError } from '@/application/errors'
import { type DateToJSDate, type DateGeneratorUtc, type DateSetTime, type DateAddDay } from '@/data/protocols/service'
export class EventsGeneratorService implements EventsGenerator {
  private readonly eventRepository: AddEventRepository & LoadEventByDateAndStartRepository & AddManyEventsRepository
  private readonly dateTime: DateGeneratorUtc & DateToJSDate & DateSetTime & DateAddDay

  constructor ({ eventRepository, dateTime }: EventsGenerator.Dependencies) {
    this.eventRepository = eventRepository
    this.dateTime = dateTime
  }

  async generate ({ schedulerId, startAt, endAt, daysOfWeek, daysOfMonth, daily }: EventsGenerator.Params): Promise<EventsGenerator.Result> {
    let startAtDateTime = this.dateTime.generate(startAt)
    const endAtDateTime = this.dateTime.generate(endAt)

    if (daysOfWeek) {
      const events = []
      while (startAtDateTime <= endAtDateTime) {
        if (daysOfWeek.includes(this.dateTime.toJSDate(startAtDateTime).getDay())) {
          const event = await this.eventRepository.loadByDateAndStart({ start: this.dateTime.toJSDate(startAtDateTime) })
          if (event) {
            return {
              isSuccess: false,
              error: new NotAcceptableError('Conflict start event'),
              data: event
            }
          }
          events.push({
            schedulerId,
            start: this.dateTime.toJSDate(startAtDateTime),
            end: this.dateTime.setTime({
              dateTime: startAtDateTime,
              time: {
                hour: endAtDateTime.hour,
                minute: endAtDateTime.minute,
                second: endAtDateTime.second
              }
            }),
            date: this.dateTime.toJSDate(startAtDateTime)
          })
        }
        startAtDateTime = this.dateTime.addDay(startAtDateTime)
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
      while (startAtDateTime <= endAtDateTime) {
        if (daysOfMonth.includes(this.dateTime.toJSDate(startAtDateTime).getDate())) {
          const event = await this.eventRepository.loadByDateAndStart({ start: this.dateTime.toJSDate(startAtDateTime) })
          if (event) {
            return {
              isSuccess: false,
              error: new NotAcceptableError('Conflict start event'),
              data: event
            }
          }
          events.push({
            schedulerId,
            start: this.dateTime.toJSDate(startAtDateTime),
            end: this.dateTime.setTime({
              dateTime: startAtDateTime,
              time: {
                hour: endAtDateTime.hour,
                minute: endAtDateTime.minute,
                second: endAtDateTime.second
              }
            }),
            date: this.dateTime.toJSDate(startAtDateTime)
          })
        }
        startAtDateTime = this.dateTime.addDay(startAtDateTime)
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
      while (startAtDateTime <= endAtDateTime) {
        const event = await this.eventRepository.loadByDateAndStart({ start: this.dateTime.toJSDate(startAtDateTime) })
        if (event) {
          return {
            isSuccess: false,
            error: new NotAcceptableError('Conflict start event'),
            data: event
          }
        }
        events.push({
          schedulerId,
          start: this.dateTime.toJSDate(startAtDateTime),
          end: this.dateTime.setTime({
            dateTime: startAtDateTime,
            time: {
              hour: endAtDateTime.hour,
              minute: endAtDateTime.minute,
              second: endAtDateTime.second
            }
          }),
          date: this.dateTime.toJSDate(startAtDateTime)
        })
        startAtDateTime = this.dateTime.addDay(startAtDateTime)
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

    const event = await this.eventRepository.loadByDateAndStart({ start: this.dateTime.toJSDate(startAtDateTime) })
    if (event) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('Conflict start event'),
        data: event
      }
    }

    const eventAddResult = await this.eventRepository.add({
      schedulerId,
      start: this.dateTime.toJSDate(startAtDateTime),
      end: this.dateTime.toJSDate(endAtDateTime),
      date: this.dateTime.toJSDate(startAtDateTime)
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
