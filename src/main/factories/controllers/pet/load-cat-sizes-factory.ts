import { type Controller } from '@/application/protocols'
import { makeDbLoadCatSizes } from '@/main/factories/usecases'
import { LoadCatSizesController } from '@/application/controllers/pets/sizes/load-cat'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'

export const makeLoadCatSizesController = (): Controller => {
  const loadCatSizes = makeDbLoadCatSizes()
  const loadCatSizesController = new LoadCatSizesController(loadCatSizes)
  const loggerPgRepository = new LoggerPgRepository()
  return new LoggerControllerDecorator(loadCatSizesController, loggerPgRepository)
}
