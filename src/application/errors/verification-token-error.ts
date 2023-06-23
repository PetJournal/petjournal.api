export class VerificationTokenError extends Error {
  constructor () {
    super('Verification token mismatch or expired')
    this.name = 'VerificationTokenError'
  }
}
