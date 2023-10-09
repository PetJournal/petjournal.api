import { DbAppointSpecie } from '@/data/use-cases'
import { type AppointSpecie } from '@/domain/use-cases'
import { SpecieRepository } from '@/infra/repos/postgresql'

export const makeDbAppointSpecie = (): AppointSpecie => {
  const specieRepository = new SpecieRepository()
  const appointOtherSpecie = new DbAppointSpecie({
    specieRepository
  })
  return appointOtherSpecie
}
