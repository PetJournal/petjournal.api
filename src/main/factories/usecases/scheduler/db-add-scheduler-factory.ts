import { DbAddScheduler } from '@/data/use-cases/scheduler/db-add-scheduler'
import { type AddScheduler } from '@/domain/use-cases'
import { EventRepository, PetRepository, TagRepository } from '@/infra/repos/postgresql'
import { SchedulerRepository } from '@/infra/repos/postgresql/scheduler-repository'
import { EventsGeneratorService } from '@/infra/service'

export const makeDbAddScheduler = (): AddScheduler => {
  const tagRepository = new TagRepository()
  const petRepository = new PetRepository()
  const schedulerRepository = new SchedulerRepository()
  const eventRepository = new EventRepository()
  const eventGenerator = new EventsGeneratorService({ eventRepository })
  const dependencies: AddScheduler.Dependencies = {
    tagRepository,
    eventGenerator,
    petRepository,
    schedulerRepository
  }
  const addScheduler = new DbAddScheduler(dependencies)
  return addScheduler
}
