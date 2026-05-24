import { DbLoadCurrentDateTasks } from '@/data/use-cases/tasks'
import { EventRepository } from '@/infra/repos/postgresql'

export const makeLoadCurrentDateTasks = (): DbLoadCurrentDateTasks => {
  const eventRepository = new EventRepository()
  return new DbLoadCurrentDateTasks(eventRepository)
}
