import { LoadPetByIdController } from '@/application/controllers'
import { makeDbLoadPetById } from '../../usecases'

export const makeLoadPetByIdController = (): LoadPetByIdController => {
  const loadPet = makeDbLoadPetById()
  const dependencies: LoadPetByIdController.Dependencies = {
    loadPet
  }
  const loadPetByIdController = new LoadPetByIdController(dependencies)
  return loadPetByIdController
}
