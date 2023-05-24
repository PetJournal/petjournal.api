import { type Authentication, type AddGuardian, type ForgetCodeAuthentication } from '@/domain/use-cases'
import { makeFakeGuardianWithIdData } from '../mocks'

const makeAddGuardian = (): AddGuardian => {
  class AddGuardianStub implements AddGuardian {
    async add (guardian: AddGuardian.Params): Promise<AddGuardian.Result> {
      const { password, accessToken, ...result } = makeFakeGuardianWithIdData()
      return result
    }
  }
  return new AddGuardianStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: Authentication.Params): Promise<Authentication.Result | null> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

const makeForgetCodeAuthentication = (): ForgetCodeAuthentication => {
  class ForgetCodeAuthenticationStub implements ForgetCodeAuthentication {
    async auth (input: ForgetCodeAuthentication.Params): Promise<ForgetCodeAuthentication.Result> {

    }
  }
  return new ForgetCodeAuthenticationStub()
}

export {
  makeAddGuardian,
  makeAuthentication,
  makeForgetCodeAuthentication
}
