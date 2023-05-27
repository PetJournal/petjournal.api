export class PasswordMismatchError extends Error {
  constructor () {
    super('Passwords must be identical')
    this.name = 'PasswordMismatchError'
  }
}
