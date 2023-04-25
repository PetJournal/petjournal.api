import { type Controller } from './controller'
import { badRequest, serverError, type HttpRequest, type HttpResponse, success, unauthorized } from '../helpers/http'
import { InvalidParamError, MissingParamError } from '../errors'
import { type Authentication } from '@/domain/use-cases/authentication'
import { type IdentifierValidator } from '@/application/validation/protocols'

export class LoginController implements Controller {
  private readonly identifierValidator: IdentifierValidator
  private readonly authentication: Authentication

  constructor (identifierValidator: IdentifierValidator, authentication: Authentication) {
    this.identifierValidator = identifierValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['identifier', 'password']
      for (const field of requiredFields) {
        if (httpRequest.body[field] === undefined) {
          return badRequest(new MissingParamError(field))
        }
      }
      const { identifier, password } = httpRequest.body
      const isValid = this.identifierValidator.isValid(identifier)
      if (!isValid) {
        return badRequest(new InvalidParamError('identifier'))
      }
      const accessToken = await this.authentication.auth(identifier, password)
      if (!accessToken) {
        return unauthorized()
      }
      return success({ accessToken })
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
