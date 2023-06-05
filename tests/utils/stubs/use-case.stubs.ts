import { type Authentication, type AddGuardian } from '@/domain/use-cases'
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

export {
  makeAddGuardian,
  makeAuthentication
}
