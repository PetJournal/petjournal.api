
import {
  type AddEventRepository,
  type LoadEventByDateRepository,
  type LoadTasksByIntervalRepository,
  type AddManyEventsRepository,
  type LoadPreviousTasksByPetIdRepository,
  type LoadNextTasksByPetIdRepository,
  type LoadNextTasksByPetIdAndTagIdRepository
} from '@/data/protocols'
import { prisma as db } from './prisma'

export class EventRepository implements AddEventRepository, AddManyEventsRepository, LoadEventByDateRepository, LoadTasksByIntervalRepository, LoadNextTasksByPetIdRepository, LoadPreviousTasksByPetIdRepository, LoadNextTasksByPetIdAndTagIdRepository {
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

  async loadByPetIdAndTagId (params: LoadNextTasksByPetIdAndTagIdRepository.Params): Promise<LoadNextTasksByPetIdAndTagIdRepository.Result> {
    const { petId, tagId, page = 1, limit = 10 } = params
    const offset = (page - 1) * limit

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [total, events] = await Promise.all([
      db.event.count({
        where: {
          scheduler: {
            pets: { some: { id: petId } },
            tagId
          },
          start: { gte: today }
        }
      }),

      db.event.findMany({
        where: {
          scheduler: {
            pets: { some: { id: petId } },
            tagId
          },
          start: { gte: today }
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
      totalPages: Math.ceil(total / limit),
      events
    }
  }

  async loadNextByPetId (
    params: LoadNextTasksByPetIdRepository.Params
  ): Promise<LoadNextTasksByPetIdRepository.Result> {
    const { petId, page = 1, limit = 10 } = params
    const offset = (page - 1) * limit

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [total, nextEvents] = await Promise.all([
      db.event.count({
        where: {
          scheduler: { pets: { some: { id: petId } } },
          start: { lt: today }
        }
      }),

      db.event.findMany({
        where: {
          scheduler: { pets: { some: { id: petId } } },
          start: { lt: today }
        },
        orderBy: { start: 'desc' },
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
      nextEvents,
      totalPages: Math.ceil(total / limit)
    }
  }

  async loadPreviousByPetId (
    params: LoadPreviousTasksByPetIdRepository.Params
  ): Promise<LoadPreviousTasksByPetIdRepository.Result> {
    const { petId, page = 1, limit = 10 } = params
    const offset = (page - 1) * limit

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [total, history] = await Promise.all([
      db.event.count({
        where: {
          scheduler: { pets: { some: { id: petId } } },
          start: { gte: today }
        }
      }),

      db.event.findMany({
        where: {
          scheduler: { pets: { some: { id: petId } } },
          start: { gte: today }
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
      history,
      totalPages: Math.ceil(total / limit)
    }
  }
}
