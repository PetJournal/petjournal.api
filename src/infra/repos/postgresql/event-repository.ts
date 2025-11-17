
import {
  type AddEventRepository,
  type LoadEventByDateRepository,
  type LoadTasksByIntervalRepository
} from '@/data/protocols'
import { prisma as db } from './prisma'
import { type AddManyEventsRepository } from '@/data/protocols/db/event/add-many-events-repository'
import { type LoadTasksByPetIdRepository } from '@/data/protocols/db/task/load-task-by-petId-repository'

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
    const { start, end, tagId, page = 1, limit = 10 } = params

    const offset = (page - 1) * limit
    const events = await db.event.findMany({
      where: {
        start: { gte: start, lte: end },
        scheduler: tagId ? { tagId } : undefined
      },
      orderBy: { start: 'asc' },
      skip: offset,
      take: limit,
      include: {
        scheduler: {
          include: {
            tag: { select: { name: true, color: true } },
            pets: { select: { id: true, image: true } }
          }
        }
      }
    })

    return events
  }

  async loadByPetId (params: LoadTasksByPetIdRepository.Params): Promise<LoadTasksByPetIdRepository.Result> {
    const { petId, page = 1, limit = 10 } = params
    const offset = (page - 1) * limit

    const [total, events] = await Promise.all([
      db.event.count({
        where: {
          scheduler: { pets: { some: { id: petId } } }
        }
      }),
      db.event.findMany({
        where: {
          scheduler: { pets: { some: { id: petId } } }
        },
        orderBy: { start: 'asc' },
        skip: offset,
        take: limit,
        include: {
          scheduler: {
            include: {
              tag: { select: { name: true, color: true } },
              pets: { select: { id: true, image: true } }
            }
          }
        }
      })
    ])

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: events
    }
  }
}
