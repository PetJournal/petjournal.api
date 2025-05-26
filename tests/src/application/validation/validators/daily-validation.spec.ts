import { InvalidParamError } from '@/application/errors'
import { DailyValidation, type BooleanValidator } from '@/application/validation'
import { makeFakeDailyValidator } from '@/tests/utils'

interface SutTypes {
  sut: DailyValidation
  fakeDailyField: string
  validatorStub: BooleanValidator
}

const makeSut = (): SutTypes => {
  const fakeDailyField = 'daily'
  const validatorStub = makeFakeDailyValidator()
  const sut = new DailyValidation(fakeDailyField, validatorStub)
  return {
    sut,
    fakeDailyField,
    validatorStub
  }
}

describe('Daily Validation', () => {
  it('Should return InvalidParamError if fieldDaily is not a boolean', () => {
    const { sut, fakeDailyField } = makeSut()
    const isValid = sut.validate('invalid_daily')
    expect(isValid).toEqual(new InvalidParamError(fakeDailyField))
  })

  it('Should throw if validator throws', () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(() => { sut.validate({ daily: true }) }).toThrow()
  })
})
