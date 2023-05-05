import { type AddGuardianRepository, type Encrypter } from '@/data/protocols'
import { DbAddGuardian } from '@/data/use-cases'
import { type AddGuardian } from '@/domain/use-cases'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub()
}

const makeAddGuardianRepository = (): AddGuardianRepository => {
  class AddGuardianRepositoryStub implements AddGuardianRepository {
    async add (guardian: AddGuardian.Params): Promise<AddGuardian.Result> {
      return await new Promise(resolve => { resolve(true) })
    }
  }
  return new AddGuardianRepositoryStub()
}

const makeFakeGuardianData = (): AddGuardianRepository.Params => ({
  firstName: 'valid_first_name',
  lastName: 'valid_last_name',
  email: 'valid_email',
  phone: 'valid_phone',
  password: 'valid_password'
})

interface SutTypes {
  sut: DbAddGuardian
  encrypterStub: Encrypter
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
    await sut.add(makeFakeGuardianData())
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  it('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.add(makeFakeGuardianData())
    await expect(promise).rejects.toThrow()
  })

  it('Should call AddGuardianRepository with correct values', async () => {
    const { sut, addGuardianRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addGuardianRepositoryStub, 'add')
    await sut.add(makeFakeGuardianData())
    expect(addSpy).toHaveBeenCalledWith({
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'valid_email',
      phone: 'valid_phone',
      password: 'hashed_password'
    })
  })

  it('Should throw if AddGuardianRepository throws', async () => {
    const { sut, addGuardianRepositoryStub } = makeSut()
    jest.spyOn(addGuardianRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.add(makeFakeGuardianData())
    await expect(promise).rejects.toThrow()
  })

  it('Should return an guardian on success', async () => {
    const { sut } = makeSut()
    const guardian = await sut.add(makeFakeGuardianData())
    expect(guardian).toBe(true)
  })
})
