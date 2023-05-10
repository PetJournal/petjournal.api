import jwt, { type JwtPayload } from 'jsonwebtoken'
import { type TokenGenerator } from '@/data/protocols'

export class JwtAdapter implements TokenGenerator {
  private readonly secret: string

  constructor (secret: string) {
    this.secret = secret
  }

  async generate (payload: JwtPayload): Promise<string> {
    const accessToken = jwt.sign({ id: payload.sub }, this.secret)
    return accessToken
  }
}
