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
  const sut = new DbAddGuardian(guardianRepositoryStub, hashServiceStub)
  return {
    sut,
    guardianRepositoryStub,
    hashServiceStub
  }
}

describe('DbAddGuardian use case', () => {
  describe('tests encrypter services', () => {
    it('Should call encrypter with correct password', async () => {
      const { sut, hashServiceStub } = makeSut()
      const encryptSpy = jest.spyOn(hashServiceStub, 'encrypt')
      const guardianData = makeFakeGuardianData()

      await sut.add(guardianData)
      expect(encryptSpy).toHaveBeenCalledWith({ value: 'valid_password' })
    })

    it('Should throw if encrypter throws', async () => {
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
        forgetPasswordToken: null
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

  describe('test dbAddGuardian success case', () => {
    it('Should return an guardian on success', async () => {
      const { sut } = makeSut()
      const { accessToken, forgetPasswordToken, ...guardianData } = makeFakeGuardianData()
      const { password, ...guardianDataDb } = guardianData

      const guardian = await sut.add(guardianData)

      expect(guardian).toMatchObject(guardianDataDb)
    })
  })
})
