import { type Breed } from '@/domain/models/breed'

export interface LoadDogBreedsRepository {
  loadDogBreed: () => Promise<LoadDogBreedsRepository.Result>
}

export namespace LoadDogBreedsRepository {
  export type Result = Breed[]
}
