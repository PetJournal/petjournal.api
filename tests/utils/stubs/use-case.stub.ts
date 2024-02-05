import {
  type ForgetPassword,
  type AddGuardian,
  type Authentication,
  type CreateAccessToken,
  type ValidateVerificationToken,
  type ChangePassword,
  type AppointSpecie,
  type LoadGuardianName,
  type AddPet,
  type AppointPet,
  type LoadCatBreeds,
  type LoadDogBreeds,
  type LoadCatSizes,
  type LoadDogSizes
} from '@/domain/use-cases'
import { mockTokenService } from '@/tests/utils/stubs/service.stub'
import { mockFakeAppointPet, mockFakePetAdded, mockFakeSpecieAdded } from '../mocks'

const mockGuardianUseCase = {
  id: 'any_id',
  firstName: 'any_first_name',
  lastName: 'any_last_name',
  email: 'any_email@mail.com',
  password: 'any_password',
  phone: 'any_phone',
  accessToken: 'any_token'
}

const makeFakeAddGuardianUseCase = (): AddGuardian => {
  class AddGuardianStub implements AddGuardian {
    async add (guardian: AddGuardian.Params): Promise<AddGuardian.Result> {
      const result = {
        id: mockGuardianUseCase.id,
        firstName: mockGuardianUseCase.firstName,
        lastName: mockGuardianUseCase.lastName,
        email: mockGuardianUseCase.email,
        password: mockGuardianUseCase.password,
        phone: mockGuardianUseCase.phone
      }
      return result
    }
  }
  return new AddGuardianStub()
}

const makeFakeAuthenticationUseCase = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
      return mockGuardianUseCase.accessToken
    }
  }
  return new AuthenticationStub()
}

const makeFakeForgetPasswordUseCase = (): ForgetPassword => {
  class ForgetPasswordStub implements ForgetPassword {
    async forgetPassword (email: ForgetPassword.Params): Promise<ForgetPassword.Result> {
      return await Promise.resolve(true)
    }
  }
  return new ForgetPasswordStub()
}

const makeFakeChangePasswordUseCase = (): ChangePassword => {
  class ChangePasswordStub implements ChangePassword {
    async change (userData: ChangePassword.Params): Promise<ChangePassword.Result> {
      return { isSuccess: true }
    }
  }
  return new ChangePasswordStub()
}

const makeFakeCreateAccessTokenUseCase = (): CreateAccessToken => {
  class CreateAccessTokenStub implements CreateAccessToken {
    async create (email: string): Promise<CreateAccessToken.Result> {
      return mockTokenService.anyToken
    }
  }
  return new CreateAccessTokenStub()
}

const makeFakeValidateVerificationTokenUseCase = (): ValidateVerificationToken => {
  class ValidateVerificationTokenStub implements ValidateVerificationToken {
    async validate (input: ValidateVerificationToken.Params): Promise<ValidateVerificationToken.Result> {
      return true
    }
  }
  return new ValidateVerificationTokenStub()
}

const makeFakeAddPetUseCase = (): AddPet => {
  class AddGuardianStub implements AddPet {
    async add (petData: AddPet.Params): Promise<AddPet.Result> {
      const result = {
        isSuccess: true,
        data: mockFakePetAdded()
      }
      return result
    }
  }
  return new AddGuardianStub()
}

const makeFakeAppointSpecieUseCase = (): AppointSpecie => {
  class AppointOtherSpecieStub implements AppointSpecie {
    async appoint (specieName: AppointSpecie.Params): Promise<AppointSpecie.Result> {
      return {
        specie: mockFakeSpecieAdded(),
        specieAlias: specieName
      }
    }
  }

  return new AppointOtherSpecieStub()
}

const makeFakeAppointPetUseCase = (): AppointPet => {
  class AppointPetStub implements AppointPet {
    async appoint (params: AppointPet.Params): Promise<AppointPet.Result> {
      return mockFakeAppointPet()
    }
  }

  return new AppointPetStub()
}

const makeLoadGuardianNameUseCase = (): LoadGuardianName => {
  class LoadGuardianNameStub implements LoadGuardianName {
    async load (userId: string): Promise<LoadGuardianName.Result> {
      return {
        firstName: 'any_first_name',
        lastName: 'any_last_name'
      }
    }
  }
  return new LoadGuardianNameStub()
}

const makeFakeLoadCatSizesUseCase = (): LoadCatSizes => {
  class LoadCatSizesStub implements LoadCatSizes {
    async load (): Promise<LoadCatSizes.Result> {
      return [{
        name: 'any_name'
      }]
    }
  }
  return new LoadCatSizesStub()
}

const makeFakeLoadDogSizesUSeCase = (): LoadDogSizes => {
  class LoadDogSizesStub implements LoadDogSizes {
    async load (): Promise<LoadDogSizes.Result> {
      return [{
        name: 'any_name'
      }]
    }
  }
  return new LoadDogSizesStub()
}

const makeLoadCatBreedsUseCase = (): LoadCatBreeds => {
  class LoadCatBreedsStub implements LoadCatBreeds {
    async load (): Promise<LoadCatBreeds.Result> {
      return [{
        name: 'any_name'
      }]
    }
  }
  return new LoadCatBreedsStub()
}

const makeLoadDogBreedsUseCase = (): LoadDogBreeds => {
  class LoadDogBreedsStub implements LoadDogBreeds {
    async load (): Promise<LoadDogBreeds.Result> {
      return [{
        name: 'any_name'
      }]
    }
  }
  return new LoadDogBreedsStub()
}

export {
  makeFakeAddGuardianUseCase,
  makeFakeAddPetUseCase,
  makeFakeAuthenticationUseCase,
  makeFakeForgetPasswordUseCase,
  makeFakeChangePasswordUseCase,
  makeFakeCreateAccessTokenUseCase,
  makeFakeValidateVerificationTokenUseCase,
  makeFakeAppointSpecieUseCase,
  makeLoadGuardianNameUseCase,
  makeFakeAppointPetUseCase,
  makeLoadCatBreedsUseCase,
  makeLoadDogBreedsUseCase,
  makeFakeLoadCatSizesUseCase,
  makeFakeLoadDogSizesUSeCase
}
