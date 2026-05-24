import { type SaveTokenRepository } from '@/data/protocols/db/guardian'
import { type HashGenerator, type TokenGenerator } from '@/data/protocols'

export class ForgetPasswordTokenGenerator implements TokenGenerator {
  private readonly hashService: HashGenerator
  private readonly saveToken: SaveTokenRepository

  constructor (hashService: HashGenerator, saveToken: SaveTokenRepository) {
    this.hashService = hashService
    this.saveToken = saveToken
  }

  async generate (userId: string): Promise<string> {
    const token = Math.floor(100000 + Math.random() * 900000).toString()
    const encryptedToken = await this.hashService.encrypt({ value: token })
    await this.saveToken.saveToken({
      userId,
      token: encryptedToken
    })
    return token
  }
}
