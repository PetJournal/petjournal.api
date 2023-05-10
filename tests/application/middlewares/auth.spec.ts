import { AuthMiddleware } from '@/application/middlewares/auth'
import { type TokenDecoder } from '@/data/protocols/cryptography/token-decoder'

interface SutTypes {
  sut: AuthMiddleware
  tokenDecoderStub: TokenDecoder
}

class TokenDecoderStub implements TokenDecoder {
  async decode (token: TokenDecoder.Input): Promise<TokenDecoder.Output> {
    return true
  }
}

const makeSut = (): SutTypes => {
  const tokenDecoderStub = new TokenDecoderStub()
  const sut = new AuthMiddleware(tokenDecoderStub)
  return { sut, tokenDecoderStub }
}

describe('Auth Middleware', () => {
  it('Should return 401 if no authorization is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = { header: { } }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
  })

  it('Should return 401 if invalid authorization is provided', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    const httpRequest = { header: { authorization: 'invalid_token' } }
    jest.spyOn(tokenDecoderStub, 'decode').mockResolvedValueOnce(false)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
  })
})
