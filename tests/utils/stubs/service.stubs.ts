
import {
  makeFakePayload,
  mockFakeGuardianAdded,
  mockFakeGuardianLoaded
} from '@/tests/utils'
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
  type UpdateVerificationTokenRepository,
  type UpdateGuardianPasswordRepository,
  type AddPetRepository
} from '@/data/protocols'

const makeFakeGuardianRepository = ():
AddGuardianRepository &
LoadGuardianByEmailRepository &
LoadGuardianByIdRepository &
UpdateAccessTokenRepository &
UpdateGuardianPasswordRepository &
UpdateVerificationTokenRepository => {
  class GuardianRepositoryStub implements
  AddGuardianRepository,
  LoadGuardianByEmailRepository,
  LoadGuardianByIdRepository,
  UpdateAccessTokenRepository,
  UpdateGuardianPasswordRepository,
  UpdateVerificationTokenRepository {
    async add (guardian: AddGuardianRepository.Params): Promise<AddGuardianRepository.Result> {
      return mockFakeGuardianAdded()
    }

    async loadByEmail (email: string): Promise<LoadGuardianByEmailRepository.Result> {
      return mockFakeGuardianLoaded()
    }

    async loadById (id: string): Promise<LoadGuardianByIdRepository.Result> {
      return mockFakeGuardianLoaded()
    }

    async updateAccessToken (authentication: UpdateAccessTokenRepository.Params): Promise<boolean> {
      return true
    }

    async updatePassword (userData: UpdateGuardianPasswordRepository.Params): Promise<UpdateGuardianPasswordRepository.Result> {
      return true
    }

    async updateVerificationToken (credentials: UpdateVerificationTokenRepository.Params): Promise<UpdateVerificationTokenRepository.Result> {
      return true
    }
  }
  return new GuardianRepositoryStub()
}

const makeFakePetRepository = (): AddPetRepository => {
  class PetRepositoryStub implements AddPetRepository {
    async add (guardian: AddPetRepository.Params): Promise<AddPetRepository.Result> {
      return {
        id: 'any_id',
        guardianId: 'any_guardian_id',
        specieId: 'any_specie_id'
      }
    }
  }

  return new PetRepositoryStub()
}

const makeFakeHashService = (): HashGenerator & HashComparer => {
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

const makeFakeTokenService = (): TokenGenerator & TokenDecoder => {
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

const makeFakeEmailService = (): EmailService => {
  class EmailServiceStub implements EmailService {
    async send (options: EmailService.Options): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new EmailServiceStub()
}

export {
  makeFakeGuardianRepository,
  makeFakePetRepository,
  makeFakeHashService,
  makeFakeEmailService,
  makeFakeTokenService
}
