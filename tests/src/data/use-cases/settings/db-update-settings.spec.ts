import { NotAcceptableError } from '@/application/errors'
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

    it('Should return Not Acceptable error if incorrect guardianId is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const result = await sut.update({ ...params, guardianId: 'invalid_guardianId' })
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('userId')
      })
    })
  })

  describe('Settings Repository', () => {
    it('Should call loadAll method with correct value', async () => {
      const { sut, settingsRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(settingsRepositoryStub, 'loadAll')
      await sut.update(params)
      expect(loadSpy).toHaveBeenCalledWith(params.guardianId)
    })

    it('Should throw if loadAll method throws', async () => {
      const { sut, settingsRepositoryStub } = makeSut()
      jest.spyOn(settingsRepositoryStub, 'loadAll').mockRejectedValue(new Error())
      const promise = sut.update(params)
      await expect(promise).rejects.toThrow()
    })
  })
})
