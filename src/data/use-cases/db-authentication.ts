import { type LoadGuardianByEmailRepository, type HashComparer, type TokenGenerator, type UpdateAccessTokenRepository } from '@/data/protocols'
import { type Authentication } from '@/domain/use-cases/authentication'

export class DbAuthentication implements Authentication {
  private readonly loadGuardianByEmailRepository: LoadGuardianByEmailRepository
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor ({
    loadGuardianByEmailRepository,
    hashComparer,
    tokenGenerator,
    updateAccessTokenRepository
  }: Authentication.Dependencies
  ) {
    this.loadGuardianByEmailRepository = loadGuardianByEmailRepository
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: Authentication.Params): Promise<Authentication.Result | null> {
    const account = await this.loadGuardianByEmailRepository.loadByEmail(authentication.email)
    if (!account) {
      return null
    }
    const isValid = await this.hashComparer.compare({ value: authentication.password, hash: account.password })
    if (!isValid) {
      return null
    }
    const accessToken = await this.tokenGenerator.generate(account.email)
    await this.updateAccessTokenRepository.updateAccessToken(account.email, accessToken)
    return accessToken
  }
}
