import { InvalidParamError } from '@/application/errors'
import { DaysOfMonthValidation, type DaysOfMonthValidator } from '@/application/validation'
import { makeFakeDaysOfMonthValidator } from '@/tests/utils'

interface SutTypes {
  sut: DaysOfMonthValidation
  fakeDaysOfMonthField: string
  validatorStub: DaysOfMonthValidator
}

const makeSut = (): SutTypes => {
  const fakeDaysOfMonthField = 'daysOfMonth'
  const validatorStub = makeFakeDaysOfMonthValidator()
  const sut = new DaysOfMonthValidation(fakeDaysOfMonthField, validatorStub)
  return {
    sut,
    fakeDaysOfMonthField,
    validatorStub
  }
}

describe('DaysOfMonth Validation', () => {
  it('Should return InvalidParamError if a invalid array of days is provided', () => {
    const { sut, fakeDaysOfMonthField } = makeSut()
    const isValid = sut.validate([])
    expect(isValid).toEqual(new InvalidParamError(fakeDaysOfMonthField))
  })
})
