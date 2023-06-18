import { type AddGuardian } from '@/domain/use-cases'
import { type AddGuardianRepository, type HashGenerator } from '@/data/protocols'
import { DbAddGuardian } from '@/data/use-cases'
import { makeFakeAddGuardianRepository, makeFakeHashGenerator } from '@/tests/utils'

interface SutTypes {
  sut: DbAddGuardian
  hashGeneratorStub: HashGenerator
  addGuardianRepositoryStub: AddGuardianRepository
}

const makeSut = (): SutTypes => {
  const hashGeneratorStub = makeFakeHashGenerator()
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
  const params: AddGuardianRepository.Params = {
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    phone: 'any_phone',
    verificationToken: 'any_verification'
  }

  describe('HashGenerator', () => {
    it('Should call HashGenerator with correct password', async () => {
      const { sut, hashGeneratorStub } = makeSut()
      const hashGeneratorSpy = jest.spyOn(hashGeneratorStub, 'encrypt')
      await sut.add(params)
      expect(hashGeneratorSpy).toHaveBeenCalledWith({ value: params.password })
    })

    it('Should throw if HashGenerator throws', async () => {
      const { sut, hashGeneratorStub } = makeSut()
      jest.spyOn(hashGeneratorStub, 'encrypt').mockRejectedValue(new Error())
      const promise = sut.add(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('AddGuardianRepository', () => {
    it('Should call AddGuardianRepository with correct values including an encrypted password', async () => {
      const { sut, addGuardianRepositoryStub } = makeSut()
      const addGuardianRepoSpy = jest.spyOn(addGuardianRepositoryStub, 'add')
      await sut.add(params)
      expect(addGuardianRepoSpy).toHaveBeenCalledWith({
        firstName: params.firstName,
        lastName: params.lastName,
        email: params.email,
        password: 'hashed_value',
        phone: params.phone,
        verificationToken: params.verificationToken
      })
    })

    it('Should throw if AddGuardianRepository throws', async () => {
      const { sut, addGuardianRepositoryStub } = makeSut()
      jest.spyOn(addGuardianRepositoryStub, 'add').mockRejectedValue(new Error())
      const promise = sut.add(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return undefined if email is already registered', async () => {
      const { sut, addGuardianRepositoryStub } = makeSut()
      jest.spyOn(addGuardianRepositoryStub, 'add').mockResolvedValue(undefined)
      const result = await sut.add(params)
      expect(result).toBeUndefined()
    })
  })

  test('Should return a guardian when saving the user successfully', async () => {
    const { sut } = makeSut()
    const result = await sut.add(params)
    expect(result).toHaveProperty('id')
    expect(result?.id).toBeDefined()
    expect(result).toMatchObject({
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phone: params.phone
    })
  })
})
