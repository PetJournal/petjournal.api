import { ForgetPasswordTokenGenerator } from '@/data/use-cases/forget-password-token-generation'
import { type Encrypter } from '@/data/protocols'

interface SutTypes {
  sut: ForgetPasswordTokenGenerator
  encrypterStub: Encrypter
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return await new Promise(resolve => { resolve('any_token') })
    }
  }
  return new EncrypterStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const sut = new ForgetPasswordTokenGenerator(encrypterStub)
  return {
    sut,
    encrypterStub
  }
}

describe('ForgetPasswordTokenGenerator', () => {
  it('Should return a token on success', async () => {
    const { sut } = makeSut()
    const token = await sut.generate(1)
    expect(token).toBeTruthy()
    expect(token).toHaveLength(6)
  })

  it('Should call Encrypter with correct value', async () => {
    const { sut, encrypterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.generate(1)
    expect(encryptSpy).toBeCalled()
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.generate(1)
    await expect(promise).rejects.toThrow()
  })
})
