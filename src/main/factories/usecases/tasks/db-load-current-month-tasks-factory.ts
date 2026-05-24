import { DbLoadCurrentMonthTasks } from '@/data/use-cases/tasks'
import { EventRepository } from '@/infra/repos/postgresql'

export const makeLoadCurrentMonthTasks = (): DbLoadCurrentMonthTasks => {
  const eventRepository = new EventRepository()
  return new DbLoadCurrentMonthTasks(eventRepository)
}
