import { type SendEmail, type AddGuardian } from '@/domain/use-cases'
import { type Validation, type Controller } from '@/application/protocols'
import { ConflictGuardianError, EmailServiceError } from '@/application/errors'
import {
  type HttpRequest,
  type HttpResponse,
  conflict,
  serverError,
  create,
  createWithWarning,
  badRequest
} from '@/application/helpers'

export class SignUpController implements Controller {
  private readonly addGuardian: AddGuardian
  private readonly validation: Validation
  private readonly sendEmail: SendEmail

  constructor ({ addGuardian, validation, sendEmail }: SignUpController.Dependencies) {
    this.addGuardian = addGuardian
    this.sendEmail = sendEmail
    this.validation = validation
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      console.log('\n[SignUp Flow] 1. Request started')
      console.log('[SignUp Flow] Environment Check:', {
        mailerooKey: process.env.MAILEROO_API_KEY ? 'CONFIGURED' : 'MISSING',
        mailerooUrl: process.env.MAILEROO_API_URL ?? 'MISSING',
        mailerooUser: process.env.MAILEROO_MAIL_USER ?? 'MISSING',
        host: process.env.HOST_URL ?? 'MISSING (Using fallback)',
        nodeEnv: process.env.NODE_ENV
      })

      console.log('[SignUp Flow] 2. Validating request body')
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        console.warn('[SignUp Flow] Validation failed:', error.message)
        return badRequest(error)
      }

      const { firstName, lastName, email, phone, password } = httpRequest.body
      const image = httpRequest.file ?? null
      const guardian = await this.addGuardian.add({
        firstName,
        lastName,
        email,
        phone,
        password,
        verificationToken: '',
        image
      })

      if (!guardian) {
        console.warn('[SignUp Flow] Guardian creation conflict')
        return conflict(new ConflictGuardianError())
      }

      // Email is intentionally sent before returning the success response.
      // This ensures that if email delivery fails, the client receives a 201 with warning
      // rather than receiving a 201 success and silently missing the confirmation email.
      try {
        console.log('[SignUp Flow] 5. Sending confirmation email to:', guardian.email)
        await this.sendEmail.send({
          id: guardian.id,
          firstName: guardian.firstName,
          lastName: guardian.lastName,
          email: guardian.email
        })
        console.log('[SignUp Flow] 6. Email sent successfully!')
      } catch (error: any) {
        console.error('[SignUp Flow] Error sending email:', {
          message: error.message,
          stack: error.stack,
          response: error.response?.data ?? error.response
        })
        if (error instanceof EmailServiceError) {
          return createWithWarning(
            guardian,
            'email_failed',
            'O cadastro foi realizado com sucesso, mas ocorreu uma falha ao enviar o e-mail de confirmação.'
          )
        }
        throw error
      }

      console.log('[SignUp Flow] 7. Guardian created successfully (returning 201)')
      return create(guardian)
    } catch (error: any) {
      console.error('[SignUp Flow] Unhandled Error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data ?? error.response
      })
      return serverError(error as Error)
    }
  }
}

export namespace SignUpController {
  export interface Dependencies {
    addGuardian: AddGuardian
    sendEmail: SendEmail
    validation: Validation
  }
}
