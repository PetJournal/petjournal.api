import { DateOfBirthValidatorAdapter } from '@/infra/validators/date-of-birth-validator-adapter'

describe('DateOfBirthValidatorAdapter', () => {
  it('Should return false if date is an invalid date', () => {
    const sut = new DateOfBirthValidatorAdapter()
    const isValid = sut.isValid('invalid_date')
    expect(isValid).toBe(false)
  })

  it('Should return false if date is not a ISO-8601 date', () => {
    const sut = new DateOfBirthValidatorAdapter()
    const isValid = sut.isValid('2021-13-01')
    expect(isValid).toBe(false)
  })

  it('Should return false if date is a future date', () => {
    const sut = new DateOfBirthValidatorAdapter()
    const isValid = sut.isValid('3000-01-01T00:00:00Z')
    expect(isValid).toBe(false)
  })

  it('Should return true if date is a valid date', () => {
    const sut = new DateOfBirthValidatorAdapter()
    const isValid = sut.isValid('2021-01-01T00:00:00Z')
    expect(isValid).toBe(true)
  })
})
