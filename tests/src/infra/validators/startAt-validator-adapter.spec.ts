import { StartAtValidatorAdapter } from '@/infra/validators'

jest.mock('validator', () => ({
  isISO8601: jest.fn(() => true)
}))

const makeSut = (): StartAtValidatorAdapter => {
  return new StartAtValidatorAdapter()
}

describe('StartAt Validator Adapter', () => {
  it('Should return false if time in startAt is not a valid number', () => {
    const sut = makeSut()
    const isValid = sut.isValid('invalid_date')
    expect(isValid).toBe(false)
  })

  it('Should return false if date is a previous date', () => {
    const sut = makeSut()
    const isValid = sut.isValid('2000-01-01T00:00:00Z')
    expect(isValid).toBe(false)
  })
})
