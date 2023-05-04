import jwt from 'jsonwebtoken'
import { type TokenGenerator } from '@/data/protocols'

export class JwtAdapter implements TokenGenerator {
  private readonly secret: string

  constructor (secret: string) {
    this.secret = secret
  }

  async generate (value: string): Promise<string> {
    const accessToken = jwt.sign({ email: value }, this.secret)
    return accessToken
  }
}
