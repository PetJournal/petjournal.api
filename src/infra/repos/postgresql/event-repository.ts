import { type AddEventRepository } from '@/data/protocols'
import { prisma as db } from './prisma'

export class EventRepository implements AddEventRepository {
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
}
