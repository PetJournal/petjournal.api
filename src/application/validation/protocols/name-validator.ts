export interface NameValidator {
  isValid: (firstName: string, lastName: string) => boolean
}
