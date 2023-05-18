import { type LoadGuardianByEmailRepository, type HashComparer, type TokenGenerator, type UpdateAccessTokenRepository, type HashGenerator } from '@/data/protocols'
import { type Authentication } from '@/domain/use-cases/authentication'

export class DbAuthentication implements Authentication {
  private readonly loadGuardianByEmailRepository: LoadGuardianByEmailRepository
  private readonly hashGenerator: HashGenerator
  private readonly hashComparer: HashComparer
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor ({
    loadGuardianByEmailRepository,
    hashGenerator,
    hashComparer,
    tokenGenerator,
    updateAccessTokenRepository
  }: Authentication.Dependencies
  ) {
    this.loadGuardianByEmailRepository = loadGuardianByEmailRepository
    this.hashGenerator = hashGenerator
    this.hashComparer = hashComparer
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (credentials: Authentication.Params): Promise<Authentication.Result | null> {
    const account = await this.loadGuardianByEmailRepository.loadByEmail(credentials.email)
    if (!account) {
      return null
    }
    const isValid = await this.hashComparer.compare({ value: credentials.password, hash: account.password })
    if (!isValid) {
      return null
    }
    const accessToken = await this.tokenGenerator.generate({ sub: account.id })
    const hashedToken = await this.hashGenerator.encrypt({ value: accessToken })
    await this.updateAccessTokenRepository.updateAccessToken({ id: account.id, token: hashedToken })
    return accessToken
  }
}
