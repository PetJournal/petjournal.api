import { type Controller } from '@/application/protocols'
import { makeDbLoadCatBreeds } from '@/main/factories/usecases'
import { LoadCatBreedsController } from '@/application/controllers/pets/breeds'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'

export const makeLoadCatBreedsController = (): Controller => {
  const loadCatBreeds = makeDbLoadCatBreeds()
  const loadCatBreedsController = new LoadCatBreedsController(loadCatBreeds)
  const loggerPgRepository = new LoggerPgRepository()
  return new LoggerControllerDecorator(loadCatBreedsController, loggerPgRepository)
}
