import jwt, { type JwtPayload } from 'jsonwebtoken'
import { type TokenGenerator, type TokenDecoder } from '@/data/protocols'

export class JwtAdapter implements TokenGenerator, TokenDecoder {
  private readonly secret: string

  constructor (secret: string) {
    this.secret = secret
  }

  async generate (payload: TokenGenerator.Params): Promise<TokenGenerator.Result> {
    const accessToken = jwt.sign(payload, this.secret)
    return accessToken
  }

  async decode (token: TokenDecoder.Params): Promise<TokenDecoder.Result> {
    try {
      return jwt.verify(token, this.secret) as JwtPayload
    } catch (e) {
      return null
    }
  }
}
