import { InvalidForgetCodeError, NotFoundError } from '@/application/errors'
import {
  type TokenGenerator,
  type HashComparer,
  type LoadGuardianByEmailRepository,
  type HashGenerator,
  type UpdateAccessTokenRepository
} from '@/data/protocols'
import { DbForgetCodeAuthentication } from '@/data/use-cases/db-forget-code-authentication'
import {
  makeFakeGuardianWithIdData,
  makeHashComparer,
  makeHashGenerator,
  makeLoadGuardianByEmail,
  makeTokenGenerator,
  makeUpdateAccessTokenRepository
} from '@/tests/utils'

interface SutTypes {
  sut: DbForgetCodeAuthentication
  loadGuardianByEmailRepositoryStub: LoadGuardianByEmailRepository
  hashComparerStub: HashComparer
  hashGeneratorStub: HashGenerator
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const loadGuardianByEmailRepositoryStub = makeLoadGuardianByEmail(makeFakeGuardianWithIdData())
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const hashGeneratorStub = makeHashGenerator()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbForgetCodeAuthentication({
    loadGuardianByEmailRepository: loadGuardianByEmailRepositoryStub,
    updateAccessTokenRepository: updateAccessTokenRepositoryStub,
    hashComparer: hashComparerStub,
    tokenGenerator: tokenGeneratorStub,
    hashGenerator: hashGeneratorStub
  })
  return {
    sut,
    loadGuardianByEmailRepositoryStub,
    updateAccessTokenRepositoryStub,
    hashComparerStub,
    hashGeneratorStub,
    tokenGeneratorStub
  }
}

describe('DbForgetCodeAuthentication UseCase', () => {
  const fakeInput = {
    email: 'any_email',
    forgetPasswordCode: 'any_code'
  }

  describe('tests LoadGuardianByEmailRepository', () => {
    it('Should return NotFoundError if not found email is provided', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(undefined)

      const result = await sut.auth(fakeInput)

      expect(result).toStrictEqual(new NotFoundError('email'))
    })

    it('Should throw if LoadGuardianByEmailRepository throws', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())

      const promise = sut.auth(fakeInput)

      await expect(promise).rejects.toThrow()
    })

    it('Should call LoadGuardianByEmailRepository with correct email', async () => {
      const { sut, loadGuardianByEmailRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail')

      await sut.auth(fakeInput)

      expect(loadSpy).toHaveBeenCalledWith(fakeInput.email)
    })
  })

  describe('test HashComparer', () => {
    it('should return InvalidForgetCodeError if invalid code is provided', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)

      const result = await sut.auth(fakeInput)

      expect(result).toStrictEqual(new InvalidForgetCodeError())
    })

    it('should call HashComparer with empty value if falsy forgetPasswordToken is provided', async () => {
      const { sut, hashComparerStub, loadGuardianByEmailRepositoryStub } = makeSut()
      const fakeGuardian = { ...makeFakeGuardianWithIdData(), forgetPasswordToken: null }
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(fakeGuardian)
      const spyHashComparer = jest.spyOn(hashComparerStub, 'compare')

      await sut.auth(fakeInput)

      expect(spyHashComparer).toHaveBeenCalledWith({ value: fakeInput.forgetPasswordCode, hash: '' })
    })

    it('Should throw if HashComparer throws', async () => {
      const { sut, hashComparerStub } = makeSut()
      jest.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())

      const promise = sut.auth(fakeInput)

      await expect(promise).rejects.toThrow()
    })

    it('should call HashComparer with correct values', async () => {
      const { sut, hashComparerStub, loadGuardianByEmailRepositoryStub } = makeSut()
      const fakeGuardian = makeFakeGuardianWithIdData()
      jest.spyOn(loadGuardianByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(fakeGuardian)
      const spyHashComparer = jest.spyOn(hashComparerStub, 'compare')

      await sut.auth(fakeInput)

      expect(spyHashComparer).toHaveBeenCalledWith({ value: fakeInput.forgetPasswordCode, hash: fakeGuardian.forgetPasswordToken })
    })
  })

  describe('test TokenGenerator', () => {
    it('should call TokenGenerator with correct value', async () => {
      const { sut, tokenGeneratorStub } = makeSut()
      const spyTokenGenerator = jest.spyOn(tokenGeneratorStub, 'generate')

      await sut.auth(fakeInput)

      expect(spyTokenGenerator).toHaveBeenCalledWith({ sub: makeFakeGuardianWithIdData().id })
    })
  })

  describe('test HashGenerator', () => {
    it('should call HashGenerator with correct value', async () => {
      const { sut, hashGeneratorStub, tokenGeneratorStub } = makeSut()
      const spyHashGenerator = jest.spyOn(hashGeneratorStub, 'encrypt')
      jest.spyOn(tokenGeneratorStub, 'generate').mockResolvedValueOnce('valid_token')

      await sut.auth(fakeInput)

      expect(spyHashGenerator).toHaveBeenCalledWith({ value: 'valid_token' })
    })
  })

  describe('tests UpdateAccessTokenRepository service', () => {
    it('Should call UpdateAccessTokenRepository with correct values', async () => {
      const { sut, updateAccessTokenRepositoryStub } = makeSut()
      const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')

      await sut.auth(fakeInput)

      expect(updateSpy).toHaveBeenCalledWith({ id: 'valid_id', token: 'hashed_value' })
    })
  })

  describe('When success', () => {
    it('should return valid token', async () => {
      const { sut } = makeSut()

      const result = await sut.auth(fakeInput)

      expect(result).toBe('any_token')
    })
  })
})
