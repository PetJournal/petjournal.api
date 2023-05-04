import { ForgetPasswordTokenGenerator } from '@/data/use-cases/forget-password-token-generation'
import { type Encrypter } from '@/data/protocols'

interface SutTypes {
  sut: ForgetPasswordTokenGenerator
}

const makeSut = (): SutTypes => {
  const sut = new ForgetPasswordTokenGenerator()
  return {
    sut
  }
}

describe('ForgetPasswordTokenGenerator', () => {
  it('Should return a token on success', async () => {
    const { sut } = makeSut()
    const token = await sut.generate(1)
    expect(token).toBeTruthy()
    expect(token).toHaveLength(6)
  })
})
