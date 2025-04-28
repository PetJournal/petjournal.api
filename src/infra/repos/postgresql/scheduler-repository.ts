import { type AddSchedulerRepository } from '@/data/protocols/db/scheduler/add-scheduler-repository'
import { prisma as db } from './prisma'

export class SchedulerRepository implements AddSchedulerRepository {
  async add (params: AddSchedulerRepository.Params): Promise<AddSchedulerRepository.Result> {
    const connectPets = params.pets.map(petId => ({ id: petId }))
    try {
      const scheduler = await db.scheduler.create({
        data: {
          tagId: params.tagId,
          title: params.title,
          description: params.description,
          note: params.note,
          startAt: params.startAt,
          endAt: params.endAt,
          daysOfWeek: params.daysOfWeek,
          daysOfMonth: params.daysOfMonth,
          daily: params.daily,
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
}
