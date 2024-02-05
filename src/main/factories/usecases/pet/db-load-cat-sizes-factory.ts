import { DbLoadCatSizes } from '@/data/use-cases'
import { SizeRepository } from '@/infra/repos/postgresql/size-repository'

export const makeDbLoadCatSizes = (): DbLoadCatSizes => {
  const sizeRepository = new SizeRepository()
  const loadCatSizes = new DbLoadCatSizes({ sizeRepository })
  return loadCatSizes
}
