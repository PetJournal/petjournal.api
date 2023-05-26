export class PasswordMismatchError extends Error {
  constructor () {
    super('As senhas devem ser idênticas')
    this.name = 'PasswordMismatchError'
  }
}
