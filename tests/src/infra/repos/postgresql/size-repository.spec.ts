import { prisma as db } from '@/infra/repos/postgresql/prisma'
import { SizeRepository } from '@/infra/repos/postgresql/size-repository'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

beforeEach(async () => { await PrismaHelper.connect() })
afterEach(async () => { await PrismaHelper.disconnect() })

const makeSut = (): SizeRepository => {
  return new SizeRepository()
}

describe('SizeRepository', () => {
  describe('LoadByName method', () => {
    it('Should not return a size if invalid name is provided', async () => {
      const sut = makeSut()
      const name = 'invalid_name'
      const result = await sut.loadByName(name)
      expect(result).toBeFalsy()
    })

    it('Should return a size if a valid name is provided', async () => {
      const sut = makeSut()
      const specieName = 'any_name'
      const specie = await db.specie.create({ data: { name: specieName } })
      const size = {
        name: 'any_name',
        specieId: specie.id
      }
      await db.size.create({ data: { name: size.name, specieId: size.specieId } })
      const result = await sut.loadByName(size.name)
      expect(result).toBeTruthy()
      expect(result).toMatchObject({ name: 'any_name' })
    })
  })
})
