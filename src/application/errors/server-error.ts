export class ServerError extends Error {
  constructor () {
    super('Internal server error.\nAn unexpected error happened. Please try again in a moment.')
    this.name = 'ServerError'
  }
}
