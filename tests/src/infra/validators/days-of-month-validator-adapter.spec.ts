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
})
