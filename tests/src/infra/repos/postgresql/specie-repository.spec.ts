import { type LoadSpecieByNameRepository } from '@/data/protocols'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

beforeEach(async () => { await PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

class SpecieRepository implements LoadSpecieByNameRepository {
  async loadByName (name: LoadSpecieByNameRepository.Params): Promise<LoadSpecieByNameRepository.Result> {
    return undefined
  }
}

const makeSut = (): SpecieRepository => {
  return new SpecieRepository()
}

describe('SpecieRepository', () => {
  it('Should not return an specie if invalid name is provided', async () => {
    const sut = makeSut()
    const name = 'invalid_name'

    const specie = await sut.loadByName(name)

    expect(specie).toBeFalsy()
  })
})
