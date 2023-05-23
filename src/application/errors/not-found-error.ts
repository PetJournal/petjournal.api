export class NotFoundError extends Error {
  constructor (paramName: string) {
    super(`Not found: ${paramName}`)
    this.name = 'NotFoundError'
  }
}
