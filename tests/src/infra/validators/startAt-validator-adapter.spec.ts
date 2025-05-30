import { StartAtValidatorAdapter } from '@/infra/validators'

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

  it('Should return false if date is not a ISO8601 date', () => {
    const sut = makeSut()
    const isValid = sut.isValid('01-01-2030')
    expect(isValid).toBe(false)
  })

  it('Should return true if date is a valid date', () => {
    const sut = makeSut()
    const validDate = new Date()
    validDate.setDate(validDate.getDate() + 1)
    const isValid = sut.isValid(validDate.toISOString())
    expect(isValid).toBe(true)
  })
})
