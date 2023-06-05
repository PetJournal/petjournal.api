import { type Authentication } from '@/domain/use-cases'
import { type HashComparer, type HashGenerator, type TokenGenerator, type LoadGuardianByEmailRepository, type UpdateAccessTokenRepository } from '@/data/protocols'
import { DbAuthentication } from '@/data/use-cases'
import {
  makeFakeHashComparer,
  makeFakeTokenGenerator,
  makeFakeLoadGuardianByEmailRepository,
  makeFakeUpdateAccessTokenRepository,
  makeFakeHashGenerator,
  makeFakeAuth,
  makeFakeGuardianData
} from '@/tests/utils'
import { NotFoundError, UnauthorizedError } from '@/application/errors'

interface SutTypes {
  sut: DbAuthentication
  hashGeneratorStub: HashGenerator
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  loadGuardianByEmailRepositoryStub: LoadGuardianByEmailRepository
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const hashGeneratorStub = makeFakeHashGenerator()
  const hashComparerStub = makeFakeHashComparer()
  const tokenGeneratorStub = makeFakeTokenGenerator()
  const loadGuardianByEmailRepositoryStub = makeFakeLoadGuardianByEmailRepository()
  const updateAccessTokenRepositoryStub = makeFakeUpdateAccessTokenRepository()
  const dependencies: Authentication.Dependencies = {
    hashGenerator: hashGeneratorStub,
    hashComparer: hashComparerStub,
    tokenGenerator: tokenGeneratorStub,
    loadGuardianByEmailRepository: loadGuardianByEmailRepositoryStub,
    updateAccessTokenRepository: updateAccessTokenRepositoryStub
  }
  const sut = new DbAuthentication(dependencies)
  return {
    sut,
    hashGeneratorStub,
    hashComparerStub,
    tokenGeneratorStub,
    loadGuardianByEmailRepositoryStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  const fakeAuth = makeFakeAuth()

  describe('tests LoadGuardianByEmailRepository', () => {
    it('Should return NotFoundError if not found email is provided', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(undefined)

      const result = await sut.auth(fakeAuth)

      expect(result).toStrictEqual(new NotFoundError('email'))
    })

    it('Should throw if LoadGuardianByEmailRepository throws', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())

      const promise = sut.auth(fakeAuth)

      await expect(promise).rejects.toThrow()
    })

    it('Should call LoadGuardianByEmailRepository with correct email', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail')

      await sut.auth(fakeAuth)

      expect(loadSpy).toHaveBeenCalledWith(fakeAuth.email)
    })
  })

  describe('test HashComparer', () => {
    it('should return UnauthorizedError if invalid code is provided', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)

      const result = await sut.auth(fakeAuth)

      expect(result).toStrictEqual(new UnauthorizedError())
    })

    it('should call HashComparer with empty value if falsy sensitiveData is provided', async () => {
      const { sut, hashComparerStub, loadGuardianByEmailRepositoryStub } = makeSut()
      const fakeGuardian = {
        ...makeFakeGuardianData({ withId: true }),
        sensitiveData: { field: 'any_field' }
      }

      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail')
        .mockResolvedValueOnce(fakeGuardian as any)
      const spyHashComparer = jest.spyOn(hashComparerStub, 'compare')

      await sut.auth(fakeAuth)

      expect(spyHashComparer).toHaveBeenCalledWith({ value: fakeAuth.sensitiveData?.value, hash: '' })
    })

    it('Should throw if HashComparer throws', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())

      const promise = sut.auth(fakeAuth)

      await expect(promise).rejects.toThrow()
    })

    it('should call HashComparer with correct values', async () => {
      const { sut, hashComparerStub, loadGuardianByEmailRepositoryStub } = makeSut()
      const fakeGuardian = {
        ...makeFakeGuardianData({ withId: true }),
        sensitiveData: { field: 'any_field' }
      }
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail')
        .mockResolvedValueOnce(fakeGuardian as any)

      const spyHashComparer = jest.spyOn(hashComparerStub, 'compare')

      await sut.auth(fakeAuth)

      expect(spyHashComparer).toHaveBeenCalledWith({
        value: 'any_data',
        hash: ''
      })
    })
  })

  describe('test TokenGenerator', () => {
    it('should call TokenGenerator with correct value', async () => {
      const { sut, tokenGeneratorStub } = makeSut()
      const spyTokenGenerator = jest.spyOn(tokenGeneratorStub, 'generate')

      await sut.auth(fakeAuth)

      expect(spyTokenGenerator).toHaveBeenCalledWith({ sub: 'valid_id' })
    })
  })

  describe('test HashGenerator', () => {
    it('should call HashGenerator with correct value', async () => {
      const { sut, hashGeneratorStub, tokenGeneratorStub } = makeSut()
      const spyHashGenerator = jest.spyOn(hashGeneratorStub, 'encrypt')
      jest.spyOn(tokenGeneratorStub, 'generate').mockResolvedValueOnce('valid_token')

      await sut.auth(fakeAuth)

      expect(spyHashGenerator).toHaveBeenCalledWith({ value: 'valid_token' })
    })
  })

  describe('tests UpdateAccessTokenRepository', () => {
    it('Should call UpdateAccessTokenRepository with correct values', async () => {
      const { sut, updateAccessTokenRepositoryStub } = makeSut()
      const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

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
