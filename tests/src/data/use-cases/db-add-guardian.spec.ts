import { type AddGuardian } from '@/domain/use-cases'
import { type AddGuardianRepository, type HashGenerator } from '@/data/protocols'
import { DbAddGuardian } from '@/data/use-cases'
import { makeFakeGuardianData, makeEncrypter, makeFakeAddGuardianRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbAddGuardian
  hashGeneratorStub: HashGenerator
  addGuardianRepositoryStub: AddGuardianRepository
}

const makeSut = (): SutTypes => {
  const hashGeneratorStub = makeEncrypter()
  const addGuardianRepositoryStub = makeFakeAddGuardianRepository()
  const dependencies: AddGuardian.Dependencies = {
    hashGenerator: hashGeneratorStub,
    addGuardianRepository: addGuardianRepositoryStub
  }
  const sut = new DbAddGuardian(dependencies)
  return {
    sut,
    hashGeneratorStub,
    addGuardianRepositoryStub
  }
}

describe('DbAddGuardian use case', () => {
  describe('tests hash generator services', () => {
    it('Should call hash generator with correct password', async () => {
      const { sut, hashGeneratorStub } = makeSut()
      const encryptSpy = jest.spyOn(hashGeneratorStub, 'encrypt')

      const guardianData = makeFakeGuardianData()
      await sut.add(guardianData)

      expect(encryptSpy).toHaveBeenCalledWith({ value: 'valid_password' })
    })

    it('Should throw if hash generator throws', async () => {
      const { sut, hashGeneratorStub } = makeSut()
      jest.spyOn(hashGeneratorStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))

      const guardianData = makeFakeGuardianData()
      const promise = sut.add(guardianData)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('tests AddGuardianRepository', () => {
    it('Should call AddGuardianRepository with correct values', async () => {
      const { sut, addGuardianRepositoryStub } = makeSut()
      const addSpy = jest.spyOn(addGuardianRepositoryStub, 'add')
      const { accessToken, ...guardianData } = makeFakeGuardianData()

      await sut.add(guardianData)

      expect(addSpy).toHaveBeenCalledWith({
        firstName: 'valid_first_name',
        lastName: 'valid_last_name',
        email: 'valid_email',
        phone: 'valid_phone',
        password: 'hashed_password',
        verificationToken: 'token dumb',
        verificationTokenCreatedAt: new Date('2023-06-05')
      })
    })

    it('Should throw if AddGuardianRepository throws', async () => {
      const { sut, addGuardianRepositoryStub } = makeSut()
      jest.spyOn(addGuardianRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

      const guardianData = makeFakeGuardianData()

      const promise = sut.add(guardianData)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('test DbAddGuardian success case', () => {
    it('Should return an guardian on success', async () => {
      const { sut } = makeSut()
      const { verificationTokenCreatedAt, ...guardianData } = makeFakeGuardianData()
      const { password, verificationToken, accessToken, ...guardianDataDb } = guardianData

      const guardian = await sut.add(guardianData)
      expect(guardian).toMatchObject(guardianDataDb)
    })
  })
})
