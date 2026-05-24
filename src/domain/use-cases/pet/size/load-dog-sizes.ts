import { type LoadDogSizesRepository } from '@/data/protocols/db/size/load-dog-sizes-repository'
import { type Size } from '@/domain/models/size'

export interface LoadDogSizes {
  load: () => Promise<LoadDogSizes.Result>
}

export namespace LoadDogSizes {
  export type Result = Size[] | undefined
  export type Dependencies = {
    sizeRepository: LoadDogSizesRepository
  }
}
