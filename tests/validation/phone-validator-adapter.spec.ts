import { PhoneValidatorAdapter } from '../../src/application/validation/validators'
import validator from 'validator'

jest.mock('validator', () => ({
  isMobilePhone (): boolean {
    return true
  }
}))

const makeSut = (): PhoneValidatorAdapter => {
  return new PhoneValidatorAdapter()
}

describe('PhoneValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isMobilePhone').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_phone')
    expect(isValid).toBe(false)
  })

  it('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_phone')
    expect(isValid).toBe(true)
  })
})
