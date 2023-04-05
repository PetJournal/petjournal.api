import { type AddGuardianRepository, type Encrypter } from '../../../src/data/protocols'
import { DbAddGuardian } from '../../../src/data/use-cases'
import { type Guardian } from '../../../src/domain/entities'
import { type IAddGuardian } from '../../../src/domain/use-cases'

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
    async add (guardian: IAddGuardian): Promise<Guardian> {
      const fakeGuardian = {
        id: 1,
        firstName: 'valid_first_name',
        lastName: 'valid_last_name',
        email: 'valid_email',
        phone: 'valid_phone',
        password: 'hashed_password',
        isProvicyPolicyAccepted: true
      }
      return await new Promise(resolve => { resolve(fakeGuardian) })
    }
  }
  return new AddGuardianRepositoryStub()
}

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
    const guardianData = {
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'valid_email',
      phone: 'valid_phone',
      password: 'valid_password',
      isProvicyPolicyAccepted: true
    }
    await sut.add(guardianData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
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
      isProvicyPolicyAccepted: true
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
      isProvicyPolicyAccepted: true
    }
    await sut.add(guardianData)
    expect(addSpy).toHaveBeenCalledWith({
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'valid_email',
      phone: 'valid_phone',
      password: 'hashed_password',
      isProvicyPolicyAccepted: true
    })
  })
})
