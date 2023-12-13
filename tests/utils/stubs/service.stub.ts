import {
  mockFakeGuardianAdded,
  mockFakeGuardianLoaded,
  mockFakePetAdded
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
  type AddPetRepository,
  type LoadSpecieByIdRepository,
  type LoadSpecieByNameRepository
} from '@/data/protocols'
import { type LoadCatSizesRepository } from '@/data/protocols/db/size/load-cat-sizes-repository'
import { type LoadDogSizesRepository } from '@/data/protocols/db/size/load-dog-sizes-repository'

const mockHashService = {
  hashedValue: 'hashed_value'
}

const mockTokenService = {
  anyToken: 'any_token',
  validId: { sub: 'valid_id' }
}

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
    async add (petData: AddPetRepository.Params): Promise<AddPetRepository.Result> {
      return mockFakePetAdded()
    }
  }

  return new PetRepositoryStub()
}

const makeFakeSpecieRepository = ():
LoadSpecieByIdRepository &
LoadSpecieByNameRepository => {
  class SpecieRepositoryStub implements
  LoadSpecieByIdRepository,
  LoadSpecieByNameRepository {
    async loadById (specieData: LoadSpecieByIdRepository.Params): Promise<LoadSpecieByIdRepository.Result> {
      return {
        id: 'any_id',
        name: 'any_name'
      }
    }

    async loadByName (specieData: LoadSpecieByNameRepository.Params): Promise<LoadSpecieByNameRepository.Result> {
      return {
        id: 'any_id',
        name: 'any_name'
      }
    }
  }

  return new SpecieRepositoryStub()
}

const makeFakeHashService = (): HashGenerator & HashComparer => {
  class HashServiceStub implements HashGenerator, HashComparer {
    async compare (input: HashComparer.Params): Promise<boolean> {
      return true
    }

    async encrypt (input: HashGenerator.Params): Promise<string> {
      return mockHashService.hashedValue
    }
  }
  return new HashServiceStub()
}

const makeFakeTokenService = (): TokenGenerator & TokenDecoder => {
  class TokenServiceStub implements TokenGenerator, TokenDecoder {
    async generate (payload: any): Promise<string> {
      return mockTokenService.anyToken
    }

    async decode (token: TokenDecoder.Params): Promise<TokenDecoder.Result> {
      return mockTokenService.validId
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

const makeFakeLoadCatSizesRepository = (): LoadCatSizesRepository => {
  class LoadCatSizesRepositoryStub implements LoadCatSizesRepository {
    async loadCatSizes (): Promise<LoadCatSizesRepository.Result> {
      return [
        {
          name: 'any_name'
        }
      ]
    }
  }
  return new LoadCatSizesRepositoryStub()
}

const makeFakeLoadDogSizesRepository = (): LoadDogSizesRepository => {
  class LoadDogSizesRepositoryStub implements LoadDogSizesRepository {
    async loadDogSizes (): Promise<LoadDogSizesRepository.Result> {
      return [
        {
          name: 'any_name'
        }
      ]
    }
  }
  return new LoadDogSizesRepositoryStub()
}

export {
  mockHashService,
  mockTokenService,
  makeFakeGuardianRepository,
  makeFakePetRepository,
  makeFakeSpecieRepository,
  makeFakeHashService,
  makeFakeEmailService,
  makeFakeTokenService,
  makeFakeLoadCatSizesRepository,
  makeFakeLoadDogSizesRepository
}
