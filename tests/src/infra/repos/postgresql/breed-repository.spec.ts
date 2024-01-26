import { BreedRepository } from '@/infra/repos/postgresql'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

beforeEach(async () => { await PrismaHelper.connect() })
afterEach(async () => { await PrismaHelper.disconnect() })

const makeSut = (): BreedRepository => {
  return new BreedRepository()
}

describe('BreedRepository', () => {
  it('Should not return a breed if invalid name is provided', async () => {
    const sut = makeSut()
    const name = 'invalid_name'
    const result = await sut.loadByName(name)
    expect(result).toBeFalsy()
  })
})
