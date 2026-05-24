import { LoadPetsController } from '@/application/controllers/pets'
import { makeDbLoadPetByGuardianId } from '@/main/factories/usecases'

export const makeLoadPetsController = (): LoadPetsController => {
  const loadPets = makeDbLoadPetByGuardianId()
  const dependencies: LoadPetsController.Dependencies = {
    loadPets
  }
  return new LoadPetsController(dependencies)
}
