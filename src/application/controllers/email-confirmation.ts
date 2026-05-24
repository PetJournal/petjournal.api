import { type EmailConfirmation } from '@/domain/use-cases'
import { type Controller } from '../protocols'
import { badRequest, type HttpRequest, type HttpResponse, serverError, success } from '../helpers'

export class EmailConfirmationController implements Controller {
  private readonly emailConfirmation: EmailConfirmation

  constructor ({ emailConfirmation }: EmailConfirmationController.Dependencies) {
    this.emailConfirmation = emailConfirmation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const userId = httpRequest.params.userId
      const result = await this.emailConfirmation.confirm(userId)
      if (!result.isSuccess) {
        return badRequest(result.error as Error)
      }
      return success({
        message: 'email confirmed',
        userId,
        email: result.data.email
      })
    } catch (error) {
      return serverError(error as Error)
    }
  }
}

export namespace EmailConfirmationController {
  export type Dependencies = {
    emailConfirmation: EmailConfirmation
  }
}
