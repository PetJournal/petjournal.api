export class UnauthorizedError extends Error {
  constructor (message?: string) {
    super(message ?? 'Unauthorized')
    this.name = 'UnauthorizedError'
  }
}
