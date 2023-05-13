import { AuthMiddleware } from '@/application/middlewares/auth'
import { type TokenDecoder } from '@/data/protocols/cryptography/token-decoder'
import { type LoadGuardianByIdRepository } from '@/data/protocols/guardian/load-guardian-by-id-repository'
import { type Guardian } from '@prisma/client'

interface SutTypes {
  sut: AuthMiddleware
  tokenDecoderStub: TokenDecoder
  loadGuardianByIdStub: LoadGuardianByIdRepository
}

class TokenDecoderStub implements TokenDecoder {
  async decode (token: TokenDecoder.Params): Promise<TokenDecoder.Result> {
    return makeFakePayload()
  }
}

class LoadGuardianByIdStub implements LoadGuardianByIdRepository {
  async loadById (id: LoadGuardianByIdRepository.Params): Promise<LoadGuardianByIdRepository.Result> {
    return makeFakeGuardianData()
  }
}

const makeFakePayload = (): TokenDecoder.Result => ({ sub: 'valid_id' })

const makeFakeGuardianData = (): Guardian => ({
  id: 'valid_id',
  firstName: 'valid_first_name',
  lastName: 'valid_last_name',
  email: 'valid_email',
  password: 'valid_password',
  phone: 'valid_phone',
  accessToken: 'valid_token',
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

    await sut.handle(httpRequest)

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
    jest.spyOn(loadGuardianByIdStub, 'loadById').mockResolvedValueOnce(undefined)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
  })

  it('Should return 401 if valid payload is provided with invalid userId', async () => {
    const { sut, tokenDecoderStub, loadGuardianByIdStub } = makeSut()
    const httpRequest = { header: { authorization: 'valid_token' } }
    jest.spyOn(tokenDecoderStub, 'decode').mockResolvedValueOnce({ userId: 'invalid_id' })
    jest.spyOn(loadGuardianByIdStub, 'loadById').mockResolvedValueOnce(undefined)

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
  })

  it('Should call loadGuardianById with correct value', async () => {
    const { sut, loadGuardianByIdStub } = makeSut()
    const httpRequest = { header: { authorization: 'valid_token' } }
    const spyLoadGuardianById = jest.spyOn(loadGuardianByIdStub, 'loadById')

    await sut.handle(httpRequest)

    expect(spyLoadGuardianById).toHaveBeenCalledWith(makeFakePayload().sub)
  })

  it('Should return 401 if authorization not match with accessToken in database', async () => {
    const { sut, loadGuardianByIdStub } = makeSut()
    const httpRequest = { header: { authorization: 'valid_token' } }
    jest.spyOn(loadGuardianByIdStub, 'loadById').mockResolvedValueOnce({ ...makeFakeGuardianData(), accessToken: 'other_token' })

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
  })

  it('Should return 500 if loadGuardianById throws', async () => {
    const { sut, loadGuardianByIdStub } = makeSut()
    const httpRequest = { header: { authorization: 'any_token' } }
    jest.spyOn(loadGuardianByIdStub, 'loadById').mockRejectedValueOnce(new Error())

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 200 if success', async () => {
    const { sut } = makeSut()
    const httpRequest = { header: { authorization: 'valid_token' } }

    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({ userId: makeFakePayload().sub })
  })
})
