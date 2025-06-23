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

  it('Should return false if in endAt is not ends with Z', () => {
    const sut = makeSut()
    const isValid = sut.isValid('2000-01-01T00:00:00')
    expect(isValid).toBe(false)
  })

  it('Should return false if date is a previous date', () => {
    const sut = makeSut()
    const isValid = sut.isValid('2000-01-01T00:00:00Z')
    expect(isValid).toBe(false)
  })

  it('Should return false if date is not a ISO8601 date', () => {
    const sut = makeSut()
    const isValid = sut.isValid('01-01-2025')
    expect(isValid).toBe(false)
  })

  it('Should return true if validation returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('2030-05-19T00:00:00Z')
    expect(isValid).toBe(true)
  })
})
