import { DaysOfMonthValidatorAdapter } from '@/infra/validators'

const makeSut = (): DaysOfMonthValidatorAdapter => {
  return new DaysOfMonthValidatorAdapter()
}

describe('DaysOfMonth Validator Adapter', () => {
  it('Should return false if in Array of month days there is not a number data', () => {
    const sut = makeSut()
    const isValid = sut.isValid([])
    expect(isValid).toBe(false)
  })

  it('Should return false if the interval is outside of 0 to 30', () => {
    const sut = makeSut()
    const isValid = sut.isValid([-1, 31])
    expect(isValid).toBe(false)
  })

  it('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid([0, 4, 30])
    expect(isValid).toBe(true)
  })
})
