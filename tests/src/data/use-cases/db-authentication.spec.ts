import { type Authentication } from '@/domain/use-cases'
import { type HashComparer, type HashGenerator, type TokenGenerator, type LoadGuardianByEmailRepository, type UpdateAccessTokenRepository } from '@/data/protocols'
import { DbAuthentication } from '@/data/use-cases'
import {
  makeFakeLoginRequest,
  makeFakeHashComparer,
  makeFakeTokenGenerator,
  makeFakeLoadGuardianByEmailRepository,
  makeFakeUpdateAccessTokenRepository,
  makeFakeHashGenerator
} from '@/tests/utils'

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
  const { body: fakeLogin } = makeFakeLoginRequest()

  describe('tests LoadAccountByEmailRepository', () => {
    it('Should call LoadAccountByEmailRepository with correct email', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail')

      await sut.auth(fakeLogin)

      expect(loadSpy).toHaveBeenCalledWith(fakeLogin.email)
    })

    it('Should throw if LoadAccountByEmailRepository throws', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())

      const promise = sut.auth(fakeLogin)

      await expect(promise).rejects.toThrow()
    })

    it('Should return null if LoadAccountByEmailRepository returns null', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(undefined)

      const accessToken = await sut.auth(fakeLogin)

      expect(accessToken).toBeNull()
    })
  })

  describe('tests HashComparer', () => {
    it('Should call HashComparer with correct values', async () => {
      const { sut, hashComparerStub } = makeSut()
      const compareSpy = jest.spyOn(hashComparerStub, 'compare')

      await sut.auth(fakeLogin)

      expect(compareSpy).toHaveBeenCalledWith({ value: 'any_password', hash: 'valid_password' })
    })

    it('Should throw if HashComparer throws', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())

      const promise = sut.auth(fakeLogin)

      await expect(promise).rejects.toThrow()
    })

    it('Should return null if HashComparer returns false', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)

      const accessToken = await sut.auth(fakeLogin)

      expect(accessToken).toBeNull()
    })
  })

  describe('tests TokenGenerator', () => {
    it('Should call TokenGenerator with correct id', async () => {
      const { sut, tokenGeneratorStub } = makeSut()
      const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')

      await sut.auth(fakeLogin)

      expect(generateSpy).toHaveBeenCalledWith({ sub: 'valid_id' })
    })

    it('Should throw if TokenGenerator throws', async () => {
      const { sut, tokenGeneratorStub } = makeSut()
      jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(new Error())

      const promise = sut.auth(fakeLogin)

      await expect(promise).rejects.toThrow()
    })

    it('Should return a token on success', async () => {
      const { sut } = makeSut()

      const accessToken = await sut.auth(fakeLogin)

      expect(accessToken).toBe('any_token')
    })
  })

  describe('tests UpdateAccessTokenRepository', () => {
    it('Should call UpdateAccessTokenRepository with correct values', async () => {
      const { sut, updateAccessTokenRepositoryStub } = makeSut()
      const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

      await sut.auth(fakeLogin)

      expect(updateSpy).toHaveBeenCalledWith({ id: 'valid_id', token: 'hashed_value' })
    })

    it('Should throw if UpdateAccessTokenRepository throws', async () => {
      const { sut, updateAccessTokenRepositoryStub } = makeSut()
      jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())

      const promise = sut.auth(fakeLogin)

      await expect(promise).rejects.toThrow()
    })
  })
})
