import { PasswordValidatorAdapter } from '../../src/application/validation/validators/'

const makeSut = (): PasswordValidatorAdapter => {
  return new PasswordValidatorAdapter()
}

describe('PasswordValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    const isValid = sut.isValid('invalid_password')
    expect(isValid).toBe(false)
  })
})
