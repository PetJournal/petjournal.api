import { type Breed, type Guardian, type Size, type Specie } from '@/domain/models'

interface Pet {
  id: string
  guardian: GuardianResultDb
  specie: SpecieResultDb
  specieAlias?: string | null
  petName: string
  gender: string
  breed: BreedResultDb
  breedAlias: string
  size: SizeResultDb
  castrated: boolean
  dateOfBirth: Date

}

   type GuardianResultDb = Pick<Guardian, 'firstName' | 'lastName' | 'email' | 'phone'> & {
     id: string
   }

   type SpecieResultDb = Specie & {
     id: string
   }

   type BreedResultDb = Breed & {
     id: string
   }

   type SizeResultDb = Size & {
     id: string
   }

export {
  type Pet
}
