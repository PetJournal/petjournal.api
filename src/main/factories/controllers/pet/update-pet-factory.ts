import { UpdatePetController } from '@/application/controllers'
import { makeDbUpdatePet } from '../../usecases'
import { makePetUpdateValidation } from '../../validations'

export const makeUpdatePetController = (): UpdatePetController => {
  const updatePet = makeDbUpdatePet()
  const validation = makePetUpdateValidation()
  const dependencies: UpdatePetController.Dependencies = {
    updatePet,
    validation
  }
  const updatePetController = new UpdatePetController(dependencies)
  return updatePetController
}
