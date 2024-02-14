import { type Controller } from '@/application/protocols'
import { makeDbLoadDogBreeds } from '@/main/factories/usecases'
import { LoadDogBreedsController } from '@/application/controllers/pets/breeds'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'

export const makeLoadDogBreedsController = (): Controller => {
  const loadDogBreeds = makeDbLoadDogBreeds()
  const loadDogBreedsController = new LoadDogBreedsController(loadDogBreeds)
  const loggerPgRepository = new LoggerPgRepository()
  return new LoggerControllerDecorator(loadDogBreedsController, loggerPgRepository)
}
