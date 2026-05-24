import { type LoadBreedByNameRepository } from '@/data/protocols/db/breed/load-breed-by-name-repository'
import { type Breed } from '@/domain/models/breed'

export interface AppointBreed {
  appoint: (breedName: AppointBreed.Params) => Promise<AppointBreed.Result>
}

export namespace AppointBreed {
  export type Params = string

  export interface Result {
    breed: Breed & { id: string }
    breedAlias: string
  }

  export interface Dependencies {
    breedRepository: LoadBreedByNameRepository
  }
}
