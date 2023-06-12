import { AuthMiddleware } from '@/application/middlewares'
import { success, unauthorized } from '@/application/helpers'
import {
  type TokenDecoder,
  type HashComparer,
  type LoadGuardianByIdRepository
} from '@/data/protocols'
import {
  makeFakePayload,
  makeFakeAuthorization,
  makeTokenService,
  makeHashService,
  makeGuardianRepository,
  makeFakeServerError,
  type Guardian,
  makeFakeGuardianData
} from '@/tests/utils'

interface SutTypes {
  sut: AuthMiddleware
  tokenServiceStub: TokenDecoder
  hashServiceStub: HashComparer
  guardianRepositoryStub: LoadGuardianByIdRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeGuardianRepository(
    makeFakeGuardianData({ withId: true }) as Guardian & { id: string }
  )
  const tokenServiceStub = makeTokenService()
  const hashServiceStub = makeHashService()
  const dependencies = {
    tokenService: tokenServiceStub,
    hashService: hashServiceStub,
    guardianRepository: guardianRepositoryStub
  }
  const sut = new AuthMiddleware(dependencies)
  return { sut, tokenServiceStub, guardianRepositoryStub, hashServiceStub }
}

describe('Auth Middleware', () => {
  describe('test the authorization field', () => {
    it('Should return 401 if no authorization is provided', async () => {
      const { sut } = makeSut()

      const httpRequest = makeFakeAuthorization({ data: '' })
      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(unauthorized())
    })

    it('Should return 401 if invalid authorization is provided', async () => {
      const { sut, tokenServiceStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'invalid_token' })
      jest.spyOn(tokenServiceStub, 'decode').mockResolvedValueOnce(false)

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(unauthorized())
    })
  })

  describe('test the tokenDecoder dependency', () => {
    it('Should call tokenDecoder with correct value', async () => {
      const { sut, tokenServiceStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'any_token' })
      const spyDecoder = jest.spyOn(tokenServiceStub, 'decode')

      await sut.handle(httpRequest)

      expect(spyDecoder).toHaveBeenCalledWith(httpRequest.authorization)
    })

    it('Should return 500 if tokenDecoder throws', async () => {
      const { sut, tokenServiceStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'any_token' })
      jest.spyOn(tokenServiceStub, 'decode').mockRejectedValueOnce(new Error())

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test the loadGuardianById service', () => {
    it('Should return 401 if invalid payload is provided', async () => {
      const { sut, tokenServiceStub, guardianRepositoryStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'valid_token' })
      jest.spyOn(tokenServiceStub, 'decode').mockResolvedValueOnce({})
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(undefined)

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(unauthorized())
    })

    it('Should return 401 if valid payload is provided with invalid userId', async () => {
      const { sut, tokenServiceStub, guardianRepositoryStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'valid_token' })
      jest.spyOn(tokenServiceStub, 'decode').mockResolvedValueOnce({ userId: 'invalid_id' })
      jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(undefined)

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(unauthorized())
    })

    it('Should call loadGuardianById with correct value', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'valid_token' })
      const spyLoadGuardianById = jest.spyOn(guardianRepositoryStub, 'loadById')

      await sut.handle(httpRequest)

      expect(spyLoadGuardianById).toHaveBeenCalledWith(makeFakePayload().sub)
    })

    it('Should return 401 if authorization not match with accessToken in database', async () => {
      const { sut, hashServiceStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'valid_token' })
      jest.spyOn(hashServiceStub, 'compare').mockResolvedValueOnce(false)

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(unauthorized())
    })

    it('Should return 500 if loadGuardianById throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'any_token' })
      jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('test authMiddleware success case', () => {
    it('Should return 200 if success', async () => {
      const { sut } = makeSut()
      const httpRequest = makeFakeAuthorization({ data: 'valid_token' })

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(success({ userId: makeFakePayload().sub }))
    })
  })
})
