import { DbLoadCurrentWeekTasks } from '@/data/use-cases/tasks'
import { EventRepository } from '@/infra/repos/postgresql'

export const makeLoadCurrentWeekTasks = (): DbLoadCurrentWeekTasks => {
  const eventRepository = new EventRepository()
  return new DbLoadCurrentWeekTasks(eventRepository)
}
