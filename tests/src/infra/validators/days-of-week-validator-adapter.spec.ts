import { DaysOfWeekValidatorAdapter } from '@/infra/validators'

const makeSut = (): DaysOfWeekValidatorAdapter => {
  return new DaysOfWeekValidatorAdapter()
}

describe('DaysOfWeek Validator Adapter', () => {
  it('Should return false if in Array of week days there is not a number data', () => {
    const sut = makeSut()
    const isValid = sut.isValid([])
    expect(isValid).toBe(false)
  })

  it('Should return false if the interval is outside of 0 to 6', () => {
    const sut = makeSut()
    const isValid = sut.isValid([7, 8])
    expect(isValid).toBe(false)
  })

  it('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid([0, 4, 6])
    expect(isValid).toBe(true)
  })
})
