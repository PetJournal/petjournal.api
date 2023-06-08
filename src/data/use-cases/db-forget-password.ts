import { type ForgetPassword } from '@/domain/use-cases'
import { type EmailService, type TokenGenerator } from '@/data/protocols'
import { type LoadGuardianByEmailRepository } from '@/data/protocols/guardian'

export class DbForgetPassword implements ForgetPassword {
  private readonly loadGuardianByEmailRepository: LoadGuardianByEmailRepository
  private readonly tokenGenerator: TokenGenerator
  private readonly emailService: EmailService

  constructor ({ loadGuardianByEmailRepository, tokenGenerator, emailService }: ForgetPassword.Dependencies) {
    this.loadGuardianByEmailRepository = loadGuardianByEmailRepository
    this.tokenGenerator = tokenGenerator
    this.emailService = emailService
  }

  async forgetPassword (params: ForgetPassword.Params): Promise<boolean> {
    let success = false
    const guardian = await this.loadGuardianByEmailRepository.loadByEmail(params.email)
    if (!guardian) {
      return success
    }

    const token = await this.tokenGenerator.generate(guardian.id)

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
