import { type UpdateVerificationTokenRepository, type LoadGuardianByEmailRepository } from '@/data/protocols/guardian'
import { type HashGenerator, type TokenGenerator } from '../protocols'
import { type EmailService } from '@/domain/use-cases'
import { type ForgetPassword } from '@/domain/use-cases/forget-password'

export class DbForgetPassword implements ForgetPassword {
  private readonly loadGuardianByEmailRepository: LoadGuardianByEmailRepository
  private readonly updateVerificationTokenRepository: UpdateVerificationTokenRepository
  private readonly hashService: HashGenerator
  private readonly tokenGenerator: TokenGenerator
  private readonly emailService: EmailService

  constructor ({ loadGuardianByEmailRepository, tokenGenerator, emailService, hashService, updateVerificationTokenRepository }: ForgetPassword.Dependencies) {
    this.loadGuardianByEmailRepository = loadGuardianByEmailRepository
    this.tokenGenerator = tokenGenerator
    this.emailService = emailService
    this.hashService = hashService
    this.updateVerificationTokenRepository = updateVerificationTokenRepository
  }

  async forgetPassword (params: ForgetPassword.Params): Promise<boolean> {
    let success = false
    const guardian = await this.loadGuardianByEmailRepository.loadByEmail(params.email)
    if (!guardian) {
      return success
    }

    const token = await this.tokenGenerator.generate(guardian.id)
    const hashedToken = await this.hashService.encrypt({ value: token })
    await this.updateVerificationTokenRepository.updateVerificationToken(guardian.id, hashedToken)

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
