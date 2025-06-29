import { LoadCurrentMonthTasksController } from '@/application/controllers/tasks'
import { makeLoadCurrentMonthTasks } from '@/main/factories/usecases/tasks'

export const makeLoadCurrentMonthTasksController = (): LoadCurrentMonthTasksController => {
  return new LoadCurrentMonthTasksController({
    loadCurrentMonthTasks: makeLoadCurrentMonthTasks()
  })
}
