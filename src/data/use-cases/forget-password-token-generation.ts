import { type SaveTokenRepository } from '@/data/protocols/db/guardian'
import { type HashGenerator, type TokenGenerator } from '../protocols'

export class ForgetPasswordTokenGenerator implements TokenGenerator {
  private readonly encrypter: HashGenerator
  private readonly saveToken: SaveTokenRepository

  constructor (encrypter: HashGenerator, saveToken: SaveTokenRepository) {
    this.encrypter = encrypter
    this.saveToken = saveToken
  }

  async generate (userId: string): Promise<string> {
    const token = Math.floor(100000 + Math.random() * 900000).toString()
    const encryptedToken = await this.encrypter.encrypt({ value: token })
    await this.saveToken.saveToken(userId, encryptedToken)
    return token
  }
}
