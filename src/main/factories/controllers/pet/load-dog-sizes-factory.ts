import { type Controller } from '@/application/protocols'
import { makeDbLoadDogSizes } from '@/main/factories/usecases'
import { LoadDogSizesController } from '@/application/controllers/pets/sizes/load-dog'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'

export const makeLoadDogSizesController = (): Controller => {
  const loadDogSizes = makeDbLoadDogSizes()
  const dependencies: LoadDogSizesController.Dependencies = {
    loadDogSizes
  }
  const loadDogSizesController = new LoadDogSizesController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  return new LoggerControllerDecorator(loadDogSizesController, loggerPgRepository)
}
