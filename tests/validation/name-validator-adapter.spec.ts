import { NameValidatorAdapter } from '../../src/application/validation/validators'

const makeSut = (): NameValidatorAdapter => {
  return new NameValidatorAdapter()
}

describe('NameValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_first_name', 'valid_last_name')
    expect(isValid).toBe(false)
  })
})
