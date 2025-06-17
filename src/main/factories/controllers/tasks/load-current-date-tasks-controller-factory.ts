import { LoadCurrentDateTasksController } from '@/application/controllers/tasks'
import { makeLoadCurrentDateTasks } from '@/main/factories/usecases/tasks'
import { makeCurrentDateTasksValidation } from '@/main/factories/validations/tasks'

export const makeLoadCurrentDateTasksController = (): LoadCurrentDateTasksController => {
  return new LoadCurrentDateTasksController({
    loadCurrentDateTasks: makeLoadCurrentDateTasks(),
    validation: makeCurrentDateTasksValidation()
  })
}
