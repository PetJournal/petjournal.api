import { PasswordValidatorAdapter } from '@/application/validation/validators/'
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
  it('Should return false if validation returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isStrongPassword').mockReturnValueOnce(0)
    const isValid = sut.isValid('invalid_password')
    expect(Boolean(isValid)).toBe(false)
  })

  it('Should return true if validation returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_password')
    expect(isValid).toBe(true)
  })

  it('Should call validator with correct password', () => {
    const sut = makeSut()
    const isValid = jest.spyOn(validator, 'isStrongPassword')
    sut.isValid('any_password')
    expect(isValid).toHaveBeenCalledWith('any_password')
  })
})
