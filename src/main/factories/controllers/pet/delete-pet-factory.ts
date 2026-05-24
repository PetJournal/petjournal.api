import { PetDeleteController } from '@/application/controllers'
import { makeDbDeletePet } from '../../usecases'

export const makePetDeleteController = (): PetDeleteController => {
  const petDelete = makeDbDeletePet()
  const dependencies: PetDeleteController.Dependencies = {
    petDelete
  }
  const petDeleteController = new PetDeleteController(dependencies)
  return petDeleteController
}
