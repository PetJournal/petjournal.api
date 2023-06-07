import { type TokenGenerator } from '@/data/protocols/'

export class VerificationTokenGenerator implements TokenGenerator {
  async generate (): Promise<string> {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }
}
