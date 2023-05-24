import { type ForgetCodeAuthentication } from '@/domain/use-cases'
import { type LoadGuardianByEmailRepository } from '@/data/protocols'
import { NotFoundError } from '@/application/errors'

export class DbForgetCodeAuthentication implements ForgetCodeAuthentication {
  private readonly loadGuardianByEmailRepository: LoadGuardianByEmailRepository

  constructor ({
    loadGuardianByEmailRepository
  }: ForgetCodeAuthentication.Dependencies) {
    this.loadGuardianByEmailRepository = loadGuardianByEmailRepository
  }

  async auth (input: ForgetCodeAuthentication.Params): Promise<ForgetCodeAuthentication.Result> {
    const guardian = await this.loadGuardianByEmailRepository.loadByEmail(input.email)
    if (!guardian) {
      return new NotFoundError('email')
    }
  }
}
