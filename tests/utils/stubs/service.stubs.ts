import { type Guardian, makeFakeGuardianData, makeFakePayload } from '@/tests/utils'
import {
  type TokenDecoder,
  type HashGenerator,
  type HashComparer,
  type TokenGenerator,
  type AddGuardianRepository,
  type LoadGuardianByIdRepository,
  type LoadGuardianByEmailRepository,
  type UpdateAccessTokenRepository,
  type UpdateGuardianPasswordRepository
} from '@/data/protocols'

const makeEncrypter = (): HashGenerator => {
  class EncrypterStub implements HashGenerator {
    async encrypt (input: HashGenerator.Params): Promise<HashGenerator.Result> {
      return 'hashed_password'
    }
  }
  return new EncrypterStub()
}

const makeFakeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare ({ value, hash }: HashComparer.Params): Promise<HashComparer.Result> {
      return true
    }
  }
  return new HashComparerStub()
}

const makeFakeHashGenerator = (): HashGenerator => {
  class HashComparerStub implements HashGenerator {
    async encrypt ({ value }: HashGenerator.Params): Promise<HashGenerator.Result> {
      return 'hashed_value'
    }
  }
  return new HashComparerStub()
}

const makeFakeTokenGenerator = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (payload: any): Promise<string> {
      return 'any_token'
    }
  }
  return new TokenGeneratorStub()
}

const makeFakeTokenDecoder = (): TokenDecoder => {
  class TokenDecoderStub implements TokenDecoder {
    async decode (token: TokenDecoder.Params): Promise<TokenDecoder.Result> {
      return makeFakePayload()
    }
  }
  return new TokenDecoderStub()
}

const makeFakeAddGuardianRepository = (): AddGuardianRepository => {
  class AddGuardianRepositoryStub implements AddGuardianRepository {
    async add (id: AddGuardianRepository.Params): Promise<AddGuardianRepository.Result> {
      return makeFakeGuardianData({ withId: true }) as Guardian & { id: string }
    }
  }
  return new AddGuardianRepositoryStub()
}

const makeFakeLoadGuardianByIdRepository = (): LoadGuardianByIdRepository => {
  class LoadGuardianByIdStub implements LoadGuardianByIdRepository {
    async loadById (id: LoadGuardianByIdRepository.Params): Promise<LoadGuardianByIdRepository.Result> {
      return makeFakeGuardianData({ withId: true }) as Guardian & { id: string }
    }
  }
  return new LoadGuardianByIdStub()
}

const makeFakeLoadGuardianByEmailRepository = (): LoadGuardianByEmailRepository => {
  class LoadGuardianByEmailRepositoryStub implements LoadGuardianByEmailRepository {
    async loadByEmail (email: LoadGuardianByEmailRepository.Params): Promise<LoadGuardianByEmailRepository.Result> {
      return makeFakeGuardianData({ withId: true }) as Guardian & { id: string }
    }
  }
  return new LoadGuardianByEmailRepositoryStub()
}

const makeFakeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (authentication: UpdateAccessTokenRepository.Params): Promise<UpdateAccessTokenRepository.Result> {
      return true
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeFakeUpdateGuardianPasswordRepository = (): UpdateGuardianPasswordRepository => {
  class UpdateGuardianPasswordRepositoryStub implements UpdateGuardianPasswordRepository {
    async updatePassword (userData: UpdateGuardianPasswordRepository.Params): Promise<UpdateGuardianPasswordRepository.Result> {
      return true
    }
  }
  return new UpdateGuardianPasswordRepositoryStub()
}

export {
  makeEncrypter,
  makeFakeHashComparer,
  makeFakeHashGenerator,
  makeFakeTokenGenerator,
  makeFakeTokenDecoder,
  makeFakeAddGuardianRepository,
  makeFakeLoadGuardianByIdRepository,
  makeFakeLoadGuardianByEmailRepository,
  makeFakeUpdateAccessTokenRepository,
  makeFakeUpdateGuardianPasswordRepository
}
