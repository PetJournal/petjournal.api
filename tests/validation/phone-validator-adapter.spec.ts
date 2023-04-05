import { PhoneValidatorAdapter } from '../../src/application/validation/validators'

const makeSut = (): PhoneValidatorAdapter => {
  return new PhoneValidatorAdapter()
}

describe('PhoneValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    const isValid = sut.isValid('invalid_phone')
    expect(isValid).toBe(false)
  })
})
