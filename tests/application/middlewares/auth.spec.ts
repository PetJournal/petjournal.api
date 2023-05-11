import { AuthMiddleware } from '@/application/middlewares/auth'
import { type TokenDecoder } from '@/data/protocols/cryptography/token-decoder'
import { type LoadGuardianByIdRepository } from '@/data/protocols/guardian/load-guardian-by-id-repository'

interface SutTypes {
  sut: AuthMiddleware
  tokenDecoderStub: TokenDecoder
  loadGuardianByIdStub: LoadGuardianByIdRepository
}

class TokenDecoderStub implements TokenDecoder {
  async decode (token: TokenDecoder.Input): Promise<TokenDecoder.Output> {
    return { userId: 'valid_id' }
  }
}

class LoadGuardianByIdStub implements LoadGuardianByIdRepository {
  async loadById (id: LoadGuardianByIdRepository.Params): Promise<LoadGuardianByIdRepository.Result | null> {
    return makeFakeGuardianData()
  }
}

const makeFakeGuardianData = (): LoadGuardianByIdRepository.Result => ({
  id: 'valid_id',
  firstName: 'valid_first_name',
  lastName: 'valid_last_name',
  email: 'valid_email',
  password: 'valid_password',
  phone: 'valid_phone',
  accessToken: null,
  isPrivacyPolicyAccepted: true
})
const makeSut = (): SutTypes => {
  const tokenDecoderStub = new TokenDecoderStub()
  const loadGuardianByIdStub = new LoadGuardianByIdStub()
  const sut = new AuthMiddleware({ tokenDecoder: tokenDecoderStub, loadGuardianById: loadGuardianByIdStub })
  return { sut, tokenDecoderStub, loadGuardianByIdStub }
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

  it('Should call tokenDecoder with correct value', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    const httpRequest = { header: { authorization: 'any_token' } }
    const spyDecoder = jest.spyOn(tokenDecoderStub, 'decode')

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(spyDecoder).toHaveBeenCalledWith(httpRequest.header.authorization)
  })

  it('Should return 500 if tokenDecoder throws', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    const httpRequest = { header: { authorization: 'any_token' } }
    jest.spyOn(tokenDecoderStub, 'decode').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 401 if invalid payload is provided', async () => {
    const { sut, tokenDecoderStub, loadGuardianByIdStub } = makeSut()
    const httpRequest = { header: { authorization: 'valid_token' } }
    jest.spyOn(tokenDecoderStub, 'decode').mockResolvedValueOnce({})
    jest.spyOn(loadGuardianByIdStub, 'loadById').mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
  })

  it('Should return 401 if valid payload is provided with invalid userId', async () => {
    const { sut, tokenDecoderStub, loadGuardianByIdStub } = makeSut()
    const httpRequest = { header: { authorization: 'valid_token' } }
    jest.spyOn(tokenDecoderStub, 'decode').mockResolvedValueOnce({ userId: 'invalid_id' })
    jest.spyOn(loadGuardianByIdStub, 'loadById').mockResolvedValueOnce(null)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
  })
})
