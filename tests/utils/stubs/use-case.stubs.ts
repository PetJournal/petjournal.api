import { type Authentication, type AddGuardian, type CreateAccessToken, type ValidateVerificationToken } from '@/domain/use-cases'
import { makeFakeGuardianWithIdData } from '../mocks'

const makeAddGuardian = (): AddGuardian => {
  class AddGuardianStub implements AddGuardian {
    async add (guardian: AddGuardian.Params): Promise<AddGuardian.Result> {
      const { password, verificationTokenCreatedAt, verificationToken, accessToken, ...result } = makeFakeGuardianWithIdData()
      return result
    }
  }
  return new AddGuardianStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

const makeCreateAccessToken = (): CreateAccessToken => {
  class CreateAccessTokenStub implements CreateAccessToken {
    async create (email: string): Promise<CreateAccessToken.Result> {
      return 'valid_token'
    }
  }
  return new CreateAccessTokenStub()
}

const validateVerificationToken = (): ValidateVerificationToken => {
  class ValidateVerificationTokenStub implements ValidateVerificationToken {
    async validate (input: ValidateVerificationToken.Params): Promise<ValidateVerificationToken.Result> {
      return true
    }
  }
  return new ValidateVerificationTokenStub()
}

export {
  makeAddGuardian,
  makeAuthentication,
  makeCreateAccessToken,
  validateVerificationToken
}
