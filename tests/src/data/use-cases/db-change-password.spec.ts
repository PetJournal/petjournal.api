import { type ChangePassword } from '@/domain/use-cases'
import { type HashGenerator, type LoadGuardianByIdRepository, type UpdateGuardianPasswordRepository } from '@/data/protocols'
import { DbChangePassword } from '@/data/use-cases'
import { NotFoundError } from '@/application/errors'
import {
  type Guardian,
  makeFakeGuardianData,
  makeGuardianRepository,
  makeHashService
} from '@/tests/utils'

interface SutTypes {
  sut: DbChangePassword
  hashServiceStub: HashGenerator
  guardianRepositoryStub: LoadGuardianByIdRepository & UpdateGuardianPasswordRepository
}

const makeSut = (): SutTypes => {
  const hashServiceStub = makeHashService()
  const guardianRepositoryStub = makeGuardianRepository(
    makeFakeGuardianData({ withId: true }) as Guardian & { id: string }
  )

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
  describe('tests HashGenerator', () => {
    it('Should call hash generator with correct password', async () => {
      const { sut, hashServiceStub } = makeSut()
      const encryptSpy = jest.spyOn(hashServiceStub, 'encrypt')

      const userData = { id: 'any_id', password: 'valid_password' }
      await sut.change(userData)

      expect(encryptSpy).toHaveBeenCalledWith({ value: 'valid_password' })
    })

    it('Should throw if hash generator throws', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'encrypt').mockRejectedValueOnce(new Error())

      const userData = { id: 'any_id', password: 'any_password' }
      const promise = sut.change(userData)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('tests LoadGuardianByIdRepository', () => {
    it('Should call LoadGuardianByIdRepository with correct values', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(guardianRepositoryStub, 'loadById')

      const userData = { id: 'any_id', password: 'any_password' }
      await sut.change(userData)

      expect(loadSpy).toHaveBeenCalledWith(userData.id)
    })

    it('Should throw if LoadGuardianByIdRepository throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())

      const userData = { id: 'any_id', password: 'any_password' }
      const promise = sut.change(userData)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('tests UpdateGuardianRepository', () => {
    it('Should call UpdateGuardianRepository with correct values', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const updateSpy = jest.spyOn(guardianRepositoryStub, 'updatePassword')

      const userData = { id: 'any_id', password: 'any_password' }
      await sut.change(userData)

      expect(updateSpy).toHaveBeenCalledWith({ id: 'any_id', password: 'hashed_value' })
    })

    it('Should throw if UpdateGuardianRepository throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'updatePassword').mockRejectedValueOnce(new Error())

      const userData = { id: 'any_id', password: 'any_password' }
      const promise = sut.change(userData)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('tests DbChangePassword failure cases', () => {
    it('Should return an isSuccess as false and NotFoundError if id is invalid', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValue(undefined)

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
