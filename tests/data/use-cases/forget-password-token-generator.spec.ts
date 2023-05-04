import { ForgetPasswordTokenGenerator } from '@/data/use-cases/forget-password-token-generation'

describe('ForgetPasswordTokenGenerator', () => {
  it('Should return a token on success', async () => {
    const sut = new ForgetPasswordTokenGenerator()
    const token = await sut.generate(1)
    expect(token).toBeTruthy()
    expect(token).toHaveLength(6)
  })
})
