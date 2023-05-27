import { type Authentication, type AddGuardian, type ChangePassword } from '@/domain/use-cases'
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
    async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
      return 'any_token'
    }
  }
  return new AuthenticationStub()
}

const makeChangePassword = (): ChangePassword => {
  class ChangePasswordStub implements ChangePassword {
    async change (userData: ChangePassword.Params): Promise<ChangePassword.Result> {
      return { isSuccess: true }
    }
  }
  return new ChangePasswordStub()
}

export {
  makeAddGuardian,
  makeAuthentication,
  makeChangePassword
}
