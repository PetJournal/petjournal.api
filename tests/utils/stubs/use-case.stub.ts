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
  type UpdatePet,
  type AppointPet,
  type LoadCatBreeds,
  type LoadDogBreeds,
  type LoadCatSizes,
  type LoadDogSizes,
  type LoadPets,
  type DeletePet,
  type EmailConfirmation,
  type SendEmail,
  type AddTag
} from '@/domain/use-cases'
import { mockTokenService } from '@/tests/utils/stubs/service.stub'
import { mockFakeAppointPet, mockFakePetUpdated, mockFakePetByGuardianIdLoaded, mockFakeSpecieAdded, makeFakeGuardianData, mockFakeBreedAdded, mockFakeSizeAdded } from '../mocks'
import { PetGender } from '@/domain/models'

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

const makeFakeEmailConfirmationUseCase = (): EmailConfirmation => {
  class EmailConfirmationStub implements EmailConfirmation {
    async confirm (userId: EmailConfirmation.Params): Promise<EmailConfirmation.Result> {
      return {
        isSuccess: true,
        data: {
          userId: 'any_id',
          email: 'any_email@mail.com'

        }
      }
    }
  }
  return new EmailConfirmationStub()
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
      const {
        password,
        accessToken,
        verificationToken,
        verificationTokenCreatedAt,
        ...guardian
      } = makeFakeGuardianData()

      const result: AddPet.Result = {
        isSuccess: true,
        data: {
          id: 'any_id',
          guardian,
          specie: mockFakeSpecieAdded(),
          specieAlias: 'any_specie_alias',
          breed: mockFakeBreedAdded(),
          breedAlias: 'any_breed_alias',
          petName: 'any_pet_name',
          gender: PetGender.MALE,
          size: mockFakeSizeAdded(),
          castrated: false,
          image: 'any_image',
          dateOfBirth: new Date(2000, 10, 23)
        }
      }
      return result
    }
  }
  return new AddGuardianStub()
}

const makeFakeLoadPetsUseCase = (): LoadPets => {
  class LoadPetsStub implements LoadPets {
    async load (guardianId: LoadPets.Params): Promise<LoadPets.Result> {
      return mockFakePetByGuardianIdLoaded()
    }
  }
  return new LoadPetsStub()
}

const makeFakeUpdatePetUseCase = (): UpdatePet => {
  class UpdatePetStub implements UpdatePet {
    async update (petData: UpdatePet.Params): Promise<UpdatePet.Result> {
      const result = {
        isSuccess: true,
        data: mockFakePetUpdated()
      }
      return result
    }
  }
  return new UpdatePetStub()
}

const makeFakeDeletePetUseCase = (): DeletePet => {
  class DeletePetStub implements DeletePet {
    async delete (params: DeletePet.Params): Promise<DeletePet.Result> {
      return {
        isSuccess: true
      }
    }
  }
  return new DeletePetStub()
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

const makeFakeSendEmailUseCase = (): SendEmail => {
  class SendEmailStub implements SendEmail {
    async send (data: SendEmail.Params): Promise<SendEmail.Result> {}
  }
  return new SendEmailStub()
}

const makeFakeAddTagUseCase = (): AddTag => {
  class AddTagStub implements AddTag {
    async add (tagData: AddTag.Params): Promise<AddTag.Result> {
      return {
        isSuccess: true,
        data: {
          id: 'any_id',
          name: 'any_name',
          color: 'any_color'
        }
      }
    }
  }
  return new AddTagStub()
}

export {
  makeFakeAddGuardianUseCase,
  makeFakeAddPetUseCase,
  makeFakeLoadPetsUseCase,
  makeFakeUpdatePetUseCase,
  makeFakeDeletePetUseCase,
  makeFakeAuthenticationUseCase,
  makeFakeForgetPasswordUseCase,
  makeFakeChangePasswordUseCase,
  makeFakeCreateAccessTokenUseCase,
  makeFakeEmailConfirmationUseCase,
  makeFakeValidateVerificationTokenUseCase,
  makeFakeAppointSpecieUseCase,
  makeLoadGuardianNameUseCase,
  makeFakeAppointPetUseCase,
  makeLoadCatBreedsUseCase,
  makeLoadDogBreedsUseCase,
  makeFakeLoadCatSizesUseCase,
  makeFakeLoadDogSizesUSeCase,
  makeFakeSendEmailUseCase,
  makeFakeAddTagUseCase
}
