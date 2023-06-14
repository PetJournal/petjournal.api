import { type ChangePassword } from '@/domain/use-cases'
import { type HashGenerator, type LoadGuardianByIdRepository, type UpdateGuardianPasswordRepository } from '@/data/protocols'
import { DbChangePassword } from '@/data/use-cases'
import {
  makeFakeHashGenerator,
  makeFakeLoadGuardianByIdRepository,
  makeFakeUpdateGuardianPasswordRepository
} from '@/tests/utils'
import { NotFoundError } from '@/application/errors'

interface SutTypes {
  sut: DbChangePassword
  hashGeneratorStub: HashGenerator
  loadGuardianByIdRepositoryStub: LoadGuardianByIdRepository
  updateGuardianPasswordRepositoryStub: UpdateGuardianPasswordRepository
}

const makeSut = (): SutTypes => {
  const hashGeneratorStub = makeFakeHashGenerator()
  const loadGuardianByIdRepositoryStub = makeFakeLoadGuardianByIdRepository()
  const updateGuardianPasswordRepositoryStub = makeFakeUpdateGuardianPasswordRepository()

  const dependencies: ChangePassword.Dependencies = {
    hashGenerator: hashGeneratorStub,
    loadGuardianByIdRepository: loadGuardianByIdRepositoryStub,
    updateGuardianPasswordRepository: updateGuardianPasswordRepositoryStub
  }
  const sut = new DbChangePassword(dependencies)
  return {
    sut,
    hashGeneratorStub,
    loadGuardianByIdRepositoryStub,
    updateGuardianPasswordRepositoryStub
  }
}

describe('DbChangePassword use case', () => {
  const params: ChangePassword.Params = {
    id: 'any_id',
    password: 'any_password'
  }
  describe('HashGenerator', () => {
    it('Should call HashGenerator with correct token', async () => {
      const { sut, hashGeneratorStub } = makeSut()
      const hashGeneratorSpy = jest.spyOn(hashGeneratorStub, 'encrypt')
      await sut.change(params)
      expect(hashGeneratorSpy).toHaveBeenCalledWith({ value: 'any_password' })
    })

    it('Should throw if HashGenerator throws', async () => {
      const { sut, hashGeneratorStub } = makeSut()
      jest.spyOn(hashGeneratorStub, 'encrypt').mockRejectedValue(new Error())
      const promise = sut.change(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('LoadGuardianByIdRepository', () => {
    it('Should call LoadGuardianByIdRepository with correct subject (userId)', async () => {
      const { sut, loadGuardianByIdRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(loadGuardianByIdRepositoryStub, 'loadById')
      await sut.change(params)
      expect(loadByEmailSpy).toHaveBeenCalledWith(params.id)
    })

    it('Should throw if LoadGuardianByEmailRepository throws', async () => {
      const { sut, loadGuardianByIdRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByIdRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const promise = sut.change(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return not found error if id does not exist', async () => {
      const { sut, loadGuardianByIdRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByIdRepositoryStub, 'loadById').mockResolvedValue(undefined)
      const result = await sut.change(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotFoundError('userId')
      })
    })
  })

  describe('UpdateGuardianPasswordRepository', () => {
    it('Should call UpdateGuardianPasswordRepository with correct subject (userId)', async () => {
      const { sut, updateGuardianPasswordRepositoryStub } = makeSut()
      const updateGuardianPasswordSpy = jest.spyOn(updateGuardianPasswordRepositoryStub, 'updatePassword')
      await sut.change(params)
      expect(updateGuardianPasswordSpy).toHaveBeenCalledWith({ id: 'any_id', password: 'hashed_value' })
    })

    it('Should throw if UpdateGuardianPasswordRepository throws', async () => {
      const { sut, updateGuardianPasswordRepositoryStub } = makeSut()
      jest.spyOn(updateGuardianPasswordRepositoryStub, 'updatePassword').mockRejectedValue(new Error())
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
