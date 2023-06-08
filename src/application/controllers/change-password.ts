import { type ChangePassword } from '@/domain/use-cases'
import { type Controller } from '@/application/protocols'
import { type PasswordValidator } from '@/application/validation'
import { type HttpRequest, type HttpResponse, success, serverError, badRequest } from '@/application/helpers'
import { MissingParamError, PasswordMismatchError, PasswordRequirementsError } from '@/application/errors'

export class ChangePasswordController implements Controller {
  private readonly changePassword: ChangePassword
  private readonly passwordValidator: PasswordValidator

  constructor ({ changePassword, passwordValidator }: ChangePasswordController.Dependencies) {
    this.changePassword = changePassword
    this.passwordValidator = passwordValidator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['password', 'passwordConfirmation']
      if (httpRequest.userId === undefined) {
        return badRequest(new MissingParamError('id'))
      }
      for (const field of requiredFields) {
        if (httpRequest.body[field] === undefined) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { userId: id } = httpRequest
      const { password, passwordConfirmation } = httpRequest.body

      if (passwordConfirmation !== password) {
        return badRequest(new PasswordMismatchError())
      }

      const isValidPassword = this.passwordValidator.isValid(password)
      if (!isValidPassword) {
        return badRequest(new PasswordRequirementsError())
      }

      const response = await this.changePassword.change({ id, password })
      if (!response.isSuccess && response.error) {
        return badRequest(response.error)
      }

      return success({ message: 'Password reset completed successfully' })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace ChangePasswordController {
  export interface Dependencies {
    changePassword: ChangePassword
    passwordValidator: PasswordValidator
  }
}
