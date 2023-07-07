import { AuthMiddleware } from '@/application/middlewares'
import {
  type TokenDecoder,
  type HashComparer,
  type LoadGuardianByIdRepository
} from '@/data/protocols'
import { badRequest, success, unauthorized } from '@/application/helpers'
import {
  makeFakeTokenService,
  makeFakeHashService,
  makeFakeGuardianRepository,
  makeFakeServerError,
  makeFakeAuthorizationRequest
} from '@/tests/utils'
import { InvalidTokenError, MissingParamError, NotFoundError } from '@/application/errors'

interface SutTypes {
  sut: AuthMiddleware
  tokenServiceStub: TokenDecoder
  hashServiceStub: HashComparer
  guardianRepositoryStub: LoadGuardianByIdRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const tokenServiceStub = makeFakeTokenService()
  const hashServiceStub = makeFakeHashService()
  const dependencies = {
    tokenService: tokenServiceStub,
    hashService: hashServiceStub,
    guardianRepository: guardianRepositoryStub
  }
  const sut = new AuthMiddleware(dependencies)
  return { sut, tokenServiceStub, guardianRepositoryStub, hashServiceStub }
}

describe('Auth Middleware', () => {
  const httpRequest = makeFakeAuthorizationRequest()
  describe('HashService', () => {
    it('Should return 401 (Unauthorized) if value doesn\'t match the hash', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'compare').mockResolvedValue(false)
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(unauthorized(new InvalidTokenError('Invalid token for this user')))
    })

    it('Should return 500 (ServerError) if compare method throws', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'compare').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should call compare method with correct value and hash values', async () => {
      const { sut, hashServiceStub } = makeSut()
      const hashCompareSpy = jest.spyOn(hashServiceStub, 'compare')
      await sut.handle(httpRequest)
      expect(hashCompareSpy).toHaveBeenCalledWith({
        hash: 'any_hashed_token',
        value: httpRequest.authorization
      })
    })
  })

  describe('TokenService', () => {
    it('Should return 401 (Unauthorized) if authorization is invalid (expired or malformed)', async () => {
      const { sut, tokenServiceStub } = makeSut()
      jest.spyOn(tokenServiceStub, 'decode').mockResolvedValue(null)
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(unauthorized(new InvalidTokenError('Invalid or expired token')))
    })

    it('Should return 500 (ServerError) if decode method throws', async () => {
      const { sut, tokenServiceStub } = makeSut()
      jest.spyOn(tokenServiceStub, 'decode').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should call decode method with correct authorization', async () => {
      const { sut, tokenServiceStub } = makeSut()
      const tokenDecoderSpy = jest.spyOn(tokenServiceStub, 'decode')
      await sut.handle(httpRequest)
      expect(tokenDecoderSpy).toHaveBeenCalledWith(httpRequest.authorization)
    })
  })

  describe('GuardianRepository', () => {
    it('Should return 401 (Unauthorized) if hash and value do not match', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValue(null)
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(unauthorized(new NotFoundError('User not found')))
    })

    it('Should return 500 (ServerError) if loadById method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should call loadById method with correct userId', async () => {
      const { sut, guardianRepositoryStub, tokenServiceStub } = makeSut()
      const loadByIdSpy = jest.spyOn(guardianRepositoryStub, 'loadById')
      const sub = 'any_id'
      jest.spyOn(tokenServiceStub, 'decode').mockResolvedValue({ sub })
      await sut.handle(httpRequest)
      expect(loadByIdSpy).toHaveBeenCalledWith(sub)
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

  test('Should must treat the token when it has "Bearer" as a prefix', async () => {
    const { sut, tokenServiceStub } = makeSut()
    const anyToken = 'any_token'
    const httpRequest = { authorization: `Bearer ${anyToken}` }
    const tokenDecoderSpy = jest.spyOn(tokenServiceStub, 'decode')
    await sut.handle(httpRequest)
    expect(tokenDecoderSpy).toHaveBeenCalledWith(anyToken)
  })

  test('Should return 200 (OK) and userId', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({ userId: 'valid_id' }))
  })
})
