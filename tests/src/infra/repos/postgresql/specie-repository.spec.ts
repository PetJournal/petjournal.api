import { prisma as db } from '@/infra/repos/postgresql/prisma'
import { SpecieRepository } from '@/infra/repos/postgresql'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

const makeSut = (): SpecieRepository => {
  return new SpecieRepository()
}

describe('SpecieRepository', () => {
  beforeAll(async () => { await PrismaHelper.connect() })

  afterAll(async () => { await PrismaHelper.disconnect() })

  it('Should not return an specie if invalid name is provided', async () => {
    const sut = makeSut()
    const name = 'invalid_name'

    const specie = await sut.loadByName(name)

    expect(specie).toBeFalsy()
  })

  it('Should return an specie if valid name is provided', async () => {
    const sut = makeSut()
    const name = 'valid_name'
    await db.specie.create({ data: { name } })

    const specie = await sut.loadByName(name)

    expect(specie).toBeTruthy()
    expect(specie).toMatchObject({ name })
  })
})
