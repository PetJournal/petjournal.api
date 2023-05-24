import { type ForgetCodeAuthentication } from '@/domain/use-cases'
import { type LoadGuardianByEmailRepository } from '@/data/protocols'

export class DbForgetCodeAuthentication implements ForgetCodeAuthentication {
  private readonly loadGuardianByEmailRepository: LoadGuardianByEmailRepository

  constructor ({
    loadGuardianByEmailRepository
  }: ForgetCodeAuthentication.Dependencies) {
    this.loadGuardianByEmailRepository = loadGuardianByEmailRepository
  }

  async auth (input: ForgetCodeAuthentication.Params): Promise<ForgetCodeAuthentication.Result> {
    await this.loadGuardianByEmailRepository.loadByEmail(input.email)
    return false
  }
}
