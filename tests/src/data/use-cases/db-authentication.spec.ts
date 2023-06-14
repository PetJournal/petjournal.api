import { type Authentication } from '@/domain/use-cases'
import { type HashComparer, type HashGenerator, type TokenGenerator, type LoadGuardianByEmailRepository, type UpdateAccessTokenRepository } from '@/data/protocols'
import { DbAuthentication } from '@/data/use-cases'
import {
  makeFakeHashComparer,
  makeFakeTokenGenerator,
  makeFakeLoadGuardianByEmailRepository,
  makeFakeUpdateAccessTokenRepository,
  makeFakeHashGenerator
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
  const params: Authentication.Params = {
    email: 'any_email@mail.com',
    sensitiveData: { field: 'password', value: 'any_data' }
  }

  describe('HashGenerator', () => {
    it('Should call HashGenerator with correct token', async () => {
      const { sut, hashGeneratorStub } = makeSut()
      const hashGeneratorSpy = jest.spyOn(hashGeneratorStub, 'encrypt')
      await sut.auth(params)
      expect(hashGeneratorSpy).toHaveBeenCalledWith({ value: 'any_token' })
    })

    it('Should throw if HashGenerator throws', async () => {
      const { sut, hashGeneratorStub } = makeSut()
      jest.spyOn(hashGeneratorStub, 'encrypt').mockRejectedValue(new Error())
      const promise = sut.auth(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('HashComparator', () => {
    it('Should call HashGenerator with correct value and hash', async () => {
      const { sut, hashComparerStub } = makeSut()
      const hashComparerSpy = jest.spyOn(hashComparerStub, 'compare')
      await sut.auth(params)
      expect(hashComparerSpy).toHaveBeenCalledWith({ value: 'any_data', hash: 'any_hashed_password' })
    })

    it('Should throw if HashGenerator throws', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare').mockRejectedValue(new Error())
      const promise = sut.auth(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should returns unauthorized if the result is invalid', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare').mockResolvedValue(false)
      const result = await sut.auth(params)
      expect(result).toEqual(new UnauthorizedError())
    })
  })

  describe('TokenGenerator', () => {
    it('Should call TokenGenerator with correct subject (userId)', async () => {
      const { sut, tokenGeneratorStub } = makeSut()
      const tokenGeneratorSpy = jest.spyOn(tokenGeneratorStub, 'generate')
      await sut.auth(params)
      expect(tokenGeneratorSpy).toHaveBeenCalledWith({ sub: 'any_id' })
    })

    it('Should throw if TokenGenerator throws', async () => {
      const { sut, tokenGeneratorStub } = makeSut()
      jest.spyOn(tokenGeneratorStub, 'generate').mockRejectedValue(new Error())
      const promise = sut.auth(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('LoadGuardianByEmailRepository', () => {
    it('Should call LoadGuardianByEmailRepository with correct email', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail')
      await sut.auth(params)
      expect(loadByEmailSpy).toHaveBeenCalledWith(params.email)
    })

    it('Should throw if LoadGuardianByEmailRepository throws', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockRejectedValue(new Error())
      const promise = sut.auth(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return not found error if email does not exist', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockResolvedValue(undefined)
      const result = await sut.auth(params)
      expect(result).toEqual(new NotFoundError('email'))
    })
  })

  describe('UpdateAccessTokenRepository', () => {
    it('Should call UpdateAccessTokenRepository with correct subject (userId)', async () => {
      const { sut, updateAccessTokenRepositoryStub } = makeSut()
      const updateAccessTokenSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
      await sut.auth(params)
      expect(updateAccessTokenSpy).toHaveBeenCalledWith({ id: 'any_id', token: 'hashed_value' })
    })

    it('Should throw if UpdateAccessTokenRepository throws', async () => {
      const { sut, updateAccessTokenRepositoryStub } = makeSut()
      jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValue(new Error())
      const promise = sut.auth(params)
      await expect(promise).rejects.toThrow()
    })
  })

  test('Should return an accessToken when received data is valid', async () => {
    const { sut } = makeSut()
    const result = await sut.auth(params)
    expect(result).toEqual('any_token')
  })
})
