import { type Authentication } from '@/domain/use-cases'
import {
  type HashComparer,
  type HashGenerator,
  type TokenGenerator,
  type UpdateAccessTokenRepository,
  type LoadGuardianByEmailRepository
} from '@/data/protocols'
import { NotFoundError, UnauthorizedError } from '@/application/errors'

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

  async auth (credentials: Authentication.Params): Promise<Authentication.Result> {
    const account = await this.guardianRepository.loadByEmail(credentials.email)
    if (!account) {
      return new NotFoundError('email')
    }
    const isValid = await this.hashService.compare({
      value: credentials.sensitiveData.value,
      hash: account[credentials.sensitiveData?.field] ?? ''
    })
    if (!isValid) {
      return new UnauthorizedError()
    }
    const accessToken = await this.tokenService.generate({ sub: account.id })
    const hashedToken = await this.hashService.encrypt({ value: accessToken })
    await this.guardianRepository.updateAccessToken({ id: account.id, token: hashedToken })
    return accessToken
  }
}
