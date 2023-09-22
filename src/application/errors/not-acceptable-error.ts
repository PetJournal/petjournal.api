export class NotAcceptableError extends Error {
  constructor (paramName: string) {
    super(`Not acceptable: ${paramName}`)
    this.name = 'NotAcceptableError'
  }
}
