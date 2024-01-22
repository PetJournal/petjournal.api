import { type Breed } from '@/domain/models/breed'

export interface LoadDogBreedsRepository {
  loadDogBreeds: () => Promise<LoadDogBreedsRepository.Result>
}

export namespace LoadDogBreedsRepository {
  export type Result = Breed[] | undefined
}
