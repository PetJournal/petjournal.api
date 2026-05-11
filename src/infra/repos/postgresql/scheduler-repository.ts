import { prisma as db } from './prisma'
import { type LoadSchedulerByIdRepository, type AddSchedulerRepository, type DeleteSchedulerByIdRepository } from '@/data/protocols'

export class SchedulerRepository implements AddSchedulerRepository, DeleteSchedulerByIdRepository, LoadSchedulerByIdRepository {
  async add (params: AddSchedulerRepository.Params): Promise<AddSchedulerRepository.Result> {
    const connectPets = params.pets.map(petId => ({ id: petId }))
    try {
      const scheduler = await db.scheduler.create({
        data: {
          tagId: params.tagId,
          guardianId: params.guardianId,
          title: params.title,
          description: params.description,
          note: params.note,
          startAt: params.startAt,
          endAt: params.endAt,
          daysOfWeek: params.daysOfWeek !== undefined ? params.daysOfWeek : [],
          daysOfMonth: params.daysOfMonth !== undefined ? params.daysOfMonth : [],
          daily: params.daily !== undefined ? params.daily : false,
          pets: {
            connect: connectPets
          }
        },
        include: {
          pets: true
        }
      })
      return scheduler
    } catch (error) {
      return undefined
    }
  }

  async delete (params: DeleteSchedulerByIdRepository.Params): Promise<DeleteSchedulerByIdRepository.Result> {
    const scheduler = await db.scheduler.delete({
      where: {
        id: params.schedulerId,
        guardianId: params.guardianId
      }
    })

    if (!scheduler) {
      return false
    }
    return true
  }

  async load (params: LoadSchedulerByIdRepository.Params): Promise<LoadSchedulerByIdRepository.Result> {
    const { guardianId, schedulerId } = params
    const scheduler = await db.scheduler.findFirst({
      where: {
        id: schedulerId,
        guardianId
      },
      select: {
        id: true,
        tagId: true,
        guardianId: true,
        title: true,
        description: true,
        note: true,
        startAt: true,
        endAt: true,
        daysOfWeek: true,
        daysOfMonth: true,
        daily: true,
        pets: {
          select: {
            id: true,
            petName: true,
            image: true
          }
        }
      }
    })
    return scheduler
  }
}
