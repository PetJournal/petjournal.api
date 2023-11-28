import jwt, { type JwtPayload } from 'jsonwebtoken'
import { JwtAdapter } from '@/infra/cryptography'
import { mockTokenService } from '@/tests/utils'

const fakeSecret = 'secret'

const tokenAny = 'any_token'

const payload = { sub: mockTokenService.validId.sub }

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return await Promise.resolve(tokenAny)
  },
  async verify (): Promise<JwtPayload> {
    return await Promise.resolve(payload)
  }
}))

const makeSut = (): JwtAdapter => {
  return new JwtAdapter(fakeSecret)
}

describe('Jwt Adapter', () => {
  it('Should call sign with correct values', async () => {
    const sut = makeSut()
    const signSpy = jest.spyOn(jwt, 'sign')
    await sut.generate(payload)
    expect(signSpy).toHaveBeenCalledWith(payload, fakeSecret)
  })

  it('Should return a token on sign success', async () => {
    const sut = makeSut()
    const accessToken = await sut.generate(payload)
    expect(accessToken).toBe(mockTokenService.anyToken)
  })

  it('Should throw if sign throws', async () => {
    const sut = makeSut()
    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })
    const promise = sut.generate(payload)
    await expect(promise).rejects.toThrow()
  })

  it('Should call verify with correct values', async () => {
    const sut = makeSut()
    const spyDecode = jest.spyOn(jwt, 'verify')
    const accessToken = await sut.generate(payload)
    await sut.decode(accessToken)
    expect(spyDecode).toHaveBeenCalledWith(accessToken, fakeSecret)
  })

  it('Should return a payload with the subject from a valid token', async () => {
    const sut = makeSut()
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
