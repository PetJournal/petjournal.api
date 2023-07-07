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
  makeFakeTokenService,
  makeFakeHashService,
  makeFakeGuardianRepository
} from '@/tests/utils'
import { NotFoundError, UnauthorizedError } from '@/application/errors'

interface SutTypes {
  sut: DbAuthentication
  guardianRepositoryStub: LoadGuardianByEmailRepository & UpdateAccessTokenRepository
  hashServiceStub: HashGenerator & HashComparer
  tokenServiceStub: TokenGenerator
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const hashServiceStub = makeFakeHashService()
  const tokenServiceStub = makeFakeTokenService()
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
  const params: Authentication.Params = {
    email: 'any_email@mail.com',
    sensitiveData: { field: 'password', value: 'any_data' }
  }

  describe('HashService', () => {
    it('Should call encrypt method with correct token', async () => {
      const { sut, hashServiceStub } = makeSut()
      const hashGeneratorSpy = jest.spyOn(hashServiceStub, 'encrypt')
      await sut.auth(params)
      expect(hashGeneratorSpy).toHaveBeenCalledWith({ value: 'any_token' })
    })

    it('Should throw if encrypt method throws', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'encrypt').mockRejectedValue(new Error())
      const promise = sut.auth(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should call compare method with correct value and hash', async () => {
      const { sut, hashServiceStub } = makeSut()
      const hashComparerSpy = jest.spyOn(hashServiceStub, 'compare')
      await sut.auth(params)
      expect(hashComparerSpy).toHaveBeenCalledWith({ value: 'any_data', hash: 'any_hashed_password' })
    })

    it('Should throw if compare method throws', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'compare').mockRejectedValue(new Error())
      const promise = sut.auth(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should returns unauthorized if the result is invalid', async () => {
      const { sut, hashServiceStub } = makeSut()
      jest.spyOn(hashServiceStub, 'compare').mockResolvedValue(false)
      const result = await sut.auth(params)
      expect(result).toEqual(new UnauthorizedError())
    })
  })

  describe('TokenService', () => {
    it('Should call generate method with correct subject (userId)', async () => {
      const { sut, tokenServiceStub } = makeSut()
      const tokenGeneratorSpy = jest.spyOn(tokenServiceStub, 'generate')
      await sut.auth(params)
      expect(tokenGeneratorSpy).toHaveBeenCalledWith({ sub: 'any_id' })
    })

    it('Should throw if generate method throws', async () => {
      const { sut, tokenServiceStub } = makeSut()
      jest.spyOn(tokenServiceStub, 'generate').mockRejectedValue(new Error())
      const promise = sut.auth(params)
      await expect(promise).rejects.toThrow()
    })
  })

  describe('GuardianRepository', () => {
    it('Should call loadByEmail method with correct email', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const loadByEmailSpy = jest.spyOn(guardianRepositoryStub, 'loadByEmail')
      await sut.auth(params)
      expect(loadByEmailSpy).toHaveBeenCalledWith(params.email)
    })

    it('Should throw if loadByEmail method throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockRejectedValue(new Error())
      const promise = sut.auth(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return not found error if email does not exist', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'loadByEmail').mockResolvedValue(null)
      const result = await sut.auth(params)
      expect(result).toEqual(new NotFoundError('email'))
    })

    it('Should call updateAccessToken method with correct subject (userId)', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      const updateAccessTokenSpy = jest.spyOn(guardianRepositoryStub, 'updateAccessToken')
      await sut.auth(params)
      expect(updateAccessTokenSpy).toHaveBeenCalledWith({ userId: 'any_id', token: 'hashed_value' })
    })

    it('Should throw if updateAccessToken throws', async () => {
      const { sut, guardianRepositoryStub } = makeSut()
      jest.spyOn(guardianRepositoryStub, 'updateAccessToken').mockRejectedValue(new Error())
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
