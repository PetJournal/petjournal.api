export class EmailServiceError extends Error {
  constructor (stack?: string) {
    super('Email service failed to send confirmation email.')
    this.name = 'EmailServiceError'
    if (stack) {
      this.stack = stack
    }
  }
}
