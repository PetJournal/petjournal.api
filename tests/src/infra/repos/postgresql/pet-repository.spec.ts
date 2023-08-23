import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import { type AddPetRepository } from '@/data/protocols'

beforeEach(async () => { await PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

class PetRepository implements AddPetRepository {
  async add (params: AddPetRepository.Params): Promise<AddPetRepository.Result> {
    return undefined
  }
}

const makeSut = (): PetRepository => {
  return new PetRepository()
}

describe('PetRepository', () => {
  it('Should not return a pet if invalid data is provided', async () => {
    const sut = makeSut()
    const data = {
      guardianId: 'invalid_guardian_id',
      specieId: 'invalid_specie_id',
      specieAlias: 'invalid_specie_alias'
    }

    const specie = await sut.add(data)

    expect(specie).toBeFalsy()
  })
})
