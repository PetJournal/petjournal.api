import { type EmailService, type LoadGuardianByEmail } from '@/domain/use-cases'
import { InvalidParamError, MissingParamError, NotFoundError } from '../errors'
import { type HttpRequest, type HttpResponse, badRequest, success, serverError } from '../helpers/http'
import { type EmailValidator } from '../validation/protocols'
import { type Controller } from './controller'
import { type TokenGenerator } from '@/data/protocols/recovery-password/token-generator'

export class ForgetPasswordController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly loadGuardianByEmail: LoadGuardianByEmail
  private readonly tokenGenerator: TokenGenerator
  private readonly emailService: EmailService

  constructor (emailValidator: EmailValidator, loadGuardianByEmail: LoadGuardianByEmail, tokenGenerator: TokenGenerator, emailService: EmailService) {
    this.emailValidator = emailValidator
    this.loadGuardianByEmail = loadGuardianByEmail
    this.tokenGenerator = tokenGenerator
    this.emailService = emailService
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

      const token = await this.tokenGenerator.generate(guardian.id)

      const options: EmailService.Options = {
        from: '',
        to: email,
        subject: 'Recuperação de senha',
        text: `Olá ${guardian.firstName} ${guardian.lastName}, seu código de recuperação de senha é: ${token}.`
      }
      await this.emailService.send(options)

      return success('')
    } catch (error) {
      return serverError()
    }
  }
}
