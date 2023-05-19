import { type Authentication, type AddGuardian } from '@/domain/use-cases'

const makeAddGuardian = (): AddGuardian => {
  class AddGuardianStub implements AddGuardian {
    async add (guardian: AddGuardian.Params): Promise<AddGuardian.Result> {
      return await Promise.resolve(true)
    }
  }
  return new AddGuardianStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: Authentication.Params): Promise<Authentication.Result | null> {
      return await Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

export {
  makeAddGuardian,
  makeAuthentication
}
