import { LoadCurrentDateTasksController } from '@/application/controllers/tasks'
import { makeLoadCurrentDateTasks } from '@/main/factories/usecases/tasks'

export const makeLoadCurrentDateTasksController = (): LoadCurrentDateTasksController => {
  return new LoadCurrentDateTasksController({
    loadCurrentDateTasks: makeLoadCurrentDateTasks()
  })
}
