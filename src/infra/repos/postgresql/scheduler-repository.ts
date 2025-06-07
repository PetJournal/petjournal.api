import { prisma as db } from './prisma'
import { type AddSchedulerRepository, type DeleteSchedulerByIdRepository } from '@/data/protocols'

export class SchedulerRepository implements AddSchedulerRepository, DeleteSchedulerByIdRepository {
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

  async delete (param: DeleteSchedulerByIdRepository.Param): Promise<DeleteSchedulerByIdRepository.Result> {
    const scheduler = await db.scheduler.delete({
      where: {
        id: param
      }
    })

    if (!scheduler) {
      return false
    }
    return true
  }
}
