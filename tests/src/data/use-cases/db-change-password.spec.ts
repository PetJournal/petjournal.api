import { type ChangePassword } from '@/domain/use-cases'
import { type HashGenerator, type LoadGuardianByIdRepository, type UpdateGuardianPasswordRepository } from '@/data/protocols'
import { DbChangePassword } from '@/data/use-cases'
import { makeHashGenerator, makeLoadGuardianById, makeUpdateGuardianRepository } from '@/tests/utils'
import { NotFoundError } from '@/application/errors'

interface SutTypes {
  sut: DbChangePassword
  hashGeneratorStub: HashGenerator
  loadGuardianByIdRepositoryStub: LoadGuardianByIdRepository
  updateGuardianPasswordRepositoryStub: UpdateGuardianPasswordRepository
}

const makeSut = (): SutTypes => {
  const hashGeneratorStub = makeHashGenerator()
  const loadGuardianByIdRepositoryStub = makeLoadGuardianById()
  const updateGuardianPasswordRepositoryStub = makeUpdateGuardianRepository()

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
  describe('tests HashGenerator', () => {
    it('Should call hash generator with correct password', async () => {
      const { sut, hashGeneratorStub } = makeSut()
      const encryptSpy = jest.spyOn(hashGeneratorStub, 'encrypt')

      const userData = { id: 'any_id', password: 'valid_password' }
      await sut.change(userData)

      expect(encryptSpy).toHaveBeenCalledWith({ value: 'valid_password' })
    })

    it('Should throw if hash generator throws', async () => {
      const { sut, hashGeneratorStub } = makeSut()
      jest.spyOn(hashGeneratorStub, 'encrypt').mockRejectedValueOnce(new Error())

      const userData = { id: 'any_id', password: 'any_password' }
      const promise = sut.change(userData)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('tests LoadGuardianByIdRepository', () => {
    it('Should call LoadGuardianByIdRepository with correct values', async () => {
      const { sut, loadGuardianByIdRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(loadGuardianByIdRepositoryStub, 'loadById')

      const userData = { id: 'any_id', password: 'any_password' }
      await sut.change(userData)

      expect(loadSpy).toHaveBeenCalledWith(userData.id)
    })

    it('Should throw if LoadGuardianByIdRepository throws', async () => {
      const { sut, loadGuardianByIdRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByIdRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())

      const userData = { id: 'any_id', password: 'any_password' }
      const promise = sut.change(userData)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('tests UpdateGuardianRepository', () => {
    it('Should call UpdateGuardianRepository with correct values', async () => {
      const { sut, updateGuardianPasswordRepositoryStub } = makeSut()
      const updateSpy = jest.spyOn(updateGuardianPasswordRepositoryStub, 'updatePassword')

      const userData = { id: 'any_id', password: 'any_password' }
      await sut.change(userData)

      expect(updateSpy).toHaveBeenCalledWith({ id: 'any_id', password: 'hashed_value' })
    })

    it('Should throw if UpdateGuardianRepository throws', async () => {
      const { sut, updateGuardianPasswordRepositoryStub } = makeSut()
      jest.spyOn(updateGuardianPasswordRepositoryStub, 'updatePassword').mockRejectedValueOnce(new Error())

      const userData = { id: 'any_id', password: 'any_password' }
      const promise = sut.change(userData)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('tests DbChangePassword failure cases', () => {
    it('Should return an isSuccess as false and NotFoundError if id is invalid', async () => {
      const { sut, loadGuardianByIdRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByIdRepositoryStub, 'loadById').mockResolvedValue(undefined)

      const userData = { id: 'any_id', password: 'any_password' }
      const response = await sut.change(userData)

      expect(response.isSuccess).toBeFalsy()
      expect(response.error).toBeInstanceOf(NotFoundError)
    })
  })

  describe('test DbChangePassword success case', () => {
    it('Should return an isSuccess as true', async () => {
      const { sut } = makeSut()

      const userData = { id: 'any_id', password: 'any_password' }
      const response = await sut.change(userData)

      expect(response).toStrictEqual({ isSuccess: true })
    })
  })
})
