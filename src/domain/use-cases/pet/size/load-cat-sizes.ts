import { type LoadCatSizesRepository } from '@/data/protocols/db/size/load-cat-sizes-repository'
import { type Size } from '@/domain/models/size'

export interface LoadCatSizes {
  load: () => Promise<LoadCatSizes.Result>
}

export namespace LoadCatSizes {
  export type Result = Size[] | undefined
  export type Dependencies = {
    sizeRepository: LoadCatSizesRepository
  }
}
