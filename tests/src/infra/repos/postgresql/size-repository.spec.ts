import { prisma as db } from '@/infra/repos/postgresql/prisma'
import { SizeRepository } from '@/infra/repos/postgresql/size-repository'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

const makeSut = (): SizeRepository => {
  return new SizeRepository()
}

describe('SizeRepository', () => {
  beforeAll(async () => { await PrismaHelper.connect() })

  beforeEach(async () => {
    await PrismaHelper.clearSize()
    await PrismaHelper.clearSpecie()
  })

  afterAll(async () => { await PrismaHelper.disconnect() })

  describe('LoadByName method', () => {
    it('Should not return a size if invalid name is provided', async () => {
      const sut = makeSut()
      const name = 'invalid_name'
      const result = await sut.loadByName(name)

      expect(result).toBeUndefined()
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

      expect(result).toEqual({
        id: expect.any(String),
        name: 'any_name',
        specieId: expect.any(String)
      })
    })
  })

  describe('LoadCatSizes', () => {
    it('Should return a list of cat sizes', async () => {
      const sut = makeSut()
      const specieName = 'Gato'
      const specie = await db.specie.create({ data: { name: specieName } })
      const sizes = [
        {
          name: 'any_name_1',
          specieId: specie.id
        },
        {
          name: 'any_name_2',
          specieId: specie.id
        },
        {
          name: 'any_name_3',
          specieId: specie.id
        }
      ]
      await db.size.createMany({ data: sizes })

      const result = await sut.loadCatSizes()

      expect(result).toHaveLength(3)
      sizes.forEach((size) => {
        expect(result).toContainEqual({
          ...size,
          id: expect.any(String)
        })
      })
    })
  })

  describe('LoadDogSizes', () => {
    it('Should return a list of dog sizes', async () => {
      const sut = makeSut()
      const specieName = 'Cachorro'
      const specie = await db.specie.create({ data: { name: specieName } })
      const sizes = [
        {
          name: 'any_name_1',
          specieId: specie.id
        },
        {
          name: 'any_name_2',
          specieId: specie.id
        },
        {
          name: 'any_name_3',
          specieId: specie.id
        }
      ]
      await db.size.createMany({ data: sizes })

      const result = await sut.loadDogSizes()

      expect(result).toHaveLength(3)
      sizes.forEach((size) => {
        expect(result).toContainEqual({
          ...size,
          id: expect.any(String)
        })
      })
    })
  })
})
