import { type Breed } from '@/domain/models/breed'

export interface LoadCatBreedsRepository {
  loadCatBreeds: () => Promise<LoadCatBreedsRepository.Result>
}

export namespace LoadCatBreedsRepository {
  export type Result = Breed[] | undefined
}
