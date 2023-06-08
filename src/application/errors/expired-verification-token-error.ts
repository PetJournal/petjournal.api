export class ExpiredVerificationTokenError extends Error {
  constructor () {
    super('Verification Token is expired')
    this.name = 'ExpiredVerificationTokenError'
  }
}
