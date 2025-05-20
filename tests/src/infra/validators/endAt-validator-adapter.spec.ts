import { EndAtValidatorAdapter } from '@/infra/validators'

const makeSut = (): EndAtValidatorAdapter => {
  return new EndAtValidatorAdapter()
}

describe('EndAt Validator Adapter', () => {
  it('Should return false if time in date is not valid', () => {
    const sut = makeSut()
    const isValid = sut.isValid('invalid_date')
    expect(isValid).toBe(false)
  })
})
