import { type Size } from '@/domain/models/size'

export interface LoadDogSizesRepository {
  loadDogSizes: () => Promise<LoadDogSizesRepository.Result>
}

export namespace LoadDogSizesRepository {
  export type Result = Size[]
}
