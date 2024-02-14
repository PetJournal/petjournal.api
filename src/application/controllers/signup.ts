import { type AddGuardian } from '@/domain/use-cases'
import { type Validation, type Controller } from '@/application/protocols'
import { ConflictGuardianError } from '@/application/errors'
import {
  type HttpRequest,
  type HttpResponse,
  conflict,
  serverError,
  create,
  badRequest
} from '@/application/helpers'

export class SignUpController implements Controller {
  constructor (
    private readonly addGuardian: AddGuardian,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { firstName, lastName, email, phone, password } = httpRequest.body
      const guardian = await this.addGuardian.add({
        firstName,
        lastName,
        email,
        phone,
        password,
        verificationToken: ''
      })

      if (!guardian) {
        return conflict(new ConflictGuardianError())
      }

      return create(guardian)
    } catch (error) {
      return serverError(error as Error)
    }
  }
}
