import { DescriptionValidatorAdapter } from '@/infra/validators'

const makeSut = (): DescriptionValidatorAdapter => {
  return new DescriptionValidatorAdapter()
}

describe('Description Validator Adapter', () => {
  it('Should return false if validation returns false', () => {
    const sut = makeSut()
    const isValid = sut.isValid('invalid_description')
    expect(isValid).toBe(false)
  })

  it('Should return true if validation returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid description')
    expect(isValid).toBe(true)
  })
})
