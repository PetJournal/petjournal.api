import { NotFoundError } from '@/application/errors'
import {
  type TokenGenerator,
  type UpdateAccessTokenRepository,
  type HashGenerator,
  type LoadGuardianByEmailRepository
} from '@/data/protocols'
import { type CreateAccessToken } from '@/domain/use-cases/create-access-token'

export class DbCreateAccessToken implements CreateAccessToken {
  private readonly loadGuardianByEmailRepository: LoadGuardianByEmailRepository
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
  private readonly hashService: HashGenerator
  private readonly tokenService: TokenGenerator

  constructor ({
    hashService,
    tokenService,
    loadGuardianByEmailRepository,
    updateAccessTokenRepository
  }: CreateAccessToken.Dependencies
  ) {
    this.hashService = hashService
    this.tokenService = tokenService
    this.loadGuardianByEmailRepository = loadGuardianByEmailRepository
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async create (email: CreateAccessToken.Params): Promise<CreateAccessToken.Result> {
    const guardian = await this.loadGuardianByEmailRepository.loadByEmail(email)
    if (!guardian) {
      return new NotFoundError('email')
    }
    const accessToken = await this.tokenService.generate({ sub: guardian.id })
    const hashedToken = await this.hashService.encrypt({ value: accessToken })
    await this.updateAccessTokenRepository.updateAccessToken({ id: guardian.id, token: hashedToken })
    return accessToken
  }
}
