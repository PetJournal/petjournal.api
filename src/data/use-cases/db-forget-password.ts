import { type ForgetPassword } from '@/domain/use-cases'
import { type EmailService, type TokenGenerator, type HashGenerator } from '@/data/protocols'
import { type UpdateVerificationTokenRepository, type LoadGuardianByEmailRepository } from '@/data/protocols/db/guardian'

export class DbForgetPassword implements ForgetPassword {
  private readonly guardianRepository: LoadGuardianByEmailRepository & UpdateVerificationTokenRepository
  private readonly tokenService: TokenGenerator
  private readonly emailService: EmailService
  private readonly hashService: HashGenerator

  constructor ({ guardianRepository, emailService, tokenService, hashService }: ForgetPassword.Dependencies) {
    this.guardianRepository = guardianRepository
    this.tokenService = tokenService
    this.emailService = emailService
    this.hashService = hashService
  }

  async forgetPassword (params: ForgetPassword.Params): Promise<boolean> {
    let success = false

    const guardian = await this.guardianRepository.loadByEmail(params.email)
    if (!guardian) {
      return success
    }

    const token = await this.tokenService.generate(guardian.id)

    const hashedToken = await this.hashService.encrypt({ value: token })

    await this.guardianRepository.updateVerificationToken({
      userId: guardian.id,
      token: hashedToken
    })

    const emailOptions: EmailService.Options = {
      from: 'contato.petjournal@gmail.com',
      to: params.email,
      subject: `${guardian.firstName} ${guardian.lastName}, aqui está seu código`,
      text: `
          Olá ${guardian.firstName} ${guardian.lastName},\n
          Recebemos uma solicitação para redefinir a senha de sua conta PetJournal.\n
          ${token}\n
          Insira este código para concluir a redefinição.\n
          Obrigado por nos ajudar a manter sua conta segura.\n
          Equipe PetJournal
        `
    }

    await this.emailService.send(emailOptions)
    success = true

    return success
  }
}
