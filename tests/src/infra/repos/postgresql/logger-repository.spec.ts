import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import { LoggerPgRepository } from '@/infra/repos/postgresql/logger-repository'
import { prisma as db } from '@/infra/repos/postgresql/prisma'

describe('LoggerPgRepository', () => {
  beforeEach(async () => { await PrismaHelper.connect() })

  afterEach(async () => { await PrismaHelper.disconnect() })

  const makeCountErrors = async (): Promise<number> => {
    return await db.logError.count()
  }

  const makeSut = (): LoggerPgRepository => {
    return new LoggerPgRepository()
  }

  it('Should create an error log on success', async () => {
    const sut = makeSut()
    await sut.logError('any_stack')
    const count = await makeCountErrors()
    expect(count).toBe(1)
  })
})
