export class PasswordRequirementsError extends Error {
  constructor () {
    super('A senha informada não atende os requisitos necessários de 8 caracteres')
    this.name = 'PasswordRequirementsError'
  }
}
