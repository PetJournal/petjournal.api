import { DbDeleteScheduler } from '@/data/use-cases'
import { type DeleteScheduler } from '@/domain/use-cases'
import { EventRepository, GuardianAccountRepository } from '@/infra/repos/postgresql'
import { SchedulerRepository } from '@/infra/repos/postgresql/scheduler-repository'

export const makeDbDeleteScheduler = (): DeleteScheduler => {
  const schedulerRepository = new SchedulerRepository()
  const guardianRepository = new GuardianAccountRepository()
  const eventRepository = new EventRepository()
  const dependencies: DeleteScheduler.Dependencies = {
    eventRepository,
    guardianRepository,
    schedulerRepository
  }
  const deleteScheduler = new DbDeleteScheduler(dependencies)
  return deleteScheduler
}
