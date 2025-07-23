
import {
  type AddEventRepository,
  type LoadEventByDateRepository,
  type LoadTasksByIntervalRepository
} from '@/data/protocols'
import { prisma as db } from './prisma'
import { type AddManyEventsRepository } from '@/data/protocols/db/event/add-many-events-repository'

export class EventRepository implements AddEventRepository, AddManyEventsRepository, LoadEventByDateRepository, LoadTasksByIntervalRepository {
  async add (params: AddEventRepository.Params): Promise<AddEventRepository.Result> {
    try {
      const event = await db.event.create({
        data: {
          schedulerId: params.schedulerId,
          start: params.start,
          end: params.end
        }
      })
      return event
    } catch (error) {
      return undefined
    }
  }

  async loadByDate (params: LoadEventByDateRepository.Params): Promise<LoadEventByDateRepository.Result> {
    const event = await db.event.findFirst({
      where: {
        start: params.date
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

  async loadAllByInterval (params: LoadTasksByIntervalRepository.Params): Promise<LoadTasksByIntervalRepository.Result> {
    const events = await db.event.findMany({
      where: {
        start: {
          gte: params.start,
          lte: params.end
        },
        scheduler: params.tagId
          ? {
              tagId: params.tagId
            }
          : undefined
      },
      orderBy: {
        start: 'asc'
      },
      include: {
        scheduler: {
          include: {
            tag: {
              select: {
                name: true,
                color: true
              }
            },
            pets: {
              select: {
                id: true,
                image: true
              }
            }
          }
        }
      }
    })
    return events
  }
}
