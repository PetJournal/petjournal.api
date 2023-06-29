import { NotFoundError } from '@/application/errors'
import {
  type TokenGenerator,
  type UpdateAccessTokenRepository,
  type HashGenerator,
  type LoadGuardianByEmailRepository
} from '@/data/protocols'
import { type CreateAccessToken } from '@/domain/use-cases'

export class DbCreateAccessToken implements CreateAccessToken {
  private readonly guardianRepository: LoadGuardianByEmailRepository & UpdateAccessTokenRepository
  private readonly hashService: HashGenerator
  private readonly tokenService: TokenGenerator

  constructor ({
    hashService,
    tokenService,
    guardianRepository
  }: CreateAccessToken.Dependencies
  ) {
    this.guardianRepository = guardianRepository
    this.hashService = hashService
    this.tokenService = tokenService
  }

  async create (email: CreateAccessToken.Params): Promise<CreateAccessToken.Result> {
    const guardian = await this.guardianRepository.loadByEmail(email)
    if (!guardian) {
      return new NotFoundError('email')
    }
    const accessToken = await this.tokenService.generate({ sub: guardian.id })
    const hashedToken = await this.hashService.encrypt({ value: accessToken })
    await this.guardianRepository.updateAccessToken({ id: guardian.id, token: hashedToken })
    return accessToken
  }
}
