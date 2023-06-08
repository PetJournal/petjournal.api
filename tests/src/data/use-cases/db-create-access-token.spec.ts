import {
  type UpdateAccessTokenRepository,
  type TokenGenerator,
  type LoadGuardianByEmailRepository,
  type HashGenerator
} from '@/data/protocols'
import {
  makeUpdateAccessTokenRepository,
  makeFakeGuardianWithIdData,
  makeTokenGenerator,
  makeHashGenerator,
  makeLoadGuardianByEmail
} from '@/tests/utils'
import { NotFoundError } from '@/application/errors'
import { DbCreateAccessToken } from '@/data/use-cases/db-create-access-token'

interface SutTypes {
  sut: DbCreateAccessToken
  loadGuardianByEmailRepositoryStub: LoadGuardianByEmailRepository
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
  hashServiceStub: HashGenerator
  tokenServiceStub: TokenGenerator
}

const makeSut = (): SutTypes => {
  const loadGuardianByEmailRepositoryStub = makeLoadGuardianByEmail(makeFakeGuardianWithIdData())
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const hashServiceStub = makeHashGenerator()
  const tokenServiceStub = makeTokenGenerator()
  const sut = new DbCreateAccessToken(
    {
      loadGuardianByEmailRepository: loadGuardianByEmailRepositoryStub,
      updateAccessTokenRepository: updateAccessTokenRepositoryStub,
      hashService: hashServiceStub,
      tokenService: tokenServiceStub
    }
  )
  return {
    sut,
    loadGuardianByEmailRepositoryStub,
    updateAccessTokenRepositoryStub,
    hashServiceStub,
    tokenServiceStub
  }
}
describe('DbCreateAccessToken UseCase', () => {
  const fakeEmail = 'any_email@email.com'

  describe('tests guardianRepository', () => {
    it('Should return NotFoundError if not found email is provided', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(undefined)

      const result = await sut.create(fakeEmail)

      expect(result).toStrictEqual(new NotFoundError('email'))
    })

    it('Should throw if loadByEmail throws', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())

      const promise = sut.create(fakeEmail)

      await expect(promise).rejects.toThrow()
    })

    it('Should call loadByEmail with correct email', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail')

      await sut.create(fakeEmail)

      expect(loadSpy).toHaveBeenCalledWith(fakeEmail)
    })
  })

  describe('test TokenService', () => {
    it('should call generate with correct value', async () => {
      const { sut, tokenServiceStub } = makeSut()
      const spyTokenService = jest.spyOn(tokenServiceStub, 'generate')

      await sut.create(fakeEmail)

      expect(spyTokenService).toHaveBeenCalledWith({ sub: makeFakeGuardianWithIdData().id })
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
      const { sut, updateAccessTokenRepositoryStub } = makeSut()
      const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

      await sut.create(fakeEmail)

      expect(updateSpy).toHaveBeenCalledWith({ id: 'valid_id', token: 'hashed_value' })
    })

    it('Should throw if updateAccessToken throws', async () => {
      const { sut, updateAccessTokenRepositoryStub } = makeSut()
      jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())

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
