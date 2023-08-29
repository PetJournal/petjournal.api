import { DbAppointOtherSpecie } from '@/data/use-cases'
import { type AppointOtherSpecie } from '@/domain/use-cases'
import { SpecieRepository } from '@/infra/repos/postgresql'

export const makeDbAppointOtherSpecie = (): AppointOtherSpecie => {
  const specieRepository = new SpecieRepository()
  const appointOtherSpecie = new DbAppointOtherSpecie({
    specieRepository
  })
  return appointOtherSpecie
}
