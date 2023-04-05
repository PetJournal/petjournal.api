export interface PasswordValidator {
  isValid: (password: string) => boolean
}
