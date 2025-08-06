import { type LoadSettingsRepository } from '@/data/protocols'
import { DbLoadSettings } from '@/data/use-cases'
import { type LoadSettings } from '@/domain/use-cases/settings'
import { makeFakeSettingsRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadSettings
  settingsRepositoryStub: LoadSettingsRepository
}

const makeSut = (): SutTypes => {
  const settingsRepositoryStub = makeFakeSettingsRepository()
  const dependencies: LoadSettings.Dependencies = {
    settingsRepository: settingsRepositoryStub
  }
  const sut = new DbLoadSettings(dependencies)
  return {
    sut,
    settingsRepositoryStub
  }
}

describe('DbLoadSettings use case', () => {
  describe('SettingsRepository', () => {
    it('Should throw if SettingsRepository throws', async () => {
      const { sut, settingsRepositoryStub } = makeSut()
      jest.spyOn(settingsRepositoryStub, 'loadAll').mockRejectedValue(new Error())
      const promise = sut.loadAll('any_guardian_id')
      await expect(promise).rejects.toThrow()
    })

    it('Should return an array of settings on success', async () => {
      const { sut } = makeSut()
      const settings = await sut.loadAll('any_guardian_id')
      expect(settings).toEqual([{
        notification_email: true,
        notification_mobile: true
      }])
    })
  })
})
