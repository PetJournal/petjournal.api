import { type AddGuardianRepository, type HashGenerator } from '@/data/protocols'
import { DbAddGuardian } from '@/data/use-cases'
import { makeAddGuardian, makeFakeGuardianData, makeEncrypter } from '@/tests/utils'

interface SutTypes {
  sut: DbAddGuardian
  encrypterStub: HashGenerator
  addGuardianRepositoryStub: AddGuardianRepository
}

const makeSut = (): SutTypes => {
  const addGuardianRepositoryStub = makeAddGuardian()
  const encrypterStub = makeEncrypter()
  const sut = new DbAddGuardian(addGuardianRepositoryStub, encrypterStub)
  return {
    sut,
    addGuardianRepositoryStub,
    encrypterStub
  }
}

describe('DbAddGuardian use case', () => {
  describe('tests encrypter services', () => {
    it('Should call encrypter with correct password', async () => {
      const { sut, encrypterStub } = makeSut()
      const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
      const guardianData = makeFakeGuardianData()

      await sut.add(guardianData)
      expect(encryptSpy).toHaveBeenCalledWith({ value: 'valid_password' })
    })

    it('Should throw if encrypter throws', async () => {
      const { sut, encrypterStub } = makeSut()
      jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
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
        forgetPasswordToken: null
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
