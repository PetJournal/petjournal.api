import { NotAcceptableError } from '@/application/errors'
import { type DeleteFileStorage, type FileStorage, type LoadGuardianByIdRepository, type UpdateGuardianRepository } from '@/data/protocols'
import { DbUpdateGuardian } from '@/data/use-cases'
import { type UpdateGuardian } from '@/domain/use-cases'
import { makeFakeFileStorage, makeFakeGuardianRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbUpdateGuardian
  guardianRepositoryStub: LoadGuardianByIdRepository & UpdateGuardianRepository
  fileStorageStub: FileStorage & DeleteFileStorage
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const fileStorageStub = makeFakeFileStorage()
  const dependencies: UpdateGuardian.Dependencies = {
    guardianRepository: guardianRepositoryStub,
    fileStorage: fileStorageStub
  }
  const sut = new DbUpdateGuardian(dependencies)
  return {
    sut,
    guardianRepositoryStub,
    fileStorageStub
  }
}

describe('DbUpdateGuardian use case', () => {
  const params: UpdateGuardian.Params = {
    guardianId: 'any_guardian_id',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    phone: 'any_phone',
    image: null
  }

  describe('GuardianRepository', () => {
    it('Should call loadById method with correct values', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByIdSpy = jest.spyOn(guardianRepositoryStub, 'loadById')
      await sut.update(params)
      expect(loadByIdSpy).toHaveBeenCalledWith(params.guardianId)
    })

    it('Should return Not Acceptable Error if incorrect guardianId is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const result = await sut.update(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotAcceptableError('userId')
      })
    })

    it('Should throw if loadById method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.update(params)
      await expect(promise).rejects.toThrow()
    })
  })
  describe('FileStorage', () => {

  })
})
