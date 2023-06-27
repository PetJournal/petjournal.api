import { VerificationTokenGenerator } from '@/infra/cryptography/verification-token-adapter'

interface SutTypes {
  sut: VerificationTokenGenerator
}

const makeSut = (): SutTypes => {
  const sut = new VerificationTokenGenerator()
  return {
    sut
  }
}

describe('VerificationTokenGenerator', () => {
  it('Should return a token on success', async () => {
    const { sut } = makeSut()
    const token = await sut.generate()
    expect(token).toBeTruthy()
    expect(typeof token).toBe('string')
    expect(token).toHaveLength(6)
  })
})
