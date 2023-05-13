import { type AddGuardianRepository, type HashGenerator } from '@/data/protocols'
import { DbAddGuardian } from '@/data/use-cases'

const makeEncrypter = (): HashGenerator => {
  class EncrypterStub implements HashGenerator {
    async encrypt (input: HashGenerator.Params): Promise<HashGenerator.Result> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub()
}

const makeAddGuardianRepository = (): AddGuardianRepository => {
  class AddGuardianRepositoryStub implements AddGuardianRepository {
    async add (guardian: AddGuardianRepository.Params): Promise<AddGuardianRepository.Result> {
      return await new Promise(resolve => { resolve(true) })
    }
  }
  return new AddGuardianRepositoryStub()
}

interface SutTypes {
  sut: DbAddGuardian
  encrypterStub: HashGenerator
  addGuardianRepositoryStub: AddGuardianRepository
}

const makeSut = (): SutTypes => {
  const addGuardianRepositoryStub = makeAddGuardianRepository()
  const encrypterStub = makeEncrypter()
  const sut = new DbAddGuardian(addGuardianRepositoryStub, encrypterStub)
  return {
    sut,
    addGuardianRepositoryStub,
    encrypterStub
  }
}

describe('DbAddGuardian use case', () => {
  it('Should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const guardianData = {
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'valid_email',
      phone: 'valid_phone',
      password: 'valid_password',
      isPrivacyPolicyAccepted: true
    }
    await sut.add(guardianData)
    expect(encryptSpy).toHaveBeenCalledWith({ value: 'valid_password' })
  })

  it('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const guardianData = {
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'valid_email',
      phone: 'valid_phone',
      password: 'valid_password',
      isPrivacyPolicyAccepted: true
    }
    const promise = sut.add(guardianData)
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddGuardianRepository with correct values', async () => {
    const { sut, addGuardianRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addGuardianRepositoryStub, 'add')
    const guardianData = {
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'valid_email',
      phone: 'valid_phone',
      password: 'valid_password',
      isPrivacyPolicyAccepted: true
    }
    await sut.add(guardianData)
    expect(addSpy).toHaveBeenCalledWith({
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'valid_email',
      phone: 'valid_phone',
      password: 'hashed_password',
      isPrivacyPolicyAccepted: true
    })
  })

  it('Should throw if AddGuardianRepository throws', async () => {
    const { sut, addGuardianRepositoryStub } = makeSut()
    jest.spyOn(addGuardianRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const guardianData = {
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'valid_email',
      phone: 'valid_phone',
      password: 'valid_password',
      isPrivacyPolicyAccepted: true
    }
    const promise = sut.add(guardianData)
    await expect(promise).rejects.toThrow()
  })

  it('Should return an guardian on success', async () => {
    const { sut } = makeSut()
    const guardianData = {
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'valid_email',
      phone: 'valid_phone',
      password: 'valid_password',
      isPrivacyPolicyAccepted: true
    }
    const guardian = await sut.add(guardianData)
    expect(guardian).toBe(true)
  })
})
