import jwt from 'jsonwebtoken'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('any_token')
  }
}))

const fakeSecret = 'secret'
const makeSut = (): JwtAdapter => {
  return new JwtAdapter(fakeSecret)
}

describe('Jwt Adapter', () => {
  it('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.generate({ sub: 'any_id' })
    expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, fakeSecret)
  })

  it('Should return a token on sign success', async () => {
    const sut = makeSut()
    const accessToken = await sut.generate({ sub: 'any_id' })
    expect(accessToken).toBe('any_token')
  })

  it('Should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.generate({ sub: 'any_id' })
    await expect(promise).rejects.toThrow()
  })
})
