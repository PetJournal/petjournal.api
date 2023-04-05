import { type Encrypter } from '../../../src/data/protocols/encrypter'
import { DbAddGuardian } from '../../../src/data/use-cases'

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('hashed_password') })
    }
  }
  return new EncrypterStub()
}

interface SutTypes {
  sut: DbAddGuardian
  encrypterStub: Encrypter
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddGuardian(encrypterStub)
  return {
    sut,
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
})
