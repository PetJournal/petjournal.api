import { type AddEventRepository, type LoadEventByDateAndStartRepository } from '@/data/protocols'
import { prisma as db } from './prisma'
import { type AddManyEventsRepository } from '@/data/protocols/db/event/add-many-events-repository'

export class EventRepository implements AddEventRepository, LoadEventByDateAndStartRepository, AddManyEventsRepository {
  async add (params: AddEventRepository.Params): Promise<AddEventRepository.Result> {
    try {
      const event = await db.event.create({
        data: {
          schedulerId: params.schedulerId,
          start: params.start,
          end: params.end,
          date: params.date
        }
      })
      return event
    } catch (error) {
      return undefined
    }
  }

  async loadByDateAndStart (params: LoadEventByDateAndStartRepository.Params): Promise<LoadEventByDateAndStartRepository.Result> {
    const event = await db.event.findFirst({
      where: {
        start: params.start
      }
    })
    return event
  }

  async addMany (params: AddManyEventsRepository.Params): Promise<AddManyEventsRepository.Result> {
    try {
      await db.event.createMany({
        data: params,
        skipDuplicates: true
      })
      return true
    } catch (error) {
      return false
    }
  }
}
