import { type Controller } from '@/application/protocols'
import { makeDbLoadDogBreeds } from '../../usecases'
import { LoadDogBreedsController } from '@/application/controllers/pets/breeds'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'

export const makeLoadDogBreedsController = (): Controller => {
  const loadDogBreeds = makeDbLoadDogBreeds()
  const dependencies: LoadDogBreedsController.Dependencies = {
    loadDogBreeds
  }
  const loadDogBreedsController = new LoadDogBreedsController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  return new LoggerControllerDecorator(loadDogBreedsController, loggerPgRepository)
}
