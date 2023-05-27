import jwt, { type JwtPayload } from 'jsonwebtoken'
import { JwtAdapter } from '@/infra/cryptography'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve('any_token')
  },
  async verify (): Promise<JwtPayload> {
    return await Promise.resolve({ sub: 'any_id' })
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
    expect(signSpy).toHaveBeenCalledWith({ sub: 'any_id' }, fakeSecret)
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

  it('Should call verify with correct values', async () => {
    const sut = makeSut()
    const spyDecode = jest.spyOn(jwt, 'verify')
    const accessToken = await sut.generate({ sub: 'any_id' })
    await sut.decode(accessToken)
    expect(spyDecode).toHaveBeenCalledWith(accessToken, fakeSecret)
  })

  it('Should return a payload with the subject from a valid token', async () => {
    const sut = makeSut()
    const payload = { sub: 'any_id' }
    const accessToken = await sut.generate(payload)
    const decodedToken = await sut.decode(accessToken) as JwtPayload
    expect(decodedToken).not.toBeNull()
    expect(payload.sub).toBe(decodedToken.sub)
  })

  it('Should return null if the token is invalid', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error()
    })
    const decodedTokenInvalid = await sut.decode('invalid_token')
    expect(decodedTokenInvalid).toBeNull()
  })
})
