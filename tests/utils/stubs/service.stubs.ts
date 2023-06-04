import { makeFakePayload } from '../mocks'
import {
  type TokenDecoder,
  type HashGenerator,
  type LoadGuardianByIdRepository,
  type LoadGuardianByEmailRepository,
  type HashComparer,
  type TokenGenerator,
  type UpdateAccessTokenRepository,
  type AddGuardianRepository
} from '@/data/protocols'
import { type GuardianWithId } from '../types'

const makeGuardianRepository = (fakeGuardianData?: GuardianWithId):
AddGuardianRepository &
LoadGuardianByEmailRepository &
LoadGuardianByIdRepository &
UpdateAccessTokenRepository => {
  class GuardianRepositoryStub implements
  AddGuardianRepository,
  LoadGuardianByEmailRepository,
  LoadGuardianByIdRepository,
  UpdateAccessTokenRepository {
    constructor (private readonly fakeGuardianData: LoadGuardianByEmailRepository.Result) {}

    async add (guardian: AddGuardianRepository.Params): Promise<AddGuardianRepository.Result> {
      const result = {
        id: 'any_id',
        firstName: guardian.firstName,
        lastName: guardian.lastName,
        email: guardian.email,
        phone: guardian.phone
      }
      return result
    }

    async updateAccessToken (authentication: UpdateAccessTokenRepository.Params): Promise<boolean> {
      return true
    }

    async loadByEmail (email: string): Promise<LoadGuardianByEmailRepository.Result> {
      return this.fakeGuardianData
    }

    async loadById (id: string): Promise<LoadGuardianByIdRepository.Result> {
      return this.fakeGuardianData
    }
  }
  return new GuardianRepositoryStub(fakeGuardianData)
}

const makeHashService = (): HashGenerator & HashComparer => {
  class HashServiceStub implements HashGenerator, HashComparer {
    async compare (input: HashComparer.Params): Promise<boolean> {
      return true
    }

    async encrypt (input: HashGenerator.Params): Promise<string> {
      return 'hashed_value'
    }
  }
  return new HashServiceStub()
}

const makeTokenService = (): TokenGenerator & TokenDecoder => {
  class TokenServiceStub implements TokenGenerator, TokenDecoder {
    async generate (payload: any): Promise<string> {
      return 'any_token'
    }

    async decode (token: TokenDecoder.Params): Promise<TokenDecoder.Result> {
      return makeFakePayload()
    }
  }
  return new TokenServiceStub()
}

export {
  makeTokenService,
  makeHashService,
  makeGuardianRepository
}
