import { DbAuthentication } from '@/data/use-cases'
import {
  type HashComparer,
  type TokenGenerator,
  type LoadGuardianByEmailRepository,
  type UpdateAccessTokenRepository,
  type HashGenerator
} from '@/data/protocols'
import {
  makeFakeLogin,
  makeLoadGuardianByEmail,
  makeHashComparer,
  makeTokenGenerator,
  makeUpdateAccessTokenRepository,
  makeHashGenerator,
  makeFakeGuardianWithIdData
} from '@/tests/utils'

interface SutTypes {
  sut: DbAuthentication
  LoadGuardianByEmailRepositoryStub: LoadGuardianByEmailRepository
  hashGeneratorStub: HashGenerator
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const LoadGuardianByEmailRepositoryStub = makeLoadGuardianByEmail(makeFakeGuardianWithIdData())
  const hashGeneratorStub = makeHashGenerator()
  const hashComparerStub = makeHashComparer()
  const tokenGeneratorStub = makeTokenGenerator()
  const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepository()
  const sut = new DbAuthentication(
    {
      loadGuardianByEmailRepository: LoadGuardianByEmailRepositoryStub,
      hashGenerator: hashGeneratorStub,
      hashComparer: hashComparerStub,
      tokenGenerator: tokenGeneratorStub,
      updateAccessTokenRepository: updateAccessTokenRepositoryStub
    }
  )
  return {
    sut,
    LoadGuardianByEmailRepositoryStub,
    hashGeneratorStub,
    hashComparerStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}
describe('DbAuthentication UseCase', () => {
  const fakeLogin = makeFakeLogin()

  describe('tests LoadAccountByEmailRepository', () => {
    it('Should call LoadAccountByEmailRepository with correct email', async () => {
      const { sut, LoadGuardianByEmailRepositoryStub } = makeSut()
      const loadSpy = jest.spyOn(LoadGuardianByEmailRepositoryStub, 'loadByEmail')

      await sut.auth(fakeLogin)

      expect(loadSpy).toHaveBeenCalledWith(fakeLogin.email)
    })

    it('Should throw if LoadAccountByEmailRepository throws', async () => {
      const { sut, LoadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(LoadGuardianByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
      const promise = sut.auth(fakeLogin)
      await expect(promise).rejects.toThrow()
    })

    it('Should return null if LoadAccountByEmailRepository returns null', async () => {
      const { sut, LoadGuardianByEmailRepositoryStub } = makeSut()
      jest.spyOn(LoadGuardianByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(undefined)
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

  describe('tests UpdateAccessTokenRepository service', () => {
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
