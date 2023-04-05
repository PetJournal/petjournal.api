import { PasswordValidatorAdapter } from '../../src/application/validation/validators/'
import validator from 'validator'

jest.mock('validator', () => ({
  isStrongPassword (): boolean {
    return true
  }
}))

const makeSut = (): PasswordValidatorAdapter => {
  return new PasswordValidatorAdapter()
}

describe('PasswordValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isStrongPassword').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_password')
    expect(isValid).toBe(false)
  })

  it('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_password')
    expect(isValid).toBe(true)
  })
})
