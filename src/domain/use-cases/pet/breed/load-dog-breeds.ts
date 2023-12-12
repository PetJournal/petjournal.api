import { type LoadDogBreedsRepository } from '@/data/protocols/db/breed'
import { type Breed } from '@/domain/models/breed'

export interface LoadDogBreeds {
  load: () => Promise<LoadDogBreeds.Result>
}

export namespace LoadDogBreeds {
  export type Result = Breed[]
  export type Dependencies = {
    breedRepository: LoadDogBreedsRepository
  }
}
