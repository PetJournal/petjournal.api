import { makeFakeGuardianData, makeFakePayload } from '../mocks'
import {
  type TokenDecoder,
  type HashGenerator,
  type LoadGuardianByIdRepository,
  type LoadGuardianByEmailRepository,
  type HashComparer,
  type TokenGenerator,
  type UpdateAccessTokenRepository,
  type UpdateVerificationTokenRepository
} from '@/data/protocols'
import { type Guardian } from '@prisma/client'

const makeEncrypter = (): HashGenerator => {
  class EncrypterStub implements HashGenerator {
    async encrypt (input: HashGenerator.Params): Promise<HashGenerator.Result> {
      return 'hashed_password'
    }
  }
  return new EncrypterStub()
}

const makeHashComparer = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare ({ value, hash }: HashComparer.Params): Promise<HashComparer.Result> {
      return true
    }
  }
  return new HashComparerStub()
}

const makeHashGenerator = (): HashGenerator => {
  class HashComparerStub implements HashGenerator {
    async encrypt ({ value }: HashGenerator.Params): Promise<HashGenerator.Result> {
      return 'hashed_value'
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

const makeTokenDecoder = (): TokenDecoder => {
  class TokenDecoderStub implements TokenDecoder {
    async decode (token: TokenDecoder.Params): Promise<TokenDecoder.Result> {
      return makeFakePayload()
    }
  }
  return new TokenDecoderStub()
}

const makeLoadGuardianById = (): LoadGuardianByIdRepository => {
  class LoadGuardianByIdStub implements LoadGuardianByIdRepository {
    async loadById (id: LoadGuardianByIdRepository.Params): Promise<LoadGuardianByIdRepository.Result> {
      return makeFakeGuardianData() as Guardian
    }
  }
  return new LoadGuardianByIdStub()
}

const makeLoadGuardianByEmail = (data: Guardian): LoadGuardianByEmailRepository => {
  class LoadGuardianByEmailRepositoryStub implements LoadGuardianByEmailRepository {
    async loadByEmail (email: LoadGuardianByEmailRepository.Params): Promise<LoadGuardianByEmailRepository.Result> {
      return data
    }
  }
  return new LoadGuardianByEmailRepositoryStub()
}

const makeUpdateAccessTokenRepository = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async updateAccessToken (authentication: UpdateAccessTokenRepository.Params): Promise<UpdateAccessTokenRepository.Result> {
      return true
    }
  }
  return new UpdateAccessTokenRepositoryStub()
}

const makeUpdateVerificationTokenRepository = (): UpdateVerificationTokenRepository => {
  class UpdateVerificationTokenRepositoryStub implements UpdateVerificationTokenRepository {
    async updateVerificationToken (credentials: UpdateVerificationTokenRepository.Params): Promise<UpdateVerificationTokenRepository.Result> {
      return true
    }
  }
  return new UpdateVerificationTokenRepositoryStub()
}

export {
  makeEncrypter,
  makeHashComparer,
  makeHashGenerator,
  makeTokenGenerator,
  makeTokenDecoder,
  makeLoadGuardianById,
  makeLoadGuardianByEmail,
  makeUpdateAccessTokenRepository,
  makeUpdateVerificationTokenRepository
}
