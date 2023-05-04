import { type SaveTokenRepository, type Encrypter, type TokenGenerator } from '../protocols'

export class ForgetPasswordTokenGenerator implements TokenGenerator {
  private readonly encrypter: Encrypter
  private readonly saveTokenRepository: SaveTokenRepository

  constructor (encrypter: Encrypter, saveTokenRepository: SaveTokenRepository) {
    this.encrypter = encrypter
    this.saveTokenRepository = saveTokenRepository
  }

  async generate (userId: number): Promise<string> {
    const token = Math.floor(100000 + Math.random() * 900000).toString()
    const encryptedToken = await this.encrypter.encrypt(token)
    await this.saveTokenRepository.saveToken(userId, encryptedToken)
    return token
  }
}
