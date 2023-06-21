import { type ChangePassword } from '@/domain/use-cases'
import { type HashGenerator, type LoadGuardianByIdRepository, type UpdateGuardianPasswordRepository } from '@/data/protocols'
import { DbChangePassword } from '@/data/use-cases'
import {
  makeFakeGuardianRepository,
  makeFakeHashService
} from '@/tests/utils'
import { NotFoundError } from '@/application/errors'

interface SutTypes {
  sut: DbChangePassword
  hashServiceStub: HashGenerator
  guardianRepositoryStub: LoadGuardianByIdRepository & UpdateGuardianPasswordRepository
}

const makeSut = (): SutTypes => {
  const hashServiceStub = makeFakeHashService()
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const dependencies: ChangePassword.Dependencies = {
    hashService: hashServiceStub,
    guardianRepository: guardianRepositoryStub
  }
  const sut = new DbChangePassword(dependencies)
  return {
    sut,
    hashServiceStub,
    guardianRepositoryStub
  }
}

describe('DbChangePassword use case', () => {
  const params: ChangePassword.Params = {
    id: 'any_id',
    password: 'any_password'
  }
  describe('HashService', () => {
    it('Should call encrypt method with correct token', async () => {
      const { sut, hashServiceStub } = makeSut()
      const hashGeneratorSpy = jest.spyOn(hashServiceStub, 'encrypt')
      await sut.change(params)
      expect(hashGeneratorSpy).toHaveBeenCalledWith({ value: 'any_password' })
    })

    it('Should throw if encrypt method throws', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'encrypt').mockRejectedValue(new Error())
      const promise = sut.change(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('GuardianRepository', () => {
    it('Should call loadById method with correct subject (userId)', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(guardianRepositoryStub, 'loadById')
      await sut.change(params)
      expect(loadByEmailSpy).toHaveBeenCalledWith(params.id)
    })

    it('Should throw if loadById method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.change(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return not found error if id does not exist', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValue(undefined)
      const result = await sut.change(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotFoundError('userId')
      })
    })

    it('Should call updatePassword method with correct subject (userId)', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const updateGuardianPasswordSpy = jest.spyOn(guardianRepositoryStub, 'updatePassword')
      await sut.change(params)
      expect(updateGuardianPasswordSpy).toHaveBeenCalledWith({ id: 'any_id', password: 'hashed_value' })
    })

    it('Should throw if updatePassword method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'updatePassword').mockRejectedValue(new Error())
      const promise = sut.change(params)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return an isSuccess true when is valid', async () => {
    const { sut } = makeSut()
    const result = await sut.change(params)
    expect(result).toEqual({ isSuccess: true })
  })
})
