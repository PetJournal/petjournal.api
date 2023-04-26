import { type LoadGuardianByEmail } from '@/domain/use-cases'
import { type LoadGuardianByEmailRepository } from '../protocols'

export class DbLoadGuardianByEmail implements LoadGuardianByEmail {
  private readonly loadGuardianByEmailRepository: LoadGuardianByEmailRepository

  constructor (loadGuardianByEmailRepository: LoadGuardianByEmailRepository) {
    this.loadGuardianByEmailRepository = loadGuardianByEmailRepository
  }

  async load (email: string): Promise<LoadGuardianByEmail.Result> {
    return await this.loadGuardianByEmailRepository.loadByEmail(email)
  }
}
