import { makeFakePayload } from '../mocks'
import {
  type EmailService,
  type AddGuardianRepository,
  type HashComparer,
  type HashGenerator,
  type LoadGuardianByEmailRepository,
  type LoadGuardianByIdRepository,
  type TokenDecoder,
  type TokenGenerator,
  type UpdateAccessTokenRepository,
  type UpdateGuardianPasswordRepository
} from '@/data/protocols'
import { type Guardian } from '../types'

const makeGuardianRepository = (fakeGuardianData?: Guardian & { id: string }):
AddGuardianRepository &
LoadGuardianByEmailRepository &
LoadGuardianByIdRepository &
UpdateAccessTokenRepository &
UpdateGuardianPasswordRepository => {
  class GuardianRepositoryStub implements
  AddGuardianRepository,
  LoadGuardianByEmailRepository,
  LoadGuardianByIdRepository,
  UpdateAccessTokenRepository,
  UpdateGuardianPasswordRepository {
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

    async updatePassword (userData: UpdateGuardianPasswordRepository.Params): Promise<UpdateGuardianPasswordRepository.Result> {
      return true
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

const makeEmailService = (): EmailService => {
  class EmailServiceStub implements EmailService {
    async send (options: EmailService.Options): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new EmailServiceStub()
}

export {
  makeEmailService,
  makeGuardianRepository,
  makeHashService,
  makeTokenService
}
