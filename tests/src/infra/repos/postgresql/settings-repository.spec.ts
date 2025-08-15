import { SettingsRepository } from '@/infra/repos/postgresql'
import { PrismaHelper, prisma } from '@/tests/helpers/prisma-helper'

const makeSut = (): SettingsRepository => {
  return new SettingsRepository()
}

describe('SettingsRepository', () => {
  beforeAll(async () => {
    await PrismaHelper.connect()
  })

  beforeEach(async () => {
    await PrismaHelper.clearGuardian()
  })

  afterAll(async () => {
    await PrismaHelper.disconnect()
  })

  describe('loadAll method', () => {
    it('Should return an array of settings on success', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()

      await prisma.settings.create({
        data: {
          guardianId: guardian.id,
          notificationEmail: false,
          notificationMobile: false
        }
      })

      const settings = await sut.loadAll(guardian.id)

      expect(settings).toEqual([
        {
          notificationEmail: false,
          notificationMobile: false
        }
      ])
    })
  })
})
