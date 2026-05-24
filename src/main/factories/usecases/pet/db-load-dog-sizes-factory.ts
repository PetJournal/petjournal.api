import { DbLoadDogSizes } from '@/data/use-cases'
import { SizeRepository } from '@/infra/repos/postgresql/size-repository'

export const makeDbLoadDogSizes = (): DbLoadDogSizes => {
  const sizeRepository = new SizeRepository()
  const loadDogSizes = new DbLoadDogSizes({ sizeRepository })
  return loadDogSizes
}
