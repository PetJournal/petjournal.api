import { AuthMiddleware } from '@/application/middlewares'
import {
  type TokenDecoder,
  type HashComparer,
  type LoadGuardianByIdRepository
} from '@/data/protocols'
import { badRequest, success, unauthorized } from '@/application/helpers'
import {
  makeFakeAuthorizationRequest,
  makeFakeTokenDecoder,
  makeFakeHashComparer,
  makeFakeLoadGuardianByIdRepository,
  makeFakeServerError
} from '@/tests/utils'
import { InvalidTokenError, MissingParamError, NotFoundError } from '@/application/errors'

interface SutTypes {
  sut: AuthMiddleware
  tokenDecoderStub: TokenDecoder
  hashComparerStub: HashComparer
  loadGuardianByIdStub: LoadGuardianByIdRepository
}

const makeSut = (): SutTypes => {
  const tokenDecoderStub = makeFakeTokenDecoder()
  const hashComparerStub = makeFakeHashComparer()
  const loadGuardianByIdStub = makeFakeLoadGuardianByIdRepository()
  const dependencies = {
    tokenDecoder: tokenDecoderStub,
    hashComparer: hashComparerStub,
    loadGuardianById: loadGuardianByIdStub
  }
  const sut = new AuthMiddleware(dependencies)
  return { sut, tokenDecoderStub, loadGuardianByIdStub, hashComparerStub }
}

describe('Auth Middleware', () => {
  const httpRequest = makeFakeAuthorizationRequest()
  describe('HashComparer', () => {
    it('Should call HashComparer with correct value and hash values', async () => {
      const { sut, hashComparerStub } = makeSut()
      const hashCompareSpy = jest.spyOn(hashComparerStub, 'compare')
      await sut.handle(httpRequest)
      expect(hashCompareSpy).toHaveBeenCalledWith({
        hash: 'any_hashed_token',
        value: httpRequest.authorization
      })
    })

    it('Should return 500 (ServerError) if HashComparer throws', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should return 401 (Unauthorized) if value doesn\'t match the hash', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare').mockResolvedValue(false)
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(unauthorized(new InvalidTokenError('Invalid token for this user')))
    })
  })

  describe('Token Decoder', () => {
    it('Should call TokenDecoder with correct authorization', async () => {
      const { sut, tokenDecoderStub } = makeSut()
      const tokenDecoderSpy = jest.spyOn(tokenDecoderStub, 'decode')
      await sut.handle(httpRequest)
      expect(tokenDecoderSpy).toHaveBeenCalledWith(httpRequest.authorization)
    })

    it('Should return 500 (ServerError) if TokenDecoder throws', async () => {
      const { sut, tokenDecoderStub } = makeSut()
      jest.spyOn(tokenDecoderStub, 'decode').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should return 401 (Unauthorized) if authorization is invalid (expired or malformed)', async () => {
      const { sut, tokenDecoderStub } = makeSut()
      jest.spyOn(tokenDecoderStub, 'decode').mockResolvedValue(null)
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(unauthorized(new InvalidTokenError('Invalid or expired token')))
    })
  })

  describe('LoadByGuardianById', () => {
    it('Should call LoadByGuardianById with correct userId', async () => {
      const { sut, loadGuardianByIdStub, tokenDecoderStub } = makeSut()
      const loadByIdSpy = jest.spyOn(loadGuardianByIdStub, 'loadById')
      const sub = 'any_id'
      jest.spyOn(tokenDecoderStub, 'decode').mockResolvedValue({ sub })
      await sut.handle(httpRequest)
      expect(loadByIdSpy).toHaveBeenCalledWith(sub)
    })

    it('Should return 500 (ServerError) if LoadByGuardianById throws', async () => {
      const { sut, loadGuardianByIdStub } = makeSut()
      jest.spyOn(loadGuardianByIdStub, 'loadById').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should return 401 (Unauthorized) if hash and value do not match', async () => {
      const { sut, loadGuardianByIdStub } = makeSut()
      jest.spyOn(loadGuardianByIdStub, 'loadById').mockResolvedValue(undefined)
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(unauthorized(new NotFoundError('User not found')))
    })
  })

  test('Should return 400 (Unauthorized) if authorization is not provided', async () => {
    const { sut } = makeSut()
    const httpRequests = [
      { authorization: '' },
      { authorization: null },
      { authorization: undefined }
    ]
    for (const request of httpRequests) {
      const httpResponse = await sut.handle(request)
      expect(httpResponse).toEqual(badRequest(new MissingParamError('authorization')))
    }
  })

  test('Should must treat the token when it has "Bearer" as a suffix', async () => {
    const { sut, tokenDecoderStub } = makeSut()
    const anyToken = 'any_token'
    const httpRequest = { authorization: `Bearer ${anyToken}` }
    const tokenDecoderSpy = jest.spyOn(tokenDecoderStub, 'decode')
    await sut.handle(httpRequest)
    expect(tokenDecoderSpy).toHaveBeenCalledWith(anyToken)
  })

  test('Should return 200 (OK) and userId', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({ userId: 'valid_id' }))
  })
})
