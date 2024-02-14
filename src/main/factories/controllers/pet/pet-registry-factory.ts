import { PetRegistryController } from '@/application/controllers'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { DevLoggerControllerDecorator, LoggerControllerDecorator } from '@/main/decorators'
import { makeDbAddPet } from '../../usecases/pet/db-add-pet-factory'
import { makePetRegistryValidation } from '../../validations/pet/pet-registry-validation-factory'

export const makePetRegistryController = (): Controller => {
  const addPet = makeDbAddPet()
  const validation = makePetRegistryValidation()
  const dependencies: PetRegistryController.Dependencies = {
    addPet,
    validation
  }
  const petRegistryController = new PetRegistryController(dependencies)
  const loggerPgRepository = new LoggerPgRepository()
  const loggerControllerDecorator = new LoggerControllerDecorator(petRegistryController, loggerPgRepository)
  return new DevLoggerControllerDecorator(loggerControllerDecorator)
}
