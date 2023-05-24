export class InvalidForgetCodeError extends Error {
  constructor () {
    super('Forget password code mismatch')
    this.name = 'InvalidForgetCodeError'
  }
}
