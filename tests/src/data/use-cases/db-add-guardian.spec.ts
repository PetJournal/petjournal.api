import { type AddGuardian } from '@/domain/use-cases'
import { type AddGuardianRepository, type HashGenerator } from '@/data/protocols'
import { DbAddGuardian } from '@/data/use-cases'
import { makeFakeGuardianRepository, makeFakeHashService, mockHashService } from '@/tests/utils'

interface SutTypes {
  sut: DbAddGuardian
  hashServiceStub: HashGenerator
  guardianRepositoryStub: AddGuardianRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const hashServiceStub = makeFakeHashService()
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
  const params: AddGuardianRepository.Params = {
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    phone: 'any_phone',
    verificationToken: 'any_verification'
  }

  describe('HashService', () => {
    it('Should call encrypt method with correct password', async () => {
      const { sut, hashServiceStub } = makeSut()
      const hashGeneratorSpy = jest.spyOn(hashServiceStub, 'encrypt')
      await sut.add(params)
      expect(hashGeneratorSpy).toHaveBeenCalledWith({ value: params.password })
    })

    it('Should throw if encrypt method throws', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'encrypt').mockRejectedValue(new Error())
      const promise = sut.add(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('GuardianRepository', () => {
    it('Should call add method with correct values including an encrypted password', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const addGuardianRepoSpy = jest.spyOn(guardianRepositoryStub, 'add')
      await sut.add(params)
      expect(addGuardianRepoSpy).toHaveBeenCalledWith({
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        password: mockHashService.hashedValue,
        phone: params.phone,
        verificationToken: params.verificationToken
      })
    })

    it('Should throw if add method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'add').mockRejectedValue(new Error())
      const promise = sut.add(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return undefined if email is already registered', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'add').mockResolvedValue(undefined)
      const result = await sut.add(params)
      expect(result).toBeUndefined()
    })
  })

  test('Should return a guardian when saving the user successfully', async () => {
    const { sut } = makeSut()
    const result = await sut.add(params) as any
    expect(result).toEqual({
      id: expect.any(String),
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phone: params.phone
    })
  })
})
