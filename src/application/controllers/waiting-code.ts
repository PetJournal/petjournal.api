import {
  type HttpRequest,
  type HttpResponse,
  badRequest,
  unauthorized,
  success,
  serverError
} from '@/application/helpers'
import { type Controller, type Validation } from '@/application/protocols'
import { type CreateAccessToken, type ValidateVerificationToken } from '@/domain/use-cases/'

export class WaitingCodeController implements Controller {
  constructor (
    private readonly validation: Validation,
    private readonly validateVerificationToken: ValidateVerificationToken,
    private readonly createAccessToken: CreateAccessToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }
      const { email, verificationToken } = httpRequest.body
      const tokenIsValidOrError = await this.validateVerificationToken.validate({
        email,
        verificationToken
      })
      if (tokenIsValidOrError instanceof Error) {
        return unauthorized(tokenIsValidOrError)
      }
      const accessToken = await this.createAccessToken.create(email)
      return success({ accessToken })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
