import { DbAppointPet } from '@/data/use-cases/pet/db-appoint-pet'
import { type AppointPet } from '@/domain/use-cases'
import { BreedRepository, SpecieRepository } from '@/infra/repos/postgresql'
import { SizeRepository } from '@/infra/repos/postgresql/size-repository'

export const makeDbAppointPet = (): AppointPet => {
  const breedRepository = new BreedRepository()
  const sizeRepository = new SizeRepository()
  const specieRepository = new SpecieRepository()
  const dbAppointPet = new DbAppointPet({
    breedRepository,
    sizeRepository,
    specieRepository
  })
  return dbAppointPet
}
