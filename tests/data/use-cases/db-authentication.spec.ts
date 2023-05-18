import { type Authentication } from '@/domain/use-cases'
import { DbAuthentication } from '@/data/use-cases'
import { type LoadGuardianByEmailRepository, type HashComparer, type TokenGenerator, type UpdateAccessTokenRepository, type HashGenerator } from '@/data/protocols'

const makeFakeAccount = (): LoadGuardianByEmailRepository.Result => ({
  id: 'valid_id',
  firstName: 'valid_first_name',
  lastName: 'valid_last_name',
  email: 'valid_email@mail.com',
  phone: 'valid_phone',
  password: 'hashed_password',
  accessToken: 'valid_token',
  isPrivacyPolicyAccepted: true
})

const makeFakeAuthentication = (): Authentication.Params => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeLoadGuardianByEmailRepository = (): LoadGuardianByEmailRepository => {
  class LoadGuardianByEmailRepositoryStub implements LoadGuardianByEmailRepository {
    async loadByEmail (email: LoadGuardianByEmailRepository.Params): Promise<LoadGuardianByEmailRepository.Result> {
      return await Promise.resolve(makeFakeAccount())
    }
  }
  return new LoadGuardianByEmailRepositoryStub()
}

const makeHashGenerator = (): HashGenerator => {
  class HashComparerStub implements HashGenerator {
    async encrypt ({ value }: HashGenerator.Params): Promise<HashGenerator.Result> {
      return await Promise.resolve('hashed_value')
    }
  }
  return new HashComparerStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare ({ value, hash }: HashComparer.Params): Promise<HashComparer.Result> {
      return await Promise.resolve(true)
    }
  }
  return new HashComparerStub()
}

const makeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (payload: any): Promise<string> {
      return 'any_token'
    }
  }
  return new TokenGeneratorStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (authentication: UpdateAccessTokenRepository.Params): Promise<UpdateAccessTokenRepository.Result> {
      return true
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  sut: DbAuthentication
  LoadGuardianByEmailRepositoryStub: LoadGuardianByEmailRepository
  hashGeneratorStub: HashGenerator
  hashComparerStub: HashComparer
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const makeSut = (): SutTypes => {
  const LoadGuardianByEmailRepositoryStub = makeLoadGuardianByEmailRepository()
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
  it('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, LoadGuardianByEmailRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(LoadGuardianByEmailRepositoryStub, 'loadByEmail')
    await sut.auth(makeFakeAuthentication())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  it('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, LoadGuardianByEmailRepositoryStub } = makeSut()
    jest.spyOn(LoadGuardianByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, LoadGuardianByEmailRepositoryStub } = makeSut()
    jest.spyOn(LoadGuardianByEmailRepositoryStub, 'loadByEmail').mockResolvedValueOnce(undefined)
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  it('Should call hashGenerator with correct value', async () => {
    const { sut, hashGeneratorStub } = makeSut()
    const hashGeneratorSpy = jest.spyOn(hashGeneratorStub, 'encrypt')

    await sut.auth(makeFakeAuthentication())

    expect(hashGeneratorSpy).toHaveBeenCalledWith({ value: 'any_token' })
  })

  it('Should throw if hashGenerator throws', async () => {
    const { sut, hashGeneratorStub } = makeSut()
    jest.spyOn(hashGeneratorStub, 'encrypt').mockRejectedValueOnce(new Error())

    const promise = sut.auth(makeFakeAuthentication())

    await expect(promise).rejects.toThrow()
  })

  it('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(hashComparerStub, 'compare')
    await sut.auth(makeFakeAuthentication())
    expect(compareSpy).toHaveBeenCalledWith({ value: 'any_password', hash: 'hashed_password' })
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('Should return null if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.resolve(false))
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBeNull()
  })

  it('Should call TokenGenerator with correct id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await sut.auth(makeFakeAuthentication())
    expect(generateSpy).toHaveBeenCalledWith({ sub: 'valid_id' })
  })

  it('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })

  it('Should return a token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.auth(makeFakeAuthentication())
    expect(accessToken).toBe('any_token')
  })

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await sut.auth(makeFakeAuthentication())
    expect(updateSpy).toHaveBeenCalledWith({ id: 'valid_id', token: 'hashed_value' })
  })

  it('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { sut, updateAccessTokenRepositoryStub } = makeSut()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.auth(makeFakeAuthentication())
    await expect(promise).rejects.toThrow()
  })
})
