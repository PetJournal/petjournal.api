import {
  type AddGuardian,
  type Authentication,
  type ChangePassword,
  type ForgetPassword
} from '@/domain/use-cases'

const makeFakeAddGuardianUseCase = (): AddGuardian => {
  class AddGuardianStub implements AddGuardian {
    async add (guardian: AddGuardian.Params): Promise<AddGuardian.Result> {
      const result = {
        id: 'any_id',
        firstName: 'any_first_name',
        lastName: 'any_last_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        phone: 'any_phone'
      }
      return result
    }
  }
  return new AddGuardianStub()
}

const makeFakeAuthenticationUseCase = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: Authentication.Params): Promise<Authentication.Result> {
      return 'any_token'
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

export {
  makeFakeAddGuardianUseCase,
  makeFakeAuthenticationUseCase,
  makeFakeForgetPasswordUseCase,
  makeFakeChangePasswordUseCase
}
