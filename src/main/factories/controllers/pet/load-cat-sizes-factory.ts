import { type Controller } from '@/application/protocols'
import { makeDbLoadCatSizes } from '../../usecases'
import { LoadCatSizesController } from '@/application/controllers/pets/sizes/load-cat'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'

export const makeLoadCatSizesController = (): Controller => {
  const loadCatSizes = makeDbLoadCatSizes()
  const dependencies: LoadCatSizesController.Dependencies = {
    loadCatSizes
  }
  const loadCatSizesController = new LoadCatSizesController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  return new LoggerControllerDecorator(loadCatSizesController, loggerPgRepository)
}
