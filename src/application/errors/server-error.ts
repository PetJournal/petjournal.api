export class ServerError extends Error {
  constructor (stack: string) {
    super('Internal server error.\nAn unexpected error happened. Please try again in a moment.')
    this.name = 'ServerError'
    this.stack = stack
  }
}
