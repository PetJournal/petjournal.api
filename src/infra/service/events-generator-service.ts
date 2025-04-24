import { type EventsGenerator } from '@/data/protocols/service/events-generator'

export class EventsGeneratorService implements EventsGenerator {
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
          const event = {
            schedulerId,
            start: startAtTimePart,
            end: endAtTimePart,
            date: currentDate
          }
          events.push(event)
        }
      }
      return events
    }

    if (daysOfMonth) {
      const events = []
      const currentDate = new Date()
      for (let i = 0; currentDate.getDate() <= endAt.getDate(); i++) {
        currentDate.setDate(currentDate.getDate() + i)
        if (daysOfMonth.includes(currentDate.getDate())) {
          const event = {
            schedulerId,
            start: startAtTimePart,
            end: endAtTimePart,
            date: currentDate
          }
          events.push(event)
        }
      }
      return events
    }

    if (daily) {
      const events = []
      const currentDate = new Date()
      for (let i = 0; currentDate.getDate() <= endAt.getDate(); i++) {
        currentDate.setDate(currentDate.getDate() + i)
        const event = {
          schedulerId,
          start: startAtTimePart,
          end: endAtTimePart,
          date: currentDate
        }
        events.push(event)
      }
      return events
    }

    return [{
      schedulerId,
      start: startAtTimePart,
      end: endAtTimePart,
      date: new Date(startAtDatePart)
    }]
  }
}
