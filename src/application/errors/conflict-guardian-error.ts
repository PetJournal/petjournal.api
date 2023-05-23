export class ConflictGuardianError extends Error {
  constructor () {
    super('Phone or Email already registered')
    this.name = 'ConflictGuardianError'
  }
}
