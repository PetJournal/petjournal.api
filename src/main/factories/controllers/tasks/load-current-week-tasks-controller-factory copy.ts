import { LoadCurrentWeekTasksController } from '@/application/controllers/tasks'
import { makeLoadCurrentWeekTasks } from '@/main/factories/usecases/tasks'

export const makeLoadCurrentWeekTasksController = (): LoadCurrentWeekTasksController => {
  return new LoadCurrentWeekTasksController({
    loadCurrentDateTasks: makeLoadCurrentWeekTasks()
  })
}
