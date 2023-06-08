export class PasswordRequirementsError extends Error {
  constructor () {
    super('The entered password does not meet the required 8-character requirements')
    this.name = 'PasswordRequirementsError'
  }
}
