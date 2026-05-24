export class EmailConfirmationError extends Error {
  constructor (param: string) {
    super(param)
    this.name = 'EmailConfirmationError'
  }
}
