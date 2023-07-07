import {
  type UpdateAccessTokenRepository,
  type TokenGenerator,
  type LoadGuardianByEmailRepository,
  type HashGenerator
} from '@/data/protocols'
import {
  makeFakeGuardianRepository,
  makeFakeHashService,
  makeFakeTokenService
} from '@/tests/utils'
import { NotFoundError } from '@/application/errors'
import { DbCreateAccessToken } from '@/data/use-cases/db-create-access-token'

interface SutTypes {
  sut: DbCreateAccessToken
  guardianRepositoryStub: LoadGuardianByEmailRepository & UpdateAccessTokenRepository
  hashServiceStub: HashGenerator
  tokenServiceStub: TokenGenerator
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const hashServiceStub = makeFakeHashService()
  const tokenServiceStub = makeFakeTokenService()
  const sut = new DbCreateAccessToken(
    {
      guardianRepository: guardianRepositoryStub,
      hashService: hashServiceStub,
      tokenService: tokenServiceStub
    }
  )
  return {
    sut,
    guardianRepositoryStub,
    hashServiceStub,
    tokenServiceStub
  }
}
describe('DbCreateAccessToken UseCase', () => {
  const fakeEmail = 'any_email@email.com'

  describe('tests guardianRepository', () => {
    it('Should return NotFoundError if not found email is provided', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValueOnce(null)

      const result = await sut.create(fakeEmail)

      expect(result).toStrictEqual(new NotFoundError('email'))
    })

    it('Should throw if loadByEmail throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())

      const promise = sut.create(fakeEmail)

      await expect(promise).rejects.toThrow()
    })

    it('Should call loadByEmail with correct email', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(guardianRepositoryStub, 'loadByEmail')

      await sut.create(fakeEmail)

      expect(loadSpy).toHaveBeenCalledWith(fakeEmail)
    })
  })

  describe('test TokenService', () => {
    it('should call generate with correct value', async () => {
      const { sut, tokenServiceStub } = makeSut()
      const spyTokenService = jest.spyOn(tokenServiceStub, 'generate')

      await sut.create(fakeEmail)

      expect(spyTokenService).toHaveBeenCalledWith({ sub: 'any_id' })
    })
  })

  describe('test HashService', () => {
    it('should call encrypt with correct value', async () => {
      const { sut, hashServiceStub, tokenServiceStub } = makeSut()
      const spyHashGenerator = jest.spyOn(hashServiceStub, 'encrypt')
      jest.spyOn(tokenServiceStub, 'generate').mockResolvedValueOnce('valid_token')

      await sut.create(fakeEmail)

      expect(spyHashGenerator).toHaveBeenCalledWith({ value: 'valid_token' })
    })
  })

  describe('tests UpdateAccessTokenRepository service', () => {
    it('Should call UpdateAccessTokenRepository with correct values', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const updateSpy = jest.spyOn(guardianRepositoryStub, 'updateAccessToken')

      await sut.create(fakeEmail)

      expect(updateSpy).toHaveBeenCalledWith({ userId: 'any_id', token: 'hashed_value' })
    })

    it('Should throw if updateAccessToken throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())

      const promise = sut.create(fakeEmail)

      await expect(promise).rejects.toThrow()
    })
  })

  describe('When success', () => {
    it('should return an valid access token', async () => {
      const { sut } = makeSut()

      const result = await sut.create(fakeEmail)

      expect(result).toBe('any_token')
    })
  })
})
