import { type SaveToken } from '@/domain/use-cases'
import { type SaveTokenRepository } from '../protocols'

export class DbSaveToken implements SaveToken {
  private readonly saveTokenRepository: SaveTokenRepository

  constructor (saveTokenRepository: SaveTokenRepository) {
    this.saveTokenRepository = saveTokenRepository
  }

  async save (tokenData: SaveToken.Params): Promise<SaveToken.Result> {
    return await this.saveTokenRepository.saveToken(tokenData.accountId, tokenData.token)
  }
}
