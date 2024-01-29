import { type Size } from '@/domain/models/size'

export interface LoadCatSizesRepository {
  loadCatSizes: () => Promise<LoadCatSizesRepository.Result>
}

export namespace LoadCatSizesRepository {
  export type Result = Size[] | undefined
}
