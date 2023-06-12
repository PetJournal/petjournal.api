import { type Authentication } from '@/domain/use-cases'
import { DbAuthentication } from '@/data/use-cases'
import {
  type HashComparer,
  type TokenGenerator,
  type LoadGuardianByEmailRepository,
  type UpdateAccessTokenRepository,
  type HashGenerator
} from '@/data/protocols'
import {
  makeTokenService,
  makeFakeAuth,
  makeGuardianRepository,
  makeHashService,
  makeFakeGuardianData,
  type Guardian
} from '@/tests/utils'
import { NotFoundError, UnauthorizedError } from '@/application/errors'

interface SutTypes {
  sut: DbAuthentication
  guardianRepositoryStub: LoadGuardianByEmailRepository & UpdateAccessTokenRepository
  hashServiceStub: HashGenerator & HashComparer
  tokenServiceStub: TokenGenerator
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeGuardianRepository(
    makeFakeGuardianData({ withId: true }) as Guardian & { id: string }
  )
  const hashServiceStub = makeHashService()
  const tokenServiceStub = makeTokenService()
  const dependencies: Authentication.Dependencies = {
    guardianRepository: guardianRepositoryStub,
    hashService: hashServiceStub,
    tokenService: tokenServiceStub
  }
  const sut = new DbAuthentication(dependencies)
  return {
    sut,
    guardianRepositoryStub,
    hashServiceStub,
    tokenServiceStub
  }
}

describe('DbAuthentication UseCase', () => {
  const fakeAuth = makeFakeAuth()

  describe('tests LoadGuardianByEmailRepository', () => {
    it('Should return NotFoundError if not found email is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce(undefined)

      const result = await sut.auth(fakeAuth)

      expect(result).toStrictEqual(new NotFoundError('email'))
    })

    it('Should throw if LoadGuardianByEmailRepository throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())

      const promise = sut.auth(fakeAuth)

      await expect(promise).rejects.toThrow()
    })

    it('Should call LoadGuardianByEmailRepository with correct email', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(guardianRepositoryStub, 'loadByEmail')

      await sut.auth(fakeAuth)

      expect(loadSpy).toHaveBeenCalledWith(fakeAuth.email)
    })
  })

  describe('test HashComparer', () => {
    it('should return UnauthorizedError if invalid code is provided', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'compare').mockResolvedValueOnce(false)

      const result = await sut.auth(fakeAuth)

      expect(result).toStrictEqual(new UnauthorizedError())
    })

    it('should call HashComparer with empty value if falsy sensitiveData is provided', async () => {
      const { sut, hashServiceStub, guardianRepositoryStub } = makeSut()
      const fakeGuardian = {
        ...makeFakeGuardianData({ withId: true }) as Guardian & { id: string },
        sensitiveData: { field: 'any_field' }
      }
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce(fakeGuardian)
      const spyHashComparer = jest.spyOn(hashServiceStub, 'compare')

      await sut.auth(fakeAuth)

      expect(spyHashComparer).toHaveBeenCalledWith({ value: fakeAuth.sensitiveData?.value, hash: '' })
    })

    it('Should throw if HashComparer throws', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'compare').mockRejectedValueOnce(new Error())

      const promise = sut.auth(fakeAuth)

      await expect(promise).rejects.toThrow()
    })

    it('should call HashComparer with correct values', async () => {
      const { sut, hashServiceStub, guardianRepositoryStub } = makeSut()
      const fakeGuardian = {
        ...makeFakeGuardianData({ withId: true }) as Guardian & { id: string },
        sensitiveData: { field: 'any_field' }
      }
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce(fakeGuardian)
      const spyHashComparer = jest.spyOn(hashServiceStub, 'compare')

      await sut.auth(fakeAuth)

      expect(spyHashComparer).toHaveBeenCalledWith({
        value: 'any_data',
        hash: ''
      })
    })
  })

  describe('test TokenGenerator', () => {
    it('should call TokenGenerator with correct value', async () => {
      const { sut, tokenServiceStub } = makeSut()
      const spyTokenGenerator = jest.spyOn(tokenServiceStub, 'generate')

      await sut.auth(fakeAuth)

      expect(spyTokenGenerator).toHaveBeenCalledWith({ sub: 'valid_id' })
    })
  })

  describe('test HashGenerator', () => {
    it('should call HashGenerator with correct value', async () => {
      const { sut, hashServiceStub, tokenServiceStub } = makeSut()
      const spyHashGenerator = jest.spyOn(hashServiceStub, 'encrypt')
      jest.spyOn(tokenServiceStub, 'generate').mockResolvedValueOnce('valid_token')

      await sut.auth(fakeAuth)

      expect(spyHashGenerator).toHaveBeenCalledWith({ value: 'valid_token' })
    })
  })

  describe('tests UpdateAccessTokenRepository', () => {
    it('Should call UpdateAccessTokenRepository with correct values', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const updateSpy = jest.spyOn(guardianRepositoryStub, 'updateAccessToken')

      await sut.auth(fakeAuth)

      expect(updateSpy).toHaveBeenCalledWith({ id: 'valid_id', token: 'hashed_value' })
    })
  })

  describe('When success', () => {
    it('should return valid token', async () => {
      const { sut } = makeSut()

      const result = await sut.auth(fakeAuth)

      expect(result).toBe('any_token')
    })
  })
})
