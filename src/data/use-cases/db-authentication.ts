import { UnauthorizedError } from '@/application/errors'
import {
  type HashComparer,
  type HashGenerator,
  type LoadGuardianByEmailRepository,
  type TokenGenerator,
  type UpdateAccessTokenRepository
} from '@/data/protocols'
import { type Authentication } from '@/domain/use-cases'

export class DbAuthentication implements Authentication {
  private readonly guardianRepository: LoadGuardianByEmailRepository & UpdateAccessTokenRepository
  private readonly hashService: HashGenerator & HashComparer
  private readonly tokenService: TokenGenerator

  constructor ({
    guardianRepository,
    hashService,
    tokenService
  }: Authentication.Dependencies
  ) {
    this.guardianRepository = guardianRepository
    this.hashService = hashService
    this.tokenService = tokenService
  }

  async auth (credentialsData: Authentication.Params): Promise<Authentication.Result> {
    const account = await this.guardianRepository.loadByEmail(credentialsData.email)
    if (!account) {
      return new UnauthorizedError()
    }

    const isValid = await this.hashService.compare({
      value: credentialsData.sensitiveData.value,
      hash: account[credentialsData.sensitiveData?.field] ?? ''
    })

    if (!isValid) {
      return new UnauthorizedError()
    }
    const accessToken = await this.tokenService.generate({ sub: account.id })
    const hashedToken = await this.hashService.encrypt({ value: accessToken })

    await this.guardianRepository.updateAccessToken({ userId: account.id, token: hashedToken })
    return accessToken
  }
}
