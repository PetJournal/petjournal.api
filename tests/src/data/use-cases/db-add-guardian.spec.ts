import { type AddGuardian } from '@/domain/use-cases'
import { type AddGuardianRepository, type HashGenerator } from '@/data/protocols'
import { DbAddGuardian } from '@/data/use-cases'
import { makeFakeGuardianData, makeGuardianRepository, makeHashService } from '@/tests/utils'

interface SutTypes {
  sut: DbAddGuardian
  hashServiceStub: HashGenerator
  guardianRepositoryStub: AddGuardianRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeGuardianRepository()
  const hashServiceStub = makeHashService()
  const dependencies: AddGuardian.Dependencies = {
    hashService: hashServiceStub,
    guardianRepository: guardianRepositoryStub
  }
  const sut = new DbAddGuardian(dependencies)
  return {
    sut,
    guardianRepositoryStub,
    hashServiceStub
  }
}

describe('DbAddGuardian use case', () => {
  describe('tests hash generator services', () => {
    it('Should call hash generator with correct password', async () => {
      const { sut, hashServiceStub } = makeSut()
      const guardianData = makeFakeGuardianData()
      const encryptSpy = jest.spyOn(hashServiceStub, 'encrypt')

      await sut.add(guardianData)

      expect(encryptSpy).toHaveBeenCalledWith({ value: 'valid_password' })
    })

    it('Should throw if hash generator throws', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
      const guardianData = makeFakeGuardianData()

      const promise = sut.add(guardianData)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('tests AddGuardianRepository', () => {
    it('Should call AddGuardianRepository with correct values', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const addSpy = jest.spyOn(guardianRepositoryStub, 'add')
      const { accessToken, ...guardianData } = makeFakeGuardianData()

      await sut.add(guardianData)

      expect(addSpy).toHaveBeenCalledWith({
        firstName: 'valid_first_name',
        lastName: 'valid_last_name',
        email: 'valid_email',
        phone: 'valid_phone',
        password: 'hashed_value',
        verificationToken: 'token dumb',
        verificationTokenCreatedAt: new Date('2023-06-05')
      })
    })

    it('Should throw if AddGuardianRepository throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'add').mockReturnValueOnce(Promise.reject(new Error()))

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
