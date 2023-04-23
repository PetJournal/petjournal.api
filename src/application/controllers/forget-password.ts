import { type LoadGuardianByEmail } from '@/domain/use-cases'
import { InvalidParamError, MissingParamError, NotFoundError } from '../errors'
import { type HttpRequest, type HttpResponse, badRequest, success, serverError } from '../helpers/http'
import { type EmailValidator } from '../validation/protocols'
import { type Controller } from './controller'
import { type TokenGenerator } from '@/data/protocols/recovery-password/token-generator'

export class ForgetPasswordController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly loadGuardianByEmail: LoadGuardianByEmail
  private readonly tokenGenerator: TokenGenerator

  constructor (emailValidator: EmailValidator, loadGuardianByEmail: LoadGuardianByEmail, tokenGenerator: TokenGenerator) {
    this.emailValidator = emailValidator
    this.loadGuardianByEmail = loadGuardianByEmail
    this.tokenGenerator = tokenGenerator
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email } = httpRequest.body
      if (!email) {
        return badRequest(new MissingParamError('email'))
      }

      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const guardian = await this.loadGuardianByEmail.load(email)
      if (!guardian) {
        return badRequest(new NotFoundError('User'))
      }

      const tokenSize = 6
      const token = await this.tokenGenerator.generate(tokenSize)

      return success('')
    } catch (error) {
      return serverError()
    }
  }
}
