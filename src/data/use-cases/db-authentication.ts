import { type Authentication } from '@/domain/use-cases'
import {
  type HashComparer,
  type HashGenerator,
  type TokenGenerator,
  type UpdateAccessTokenRepository,
  type LoadGuardianByEmailRepository
} from '@/data/protocols'

export class DbAuthentication implements Authentication {
  private readonly hashComparer: HashComparer
  private readonly hashGenerator: HashGenerator
  private readonly tokenGenerator: TokenGenerator
  private readonly loadGuardianByEmailRepository: LoadGuardianByEmailRepository
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor ({
    hashComparer,
    hashGenerator,
    tokenGenerator,
    loadGuardianByEmailRepository,
    updateAccessTokenRepository
  }: Authentication.Dependencies
  ) {
    this.hashComparer = hashComparer
    this.hashGenerator = hashGenerator
    this.tokenGenerator = tokenGenerator
    this.loadGuardianByEmailRepository = loadGuardianByEmailRepository
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (credentials: Authentication.Params): Promise<Authentication.Result> {
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
