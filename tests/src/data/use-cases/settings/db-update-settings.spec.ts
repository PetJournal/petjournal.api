import { type LoadGuardianByIdRepository, type LoadSettingsRepository, type UpdateSettingsRepository } from '@/data/protocols'
import { DbUpdateSettings } from '@/data/use-cases'
import { type UpdateSettings } from '@/domain/use-cases'
import { makeFakeGuardianRepository, makeFakeSettingsRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbUpdateSettings
  settingsRepositoryStub: UpdateSettingsRepository & LoadSettingsRepository
  guardianRepositoryStub: LoadGuardianByIdRepository
}

const makeSut = (): SutTypes => {
  const settingsRepositoryStub = makeFakeSettingsRepository()
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const dependencies: UpdateSettings.Dependencies = {
    settingsRepository: settingsRepositoryStub,
    guardianRepository: guardianRepositoryStub
  }
  const sut = new DbUpdateSettings(dependencies)
  return {
    sut,
    settingsRepositoryStub,
    guardianRepositoryStub

  }
}

describe('DbUpdateSettings Use Case', () => {
  const params = {
    guardianId: 'any_guardianId',
    notificationEmail: false,
    notificationMobile: false
  }
  describe('Guardian Repository', () => {
    it('Should call loadById method with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(guardianRepositoryStub, 'loadById')
      await sut.update(params)
      expect(loadSpy).toHaveBeenCalledWith(params.guardianId)
    })

    it('Should throw if loadById method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.update(params)
      await expect(promise).rejects.toThrow()
    })
  })
})
