import jwt from 'jsonwebtoken'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await new Promise(resolve => { resolve('any_token') })
  }
}))

describe('Jwt Adapter', () => {
  it('Should call sign with correct values', async () => {
    const sut = new JwtAdapter('secret')
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.generate('any_email@mail.com')
    expect(signSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com' }, 'secret')
  })

  it('Should return a token on sign success', async () => {
    const sut = new JwtAdapter('secret')
    const accessToken = await sut.generate('any_email@mail.com')
    expect(accessToken).toBe('any_token')
  })

  it('Should throw if sign throws', async () => {
    const sut = new JwtAdapter('secret')
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.generate('any_email@mail.com')
    await expect(promise).rejects.toThrow()
  })
})
